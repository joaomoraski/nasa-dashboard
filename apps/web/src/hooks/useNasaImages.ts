import { useState } from 'react';
import type { NasaImagesResponse } from '../types/neoWs';
import { fetchNasaImages } from '../services/imageService';

interface NasaImagesReturn {
    data: NasaImagesResponse | null;
    loading: boolean;
    error: string | null;
    loadNasaImages: (filter: string) => Promise<void>;
}

/**
 * Custom hook for fetching NASA images
 */
export function useNasaImages(page: number = 1, size: number = 20): NasaImagesReturn {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNasaImages = async (filter: string) => {
        if (!filter) {
            setData(null);
            setError("Please enter a search term");
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
    };

    return { data, loading, error, loadNasaImages };
}

