import { useState, useEffect, useCallback } from 'react';
import type { Apod } from '../types/apod';
import { fetchApod } from '../services/apodService';

interface UseApodReturn {
    data: Apod | null;
    loading: boolean;
    error: string | null;
    loadApod: (date?: string) => Promise<void>;
}

/**
 * Custom hook for fetching APOD data
 */
export function useApod(): UseApodReturn {
    const [data, setData] = useState<Apod | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadApod = useCallback(async (selectedDate?: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchApod(selectedDate);
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Network error");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load on mount
    useEffect(() => {
        loadApod();
    }, [loadApod]);

    return { data, loading, error, loadApod };
}

