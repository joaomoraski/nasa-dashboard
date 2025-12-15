import { Request, Response } from 'express';

/**
 * GET /health
 * Health check endpoint
 */
export function getHealth(_req: Request, res: Response): void {
    res.json({ ok: true });
}

