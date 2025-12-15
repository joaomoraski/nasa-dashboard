import { NextFunction, Request, Response } from 'express';

/**
 * Wraps async route handlers to catch errors and pass them to Express error middleware
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<void> | void
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

