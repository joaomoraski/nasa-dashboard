import { Request, Response } from "express";
import { ApiError } from "../types";
import * as favoriteService from "../services/favoriteService";
import { getAuthenticatedUser } from "../utils/authHelpers";

export async function addFavorite(req: Request, res: Response): Promise<void> {
    if (!req.body.fav_type || !req.body.media_type || !req.body.description) {
        throw new ApiError(400, 'fav_type, media_type and description are required');
    }
    
    const user = getAuthenticatedUser(req);
    const userId = user.id;
    
    const { fav_type, media_type, description, metadata } = req.body;
    try {
        const favorite = await favoriteService.addFavorite(userId, fav_type, media_type, description, metadata);
        res.status(201).json(favorite);
    } catch (error) {
        throw new ApiError(400, 'Failed to add favorite');
    }
}

export async function getFavoriteById(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'Favorite ID is required');
    }
    
    const user = getAuthenticatedUser(req);
    const { id } = req.params;
    
    try {
        const favorite = await favoriteService.getFavoriteById(parseInt(id), user.id);
        res.status(200).json(favorite);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(404, 'Favorite not found');
    }
}

export async function getFavoritesByUserId(req: Request, res: Response): Promise<void> {
    if (!req.params.userId) {
        throw new ApiError(400, 'User ID is required');
    }
    
    const user = getAuthenticatedUser(req);
    const { userId } = req.params;
    
    // Verify user can only access their own favorites
    if (user.id !== parseInt(userId)) {
        throw new ApiError(403, 'Forbidden: You can only access your own favorites');
    }
    
    try {
        const favorites = await favoriteService.getFavoritesByUserId(parseInt(userId));
        res.status(200).json(favorites);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(404, 'Favorites not found');
    }
}

export async function deleteFavorite(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'Favorite ID is required');
    }
    
    const user = getAuthenticatedUser(req);
    const { id } = req.params;
    
    try {
        await favoriteService.deleteFavorite(parseInt(id), user.id);
        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(404, 'Favorite not found');
    }
}