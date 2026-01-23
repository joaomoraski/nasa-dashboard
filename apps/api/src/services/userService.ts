import User from "../models/user";
import { ApiError, RepositoryError } from "../types";
import { UserRepository } from "../repos/userRepository";
import { UserResponse, UserPublic } from "../models/user";
import jwt from "jsonwebtoken";
import { comparePassword, compareTextPassword } from "../utils/authHelpers";
const secretKey = process.env.SECRET_KEY;

const userRepository = new UserRepository();

export async function registerUser(email: string, password: string, passwordConfirmation: string): Promise<UserResponse> {
    if (!secretKey) {
        throw new ApiError(500, 'Server configuration error: SECRET_KEY is not set');
    }

    if (!compareTextPassword(password, passwordConfirmation)) {
        throw new ApiError(400, 'Passwords do not match');
    }

    try {
        if (await userRepository.checkIfUserExists(email)) {
            throw new ApiError(409, 'Email already registered');
        }

        const user = await userRepository.registerUser(email, password);
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1d' });

        return new UserResponse({
            id: user.id,
            email: user.email,
            apiKey: user.apiKey,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(404, error.message);
        }
        throw new ApiError(400, 'Failed to register user');
    }
}

export async function loginUser(email: string, password: string): Promise<UserResponse> {
    if (!secretKey) {
        throw new ApiError(500, 'Server configuration error: SECRET_KEY is not set');
    }

    try {
        const user = await userRepository.findUserByEmail(email);

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1d' });
        return new UserResponse({
            id: user.id,
            email: user.email,
            apiKey: user.apiKey,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(401, 'Invalid email or password');
        }
        throw new ApiError(401, 'Invalid email or password');
    }
}

export async function getUserById(id: number): Promise<UserPublic> {
    try {
        const user = await userRepository.getUserById(id);
        return new UserPublic({
            id: user.id,
            email: user.email,
            apiKey: user.apiKey,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(404, error.message);
        }
        throw new ApiError(404, 'User not found');
    }
}

export async function getUserByIdWithFavorites(id: number): Promise<UserPublic> {
    try {
        const user = await userRepository.getUserByIdWithFavorites(id);
        return new UserPublic({
            id: user.id,
            email: user.email,
            apiKey: user.apiKey,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            favorites: user.favorites,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(404, error.message);
        }
        throw new ApiError(404, 'User not found');
    }
}

export async function updateUser(id: number, user: User): Promise<UserPublic> {
    try {
        const updatedUser = await userRepository.updateUser(id, user);
        return new UserPublic({
            id: updatedUser.id,
            email: updatedUser.email,
            apiKey: updatedUser.apiKey,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(404, error.message);
        }
        throw new ApiError(404, 'User not found');
    }
}

export async function checkIfUserHasFavorites(id: number): Promise<boolean> {
    try {
        const user = await userRepository.getUserByIdWithFavorites(id);
        return Array.isArray(user?.favorites) && user.favorites.length > 0;
    } catch (error) {
        if (error instanceof ApiError || error instanceof RepositoryError) {
            return false;
        }
        return false;
    }
}

export async function deleteUser(id: number, confirmation: boolean): Promise<void> {
    try {
        const hasFavorites = await checkIfUserHasFavorites(id);
        if (hasFavorites && !confirmation) {
            throw new ApiError(400, 'User has favorites, please confirm deletion');
        }
        await userRepository.deleteUser(id);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof RepositoryError) {
            throw new ApiError(404, error.message);
        }
        throw new ApiError(404, 'User not found');
    }
}