import { Router } from 'express';
import {
  searchPapers,
  getPapers,
  addPaperToWorkspace,
  getPaperById,
  analyzePaper,
  comparePapers,
  getComparisons,
  deletePaper
} from '../controllers/paperController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', authenticateToken, searchPapers);
router.get('/comparisons', authenticateToken, getComparisons);
router.post('/compare', authenticateToken, comparePapers);
router.post('/add-to-workspace', authenticateToken, addPaperToWorkspace);

router.get('/', authenticateToken, getPapers);
router.get('/:id', authenticateToken, getPaperById);
router.post('/:id/analyze', authenticateToken, analyzePaper);
router.delete('/:id', authenticateToken, deletePaper);

export default router;
