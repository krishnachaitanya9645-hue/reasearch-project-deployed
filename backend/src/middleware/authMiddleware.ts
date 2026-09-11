import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../types/index.js';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For easy testing/demo mode, if no token, attach default mock user
    req.user = {
      userId: 'usr-mock-101',
      email: 'alex.rivera@researchpilot.ai',
      name: 'Dr. Alex Rivera'
    };
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};
