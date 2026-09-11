import { AgentContext } from './orchestratorAgent.js';

export const taskPlannerAgent = {
  name: 'Task Planner Agent',
  role: 'Experiment & Kanban Task Architect',

  async run(context: AgentContext): Promise<AgentContext> {
    const timestamp = new Date().toLocaleTimeString();
    const fileName = context.fileName;
    const topic = context.detectedTopic;
    const directionTitle = context.directionOutput?.directions?.[0]?.title || `Optimization for ${topic}`;

    const experiments = [
      {
        id: `exp-${Date.now()}-1`,
        title: `Benchmark Evaluation of ${directionTitle}`,
        directionTitle,
        hypothesis: `Implementing ${directionTitle} will reduce system overhead by >35% compared to baselines in '${fileName}'.`,
        dataset: `Standard ${topic} Evaluation Suite`,
        method: `Comparative empirical benchmark against '${fileName}' reference architecture`,
        metrics: ['Throughput (ops/sec)', 'Latency (ms)', 'Resource Footprint (MB)', 'Error Rate (%)'],
        expectedOutcome: 'Significant latency reduction without drop in benchmark accuracy.',
        status: 'Planning',
        milestones: [
          { id: `m-${Date.now()}-1`, title: `Extract reference baseline metrics from '${fileName}'`, completed: true },
          { id: `m-${Date.now()}-2`, title: `Implement prototype codebase for ${directionTitle.slice(0, 30)}...`, completed: false },
          { id: `m-${Date.now()}-3`, title: `Execute 1,000 trial benchmark evaluation runs`, completed: false }
        ]
      }
    ];

    const tasks = [
      {
        id: `task-${Date.now()}-1`,
        title: `Deep-parse methodology equations in '${fileName}'`,
        description: `Extract specific algorithmic formulations for '${topic}' from uploaded PDF text.`,
        priority: 'High',
        status: 'completed',
        assignee: 'Analysis Agent',
        deadline: new Date().toISOString().split('T')[0],
        tag: 'Literature'
      },
      {
        id: `task-${Date.now()}-2`,
        title: `Implement baseline model for ${topic}`,
        description: `Create benchmark reference implementation based on parameters in '${fileName}'.`,
        priority: 'High',
        status: 'in_progress',
        assignee: 'Lead Researcher',
        deadline: new Date(Date.now() + 604800000).toISOString().split('T')[0],
        tag: 'Implementation'
      },
      {
        id: `task-${Date.now()}-3`,
        title: `Collect test dataset for ${directionTitle.slice(0, 35)}...`,
        description: `Format evaluation workload suite matching parameters extracted from '${fileName}'.`,
        priority: 'Medium',
        status: 'todo',
        assignee: 'Data Engineer',
        deadline: new Date(Date.now() + 864000000).toISOString().split('T')[0],
        tag: 'Data Prep'
      },
      {
        id: `task-${Date.now()}-4`,
        title: `Draft experimental section for camera-ready report`,
        description: `Synthesize empirical results comparing prototype against '${fileName}' baselines.`,
        priority: 'Medium',
        status: 'todo',
        assignee: 'Lead Researcher',
        deadline: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
        tag: 'Writing'
      }
    ];

    const log = `[${timestamp}] Task Planner Agent generated custom experiment plan and ${tasks.length} tasks for '${directionTitle}'.`;

    return {
      ...context,
      taskPlannerOutput: { experiments, tasks },
      logs: [...context.logs, log]
    };
  }
};
