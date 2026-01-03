import { Request, Response } from "express";
import { ApiError } from "../types";
import * as favoriteService from "../services/favoriteService";

export async function addFavorite(req: Request, res: Response): Promise<void> {
    if (!req.body.userId || !req.body.fav_type || !req.body.media_type || !req.body.description) {
        throw new ApiError(400, 'UserId, fav_type, media_type and description are required');
    }
    const { userId, fav_type, media_type, description, metadata } = req.body;
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
    const { id } = req.params;
    try {
        const favorite = await favoriteService.getFavoriteById(parseInt(id));
        res.status(200).json(favorite);
    } catch (error) {
        throw new ApiError(404, 'Favorite not found');
    }
}

export async function getFavoritesByUserId(req: Request, res: Response): Promise<void> {
    if (!req.params.userId) {
        throw new ApiError(400, 'User ID is required');
    }
    const { userId } = req.params;
    try {
        const favorites = await favoriteService.getFavoritesByUserId(parseInt(userId));
        res.status(200).json(favorites);
    } catch (error) {
        throw new ApiError(404, 'Favorites not found');
    }
}

export async function deleteFavorite(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'Favorite ID is required');
    }
    const { id } = req.params;
    try {
        await favoriteService.deleteFavorite(parseInt(id));
        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        throw new ApiError(404, 'Favorite not found');
    }
}