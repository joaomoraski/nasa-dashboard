import Favorite from "../models/favorite";
import { ApiError } from "../types";
import { FavoriteRepository } from "../repos/favoriteRepository";

const favoriteRepository = new FavoriteRepository();

export async function addFavorite(userId: number, fav_type: string, media_type: string, description: string, metadata: any): Promise<Favorite> {
    try {
        const favorite = await favoriteRepository.addFavorite(new Favorite({
            id: 0,
            userId: userId,
            fav_type: fav_type,
            media_type: media_type,
            description: description,
            metadata: metadata
        }));
        return favorite;
    } catch (error) {
        throw new ApiError(400, 'Failed to add favorite: ' + error);
    }
}

export async function getFavoriteById(id: number, userId: number): Promise<Favorite> {
    try {
        const favorite = await favoriteRepository.getFavoriteById(id);
        
        // Verify the favorite belongs to the authenticated user
        if (favorite.userId !== userId) {
            throw new ApiError(403, 'Forbidden: You can only access your own favorites');
        }
        
        return favorite;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(404, 'Favorite not found');
    }
}

export async function getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    try {
        const favorites = await favoriteRepository.getFavoritesByUserId(userId);
        return favorites;
    } catch (error) {
        throw new ApiError(404, 'Favorites not found');
    }
}

export async function findFavoriteByCriteria(userId: number, fav_type: string, description: string): Promise<Favorite | null> {
    try {
        const favorite = await favoriteRepository.findFavoriteByCriteria(userId, fav_type, description);
        return favorite;
    } catch (error) {
        throw new ApiError(500, 'Failed to search favorite');
    }
}

export async function deleteFavorite(id: number, userId: number): Promise<void> {
    try {
        // First verify the favorite belongs to the authenticated user
        const favorite = await favoriteRepository.getFavoriteById(id);
        
        if (favorite.userId !== userId) {
            throw new ApiError(403, 'Forbidden: You can only delete your own favorites');
        }
        
        await favoriteRepository.deleteFavorite(id);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(404, 'Favorite not found');
    }
}

