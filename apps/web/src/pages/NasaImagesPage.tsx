import { useState } from "react";
import type { Meta, NasaImage } from "../types/neoWs";
import { useNasaImages } from "../hooks/useNasaImages";
import ImageCard from "../components/NasaImages/ImageCard";

export default function NasaImagesPage() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [size] = useState(20);
    const [validationError, setValidationError] = useState<string | null>(null);

    const { data: response, loading, error, loadNasaImages } = useNasaImages(page, size);

    const handleClickSearch = (e: React.FormEvent) => {
        e.preventDefault();
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
        page: 1, size: 20, total: 0, totalPages: 0, start: 0, end: 0,
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-6 py-10">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Image Gallery
                </h2>
                <p className="text-slate-400 text-lg">Search through NASA's extensive library of images and videos.</p>
                
                <form onSubmit={handleClickSearch} className="max-w-xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative flex glass-panel rounded-xl overflow-hidden p-1">
                        <input
                            className="flex-grow bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-slate-500"
                            type="text"
                            placeholder="Search images (e.g. Orion, Mars, Apollo)"
                            value={q}
                            onChange={handleInputChange}
                        />
                        <button 
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg"
                        >
                            Search
                        </button>
                    </div>
                </form>
                
                {validationError && (
                    <p className="text-red-400 text-sm animate-pulse">{validationError}</p>
                )}
            </div>

            {loading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-center">
                    Error: {error}
                </div>
            )}

            {items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((image) => (
                        <ImageCard key={image.nasa_id} image={image} />
                    ))}
                </div>
            )}

            {meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-8">
                    <button
                        type="button"
                        disabled={meta.page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="glass-button px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="text-slate-400 font-mono text-sm">
                        Page {meta.page} of {meta.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="glass-button px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
