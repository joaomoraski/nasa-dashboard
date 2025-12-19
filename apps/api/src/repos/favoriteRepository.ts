import Favorites from "../models/favorites";

export default interface IFavoriteRepo {
    addFavorite(favorite: Favorites): Promise<Favorites>;
    getFavoriteById(id: number): Promise<Favorites>;
    getFavoritesByUserId(userId: number): Promise<Favorites[]>;
    deleteFavorite(id: number): Promise<void>;
}

export class FavoriteRepository implements IFavoriteRepo {
    async addFavorite(favorite: Favorites): Promise<Favorites> {
        return new Favorites({ id: 0, userId: favorite.userId, fav_type: favorite.fav_type, media_type: favorite.media_type, description: favorite.description, metadata: favorite.metadata, createdAt: new Date(), updatedAt: new Date() });
    }
    
    async getFavoriteById(id: number): Promise<Favorites> {
        return new Favorites({ id: id, userId: 0, fav_type: "", media_type: "", description: "", metadata: null, createdAt: new Date(), updatedAt: new Date() });
    }
    
    async getFavoritesByUserId(userId: number): Promise<Favorites[]> {
        return [];
    }

    async deleteFavorite(id: number): Promise<void> {
        return;
    }

}