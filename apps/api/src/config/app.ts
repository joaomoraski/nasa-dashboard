import express from 'express';
import cors from 'cors';
import router from '../routes';
import { errorHandler } from '../middleware/errorHandler';

/**
 * Creates and configures the Express application
 */
export function createApp(): express.Application {
    const app = express();

    // Middleware
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }));
    app.use(express.json());

    // Routes
    app.use(router);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    return app;
}

