import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { orchestratorAgent, AgentContext } from '../agents/orchestratorAgent.js';
import { discoveryAgent } from '../agents/discoveryAgent.js';
import { analysisAgent } from '../agents/analysisAgent.js';
import { relationshipAgent } from '../agents/relationshipAgent.js';
import { gapAgent } from '../agents/gapAgent.js';
import { directionAgent } from '../agents/directionAgent.js';
import { taskPlannerAgent } from '../agents/taskPlannerAgent.js';
import { validationAgent } from '../agents/validationAgent.js';
import { extractTextFromContent } from '../utils/pdfExtractor.js';
import { mockDocumentsMap } from './documentController.js';

export const runAgentPipeline = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId, documentId, documentIds, paperIds, researchQuestion } = req.body;
    const wsId = workspaceId || 'ws-1';

    // 1. Fetch workspace details
    const workspace = await prisma.researchWorkspace.findUnique({ where: { id: wsId } }).catch(() => null);

    // 2. Resolve document IDs
    const targetDocIds: string[] = [];
    if (Array.isArray(documentIds) && documentIds.length > 0) {
      targetDocIds.push(...documentIds);
    } else if (documentId) {
      targetDocIds.push(documentId);
    }

    const docs: any[] = await prisma.document.findMany({
      where: targetDocIds.length > 0 ? { id: { in: targetDocIds } } : { workspaceId: wsId }
    }).catch(() => []);

    // Fallback to mockDocumentsMap if documents not found in DB
    if (targetDocIds.length > 0) {
      for (const id of targetDocIds) {
        if (!docs.some(d => d.id === id)) {
          const mDoc = mockDocumentsMap.get(id);
          if (mDoc) docs.push(mDoc);
        }
      }
    } else if (docs.length === 0) {
      for (const mDoc of mockDocumentsMap.values()) {
        if (mDoc.workspaceId === wsId || !mDoc.workspaceId) {
          docs.push(mDoc);
        }
      }
    }

    // 3. Resolve paper IDs
    const targetPaperIds: string[] = Array.isArray(paperIds) ? paperIds : [];
    const papers = targetPaperIds.length > 0 ? await prisma.paper.findMany({
      where: { id: { in: targetPaperIds }, workspaceId: wsId },
      include: { analysis: true }
    }).catch(() => []) : [];

    // 4. Build combined multi-source text payload
    const textChunks: string[] = [];

    if (docs.length > 0) {
      textChunks.push(`=== UPLOADED DOCUMENTS (${docs.length}) ===`);
      for (const doc of docs) {
        let text = doc.extractedText || '';
        if (!text || text.length < 20) {
          text = extractTextFromContent(doc.name, '').extractedText;
        }
        textChunks.push(`--- Document: ${doc.name} ---\n${text}`);
      }
    }

    if (papers.length > 0) {
      textChunks.push(`\n=== DISCOVERED ACADEMIC PAPERS (${papers.length}) ===`);
      for (const p of papers) {
        let pText = `Title: ${p.title}\nAuthors: ${p.authors.join(', ')}\nVenue: ${p.journalOrConf} (${p.year})\nAbstract: ${p.abstract}`;
        if (p.analysis) {
          pText += `\nMethodology: ${p.analysis.methodology}\nFindings: ${p.analysis.keyFindings.join('; ')}\nLimitations: ${p.analysis.limitations}`;
        }
        textChunks.push(`--- Paper: ${p.title} (${p.year}) ---\n${pText}`);
      }
    }

    // Default fallback if no doc and no paper
    if (textChunks.length === 0) {
      const fallbackExt = extractTextFromContent('CN.pdf', '');
      textChunks.push(`=== UPLOADED DOCUMENTS (1) ===\n--- Document: CN.pdf ---\n${fallbackExt.extractedText}`);
    }

    const combinedText = textChunks.join('\n\n');
    const primaryDocName = docs[0]?.name || papers[0]?.title || 'Research Source';
    const documentCount = docs.length;
    const paperCount = papers.length;
    const sourcesSummary = `${documentCount} Uploaded Document(s), ${paperCount} Academic Paper(s)`;

    const question = researchQuestion || workspace?.question || `How can we optimize research objectives for ${primaryDocName}?`;
    const field = docs[0]?.detectedField || workspace?.field || 'Computer Science & AI';
    const detectedTopic = docs[0]?.detectedTopic || workspace?.name || 'Autonomous Intelligent Systems';

    console.log(`==================================================`);
    console.log(`[WORKFLOW START] Running 8-Agent Pipeline`);
    console.log(`Sources: ${sourcesSummary} (${combinedText.length} total chars)`);
    console.log(`Topic: '${detectedTopic}' | Field: '${field}'`);
    console.log(`Question: '${question}'`);
    console.log(`==================================================`);

    let context: AgentContext = {
      workspaceId: wsId,
      documentId: docs[0]?.id,
      fileName: primaryDocName,
      extractedText: combinedText,
      researchQuestion: question,
      field,
      detectedTopic,
      logs: []
    };

    // 5. Create AgentRun in DB
    let agentRun: any = null;
    try {
      agentRun = await prisma.agentRun.create({
        data: {
          workspaceId: wsId,
          documentId: docs[0]?.id,
          paperIds: papers.map(p => p.id),
          researchQuestion: question,
          status: 'RUNNING'
        }
      });
    } catch {
      agentRun = { id: `run-${Date.now()}` };
    }

    // 6. Execute 8 Agents Sequentially
    context = await orchestratorAgent.run(context);
    context = await discoveryAgent.run(context);
    context = await analysisAgent.run(context);
    context = await relationshipAgent.run(context);
    context = await gapAgent.run(context);
    context = await directionAgent.run(context);
    context = await taskPlannerAgent.run(context);
    context = await validationAgent.run(context);

    const reportData = context.validationOutput?.finalReport;

    // 7. Save AgentExecutions in DB
    try {
      const agentList = [orchestratorAgent, discoveryAgent, analysisAgent, relationshipAgent, gapAgent, directionAgent, taskPlannerAgent, validationAgent];
      for (const ag of agentList) {
        await prisma.agentExecution.create({
          data: {
            runId: agentRun.id,
            agentName: ag.name,
            status: 'COMPLETED',
            log: context.logs.find(l => l.includes(ag.name)) || `Executed ${ag.name}`
          }
        }).catch(() => null);
      }
    } catch (e) {
      console.warn('Could not save agent executions to DB:', e);
    }

    // 8. Save ResearchReport in DB with source metrics
    let savedReport: any = null;
    try {
      savedReport = await prisma.report.create({
        data: {
          title: reportData.title,
          workspaceId: wsId,
          documentId: docs[0]?.id,
          runId: agentRun.id,
          documentName: primaryDocName,
          documentCount,
          paperCount,
          sourcesSummary,
          researchQuestion: reportData.researchQuestion,
          executiveSummary: reportData.executiveSummary,
          keyConcepts: reportData.keyConcepts,
          methodology: reportData.methodology,
          empiricalFindings: reportData.empiricalFindings,
          relationships: reportData.relationships,
          potentialGaps: reportData.potentialGaps,
          directions: reportData.directions,
          experiments: reportData.experiments,
          tasks: reportData.tasks,
          validationStatus: reportData.validationStatus,
          evidenceQuotes: reportData.evidenceQuotes
        }
      });
    } catch {
      savedReport = { id: `rep-${Date.now()}`, documentCount, paperCount, sourcesSummary, ...reportData };
    }

    // 9. Update Workspace state in DB
    try {
      await prisma.researchGap.deleteMany({ where: { workspaceId: wsId } }).catch(() => null);
      await prisma.researchDirection.deleteMany({ where: { workspaceId: wsId } }).catch(() => null);

      if (reportData.potentialGaps) {
        for (const g of reportData.potentialGaps) {
          await prisma.researchGap.create({
            data: {
              title: g.title,
              description: g.description,
              confidenceScore: g.confidenceScore || 90,
              supportingPaperTitles: g.supportingPaperTitles || [primaryDocName],
              evidence: g.evidence || [],
              whyItMatters: g.whyItMatters || 'Critical requirement',
              impactLevel: g.impactLevel || 'Critical',
              workspaceId: wsId
            }
          }).catch(() => null);
        }
      }

      if (reportData.directions) {
        for (const d of reportData.directions) {
          await prisma.researchDirection.create({
            data: {
              title: d.title,
              description: d.description,
              targetGapTitle: d.targetGapTitle || 'Literature Gap',
              supportingEvidence: d.supportingEvidence || [],
              expectedImpact: d.expectedImpact || 'High',
              difficulty: d.difficulty || 'Medium',
              noveltyScore: d.noveltyScore || 92,
              potentialVenue: d.potentialVenue || 'IEEE / ACM Conference',
              isAddedToPlan: d.isAddedToPlan || false,
              workspaceId: wsId
            }
          }).catch(() => null);
        }
      }

      await prisma.researchWorkspace.update({
        where: { id: wsId },
        data: { progress: 100 }
      }).catch(() => null);
    } catch (e) {
      console.warn('Could not update workspace records:', e);
    }

    // 10. Update AgentRun status to COMPLETED
    try {
      await prisma.agentRun.update({
        where: { id: agentRun.id },
        data: { status: 'COMPLETED', completedAt: new Date() }
      }).catch(() => null);
    } catch {}

    console.log(`[WORKFLOW COMPLETE] Generated report '${reportData.title}' for '${primaryDocName}' (${sourcesSummary})`);

    return res.json({
      message: 'Autonomous workflow executed successfully',
      runId: agentRun.id,
      status: 'COMPLETED',
      reportId: savedReport.id,
      sourcesSummary,
      documentCount,
      paperCount,
      report: reportData,
      logs: context.logs
    });
  } catch (error: any) {
    console.error('Agent Pipeline Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getRunStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { runId } = req.params;
    const run = await prisma.agentRun.findUnique({
      where: { id: runId },
      include: { executions: true, reports: true }
    }).catch(() => null);

    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }

    return res.json({ run });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
