import Favorite from "../models/favorite";
import { prisma } from "../config/prisma";

export default interface IFavoriteRepo {
    addFavorite(favorite: Favorite): Promise<Favorite>;
    getFavoriteById(id: number): Promise<Favorite>;
    getFavoritesByUserId(userId: number): Promise<Favorite[]>;
    deleteFavorite(id: number): Promise<void>;
}

export class FavoriteRepository implements IFavoriteRepo {
    async addFavorite(favorite: Favorite): Promise<Favorite> {
        const newFav = await prisma.favorite.create({
            data: {
                userId: favorite.userId,
                fav_type: favorite.fav_type,
                media_type: favorite.media_type,
                description: favorite.description,
                metadata: favorite.metadata,
            }
        })
        return new Favorite({ id: newFav.id, userId: newFav.userId, fav_type: newFav.fav_type, media_type: newFav.media_type, description: newFav.description, metadata: newFav.metadata, createdAt: newFav.createdAt, updatedAt: newFav.updatedAt });
    }

    async getFavoriteById(id: number): Promise<Favorite> {
        const fav = await prisma.favorite.findUnique({
            where: {
                id: id,
            }
        });
        if (!fav) {
            throw new Error("Favorite not found");
        }
        return new Favorite({ id: fav.id, userId: fav.userId, fav_type: fav.fav_type, media_type: fav.media_type, description: fav.description, metadata: fav.metadata, createdAt: fav.createdAt, updatedAt: fav.updatedAt });
    }

    async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
        const fav = await prisma.favorite.findMany({
            where: {
                userId: userId,
            }
        });
        if (!fav) {
            throw new Error("Favorites not found");
        }
        return fav.map((f) => new Favorite(f))
    }

    async deleteFavorite(id: number): Promise<void> {
        await prisma.favorite.delete({
            where: {
                id: id,
            }
        });
    }

}