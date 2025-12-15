import { useEffect, useState } from "react";
import type { Meta } from "../types/neoWs";
import { useNeoWsList } from "../hooks/useNeoWsList";
import { useNeoWsDetail } from "../hooks/useNeoWsDetail";
import NeoFilterForm from "../components/NeoWs/NeoFilterForm";
import NeoWsTable from "../components/NeoWs/NeoWsTable";
import NeoWsDetailModal from "../components/NeoWs/NeoWsDetailModal";

function formatNumber(n: number | null, suffix = "") {
    if (n === null || n === undefined || Number.isNaN(n)) return "-";
    return `${Math.round(n).toLocaleString()}${suffix}`;
}

export default function AsteroidsPage() {
    // Filters state
    const [startDate, setStartDate] = useState("2025-12-14");
    const [endDate, setEndDate] = useState("2025-12-15");
    const [q, setQ] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    // Modal state
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Use hooks for data fetching
    const { data: response, loading, error } = useNeoWsList(startDate, endDate, page, size, q);
    const { data: detailResponse, loading: detailLoading, error: detailError } = useNeoWsDetail(selectedId);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [startDate, endDate, q]);

    const items = response?.items ?? [];
    const meta: Meta = response?.meta ?? {
        page: 1,
        size: 20,
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
    };

    const canPrev = meta.page > 1;
    const canNext = meta.page < meta.totalPages;

    return (
        <div style={{ padding: 16 }}>
            <h2>Near Earth Objects (NeoWs)</h2>

            {/* Filters Form */}
            <NeoFilterForm
                startDate={startDate}
                endDate={endDate}
                q={q}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setQ={setQ}
            />

            {/* Loading / Error */}
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "tomato" }}>Error: {error}</p>}

            {/* Table */}
            <NeoWsTable items={items}
                loading={loading}
                formatNumber={formatNumber}
                setSelectedId={setSelectedId}
            />

            {/* Pagination */}
            {meta && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                        type="button"
                        disabled={!canPrev}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Prev
                    </button>

                    <span>
                        Page {meta.page} / {meta.totalPages} (total: {meta.total})
                    </span>

                    <button
                        type="button"
                        disabled={!canNext}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal / Dialog (simple version) */}
            {selectedId && 
                <NeoWsDetailModal 
                    selectedId={selectedId} 
                    setSelectedId={setSelectedId} 
                    detailLoading={detailLoading} 
                    detailError={detailError} 
                    detailResponse={detailResponse} 
                    formatNumber={formatNumber} 
                />
            }
        </div>
    );
}

