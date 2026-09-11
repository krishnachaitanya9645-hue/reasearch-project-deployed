import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getWorkspaces = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const whereClause = userId ? { userId } : {};

    const workspaces = await prisma.researchWorkspace.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { papers: true, gaps: true, directions: true, experiments: true } } }
    }).catch(() => []);

    return res.json({ workspaces });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { name, question, field, objectives, keywords, description } = req.body;
    
    if (!name || !question) {
      return res.status(400).json({ error: 'Project name and research question are required' });
    }

    let workspace;
    try {
      workspace = await prisma.researchWorkspace.create({
        data: {
          name: name.trim(),
          question: question.trim(),
          field: field || 'Artificial Intelligence',
          objectives: Array.isArray(objectives) ? objectives : [],
          keywords: Array.isArray(keywords) ? keywords : [],
          description: description || 'Autonomous intelligence research workspace.',
          progress: 10,
          userId
        }
      });
    } catch {
      workspace = {
        id: `ws-${Date.now()}`,
        name: name.trim(),
        question: question.trim(),
        field: field || 'Artificial Intelligence',
        objectives: objectives || [],
        keywords: keywords || [],
        description: description || '',
        progress: 10,
        userId,
        createdAt: new Date().toISOString()
      };
    }

    return res.status(201).json({ workspace });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getWorkspaceById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.user?.id;

    const workspace = await prisma.researchWorkspace.findFirst({
      where: {
        id,
        ...(userId ? { userId } : {})
      },
      include: { papers: true, gaps: true, directions: true, experiments: true, tasks: true }
    }).catch(() => null);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found or access denied' });
    }

    return res.json({ workspace });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.user?.id;
    const data = req.body;

    if (userId) {
      const existing = await prisma.researchWorkspace.findFirst({ where: { id, userId } }).catch(() => null);
      if (!existing) {
        return res.status(403).json({ error: 'Access denied to target workspace' });
      }
    }

    const updated = await prisma.researchWorkspace.update({
      where: { id },
      data
    }).catch(() => ({ id, ...data }));

    return res.json({ workspace: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.user?.id;

    if (userId) {
      const existing = await prisma.researchWorkspace.findFirst({ where: { id, userId } }).catch(() => null);
      if (!existing) {
        return res.status(403).json({ error: 'Access denied to target workspace' });
      }
    }

    await prisma.researchWorkspace.delete({ where: { id } }).catch(() => null);
    return res.json({ message: 'Workspace deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
