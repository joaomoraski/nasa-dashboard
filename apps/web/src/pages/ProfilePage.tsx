import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Notification } from "../components/notification";
import { ApodContent } from "../components/Apod/ApodContent";
import ImageCard from "../components/NasaImages/ImageCard";
import NeoWsDetailModal from "../components/NeoWs/NeoWsDetailModal";
import { useNeoWsDetail } from "../hooks/useNeoWsDetail";
import type { Favorite } from "../types/favorite";
import type { Apod } from "../types/apod";
import type { NasaImage, AsteroidPreview } from "../types/neoWs";

function formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function ProfilePage() {

    const { user, updateApiKey, error, setError, loading, getFavorites, deleteFavorite } = useAuth();
    const [apiKey, setApiKey] = useState(user?.apiKey || '');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'apod' | 'nasa_image' | 'asteroid' | null>(null);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [selectedAsteroidId, setSelectedAsteroidId] = useState<string | null>(null);
    const { data: asteroidDetail, loading: asteroidDetailLoading, error: asteroidDetailError } = useNeoWsDetail(selectedAsteroidId);

    useEffect(() => {
        if (user?.apiKey) {
            setApiKey(user.apiKey);
        }
    }, [user?.apiKey]);

    useEffect(() => {
        if (showFavorites && user) {
            loadFavorites();
        }
    }, [showFavorites, user]);

    async function loadFavorites() {
        if (!user) return;
        setFavoritesLoading(true);
        try {
            const favs = await getFavorites();
            setFavorites(favs);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setFavoritesLoading(false);
        }
    }

    async function handleDeleteFavorite(id: number) {
        try {
            await deleteFavorite(id);
            await loadFavorites();
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    }

    const filteredFavorites = selectedFilter 
        ? favorites.filter(fav => fav.fav_type === selectedFilter)
        : [];

    const formatNumber = (n: number | null) => {
        if (n === null) return 'N/A';
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setValidationError(null);
        setError(null);

        if (!apiKey.trim()) {
            setValidationError("API Key cannot be empty");
            return;
        }

        if (apiKey === user?.apiKey) {
            setValidationError("API Key is the same as current value");
            return;
        }

        try {
            await updateApiKey(apiKey);
        } catch (error) {
            console.error('Error updating API key:', error);
        }
    }

    return (
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
            {validationError && (
                <Notification 
                    key={`validation-${validationError}`}
                    message={validationError} 
                    type="warning" 
                    autoClose={4000}
                    onClose={() => setValidationError(null)}
                />
            )}
            
            {error && (
                <Notification 
                    key={`error-${error}`}
                    message={error} 
                    type="error" 
                    autoClose={5000}
                    onClose={() => setError(null)}
                />
            )}

            <div className={`w-full max-w-5xl bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col gap-6 items-center transition-all duration-500 ${showFavorites ? 'min-h-[70vh]' : ''}`}>
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        Astronaut Profile
                    </h1>
                    {user?.createdAt && (
                         <span className="text-slate-400 text-sm font-mono border border-white/10 px-3 py-1 rounded-full">
                            Member since {new Date(user.createdAt).getFullYear()}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="w-full glass-panel p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            disabled 
                            value={user?.email || ''} 
                            className="glass-input w-full px-4 py-3 rounded-xl opacity-60 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">NASA API Key</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={apiKey} 
                                onChange={(e) => setApiKey(e.target.value)}
                                className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Enter your NASA API Key"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Account Created</label>
                        <input 
                            type="text" 
                            disabled 
                            value={formatDate(user?.createdAt)} 
                            className="glass-input w-full px-4 py-3 rounded-xl opacity-60 cursor-not-allowed text-sm font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Last Updated</label>
                        <input 
                            type="text" 
                            disabled 
                            value={formatDate(user?.updatedAt)} 
                            className="glass-input w-full px-4 py-3 rounded-xl opacity-60 cursor-not-allowed text-sm font-mono"
                        />
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating Profile...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <div className="w-full h-px bg-white/10 my-2"></div>

                <div className="w-full">
                    <button
                        type="button"
                        onClick={() => {
                            setShowFavorites(!showFavorites);
                            if (!showFavorites) {
                                setSelectedFilter(null);
                            }
                        }}
                        className="w-full group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-2xl transition-all duration-300"
                    >
                         <span className="relative z-10 flex items-center justify-center gap-2">
                            {showFavorites ? 'Close Collection' : 'View Saved Discoveries'}
                            <svg 
                                className={`w-5 h-5 transition-transform duration-300 ${showFavorites ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                </div>

                {showFavorites && (
                    <div className="w-full space-y-6 animate-fade-in">
                        <div className="flex flex-wrap gap-3 justify-center bg-black/20 p-2 rounded-2xl border border-white/5 w-fit mx-auto">
                            {[
                                { id: 'apod', label: 'Picture of the Day' },
                                { id: 'nasa_image', label: 'Image Gallery' },
                                { id: 'asteroid', label: 'Asteroids' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setSelectedFilter(filter.id as any)}
                                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                        selectedFilter === filter.id
                                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {favoritesLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : selectedFilter ? (
                            <div className="space-y-6">
                                {filteredFavorites.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                                        <p className="text-slate-400">No saved items in this collection yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        {selectedFilter === 'apod' && (
                                            <div className="grid grid-cols-1 gap-6">
                                                {filteredFavorites.map((fav) => {
                                                    const apodData = fav.metadata as Apod;
                                                    return (
                                                        <div key={fav.id} className="relative group bg-black/40 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                                                            <div className="absolute top-4 right-4 z-20">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFavorite(fav.id)}
                                                                    className="bg-red-500/20 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-full backdrop-blur-md transition-all duration-300"
                                                                    title="Remove from favorites"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <ApodContent data={apodData} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {selectedFilter === 'nasa_image' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredFavorites.map((fav) => {
                                                    const imageData = fav.metadata as NasaImage;
                                                    return (
                                                        <div key={fav.id} className="relative group">
                                                            <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFavorite(fav.id)}
                                                                    className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                                                                    title="Remove from favorites"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="h-full">
                                                                <ImageCard image={imageData} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {selectedFilter === 'asteroid' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {filteredFavorites.map((fav) => {
                                                    const asteroid = fav.metadata as AsteroidPreview;
                                                    return (
                                                        <div key={fav.id} className="relative glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
                                                            <div className="absolute top-4 right-4 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFavorite(fav.id)}
                                                                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                                                    title="Remove from favorites"
                                                                >
                                                                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            <div className="pr-8">
                                                                <h3 className="text-xl font-bold text-white mb-2">{asteroid.name}</h3>
                                                                <div className="space-y-2 text-sm text-slate-400">
                                                                    <div className="flex justify-between">
                                                                        <span>Date:</span>
                                                                        <span className="text-slate-200">{asteroid.date}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Velocity:</span>
                                                                        <span className="font-mono text-cyan-400">{formatNumber(asteroid.velKph)} km/h</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Miss Distance:</span>
                                                                        <span className="font-mono text-indigo-400">{formatNumber(asteroid.missKm)} km</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-2 mt-4 mb-4">
                                                                    {asteroid.hazardous && (
                                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                                                            HAZARDOUS
                                                                        </span>
                                                                    )}
                                                                    {asteroid.sentry && (
                                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                            SENTRY
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedAsteroidId(asteroid.id)}
                                                                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-cyan-400 text-xs uppercase font-bold tracking-wider rounded-lg transition-colors border border-white/5"
                                                                >
                                                                    Analysis Data
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {selectedAsteroidId && (
                                                    <NeoWsDetailModal
                                                        selectedId={selectedAsteroidId}
                                                        setSelectedId={setSelectedAsteroidId}
                                                        detailLoading={asteroidDetailLoading}
                                                        detailError={asteroidDetailError}
                                                        detailResponse={asteroidDetail}
                                                        formatNumber={formatNumber}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-50">
                                <div className="text-6xl mb-4">🔭</div>
                                <p className="text-xl">Select a category above to view your discoveries.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}