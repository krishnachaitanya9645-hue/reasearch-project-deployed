export type ScreenView = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'workspace'
  | 'discovery'
  | 'documents'
  | 'analysis'
  | 'comparison'
  | 'gaps'
  | 'directions'
  | 'workflow'
  | 'experiments'
  | 'tasks'
  | 'report'
  | 'settings'
  | 'help'
  | 'profile';

export type WorkspaceTab = 
  | 'overview'
  | 'papers'
  | 'analysis'
  | 'gaps'
  | 'directions'
  | 'experiments'
  | 'tasks';

export interface Workspace {
  id: string;
  name: string;
  question: string;
  field: string;
  objectives: string[];
  keywords: string[];
  description: string;
  createdAt: string;
  progress: number; // 0 - 100
  papersCount: number;
  gapsCount: number;
  directionsCount: number;
  activeExperimentsCount: number;
}

export interface Paper {
  id: string;
  externalId?: string;
  source?: string;
  workspaceId?: string;
  title: string;
  authors: string[];
  year: number;
  journalOrConf: string;
  venue?: string;
  abstract: string;
  citations: number;
  tags: string[];
  doi?: string;
  url?: string;
  pdfUrl?: string;
  isSaved?: boolean;
  isAddedToWorkspace?: boolean;
  isAnalyzed?: boolean;
  keyFindings?: string[];
  methodology?: string;
  dataset?: string;
  limitations?: string;
  resultsSummary?: string;
  objective?: string;
  evidenceQuotes?: { text: string; location: string }[];
}

export interface Gap {
  id: string;
  title: string;
  description: string;
  confidenceScore: number; // e.g. 94
  supportingPaperTitles: string[];
  evidence: string[];
  whyItMatters: string;
  workspaceId: string;
  impactLevel: 'Critical' | 'High' | 'Moderate';
}

export interface Direction {
  id: string;
  title: string;
  description: string;
  targetGapTitle: string;
  supportingEvidence: string[];
  expectedImpact: 'Ultra High' | 'High' | 'Moderate';
  difficulty: 'Low' | 'Medium' | 'High';
  noveltyScore: number; // 0 - 100
  workspaceId: string;
  isAddedToPlan: boolean;
  potentialVenue: string;
}

export interface AgentStep {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  toolsUsed: string[];
  lastLog: string;
  outputSummary: string;
  progress: number; // 0 - 100
}

export interface ExperimentMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Experiment {
  id: string;
  title: string;
  directionTitle: string;
  hypothesis: string;
  dataset: string;
  method: string;
  metrics: string[];
  expectedOutcome: string;
  milestones: ExperimentMilestone[];
  status: 'Planning' | 'In Progress' | 'Completed';
  workspaceId: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  assignee: string;
  deadline: string;
  workspaceId: string;
  tag?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileSize: string;
  uploadDate: string;
  author: string;
  status: 'Processing' | 'Analyzed' | 'Failed';
  paperId?: string;
  fileType?: string;
  sourceType?: 'FILE' | 'TEXT';
  extractedText?: string;
  detectedTopic?: string;
  detectedField?: string;
  keywords?: string[];
  textLength?: number;
  updatedAt?: string;
}
