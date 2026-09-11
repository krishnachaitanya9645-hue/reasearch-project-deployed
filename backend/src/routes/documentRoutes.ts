import { Router } from 'express';
import { getDocuments, createDocument, createTextDocument, updateTextDocument, deleteDocument } from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getDocuments);
router.post('/', authenticateToken, createDocument);
router.post('/text', authenticateToken, createTextDocument);
router.put('/:id', authenticateToken, updateTextDocument);
router.delete('/:id', authenticateToken, deleteDocument);

export default router;
