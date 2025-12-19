import { useState } from "react";
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
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [q, setQ] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [size] = useState(20);

    // Modal state
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Use hooks for data fetching
    const { data: response, loading, error, loadNeoWsList } = useNeoWsList();
    const { data: detailResponse, loading: detailLoading, error: detailError } = useNeoWsDetail(selectedId);


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
                size={size}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setQ={setQ}
                validationError={validationError}
                setValidationError={setValidationError}
                setPage={setPage}
                loadNeoWsList={loadNeoWsList}
            />

            {/* Validation Error */}
            {validationError && (
                <p style={{ color: "tomato", marginTop: 8 }}>{validationError}</p>
            )}

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
            {meta && response && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                        type="button"
                        disabled={!canPrev}
                        onClick={() => {
                            const newPage = Math.max(1, page - 1);
                            setPage(newPage);
                            loadNeoWsList(startDate, endDate, newPage, size, q);
                        }}
                    >
                        Prev
                    </button>

                    <span>
                        Page {meta.page} / {meta.totalPages} (total: {meta.total})
                    </span>

                    <button
                        type="button"
                        disabled={!canNext}
                        onClick={() => {
                            const newPage = page + 1;
                            setPage(newPage);
                            loadNeoWsList(startDate, endDate, newPage, size, q);
                        }}
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

