import { Router } from 'express';
import { getGaps, createGap } from '../controllers/gapController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getGaps);
router.post('/', authenticateToken, createGap);

export default router;
