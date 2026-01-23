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

            <div className={`w-full max-w-4xl ${showFavorites ? 'min-h-[70vh]' : 'h-[70vh]'} bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800/30 p-8 flex flex-col gap-4 items-center`}>
                <h1 className="text-white text-3xl font-bold">Profile</h1>
                <hr className="w-full border-blue-800/30" />
                <form onSubmit={handleSubmit} className="w-full shadow-2xl border border-blue-800/30 rounded-2xl p-4 grid grid-cols-[100px_auto] gap-4 items-center">
                    <p className="text-white">Email: </p>
                    <input type="email" id="email" name="email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={user?.email || ''} disabled />
                    <p className="text-white">API Key: </p>
                    <input type="text" id="apiKey" name="apiKey" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
                    <p className="text-white">Created At: </p>
                    <input type="text" id="createdAt" name="createdAt" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formatDate(user?.createdAt)} disabled />
                    <p className="text-white">Updated At: </p>
                    <input type="text" id="updatedAt" name="updatedAt" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={formatDate(user?.updatedAt)} disabled />
                    <div className="col-span-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update API Key'}
                        </button>
                    </div>
                </form>

                <div className="w-full mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setShowFavorites(!showFavorites);
                            if (!showFavorites) {
                                setSelectedFilter(null);
                            }
                        }}
                        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                        {showFavorites ? 'Hide Favorites' : 'View Favorites'}
                    </button>
                </div>

                {showFavorites && (
                    <div className="w-full mt-4 space-y-4">
                        <div className="flex gap-2 justify-center">
                            <button
                                type="button"
                                onClick={() => setSelectedFilter('apod')}
                                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                                    selectedFilter === 'apod'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                APOD
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedFilter('nasa_image')}
                                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                                    selectedFilter === 'nasa_image'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                NASA Images
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedFilter('asteroid')}
                                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                                    selectedFilter === 'asteroid'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                Asteroids
                            </button>
                        </div>

                        {favoritesLoading ? (
                            <div className="text-center text-white py-8">Loading favorites...</div>
                        ) : selectedFilter ? (
                            <div className="space-y-4 overflow-y-auto">
                                {filteredFavorites.length === 0 ? (
                                    <div className="text-center text-white py-8">
                                        No {selectedFilter === 'apod' ? 'APOD' : selectedFilter === 'nasa_image' ? 'NASA Images' : 'Asteroids'} favorites found.
                                    </div>
                                ) : (
                                    <>
                                        {selectedFilter === 'apod' && filteredFavorites.map((fav) => {
                                            const apodData = fav.metadata as Apod;
                                            return (
                                                <div key={fav.id} className="relative bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteFavorite(fav.id)}
                                                        className="absolute top-2 right-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                    <ApodContent data={apodData} />
                                                </div>
                                            );
                                        })}

                                        {selectedFilter === 'nasa_image' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {filteredFavorites.map((fav) => {
                                                    const imageData = fav.metadata as NasaImage;
                                                    return (
                                                        <div key={fav.id} className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteFavorite(fav.id)}
                                                                className="absolute top-2 right-2 z-10 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition duration-200"
                                                            >
                                                                Delete
                                                            </button>
                                                            <ImageCard image={imageData} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {selectedFilter === 'asteroid' && (
                                            <>
                                                <div className="space-y-2">
                                                    {filteredFavorites.map((fav) => {
                                                        const asteroid = fav.metadata as AsteroidPreview;
                                                        return (
                                                            <div key={fav.id} className="relative bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFavorite(fav.id)}
                                                                    className="absolute top-2 right-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition duration-200"
                                                                >
                                                                    Delete
                                                                </button>
                                                                <div className="pr-20">
                                                                    <p className="text-white font-semibold">{asteroid.name}</p>
                                                                    <p className="text-gray-400 text-sm">Date: {asteroid.date}</p>
                                                                    <p className="text-gray-400 text-sm">Velocity: {formatNumber(asteroid.velKph)} km/h</p>
                                                                    <p className="text-gray-400 text-sm">Miss Distance: {formatNumber(asteroid.missKm)} km</p>
                                                                    {asteroid.hazardous && <span className="text-red-400 text-sm">⚠️ Hazardous</span>}
                                                                    {asteroid.sentry && <span className="text-yellow-400 text-sm ml-2">🛰️ Sentry</span>}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedAsteroidId(asteroid.id)}
                                                                        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition duration-200"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
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
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-white py-8">
                                Select a category to view your favorites.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}