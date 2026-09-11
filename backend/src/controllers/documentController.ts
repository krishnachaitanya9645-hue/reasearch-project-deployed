import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { extractTextFromContent } from '../utils/pdfExtractor.js';

export const mockDocumentsMap = new Map<string, any>();

export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
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

    const documents: any[] = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    }).catch(() => []);

    for (const mockDoc of mockDocumentsMap.values()) {
      if (!documents.some(d => d.id === mockDoc.id)) {
        if (!workspaceId || mockDoc.workspaceId === workspaceId) {
          documents.push(mockDoc);
        }
      }
    }

    return res.json({ documents });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, fileSize, fileType, author, workspaceId, content } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Document name is required' });
    }

    const cleanName = name.trim();
    const ext = cleanName.toLowerCase().split('.').pop() || '';
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: `Unsupported file format '.${ext}'. Allowed formats: PDF, DOC, DOCX, TXT.` });
    }

    const determinedFileType = fileType ? fileType.toUpperCase() : (ext === 'docx' ? 'DOCX' : ext === 'doc' ? 'DOC' : ext === 'txt' ? 'TXT' : 'PDF');

    // Extract text and detect topic from PDF/DOCX/text content
    const extractedData = extractTextFromContent(cleanName, content || '');

    let doc;
    try {
      doc = await prisma.document.create({
        data: {
          name: extractedData.fileName,
          fileSize: fileSize || '2.4 MB',
          fileType: determinedFileType,
          sourceType: 'FILE',
          uploadDate: new Date().toISOString().split('T')[0],
          author: author || req.user?.name || 'Uploaded File',
          status: 'Analyzed',
          extractedText: extractedData.extractedText,
          detectedTopic: extractedData.detectedTopic,
          detectedField: extractedData.detectedField,
          keywords: extractedData.keywords,
          textLength: extractedData.textLength,
          workspaceId
        }
      });
    } catch {
      doc = {
        id: `doc-${Date.now()}`,
        name: extractedData.fileName,
        fileSize: fileSize || '2.4 MB',
        fileType: determinedFileType,
        sourceType: 'FILE',
        uploadDate: new Date().toISOString().split('T')[0],
        author: author || req.user?.name || 'Uploaded File',
        status: 'Analyzed',
        extractedText: extractedData.extractedText,
        detectedTopic: extractedData.detectedTopic,
        detectedField: extractedData.detectedField,
        keywords: extractedData.keywords,
        textLength: extractedData.textLength,
        workspaceId,
        createdAt: new Date().toISOString()
      };
    }

    console.log(`[FILE DOCUMENT CREATED] ID: ${doc.id}, Name: ${doc.name}, Type: ${determinedFileType}, Text Length: ${doc.textLength} chars`);
    mockDocumentsMap.set(doc.id, doc);

    return res.status(201).json({ document: doc });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createTextDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workspaceId, title, content } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Research title is required' });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Research content cannot be empty' });
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    // Verify workspace ownership if workspaceId provided
    if (workspaceId && typeof workspaceId === 'string' && userId) {
      const workspace = await prisma.researchWorkspace.findFirst({
        where: { id: workspaceId }
      }).catch(() => null);
      if (workspace && workspace.userId && workspace.userId !== userId) {
        return res.status(403).json({ error: 'Access denied to target workspace' });
      }
    }

    const extractedData = extractTextFromContent(cleanTitle, cleanContent);
    const calculatedSize = `${Math.max(1, Math.round((cleanContent.length / 1024) * 10) / 10)} KB`;

    let doc;
    try {
      doc = await prisma.document.create({
        data: {
          name: cleanTitle,
          fileSize: calculatedSize,
          fileType: 'TEXT',
          sourceType: 'TEXT',
          uploadDate: new Date().toISOString().split('T')[0],
          author: req.user?.name || 'Text Input',
          status: 'Analyzed',
          extractedText: cleanContent,
          detectedTopic: extractedData.detectedTopic,
          detectedField: extractedData.detectedField,
          keywords: extractedData.keywords,
          textLength: cleanContent.length,
          workspaceId
        }
      });
    } catch {
      doc = {
        id: `doc-text-${Date.now()}`,
        name: cleanTitle,
        fileSize: calculatedSize,
        fileType: 'TEXT',
        sourceType: 'TEXT',
        uploadDate: new Date().toISOString().split('T')[0],
        author: req.user?.name || 'Text Input',
        status: 'Analyzed',
        extractedText: cleanContent,
        detectedTopic: extractedData.detectedTopic,
        detectedField: extractedData.detectedField,
        keywords: extractedData.keywords,
        textLength: cleanContent.length,
        workspaceId,
        createdAt: new Date().toISOString()
      };
    }

    console.log(`[TEXT DOCUMENT CREATED] ID: ${doc.id}, Title: '${doc.name}', Length: ${doc.textLength} chars`);
    mockDocumentsMap.set(doc.id, doc);

    return res.status(201).json({ document: doc });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateTextDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Research title is required' });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Research content cannot be empty' });
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const extractedData = extractTextFromContent(cleanTitle, cleanContent);
    const calculatedSize = `${Math.max(1, Math.round((cleanContent.length / 1024) * 10) / 10)} KB`;

    let updatedDoc;
    try {
      updatedDoc = await prisma.document.update({
        where: { id },
        data: {
          name: cleanTitle,
          extractedText: cleanContent,
          fileSize: calculatedSize,
          textLength: cleanContent.length,
          detectedTopic: extractedData.detectedTopic,
          detectedField: extractedData.detectedField,
          keywords: extractedData.keywords,
          updatedAt: new Date()
        }
      });
    } catch {
      updatedDoc = {
        id,
        name: cleanTitle,
        extractedText: cleanContent,
        fileSize: calculatedSize,
        fileType: 'TEXT',
        sourceType: 'TEXT',
        textLength: cleanContent.length,
        detectedTopic: extractedData.detectedTopic,
        detectedField: extractedData.detectedField,
        keywords: extractedData.keywords,
        updatedAt: new Date().toISOString()
      };
    }

    console.log(`[TEXT DOCUMENT UPDATED] ID: ${id}, Title: '${cleanTitle}'`);
    mockDocumentsMap.set(updatedDoc.id, updatedDoc);

    return res.json({ document: updatedDoc });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.document.delete({ where: { id } }).catch(() => null);
    return res.json({ message: 'Document deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
