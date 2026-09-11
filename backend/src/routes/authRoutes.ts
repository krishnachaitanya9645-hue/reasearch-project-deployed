import { Router } from 'express';
import { register, login, me, googleAuth, completeProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/complete-profile', authenticateToken, completeProfile);
router.get('/me', authenticateToken, me);

export default router;
