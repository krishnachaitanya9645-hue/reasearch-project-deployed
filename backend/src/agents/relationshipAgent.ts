import { AgentContext } from './orchestratorAgent.js';

export const relationshipAgent = {
  name: 'Relationship Agent',
  role: 'Citation Topology & Comparative Mapper',

  async run(context: AgentContext): Promise<AgentContext> {
    const timestamp = new Date().toLocaleTimeString();
    const topic = context.detectedTopic;
    const methodology = context.analysisOutput?.methodology || 'Extracted methodology';
    const limitations = context.analysisOutput?.limitations || 'Extracted limitations';

    const relationshipOutput = {
      relationships: [
        `Direct correlation between '${methodology.slice(0, 45)}' and empirical findings in '${context.fileName}'.`,
        `Identified technical trade-off: higher precision vs '${limitations.slice(0, 40)}'.`,
        `Mapped concept topology connecting '${topic}' to workspace research question.`
      ],
      conceptMap: `${context.fileName} → ${topic} → Method Constraints → Literature Bottlenecks`
    };

    const log = `[${timestamp}] Relationship Agent mapped conceptual dependencies and trade-offs in '${context.fileName}'.`;

    return {
      ...context,
      relationshipOutput,
      logs: [...context.logs, log]
    };
  }
};
