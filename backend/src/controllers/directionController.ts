import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getDirections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const where = workspaceId ? { workspaceId: String(workspaceId) } : {};
    const directions = await prisma.researchDirection.findMany({ where, orderBy: { createdAt: 'desc' } }).catch(() => []);
    return res.json({ directions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDirection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, targetGapTitle, supportingEvidence, expectedImpact, difficulty, noveltyScore, potentialVenue, workspaceId } = req.body;
    let direction;
    try {
      direction = await prisma.researchDirection.create({
        data: {
          title,
          description,
          targetGapTitle: targetGapTitle || 'General Bottleneck',
          supportingEvidence: supportingEvidence || [],
          expectedImpact: expectedImpact || 'High',
          difficulty: difficulty || 'Medium',
          noveltyScore: noveltyScore || 90,
          potentialVenue: potentialVenue || 'NeurIPS / ICLR',
          workspaceId: workspaceId || 'ws-1'
        }
      });
    } catch {
      direction = { id: `dir-${Date.now()}`, title, description, targetGapTitle, workspaceId: workspaceId || 'ws-1' };
    }
    return res.status(201).json({ direction });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
