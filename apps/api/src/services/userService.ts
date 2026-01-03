import User from "../models/user";
import { ApiError } from "../types";
import { UserRepository } from "../repos/userRepository";

const userRepository = new UserRepository();

export async function registerUser(email: string, password: string): Promise<User> {
    try {
        const user = await userRepository.registerUser(email, password);
        return user;
    } catch (error) {
        throw new ApiError(400, 'Failed to register user: ' + error);
    }
}

export async function getUserById(id: number): Promise<User> {
    try {
        const user = await userRepository.getUserById(id);
        return user;
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function getUserByIdWithFavorites(id: number): Promise<User> {
    try {
        const user = await userRepository.getUserByIdWithFavorites(id);
        return user;
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function updateUser(id: number, user: User): Promise<User> {
    try {
        const updatedUser = await userRepository.updateUser(id, user);
        return updatedUser;
    } catch (error) {
        throw new ApiError(404, 'User not found');
    }
}

export async function checkIfUserHasFavorites(id: number): Promise<boolean> {
    try {
        const user = await userRepository.getUserByIdWithFavorites(id);
        return Array.isArray(user?.favorites) && user.favorites.length > 0;
    } catch (error) {
        throw new ApiError(404, 'User not found');
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
        throw new ApiError(404, 'User not found');
    }
}