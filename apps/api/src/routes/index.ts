import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getHealth } from '../controllers/healthController';
import { getApod } from '../controllers/apodController';
import { listAsteroids } from '../controllers/neoWsController';

const router = Router();

router.get('/health', getHealth);
router.get('/api/apod', asyncHandler(getApod));
router.get('/api/asteroids', asyncHandler(listAsteroids));

export default router;

