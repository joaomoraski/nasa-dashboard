import type { NasaImagesResponse } from '../types/neoWs';
import { API_URL } from '../config/api';

/**
 * Fetches NeoWs list data from the API
 */
export async function fetchNasaImages(
    filter?: string,
    page: number = 1,
    size: number = 20
): Promise<NasaImagesResponse> {
    const params = new URLSearchParams();
    if (filter?.trim()) {
        params.set("filter", filter.trim());
    }
    params.set("page", page.toString());
    params.set("size", size.toString());

    const resp = await fetch(`${API_URL}/api/images?${params.toString()}`);
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}