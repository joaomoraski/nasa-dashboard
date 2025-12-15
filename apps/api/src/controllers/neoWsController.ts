import { Request, Response } from 'express';
import { fetchAsteroidById, fetchNeoWs } from '../services/nasaService';
import { ApiError } from '../types';

/**
 * GET /api/asteroids
 * Fetches Near Earth Asteroids from NASA API
 */
export async function listAsteroids(req: Request, res: Response): Promise<void> {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, 'NASA_API_KEY environment variable is required');
    }

    const startDate = req.query.start_date?.toString();
    const endDate = req.query.end_date?.toString();

    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 20);

    const q = (req.query.q ?? '').toString();
    
    const data = await fetchNeoWs(apiKey, startDate, endDate, page, size, q);
    
    res.json(data);
}

/**
 * GET /api/asteroids/:id
 * Fetches Near Earth Asteroid by ID from NASA API
 */
export async function getAsteroidById(req: Request, res: Response): Promise<void> {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, 'NASA_API_KEY environment variable is required');
    }

    const id = req.params.id;
    
    const data = await fetchAsteroidById(apiKey, id);
    
    res.json(data);
}
