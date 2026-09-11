import { Router } from 'express';
import { getDirections, createDirection } from '../controllers/directionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getDirections);
router.post('/', authenticateToken, createDirection);

export default router;
