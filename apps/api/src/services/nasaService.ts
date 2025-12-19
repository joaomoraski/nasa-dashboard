import { ApiError, NasaImage, NasaImagesApiResponse } from '../types';
import { daysBetween } from '../utils/date';
import { fetchNasaImageMedia } from '../utils/nasaImageMediaFetcher';
import { toRow } from '../utils/pagination';

const NASA_API_BASE_URL = 'https://api.nasa.gov';
const NASA_PLANETARY_BASE_URL = `${NASA_API_BASE_URL}/planetary/apod`;
const NASA_NEO_WS_BASE_URL = `${NASA_API_BASE_URL}/neo/rest/v1/feed`;
const NASA_NEO_WS_ID_BASE_URL = `${NASA_API_BASE_URL}/neo/rest/v1/neo`;
const NASA_IMAGES_BASE_URL = `https://images-api.nasa.gov`;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Fetches APOD data from NASA API
 */
export async function fetchApod(apiKey: string, date?: string): Promise<any> {
    if (!apiKey) {
        throw new ApiError(500, 'NASA API key is not set');
    }

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    const url = new URL(NASA_PLANETARY_BASE_URL);
    url.searchParams.set('api_key', apiKey);
    if (date) {
        url.searchParams.set('date', date);
    }

    // Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, { signal: controller.signal });
        
        if (!response.ok) {
            const body = await response.text();
            throw new ApiError(response.status, `NASA error: ${body}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}

export async function fetchAsteroidById(apiKey: string, id: string): Promise<any> {
    if (!apiKey) {
        throw new ApiError(500, 'NASA API key is not set');
    }
    if (!id) {
        throw new ApiError(400, 'Asteroid ID is required');
    }
    const url = new URL(NASA_NEO_WS_ID_BASE_URL);
    url.searchParams.set('api_key', apiKey);
    url.pathname += `/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
        const body = await response.text();
        throw new ApiError(response.status, `NASA error: ${body}`);
    }
    
    return response.json();
}

export async function fetchNeoWs(apiKey: string, startDate?: string, endDate?: string, page?: number, size?: number, q?: string): Promise<any> {
    if (!apiKey) {
        throw new ApiError(500, 'NASA API key is not set');
    }

    if ((startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) || 
        (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
        throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
    }

    if (startDate && endDate) {
        const diffDays = daysBetween(startDate, endDate);
        if (diffDays > 7) {
            throw new ApiError(400, "Date range too large (max 7 days)");
        }
    }


    const url = new URL(NASA_NEO_WS_BASE_URL);
    url.searchParams.set('api_key', apiKey);
    if (startDate) {
        url.searchParams.set('start_date', startDate);
    }
    if (endDate) {
        url.searchParams.set('end_date', endDate);
    }

    // Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const resp = await fetch(url, { signal: controller.signal });
        
        if (!resp.ok) {
            const body = await resp.text();
            throw new ApiError(resp.status, `NASA error: ${body}`);
        }

        const data = await resp.json();
    
        const byDate = data.near_earth_objects ?? {};
        const all = Object.entries(byDate).flatMap(([date, neos]) =>
            (neos as any[]).map(neo => toRow(neo, date))
        );

        let filtered = all;

        if (q) {
            const qq = q.toLowerCase();
            filtered = filtered.filter(x =>
                x.name.toLowerCase().includes(qq) || x.id.includes(qq)
            );
        }

        const total = filtered.length;
        const pageNum = typeof page === "number" && page > 0 ? page : 1;
        const pageSize = typeof size === "number" && size > 0 ? size : 10;

        const totalPages = Math.ceil(total / pageSize);

        const startIndex = (pageNum - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        // set these for return meta
        const start = items.length > 0 ? startIndex + 1 : 0;
        const end = startIndex + items.length;

        return {
            meta: {
              page,
              size,
              total,
              totalPages,
              start,
              end,
              nasaLinks: data.links,
              elementCount: data.element_count,
            },
            items,
          };
    } finally {
        clearTimeout(timeout);
    }
}


export async function fetchNasaImages(filter: string, page: number, size: number): Promise<any> {
    if (!filter) {
        throw new ApiError(400, 'Filter is required');
    }

    const params = new URLSearchParams();
    if (filter.trim()) {
        params.set('q', filter.trim());
    }

    const url = new URL(`${NASA_IMAGES_BASE_URL}/search`);
    url.search = params.toString();

    const response = await fetch(url);
    if (!response.ok) {
        const body = await response.text();
        throw new ApiError(response.status, `NASA error: ${body}`);
    }


    const data: NasaImagesApiResponse = await response.json();
    const items = data.collection.items;

    const nasaImages: NasaImage[] = (await Promise.all(
        items.map(async (item) => {
            const rawData = item.data?.[0];
            if (!rawData) return undefined;
            const media = await fetchNasaImageMedia(item.href);
            return {
                nasa_id: rawData.nasa_id,
                href: media,
                date_created: rawData.date_created,
                description: rawData.description,
                description_508: rawData.description_508,
                keywords: rawData.keywords,
                media_type: rawData.media_type,
                title: rawData.title,
                photographer: rawData.photographer,
            };
        })
    )).filter((image): image is NasaImage => image !== undefined);

    const total = nasaImages.length;
    const pageNum = typeof page === "number" && page > 0 ? page : 1;
    const pageSize = typeof size === "number" && size > 0 ? size : 10;

    const totalPages = Math.ceil(total / pageSize);

    const startIndex = (pageNum - 1) * pageSize;
    const paginated = nasaImages.slice(startIndex, startIndex + pageSize);

    const start = nasaImages.length > 0 ? startIndex + 1 : 0;
    const end = startIndex + nasaImages.length;

    return {
        meta: {
          page,
          size,
          total,
          totalPages,
          start,
          end,
        },
        paginated,
      };
}