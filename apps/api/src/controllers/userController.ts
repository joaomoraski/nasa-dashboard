import { UserRepository } from "../repos/userRepository";
import { Request, Response } from "express";
import { ApiError } from "../types";
import * as userService from "../services/userService";
import { getAuthenticatedUser } from "../utils/authHelpers";

export async function registerUser(req: Request, res: Response): Promise<void> {
    if (!req.body.email || !req.body.password || !req.body.passwordConfirmation) {
        throw new ApiError(400, 'Email, password and password confirmation are required');
    }

    const { email, password, passwordConfirmation } = req.body;
    const user = await userService.registerUser(email, password, passwordConfirmation);
    res.status(201).json(user);
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    if (!req.body.email || !req.body.password) {
        throw new ApiError(400, 'Email and password are required');
    }
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.status(200).json(user);
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    
    const authenticatedUser = getAuthenticatedUser(req);
    const { id } = req.params;
    
    // Verify user can only access their own data
    if (authenticatedUser.id !== parseInt(id)) {
        throw new ApiError(403, 'Forbidden: You can only access your own data');
    }
    
    const user = await userService.getUserById(parseInt(id));
    res.status(200).json(user);
}

export async function getUserByIdWithFavorites(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    
    const authenticatedUser = getAuthenticatedUser(req);
    const { id } = req.params;
    
    // Verify user can only access their own data
    if (authenticatedUser.id !== parseInt(id)) {
        throw new ApiError(403, 'Forbidden: You can only access your own data');
    }
    
    const user = await userService.getUserByIdWithFavorites(parseInt(id));
    res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    
    const authenticatedUser = getAuthenticatedUser(req);
    const { id } = req.params;
    
    // Verify user can only update their own data
    if (authenticatedUser.id !== parseInt(id)) {
        throw new ApiError(403, 'Forbidden: You can only update your own data');
    }
    
    const user = await userService.updateUser(parseInt(id), req.body);
    res.status(200).json(user);
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    if (!req.params.id || !req.query.confirmation) {
        throw new ApiError(400, 'User ID and confirmation are required');
    }

    const authenticatedUser = getAuthenticatedUser(req);
    const { id } = req.params;
    const confirmation = req.query.confirmation;

    // Verify user can only delete their own account
    if (authenticatedUser.id !== parseInt(id)) {
        throw new ApiError(403, 'Forbidden: You can only delete your own account');
    }

    if (confirmation !== 'true') {
        throw new ApiError(400, 'Confirmation required.');
    }

    await userService.deleteUser(parseInt(id), true);
    res.status(200).json({ message: 'User deleted successfully' });
}