import { useState, useEffect, useCallback } from 'react';
import type { NasaImagesResponse } from '../types/neoWs';
import { fetchNasaImages } from '../services/imageService';

interface useNasaImagesReturn {
    data: NasaImagesResponse | null;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook for fetching NeoWs detail data by ID
 */
export function useNasaImages(query: string | null, page: number = 1, size: number = 20): useNasaImagesReturn {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNasaImages = useCallback(async (filter: string) => {
        if (!filter) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchNasaImages(filter, page, size);
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Network error");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce query to avoid requests on every keystroke
    useEffect(() => {
        if (!query) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            loadNasaImages(query);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, loadNasaImages]);

    return { data, loading, error };
}

