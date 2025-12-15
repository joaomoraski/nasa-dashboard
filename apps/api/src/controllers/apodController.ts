import { Request, Response } from 'express';
import { fetchApod } from '../services/nasaService';
import { ApiError } from '../types';

/**
 * GET /api/apod
 * Fetches Astronomy Picture of the Day from NASA API
 */
export async function getApod(req: Request, res: Response): Promise<void> {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, 'NASA_API_KEY environment variable is required');
    }

    const date = req.query.date?.toString();
    const data = await fetchApod(apiKey, date);
    
    res.json(data);
}

