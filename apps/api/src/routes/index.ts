import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getHealth } from '../controllers/healthController';
import { getApod } from '../controllers/apodController';
import { getAsteroidById, listAsteroids } from '../controllers/neoWsController';
import { searchNasaImages } from '../controllers/nasaImageController';

const router = Router();

router.get('/health', getHealth);
router.get('/api/apod', asyncHandler(getApod));
router.get('/api/asteroids', asyncHandler(listAsteroids));
router.get('/api/asteroids/:id', asyncHandler(getAsteroidById));
router.get('/api/images/', asyncHandler(searchNasaImages));

export default router;

