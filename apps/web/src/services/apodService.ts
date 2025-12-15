import type { Apod } from '../types/apod';
import { API_URL } from '../config/api';

export interface ApodServiceError {
    message: string;
}

/**
 * Fetches APOD data from the API
 */
export async function fetchApod(date?: string): Promise<Apod> {
    const params = new URLSearchParams();
    if (date) {
        params.set("date", date);
    }

    const resp = await fetch(`${API_URL}/api/apod?${params.toString()}`);
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

