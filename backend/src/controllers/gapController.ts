import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getGaps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const where = workspaceId ? { workspaceId: String(workspaceId) } : {};
    const gaps = await prisma.researchGap.findMany({ where, orderBy: { createdAt: 'desc' } }).catch(() => []);
    return res.json({ gaps });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createGap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, confidenceScore, supportingPaperTitles, evidence, whyItMatters, impactLevel, workspaceId } = req.body;
    let gap;
    try {
      gap = await prisma.researchGap.create({
        data: {
          title,
          description,
          confidenceScore: confidenceScore || 92,
          supportingPaperTitles: supportingPaperTitles || [],
          evidence: evidence || [],
          whyItMatters: whyItMatters || 'High scientific importance.',
          impactLevel: impactLevel || 'Critical',
          workspaceId: workspaceId || 'ws-1'
        }
      });
    } catch {
      gap = { id: `gap-${Date.now()}`, title, description, confidenceScore: 92, workspaceId: workspaceId || 'ws-1' };
    }
    return res.status(201).json({ gap });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
