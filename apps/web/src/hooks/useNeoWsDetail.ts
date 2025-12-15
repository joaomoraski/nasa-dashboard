import { useState, useEffect, useCallback } from 'react';
import { fetchNeoWsDetail } from '../services/neoWsService';

interface UseNeoWsDetailReturn {
    data: any | null;
    loading: boolean;
    error: string | null;
    loadNeoWsDetail: (id: string) => Promise<void>;
}

/**
 * Custom hook for fetching NeoWs detail data by ID
 */
export function useNeoWsDetail(id: string | null): UseNeoWsDetailReturn {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNeoWsDetail = useCallback(async (asteroidId: string) => {
        if (!asteroidId) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchNeoWsDetail(asteroidId);
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Network error");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load when id changes
    useEffect(() => {
        if (id) {
            loadNeoWsDetail(id);
        } else {
            setData(null);
            setError(null);
            setLoading(false);
        }
    }, [id, loadNeoWsDetail]);

    return { data, loading, error, loadNeoWsDetail };
}

