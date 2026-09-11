import fs from 'fs';
import path from 'path';

export interface ExtractedDocumentData {
  fileName: string;
  extractedText: string;
  textLength: number;
  detectedTopic: string;
  detectedField: string;
  keywords: string[];
}

export function extractTextFromContent(fileName: string, rawContent?: string | Buffer): ExtractedDocumentData {
  let text = '';
  
  if (typeof rawContent === 'string') {
    text = rawContent;
  } else if (Buffer.isBuffer(rawContent)) {
    const rawString = rawContent.toString('utf-8');
    // Check if DOCX XML stream
    if (rawString.includes('<w:t')) {
      const wtMatches = rawString.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (wtMatches && wtMatches.length > 0) {
        text = wtMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
      } else {
        text = rawString.replace(/[\r\n\t]+/g, ' ').replace(/[^\x20-\x7E\s]/g, '').replace(/\s+/g, ' ');
      }
    } else {
      text = rawString
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/[^\x20-\x7E\s]/g, '')
        .replace(/\s+/g, ' ');
    }
  }

  if (!text || text.trim().length < 5) {
    text = `Document: ${fileName}. Content provided for AI research intelligence analysis.`;
  }

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();
  const lowerName = fileName.toLowerCase();

  // Dynamic topic and field detection based on actual filename and text content
  let detectedField = 'Artificial Intelligence & Computer Science';
  let detectedTopic = fileName.trim() || 'Autonomous Research Subject';
  const keywords: string[] = [];

  if (lowerName.includes('blockchain') || lowerText.includes('blockchain') || lowerText.includes('supply chain') || lowerText.includes('ledger')) {
    detectedField = 'Blockchain & Distributed Ledger Technologies';
    detectedTopic = 'Blockchain-Based Supply Chain Traceability & Smart Contracts';
    keywords.push('Blockchain', 'Supply Chain', 'Distributed Ledger', 'Smart Contracts', 'Transparency');
  } else if (lowerText.includes('adaptive') && (lowerText.includes('cpu') || lowerText.includes('scheduling'))) {
    detectedField = 'Operating Systems & System Architecture';
    detectedTopic = 'Adaptive Machine Learning CPU Scheduling & Workload Prediction';
    keywords.push('Adaptive Scheduling', 'CPU Burst Prediction', 'Workload Modeling', 'Process Management');
  } else if (lowerName.includes('cn') || lowerText.includes('network') || lowerText.includes('tcp') || lowerText.includes('packet') || lowerText.includes('socket')) {
    detectedField = 'Computer Networks & Distributed Systems';
    detectedTopic = 'Network Protocols & Packet Routing Optimization';
    keywords.push('Computer Networks', 'TCP/IP Protocol', 'Congestion Control', 'Packet Loss', 'Socket API');
  } else if (lowerName.includes('os') || lowerText.includes('operating system') || lowerText.includes('kernel') || lowerText.includes('semaphore') || lowerText.includes('virtual memory') || lowerText.includes('scheduling')) {
    detectedField = 'Operating Systems & System Architecture';
    detectedTopic = 'Kernel Memory Management & Process Scheduling';
    keywords.push('Operating Systems', 'Virtual Memory', 'CPU Scheduling', 'Deadlock Prevention', 'Concurrency');
  } else if (lowerName.includes('dbms') || lowerText.includes('database') || lowerText.includes('sql') || lowerText.includes('transaction') || lowerText.includes('acid') || lowerText.includes('indexing')) {
    detectedField = 'Database Management Systems';
    detectedTopic = 'Relational Query Optimization & Transaction Control';
    keywords.push('Database Systems', 'SQL Indexing', 'ACID Transactions', 'B-Trees', 'Concurrency Control');
  } else if (lowerName.includes('bio') || lowerText.includes('rna') || lowerText.includes('protein') || lowerText.includes('gene') || lowerText.includes('genome')) {
    detectedField = 'Computational Biology & Genomics';
    detectedTopic = 'RNA Secondary Structure & Protein Folding Prediction';
    keywords.push('Genomics', 'RNA Secondary Folding', 'Structural Biology', 'SE(3) Equivariance');
  } else if (lowerName.includes('climate') || lowerText.includes('microgrid') || lowerText.includes('solar') || lowerText.includes('wind') || lowerText.includes('energy')) {
    detectedField = 'Renewable Energy & Climate ML';
    detectedTopic = 'Microgrid Power Allocation & Physics-Informed Neural Networks';
    keywords.push('Microgrids', 'Grid Stability', 'PINNs', 'Renewable Energy');
  } else {
    detectedField = 'Interdisciplinary Academic Research';
    detectedTopic = fileName.length > 3 ? fileName : 'Empirical Research Content Analysis';
    keywords.push('Academic Research', 'Methodology Extraction', 'Empirical Study', 'Text Intelligence');
  }

  console.log(`[DOCUMENT EXTRACTOR] Processed '${fileName}': Extracted ${cleanText.length} chars. Detected Topic: '${detectedTopic}' (${detectedField})`);

  return {
    fileName,
    extractedText: cleanText,
    textLength: cleanText.length,
    detectedTopic,
    detectedField,
    keywords
  };
}
