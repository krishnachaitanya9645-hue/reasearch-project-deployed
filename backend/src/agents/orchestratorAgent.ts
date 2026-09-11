export interface AgentContext {
  workspaceId: string;
  documentId?: string;
  fileName: string;
  extractedText: string;
  researchQuestion: string;
  field: string;
  detectedTopic: string;
  orchestratorOutput?: any;
  discoveryOutput?: any;
  analysisOutput?: any;
  relationshipOutput?: any;
  gapOutput?: any;
  directionOutput?: any;
  taskPlannerOutput?: any;
  validationOutput?: any;
  logs: string[];
}

export const orchestratorAgent = {
  name: 'Orchestrator Agent',
  role: 'Workflow Planner & Controller',

  async run(context: AgentContext): Promise<AgentContext> {
    const timestamp = new Date().toLocaleTimeString();
    const textLen = context.extractedText?.length || 0;
    
    const topic = context.detectedTopic || 'Autonomous Intelligent Systems';
    const field = context.field || 'Computer Science & AI';

    const plan = {
      detectedTopic: topic,
      detectedField: field,
      workflowPlan: [
        `Analyze document '${context.fileName}' (${textLen} characters)`,
        `Extract technical methodology and limitations for '${topic}'`,
        `Synthesize potential research gaps addressing core question: '${context.researchQuestion}'`,
        `Generate validated experiment roadmap and Kanban tasks`
      ]
    };

    const log = `[${timestamp}] Orchestrator Agent initialized workflow for '${context.fileName}' (${textLen} chars). Detected Topic: '${topic}'.`;

    return {
      ...context,
      orchestratorOutput: plan,
      logs: [...context.logs, log]
    };
  }
};
