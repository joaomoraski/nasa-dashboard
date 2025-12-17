import { useEffect, useState } from "react";
import type { Meta, NasaImage } from "../types/neoWs";
import { useNasaImages } from "../hooks/useNasaImages";
import ImageCard from "../components/NasaImages/ImageCard";


export default function NasaImagesPage() {
    // Filters state
    const [q, setQ] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [size] = useState(20);

    // Use hooks for data fetching
    const { data: response, loading, error } = useNasaImages(q, page, size);

    // Reset page when filters change with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [q]);


    const items: NasaImage[] = response?.paginated ?? [];
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
            <h2 className="text-2xl font-bold">Nasa Images</h2>

            {/* Search Input */}
            <div style={{ marginBottom: 16 }}>
                <label>
                    Search:
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ marginLeft: 8, padding: 8, minWidth: 300 }}
                    />
                </label>
            </div>

            {/* Loading / Error */}
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "tomato" }}>Error: {error}</p>}

            {/* Images Grid */}
            {items.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                    {items.map((image) => (
                        <ImageCard key={image.nasa_id} image={image} />
                    ))}
                </div>
            )}

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
        </div>
    );
}

