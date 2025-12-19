import { useState } from "react";
import type { Meta, NasaImage } from "../types/neoWs";
import { useNasaImages } from "../hooks/useNasaImages";
import ImageCard from "../components/NasaImages/ImageCard";


export default function NasaImagesPage() {
    // Filters state
    const [q, setQ] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [size] = useState(20);

    const [validationError, setValidationError] = useState<string | null>(null);

    // Use hooks for data fetching
    const { data: response, loading, error, loadNasaImages } = useNasaImages(page, size);

    const handleClickSearch = () => {
        // clear validation error
        setValidationError(null);

        if (!q.trim()) {
            setValidationError("Please enter a search term");
            return;
        }

        setPage(1);
        loadNasaImages(q.trim());
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
        if (validationError) {
            setValidationError(null);
        }
    }

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

            {/* Search Form */}
            <form className="w-full max-w-sm">
                <div className="flex items-center border-b border-teal-500 py-2">
                    <input
                        className="appearence-once bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Search images (e.g: Orion)"
                        aria-label="Search images"
                        value={q}
                        onChange={handleInputChange}
                    />
                    <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" 
                        type="button" onClick={handleClickSearch}>
                        Buscar
                    </button>
                </div>
            </form>

            {/* Validation Error */}
            {validationError && (
                <p style={{ color: "tomato", marginTop: 8 }}>{validationError}</p>
            )}
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

