import { Request, Response } from 'express';
import { ApiError } from "../types";
import { fetchNasaImages } from '../services/nasaService';

export async function searchNasaImages(req: Request, res: Response): Promise<void> {
    if (!req.query || !req.query.filter) {
        throw new ApiError(400, 'Filter is required');
    }
    
    const filter = req.query.filter?.toString() ?? '';
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 20);

    const data = await fetchNasaImages(filter, page, size);

    res.json(data);
}