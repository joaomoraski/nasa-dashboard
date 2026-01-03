import { UserRepository } from "../repos/userRepository";
import { Request, Response } from "express";
import { ApiError } from "../types";
import * as userService from "../services/userService";

export async function registerUser(req: Request, res: Response): Promise<void> {
    if (!req.body.email || !req.body.password) {
        throw new ApiError(400, 'Email and password are required');
    }
    const { email, password } = req.body;
    try {
        const user = await userService.registerUser(email, password);
        res.status(201).json(user);
    } catch (error) {
        throw new ApiError(400, 'Failed to register user');
    }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    const { id } = req.params;
    try {
        const user = await userService.getUserById(parseInt(id));
        res.status(200).json(user);
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function getUserByIdWithFavorites(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    const { id } = req.params;
    try {
        const user = await userService.getUserByIdWithFavorites(parseInt(id));
        res.status(200).json(user);
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
        throw new ApiError(400, 'User ID is required');
    }
    const { id } = req.params;
    try {
        const user = await userService.updateUser(parseInt(id), req.body);
        res.status(200).json(user);
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    if (!req.params.id || !req.query.confirmation) {
        throw new ApiError(400, 'User ID and confirmation are required');
    }

    const { id } = req.params;
    const confirmation = req.query.confirmation;

    if (confirmation !== 'true') {
        throw new ApiError(400, 'Confirmation required.');
    }

    try {
        await userService.deleteUser(parseInt(id), JSON.parse(confirmation));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}