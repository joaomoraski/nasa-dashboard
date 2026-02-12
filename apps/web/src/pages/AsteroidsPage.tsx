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
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [q, setQ] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [size] = useState(20);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data: response, loading, error, loadNeoWsList } = useNeoWsList();
    const { data: detailResponse, loading: detailLoading, error: detailError } = useNeoWsDetail(selectedId);

    const items = response?.items ?? [];
    const meta: Meta = response?.meta ?? {
        page: 1, size: 20, total: 0, totalPages: 0, start: 0, end: 0,
    };

    const canPrev = meta.page > 1;
    const canNext = meta.page < meta.totalPages;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
             <div className="text-center space-y-4 pt-4 mb-8">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    Near Earth Objects
                </h2>
                <p className="text-slate-400 text-lg">Track asteroids and comets that pass close to Earth's orbit.</p>
            </div>

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

            {validationError && (
                <p className="text-red-400 text-center animate-pulse">{validationError}</p>
            )}

            {loading && (
                 <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            )}
            
            {error && <p className="text-red-400 text-center">Error: {error}</p>}

            <NeoWsTable 
                items={items}
                loading={loading}
                formatNumber={formatNumber}
                setSelectedId={setSelectedId}
            />

            {meta.totalPages > 1 && response && (
                <div className="flex justify-center items-center gap-4 py-8">
                    <button
                        type="button"
                        disabled={!canPrev}
                        onClick={() => {
                            const newPage = Math.max(1, page - 1);
                            setPage(newPage);
                            loadNeoWsList(startDate, endDate, newPage, size, q);
                        }}
                        className="glass-button px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="text-slate-400 font-mono text-sm">
                        Page {meta.page} of {meta.totalPages} <span className="text-slate-600">({meta.total} total)</span>
                    </span>

                    <button
                        type="button"
                        disabled={!canNext}
                        onClick={() => {
                            const newPage = page + 1;
                            setPage(newPage);
                            loadNeoWsList(startDate, endDate, newPage, size, q);
                        }}
                        className="glass-button px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

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
