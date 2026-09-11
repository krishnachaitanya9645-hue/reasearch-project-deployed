import { Router } from 'express';
import { getExperiments, createExperiment } from '../controllers/experimentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getExperiments);
router.post('/', authenticateToken, createExperiment);

export default router;
