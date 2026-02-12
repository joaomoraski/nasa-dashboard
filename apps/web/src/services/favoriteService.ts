import { API_URL } from '../config/api';
import type { Favorite } from '../types/favorite';

export interface FavoriteServiceError {
    message: string;
}

export async function addFavorite(token: string, favorite: Favorite): Promise<Favorite> {
    const resp = await fetch(`${API_URL}/api/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            fav_type: favorite.fav_type,
            media_type: favorite.media_type,
            description: favorite.description,
            metadata: favorite.metadata,
        }),
    });
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

export async function deleteFavorite(token: string, id: number): Promise<void> {
    const resp = await fetch(`${API_URL}/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

export async function getFavoritesByUserId(token: string, userId: number): Promise<Favorite[]> {
    const resp = await fetch(`${API_URL}/api/favorites/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const body = await resp.json();

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}

export async function checkFavorite(token: string, fav_type: string, description: string): Promise<Favorite | null> {
    const resp = await fetch(`${API_URL}/api/favorites/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fav_type, description }),
    });
    const body = await resp.json();

    if (resp.status === 404) {
        return null;
    }

    if (!resp.ok) {
        throw new Error(body?.error ?? 'Unknown error');
    }

    return body;
}
