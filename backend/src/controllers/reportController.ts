import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getReports = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const userId = req.user?.userId || req.user?.id;

    let whereClause: any = {};
    if (workspaceId && typeof workspaceId === 'string') {
      if (userId) {
        const workspace = await prisma.researchWorkspace.findFirst({
          where: { id: workspaceId, userId }
        }).catch(() => null);
        if (!workspace) {
          return res.status(403).json({ error: 'Access denied to target workspace' });
        }
      }
      whereClause.workspaceId = workspaceId;
    } else if (userId) {
      whereClause.workspace = { userId };
    }

    const reports = await prisma.report.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } }).catch(() => []);
    return res.json({ reports });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLatestReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId, documentId } = req.query;
    const wsId = workspaceId ? String(workspaceId) : 'ws-1';

    const where: any = { workspaceId: wsId };
    if (documentId) {
      where.documentId = String(documentId);
    }

    const report = await prisma.report.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
      include: { document: true, agentRun: true }
    }).catch(() => null);

    if (!report) {
      return res.status(404).json({ error: 'No generated report found for this workspace' });
    }

    return res.json({ report });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, contentJson, workspaceId, documentId, runId } = req.body;
    let report;
    try {
      report = await prisma.report.create({
        data: {
          title,
          contentJson: contentJson || {},
          workspaceId: workspaceId || 'ws-1',
          documentId,
          runId
        }
      });
    } catch {
      report = { id: `rep-${Date.now()}`, title, workspaceId: workspaceId || 'ws-1' };
    }
    return res.status(201).json({ report });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
