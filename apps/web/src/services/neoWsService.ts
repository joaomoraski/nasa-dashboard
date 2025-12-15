import type { Apod } from '../types/apod';
import { API_URL } from '../config/api';

export interface NeoWsServiceError {
    message: string;
}

/**
 * Fetches APOD data from the API
 */
export async function fetchNeoWs(startDate?: string, endDate?: string): Promise<Apod> {
    const params = new URLSearchParams();
    if (startDate) {
        params.set("start_date", startDate);
    }
    if (endDate) {
        params.set("end_date", endDate);
    }

    const resp = await fetch(`${API_URL}/api/apod?${params.toString()}`);
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

