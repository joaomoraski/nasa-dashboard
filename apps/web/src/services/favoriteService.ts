// import type { Apod } from '../types/apod';
// import { API_URL } from '../config/api';

// export interface FavoriteServiceError {
//     message: string;
// }

// // router.post('/api/favorites', asyncHandler(addFavorite));
// // router.get('/api/favorites/:id', asyncHandler(getFavoriteById));
// // router.get('/api/favorites/user/:userId', asyncHandler(getFavoritesByUserId));
// // router.delete('/api/favorites/:id', asyncHandler(deleteFavorite));

// export async function addFavorite(date?: string): Promise<void> {
//     const resp = await fetch(`${API_URL}/api/favorites`);
//     const body = await resp.json();

//     if (!resp.ok) {
//         throw new Error(body?.error ?? 'Unknown error');
//     }

//     return body;
// }

