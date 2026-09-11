import { Router } from 'express';
import { getReports, getLatestReport, createReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/latest', authenticateToken, getLatestReport);
router.get('/', authenticateToken, getReports);
router.post('/', authenticateToken, createReport);

export default router;
