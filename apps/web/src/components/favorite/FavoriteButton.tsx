import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Favorite } from "../../types/favorite";
import { useNavigate } from "react-router-dom";
import { Notification } from "../notification";

export function FavoriteButton({ favorite }: { favorite: Favorite }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [showLoginNotification, setShowLoginNotification] = useState(false);
    
    const { user, checkFavorite, addFavorite, deleteFavorite } = useAuth();
    const navigate = useNavigate();

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
        e.stopPropagation(); // Prevent bubbling to parent elements (like card links)

        if (!user) {
            setShowLoginNotification(true);
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
            }, 1000); // Shorter animation duration
        }
    };

    return (
        <>
            {showLoginNotification && (
                <div className="fixed top-4 right-4 z-[100] min-w-[300px]">
                    <Notification 
                        type="warning" 
                        message="Please login to save favorites" 
                        onClose={() => setShowLoginNotification(false)}
                        autoClose={3000}
                    />
                </div>
            )}
            
            <button 
                type="button" 
                onClick={handleFavorite} 
                className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-full 
                    transition-all duration-300 
                    ${isFavorite 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
                    }
                    focus:outline-none focus:ring-2 focus:ring-red-500/50
                `}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isAnimating ? 'animate-ping' : ''}`} 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                </svg>
            </button>
        </>
    );
}
