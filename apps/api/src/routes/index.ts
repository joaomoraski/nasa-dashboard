import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getApod } from '../controllers/apodController';
import { getAsteroidById, listAsteroids } from '../controllers/neoWsController';
import { searchNasaImages } from '../controllers/nasaImageController';
import { registerUser, getUserById, getUserByIdWithFavorites, updateUser, deleteUser, loginUser } from '../controllers/userController';
import { addFavorite, getFavoriteById, getFavoritesByUserId, deleteFavorite } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/api/apod', asyncHandler(getApod));
router.get('/api/asteroids', asyncHandler(listAsteroids));
router.get('/api/asteroids/:id', asyncHandler(getAsteroidById));
router.get('/api/images/', asyncHandler(searchNasaImages));

router.post('/api/auth/register', asyncHandler(registerUser));
router.post('/api/auth/login', asyncHandler(loginUser));
router.get('/api/users/:id', authMiddleware, asyncHandler(getUserById));
router.get('/api/users/:id/favorites', authMiddleware, asyncHandler(getUserByIdWithFavorites));
router.put('/api/users/:id', authMiddleware, asyncHandler(updateUser));
router.delete('/api/users/:id', authMiddleware, asyncHandler(deleteUser));

router.post('/api/favorites', authMiddleware, asyncHandler(addFavorite));
router.get('/api/favorites/:id', authMiddleware, asyncHandler(getFavoriteById));
router.get('/api/favorites/user/:userId', authMiddleware, asyncHandler(getFavoritesByUserId));
router.delete('/api/favorites/:id', authMiddleware, asyncHandler(deleteFavorite));

export default router;

