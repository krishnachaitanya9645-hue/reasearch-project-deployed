import { Router } from 'express';
import { getWorkspaces, createWorkspace, getWorkspaceById, updateWorkspace, deleteWorkspace } from '../controllers/workspaceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getWorkspaces);
router.post('/', authenticateToken, createWorkspace);
router.get('/:id', authenticateToken, getWorkspaceById);
router.put('/:id', authenticateToken, updateWorkspace);
router.delete('/:id', authenticateToken, deleteWorkspace);

export default router;
