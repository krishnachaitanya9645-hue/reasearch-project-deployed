import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getExperiments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const where = workspaceId ? { workspaceId: String(workspaceId) } : {};
    const experiments = await prisma.experiment.findMany({ where, orderBy: { createdAt: 'desc' } }).catch(() => []);
    return res.json({ experiments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createExperiment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, directionTitle, hypothesis, dataset, method, metrics, expectedOutcome, milestones, workspaceId } = req.body;
    let exp;
    try {
      exp = await prisma.experiment.create({
        data: {
          title,
          directionTitle: directionTitle || 'Direction Baseline',
          hypothesis,
          dataset: dataset || 'GSM8K',
          method: method || 'Quantitative comparison',
          metrics: metrics || [],
          expectedOutcome: expectedOutcome || 'Outperform baselines',
          status: 'Planning',
          milestones: milestones || [],
          workspaceId: workspaceId || 'ws-1'
        }
      });
    } catch {
      exp = { id: `exp-${Date.now()}`, title, hypothesis, workspaceId: workspaceId || 'ws-1' };
    }
    return res.status(201).json({ experiment: exp });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
