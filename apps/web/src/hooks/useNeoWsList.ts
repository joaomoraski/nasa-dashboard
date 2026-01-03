import { useState } from 'react';
import type { NeoWsResponse } from '../types/neoWs';
import { fetchNeoWsList } from '../services/neoWsService';

interface UseNeoWsListReturn {
    data: NeoWsResponse | null;
    loading: boolean;
    error: string | null;
    loadNeoWsList: (startDate: string, endDate: string, page?: number, size?: number, q?: string) => Promise<void>;
}

/**
 * Custom hook for fetching NeoWs list data
 * Call loadNeoWsList() manually via onClick or onSubmit
 */
export function useNeoWsList(): UseNeoWsListReturn {
    const [data, setData] = useState<NeoWsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNeoWsList = async (
        start: string,
        end: string,
        pageNum: number = 1,
        pageSize: number = 20,
        query: string = ""
    ) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchNeoWsList(start, end, pageNum, pageSize, query);
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Network error");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, loadNeoWsList };
}

