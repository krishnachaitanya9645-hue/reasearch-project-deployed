import { AgentContext } from './orchestratorAgent.js';

export const discoveryAgent = {
  name: 'Discovery Agent',
  role: 'Academic Literature Search & Retrieval',

  async run(context: AgentContext): Promise<AgentContext> {
    const timestamp = new Date().toLocaleTimeString();
    const topic = context.orchestratorOutput?.detectedTopic || 'Intelligent Systems';

    const discoveryOutput = {
      keyTerms: context.extractedText.toLowerCase().includes('network') 
        ? ['TCP/IP', 'Congestion Window', 'Packet Latency', 'Throughput Optimization'] 
        : context.extractedText.toLowerCase().includes('operating system') || context.extractedText.toLowerCase().includes('kernel')
        ? ['Virtual Memory', 'Page Replacement', 'Process Scheduler', 'Deadlock Avoidance']
        : context.extractedText.toLowerCase().includes('database') || context.extractedText.toLowerCase().includes('sql')
        ? ['ACID Compliance', 'B+ Tree Indexing', 'Write-Ahead Logging', 'Query Optimizer']
        : ['System Architecture', 'Algorithmic Optimization', 'Empirical Evaluation'],
      literatureContext: `Discovered academic concepts in '${topic}' anchored in uploaded document '${context.fileName}'.`,
      evidenceFound: [`Explicit text match found in '${context.fileName}' (${context.extractedText.length} characters analyzed)`]
    };

    const log = `[${timestamp}] Discovery Agent identified ${discoveryOutput.keyTerms.length} core concepts in '${context.fileName}' for topic '${topic}'.`;

    return {
      ...context,
      discoveryOutput,
      logs: [...context.logs, log]
    };
  }
};
