import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Favorite } from "../../types/favorite";

export function FavoriteButton({ favorite }: { favorite: Favorite }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const { user, checkFavorite, addFavorite, deleteFavorite } = useAuth();

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (!user) {
                setIsFavorite(false);
                return;
            }

            try {
                const existingFavorite = await checkFavorite(favorite.fav_type, favorite.description);
                if (existingFavorite) {
                    setIsFavorite(true);
                    setFavoriteId(existingFavorite.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (error) {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        };

        checkIfFavorite();
    }, [user, favorite.fav_type, favorite.description, checkFavorite]);

    const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        setIsAnimating(true);

        try {
            if (isFavorite && favoriteId) {
                await deleteFavorite(favoriteId);
                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const newFavorite = await addFavorite(favorite);
                setIsFavorite(true);
                setFavoriteId(newFavorite.id);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setTimeout(() => {
                setIsAnimating(false);
            }, 1500);
        }
    };

    return (
        <button type="button" onClick={(e) => handleFavorite(e)} className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-small leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
            {isFavorite ? (
                <svg className={`w-6 h-6 text-gray-800 dark:text-white ${isAnimating ? 'animate-bounce' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                </svg>
            ) : (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                </svg>
            )}
        </button>
    );
}