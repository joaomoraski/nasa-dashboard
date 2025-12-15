import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../types';

/**
 * Express error handling middleware
 */
export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // AbortError from fetch timeout
    if (err instanceof Error && err.name === 'AbortError') {
        return res.status(504).json({ error: "Upstream timeout (NASA API)" });
    }

    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
};

