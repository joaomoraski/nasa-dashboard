import User from "../models/user";
import { prisma } from "../config/prisma";
import Favorite from "../models/favorite";
import { RepositoryError } from "../types";
import bcrypt from 'bcryptjs';
import { hashPassword } from "../utils/authHelpers";

export default interface IUserRepo {
    registerUser(email: string, password: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    getUserByIdWithFavorites(id: number): Promise<User>;
}

export class UserRepository implements IUserRepo {
    async registerUser(email: string, password: string): Promise<User> {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: await hashPassword(password),
                api_key: "DEMO_KEY",
            }
        });

        return new User({
            id: user.id,
            email: user.email,
            password: user.password,
            apiKey: user.api_key,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async getUserById(id: number): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });

        if (!user) {
            throw new RepositoryError("User not found");
        }

        return new User({ id: user.id, email: user.email, password: user.password, apiKey: user.api_key, createdAt: user.createdAt, updatedAt: user.updatedAt });
    }

    async checkIfUserExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        return user !== null;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!user) {
            throw new RepositoryError("User not found");
        }

        return new User({ id: user.id, email: user.email, password: user.password, apiKey: user.api_key, createdAt: user.createdAt, updatedAt: user.updatedAt });
    }

    async getUserByIdWithFavorites(id: number): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                favorites: true
            }
        });

        if (!user) {
            throw new RepositoryError("User not found");
        }

        return new User({
            id: user.id,
            email: user.email,
            password: user.password,
            apiKey: user.api_key,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            favorites: user.favorites.map((fav) => new Favorite(fav))
        });
    }

    async updateUser(id: number, user: User): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                email: user.email,
                password: user.password,
                api_key: user.apiKey,
            },
        })
        return new User({ id: updatedUser.id, email: updatedUser.email, password: updatedUser.password, apiKey: updatedUser.api_key, createdAt: updatedUser.createdAt, updatedAt: updatedUser.updatedAt });
    }

    async deleteUser(id: number): Promise<void> {
        await prisma.user.delete({
            where: { id: id },
        });
    }
}