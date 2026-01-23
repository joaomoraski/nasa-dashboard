import { Request } from "express";
import { ApiError } from "../types";
import bcrypt from 'bcryptjs';

export interface AuthenticatedUser {
    id: number;
    email?: string;
}

function isUserJwtPayload(user: string | { id: number; email?: string } | undefined): user is AuthenticatedUser {
    return typeof user === 'object' && user !== null && typeof user.id === 'number';
}

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
    if (!req.user) {
        throw new ApiError(401, 'Unauthorized');
    }

    if (!isUserJwtPayload(req.user)) {
        throw new ApiError(401, 'Invalid authentication token');
    }

    return req.user;
}


export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function compareTextPassword(password: string, confirmationPassword: string): boolean {
    return password === confirmationPassword;
}