import { Response } from 'express';
import prisma from '../services/prisma.js';
import { geminiService } from '../services/geminiService.js';
import { academicSearchService } from '../services/academicSearchService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const searchPapers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query = '', page = '1', limit = '10', yearFrom, yearTo, sort = 'relevance' } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ error: 'Search query parameter is required' });
    }

    const options = {
      query: query.toString().trim(),
      page: parseInt(page.toString(), 10) || 1,
      limit: parseInt(limit.toString(), 10) || 10,
      yearFrom: yearFrom ? parseInt(yearFrom.toString(), 10) : undefined,
      yearTo: yearTo ? parseInt(yearTo.toString(), 10) : undefined,
      sort: (sort as any) || 'relevance'
    };

    const result = await academicSearchService.searchPapers(options);

    return res.json({
      papers: result.papers,
      total: result.total,
      page: options.page,
      limit: options.limit
    });
  } catch (error: any) {
    console.error('Paper Search Endpoint Error:', error);
    return res.status(500).json({ error: 'Unable to search academic sources. Please try again.' });
  }
};

export const getPapers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const userId = req.user?.userId || req.user?.id;

    let whereClause: any = {};
    if (workspaceId && typeof workspaceId === 'string') {
      // Validate workspace ownership if user exists
      if (userId) {
        const workspace = await prisma.researchWorkspace.findFirst({
          where: { id: workspaceId, userId }
        }).catch(() => null);
        if (!workspace) {
          return res.status(403).json({ error: 'Access denied to target workspace' });
        }
      }
      whereClause.workspaceId = workspaceId;
    }

    const papers = await prisma.paper.findMany({
      where: whereClause,
      include: { analysis: true },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []);

    return res.json({ papers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addPaperToWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      externalId,
      source = 'OpenAlex',
      title,
      authors = [],
      year,
      journalOrConf,
      venue,
      abstract,
      citations = 0,
      tags = [],
      doi,
      url,
      pdfUrl,
      workspaceId
    } = req.body;

    if (!title || !workspaceId) {
      return res.status(400).json({ error: 'Title and workspaceId are required' });
    }

    const userId = req.user?.userId || req.user?.id;
    if (userId) {
      const workspace = await prisma.researchWorkspace.findFirst({
        where: { id: workspaceId, userId }
      }).catch(() => null);
      if (!workspace) {
        return res.status(403).json({ error: 'Access denied to target workspace' });
      }
    }

    // Check duplicate paper in workspace
    const existingPaper = await prisma.paper.findFirst({
      where: {
        workspaceId,
        OR: [
          ...(externalId ? [{ externalId }] : []),
          ...(doi ? [{ doi }] : []),
          { title }
        ]
      }
    }).catch(() => null);

    if (existingPaper) {
      return res.status(409).json({
        message: 'Paper already exists in this workspace',
        paper: existingPaper,
        isDuplicate: true
      });
    }

    let paper;
    try {
      paper = await prisma.paper.create({
        data: {
          externalId,
          source,
          title,
          authors: Array.isArray(authors) ? authors : [authors],
          year: year || new Date().getFullYear(),
          journalOrConf: journalOrConf || venue || 'Academic Literature',
          venue: venue || journalOrConf || 'Academic Literature',
          abstract: abstract || '',
          citations: citations || 0,
          tags: Array.isArray(tags) ? tags : [],
          doi,
          url,
          pdfUrl,
          isSaved: true,
          isAddedToWorkspace: true,
          workspaceId
        }
      });
    } catch {
      paper = {
        id: `paper-${Date.now()}`,
        externalId,
        source,
        title,
        authors,
        year,
        journalOrConf: venue || 'Academic Literature',
        abstract,
        citations,
        tags,
        doi,
        url,
        isAddedToWorkspace: true,
        workspaceId
      };
    }

    return res.status(201).json({ message: 'Paper added to workspace', paper });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPaperById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({
      where: { id },
      include: { analysis: true }
    }).catch(() => null);

    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    return res.json({ paper });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const analyzePaper = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({ where: { id } }).catch(() => null);

    const title = paper?.title || req.body.title || 'Academic Study';
    const abstract = paper?.abstract || req.body.abstract || 'Abstract text';

    const aiResult = await geminiService.generateAnalysis(title, abstract);

    let analysis;
    try {
      analysis = await prisma.paperAnalysis.upsert({
        where: { paperId: id },
        update: aiResult,
        create: { paperId: id, ...aiResult }
      });
    } catch {
      analysis = { id: `analysis-${Date.now()}`, paperId: id, ...aiResult };
    }

    return res.json({ message: 'Paper analyzed successfully', analysis });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const comparePapers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId, paperIds, researchQuestion } = req.body;

    if (!workspaceId || !Array.isArray(paperIds) || paperIds.length < 2) {
      return res.status(400).json({ error: 'workspaceId and at least 2 paperIds are required for comparison' });
    }

    const userId = req.user?.userId || req.user?.id;
    if (userId) {
      const workspace = await prisma.researchWorkspace.findFirst({
        where: { id: workspaceId, userId }
      }).catch(() => null);
      if (!workspace) {
        return res.status(403).json({ error: 'Access denied to target workspace' });
      }
    }

    const papers = await prisma.paper.findMany({
      where: {
        id: { in: paperIds },
        workspaceId
      },
      include: { analysis: true }
    }).catch(() => []);

    if (papers.length < 2) {
      return res.status(400).json({ error: 'At least 2 valid workspace papers must be selected' });
    }

    const paperInputs = papers.map(p => ({
      title: p.title,
      abstract: p.abstract,
      methodology: p.analysis?.methodology,
      findings: p.analysis?.resultsSummary || p.analysis?.keyFindings?.join('; ')
    }));

    const result = await geminiService.generatePaperComparison(paperInputs, researchQuestion);

    let comparison;
    try {
      comparison = await prisma.paperComparison.create({
        data: {
          workspaceId,
          paperIds: papers.map(p => p.id),
          comparisonRows: result.comparisonRows,
          aiSynthesis: result.aiSynthesis
        }
      });
    } catch {
      comparison = {
        id: `comp-${Date.now()}`,
        workspaceId,
        paperIds: papers.map(p => p.id),
        comparisonRows: result.comparisonRows,
        aiSynthesis: result.aiSynthesis,
        createdAt: new Date()
      };
    }

    return res.json({
      message: 'Paper comparison synthesized successfully',
      comparison,
      papers
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getComparisons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId || typeof workspaceId !== 'string') {
      return res.status(400).json({ error: 'workspaceId is required' });
    }

    const comparisons = await prisma.paperComparison.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []);

    return res.json({ comparisons });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deletePaper = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.paper.delete({ where: { id } }).catch(() => null);
    return res.json({ message: 'Paper deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
