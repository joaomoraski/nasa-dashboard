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

export async function getFavoriteById(id: number): Promise<Favorite> {
    try {
        const favorite = await favoriteRepository.getFavoriteById(id);
        return favorite;
    } catch (error) {
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

export async function deleteFavorite(id: number): Promise<void> {
    try {
        await favoriteRepository.deleteFavorite(id);
    } catch (error) {
        throw new ApiError(404, 'Favorite not found');
    }
}

