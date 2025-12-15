import type { NeoWsResponse } from '../types/neoWs';
import { API_URL } from '../config/api';

/**
 * Fetches NeoWs list data from the API
 */
export async function fetchNeoWsList(
    startDate: string,
    endDate: string,
    page: number = 1,
    size: number = 20,
    q?: string
): Promise<NeoWsResponse> {
    const params = new URLSearchParams();
    params.set("start_date", startDate);
    params.set("end_date", endDate);
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (q?.trim()) {
        params.set("q", q.trim());
    }

    const resp = await fetch(`${API_URL}/api/asteroids?${params.toString()}`);
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

/**
 * Fetches NeoWs detail data by ID from the API
 */
export async function fetchNeoWsDetail(id: string): Promise<any> {
    if (!id) {
        throw new Error('Asteroid ID is required');
    }

    const resp = await fetch(`${API_URL}/api/asteroids/${id}`);
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}
