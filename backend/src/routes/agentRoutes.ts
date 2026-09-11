import { Router } from 'express';
import { runAgentPipeline, getRunStatus } from '../controllers/agentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/run', authenticateToken, runAgentPipeline);
router.get('/runs/:runId', authenticateToken, getRunStatus);

export default router;
