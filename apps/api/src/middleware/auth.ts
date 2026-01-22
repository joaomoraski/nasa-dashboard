import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!secretKey) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        req.user = user as { id: number; email?: string };

        next();
    })
}