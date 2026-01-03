import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getHealth } from '../controllers/healthController';
import { getApod } from '../controllers/apodController';
import { getAsteroidById, listAsteroids } from '../controllers/neoWsController';
import { searchNasaImages } from '../controllers/nasaImageController';
import { registerUser, getUserById, getUserByIdWithFavorites, updateUser, deleteUser } from '../controllers/userController';
import { addFavorite, getFavoriteById, getFavoritesByUserId, deleteFavorite } from '../controllers/favoriteController';

const router = Router();

router.get('/health', getHealth);
router.get('/api/apod', asyncHandler(getApod));
router.get('/api/asteroids', asyncHandler(listAsteroids));
router.get('/api/asteroids/:id', asyncHandler(getAsteroidById));
router.get('/api/images/', asyncHandler(searchNasaImages));

router.post('/api/users', asyncHandler(registerUser));
router.get('/api/users/:id', asyncHandler(getUserById));
router.get('/api/users/:id/favorites', asyncHandler(getUserByIdWithFavorites));
router.put('/api/users/:id', asyncHandler(updateUser));
router.delete('/api/users/:id', asyncHandler(deleteUser));

router.post('/api/favorites', asyncHandler(addFavorite));
router.get('/api/favorites/:id', asyncHandler(getFavoriteById));
router.get('/api/favorites/user/:userId', asyncHandler(getFavoritesByUserId));
router.delete('/api/favorites/:id', asyncHandler(deleteFavorite));

export default router;

