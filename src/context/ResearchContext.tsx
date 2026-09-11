import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ScreenView, WorkspaceTab, Workspace, Paper, Gap, Direction, AgentStep, Experiment, TaskItem, DocumentItem } from '../types/research';
import { INITIAL_WORKSPACES, INITIAL_PAPERS, INITIAL_GAPS, INITIAL_DIRECTIONS, INITIAL_AGENTS, INITIAL_EXPERIMENTS, INITIAL_TASKS, INITIAL_DOCUMENTS } from '../data/mockData';
import { apiService } from '../services/api';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ResearchContextType {
  currentScreen: ScreenView;
  setCurrentScreen: (screen: ScreenView) => void;
  activeWorkspaceTab: WorkspaceTab;
  setActiveWorkspaceTab: (tab: WorkspaceTab) => void;
  
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace: Workspace;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (data: Omit<Workspace, 'id' | 'createdAt' | 'progress' | 'papersCount' | 'gapsCount' | 'directionsCount' | 'activeExperimentsCount'>) => void;
  
  papers: Paper[];
  addPaperToWorkspace: (paperId: string) => void;
  addDiscoveredPaperToWorkspace: (paper: any) => Promise<boolean>;
  removePaperFromWorkspace: (paperId: string) => void;
  toggleSavePaper: (paperId: string) => void;
  analyzePaper: (paperId: string) => void;
  selectedPaperForAnalysis: Paper | null;
  setSelectedPaperForAnalysis: (paper: Paper | null) => void;
  
  // Real Discovery State
  discoveredPapers: any[];
  isSearchingPapers: boolean;
  searchTotal: number;
  searchAcademicPapers: (query: string, options?: any) => Promise<void>;
  
  // Multi-Paper Comparison
  selectedPaperIdsForCompare: string[];
  togglePaperSelectionForCompare: (paperId: string) => void;
  clearPaperComparisonSelection: () => void;
  activeComparison: any | null;
  runPaperComparison: () => Promise<void>;
  isComparingPapers: boolean;
  
  gaps: Gap[];
  exploreGap: (gapId: string) => void;
  
  directions: Direction[];
  addDirectionToPlan: (directionId: string) => void;
  
  agents: AgentStep[];
  isAgentRunning: boolean;
  runAgentWorkflowSim: (selectedDocIds?: any, selectedPaperIds?: string[]) => void;
  agentLogs: string[];
  
  experiments: Experiment[];
  toggleMilestone: (expId: string, milestoneId: string) => void;
  createExperiment: (exp: Omit<Experiment, 'id' | 'workspaceId' | 'status'>) => void;
  
  tasks: TaskItem[];
  updateTaskStatus: (taskId: string, newStatus: TaskItem['status']) => void;
  createTask: (task: Omit<TaskItem, 'id' | 'workspaceId'>) => void;
  
  documents: DocumentItem[];
  activeDocument: DocumentItem | null;
  setActiveDocument: (doc: DocumentItem | null) => void;
  uploadDocument: (name: string, size: string, content?: string) => Promise<void>;
  createTextDocument: (title: string, content: string) => Promise<void>;
  updateTextDocument: (id: string, title: string, content: string) => Promise<void>;
  deleteDocument: (docId: string) => void;

  currentReport: any | null;
  setCurrentReport: (report: any | null) => void;
  
  toast: Toast | null;
  showToast: (title: string, message: string, type?: Toast['type']) => void;
  clearToast: () => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  isCreateWorkspaceModalOpen: boolean;
  setIsCreateWorkspaceModalOpen: (open: boolean) => void;
  
  isAskAIModalOpen: boolean;
  setIsAskAIModalOpen: (open: boolean) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('dashboard');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('overview');
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-1');
  
  const [papers, setPapers] = useState<Paper[]>(INITIAL_PAPERS);
  const [selectedPaperForAnalysis, setSelectedPaperForAnalysis] = useState<Paper | null>(INITIAL_PAPERS[0]);
  
  // Real Paper Discovery State
  const [discoveredPapers, setDiscoveredPapers] = useState<any[]>([]);
  const [isSearchingPapers, setIsSearchingPapers] = useState<boolean>(false);
  const [searchTotal, setSearchTotal] = useState<number>(0);
  
  // Multi-Paper Comparison State
  const [selectedPaperIdsForCompare, setSelectedPaperIdsForCompare] = useState<string[]>([]);
  const [activeComparison, setActiveComparison] = useState<any | null>(null);
  const [isComparingPapers, setIsComparingPapers] = useState<boolean>(false);

  const [gaps, setGaps] = useState<Gap[]>(INITIAL_GAPS);
  const [directions, setDirections] = useState<Direction[]>(INITIAL_DIRECTIONS);
  const [agents, setAgents] = useState<AgentStep[]>(INITIAL_AGENTS);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    'System initialized ResearchPilot Multi-Agent Architecture v2.4',
    'Connected to OpenAlex academic literature search index.',
    'Orchestrator Agent assigned research goals for Active Workspace.'
  ]);
  
  const [experiments, setExperiments] = useState<Experiment[]>(INITIAL_EXPERIMENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(INITIAL_DOCUMENTS[0]);
  const [currentReport, setCurrentReport] = useState<any | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState<boolean>(false);
  const [isAskAIModalOpen, setIsAskAIModalOpen] = useState<boolean>(false);

  const defaultWorkspace: Workspace = {
    id: 'ws-default',
    name: 'General Research Workspace',
    question: 'Search papers and run autonomous AI analysis',
    field: 'General Research',
    objectives: [],
    keywords: [],
    description: 'Default research workspace',
    createdAt: new Date().toISOString(),
    progress: 0,
    papersCount: 0,
    gapsCount: 0,
    directionsCount: 0,
    activeExperimentsCount: 0
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || defaultWorkspace;

  // Initial Sync & Report Load
  useEffect(() => {
    async function syncBackendData() {
      const isLive = await apiService.checkHealth();
      if (isLive) {
        const fetchedWorkspaces = await apiService.getWorkspaces();
        if (Array.isArray(fetchedWorkspaces)) {
          setWorkspaces(fetchedWorkspaces);
          if (fetchedWorkspaces.length > 0 && !fetchedWorkspaces.some(w => w.id === activeWorkspaceId)) {
            setActiveWorkspaceId(fetchedWorkspaces[0].id);
          }
        }
        const fetchedDocs = await apiService.getDocuments(activeWorkspaceId);
        if (Array.isArray(fetchedDocs)) {
          setDocuments(fetchedDocs);
          setActiveDocument(fetchedDocs[0] || null);
        }
        const fetchedPapers = await apiService.getPapers(activeWorkspaceId);
        if (Array.isArray(fetchedPapers)) {
          setPapers(fetchedPapers);
        }
        const report = await apiService.getLatestReport(activeWorkspaceId);
        setCurrentReport(report || null);
      }
    }
    syncBackendData();
  }, [activeWorkspaceId]);

  // Auto prefill research question for paper discovery when switching workspaces
  useEffect(() => {
    if (activeWorkspace?.question) {
      setSearchQuery(activeWorkspace.question);
    }
  }, [activeWorkspaceId, activeWorkspace?.question]);

  const showToast = (title: string, message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const searchAcademicPapers = async (query: string, options?: any) => {
    if (!query || query.trim() === '') return;
    setIsSearchingPapers(true);
    setSearchQuery(query);

    const data = await apiService.searchPapers(query, options);
    setIsSearchingPapers(false);

    if (data && Array.isArray(data.papers)) {
      setDiscoveredPapers(data.papers);
      setSearchTotal(data.total || data.papers.length);
      showToast('Search Complete', `Found ${data.total || data.papers.length} academic papers on OpenAlex`, 'success');
    } else {
      setDiscoveredPapers([]);
      setSearchTotal(0);
      showToast('Search Error', 'Unable to fetch academic literature. Please try again.', 'warning');
    }
  };

  const addDiscoveredPaperToWorkspace = async (paper: any): Promise<boolean> => {
    const res = await apiService.addPaperToWorkspace(paper, activeWorkspaceId);
    if (res && res.isDuplicate) {
      showToast('Duplicate Paper', 'Paper already exists in this workspace.', 'warning');
      return false;
    }

    const newPaper: Paper = res?.paper || {
      id: paper.id || `paper-${Date.now()}`,
      title: paper.title,
      authors: paper.authors || [],
      year: paper.publicationYear || paper.year || 2026,
      journalOrConf: paper.venue || paper.journalOrConf || 'Academic Literature',
      abstract: paper.abstract || '',
      citations: paper.citations || 0,
      tags: paper.tags || paper.concepts || [],
      doi: paper.doi,
      url: paper.url,
      isSaved: true,
      isAddedToWorkspace: true
    };

    setPapers(prev => {
      if (prev.some(p => p.id === newPaper.id || p.title.toLowerCase() === newPaper.title.toLowerCase())) {
        return prev;
      }
      return [newPaper, ...prev];
    });

    setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, papersCount: w.papersCount + 1 } : w));
    showToast('Paper Added', `Added "${newPaper.title.slice(0, 35)}..." to workspace library`, 'success');
    return true;
  };

  const togglePaperSelectionForCompare = (paperId: string) => {
    setSelectedPaperIdsForCompare(prev => {
      if (prev.includes(paperId)) {
        return prev.filter(id => id !== paperId);
      }
      if (prev.length >= 5) {
        showToast('Limit Reached', 'Maximum 5 papers allowed per comparison.', 'warning');
        return prev;
      }
      return [...prev, paperId];
    });
  };

  const clearPaperComparisonSelection = () => setSelectedPaperIdsForCompare([]);

  const runPaperComparison = async () => {
    if (selectedPaperIdsForCompare.length < 2) {
      showToast('Selection Required', 'Select at least 2 papers to perform comparative analysis.', 'warning');
      return;
    }

    setIsComparingPapers(true);
    showToast('AI Synthesis Active', `Synthesizing matrix across ${selectedPaperIdsForCompare.length} literature studies...`, 'info');

    const res = await apiService.comparePapers(activeWorkspaceId, selectedPaperIdsForCompare, activeWorkspace.question);
    setIsComparingPapers(false);

    if (res && res.comparison) {
      setActiveComparison(res.comparison);
      setCurrentScreen('comparison');
      showToast('Comparison Synthesized', `Cross-paper intelligence matrix created successfully.`, 'success');
    } else {
      showToast('Comparison Error', 'Unable to complete multi-paper comparison.', 'warning');
    }
  };

  const createWorkspace = async (data: Omit<Workspace, 'id' | 'createdAt' | 'progress' | 'papersCount' | 'gapsCount' | 'directionsCount' | 'activeExperimentsCount'>) => {
    const apiResult = await apiService.createWorkspace(data);
    const newWs: Workspace = apiResult || {
      ...data,
      id: `ws-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 10,
      papersCount: 0,
      gapsCount: 0,
      directionsCount: 0,
      activeExperimentsCount: 0
    };

    setWorkspaces(prev => [newWs, ...prev]);
    setActiveWorkspaceId(newWs.id);
    setCurrentScreen('workspace');
    setActiveWorkspaceTab('overview');
    showToast('Workspace Created', `Successfully initialized "${newWs.name}"`, 'success');
  };

  const addPaperToWorkspace = (paperId: string) => {
    const target = papers.find(p => p.id === paperId);
    if (target) {
      addDiscoveredPaperToWorkspace(target);
    }
  };

  const removePaperFromWorkspace = (paperId: string) => {
    setPapers(prev => prev.map(p => p.id === paperId ? { ...p, isAddedToWorkspace: false } : p));
    setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, papersCount: Math.max(0, w.papersCount - 1) } : w));
    showToast('Paper Removed', 'Paper unlinked from workspace', 'info');
  };

  const toggleSavePaper = (paperId: string) => {
    setPapers(prev => prev.map(p => p.id === paperId ? { ...p, isSaved: !p.isSaved } : p));
    const paper = papers.find(p => p.id === paperId);
    showToast(paper?.isSaved ? 'Removed from Library' : 'Saved to Library', paper?.title || 'Paper updated', 'info');
  };

  const analyzePaper = async (paperId: string) => {
    const targetPaper = papers.find(p => p.id === paperId) || discoveredPapers.find(p => p.id === paperId);
    if (targetPaper) {
      setPapers(prev => prev.map(p => p.id === paperId ? { ...p, isAnalyzed: true } : p));
      setSelectedPaperForAnalysis(targetPaper);
      setCurrentScreen('analysis');
      showToast('AI Analysis Ready', `Extracted structured intelligence for "${targetPaper.title.slice(0, 30)}..."`, 'success');
      
      await apiService.analyzePaper(paperId, targetPaper.title, targetPaper.abstract);
    }
  };

  const exploreGap = (gapId: string) => {
    const gap = gaps.find(g => g.id === gapId);
    setCurrentScreen('directions');
    showToast('Gap Selected', `Filtering research directions addressing "${gap?.title.slice(0, 35)}..."`, 'info');
  };

  const addDirectionToPlan = (directionId: string) => {
    setDirections(prev => prev.map(d => d.id === directionId ? { ...d, isAddedToPlan: true } : d));
    const dir = directions.find(d => d.id === directionId);
    
    if (dir && !dir.isAddedToPlan) {
      const newExp: Experiment = {
        id: `exp-${Date.now()}`,
        title: `Validation of ${dir.title}`,
        directionTitle: dir.title,
        hypothesis: `Implementing ${dir.title} will address the literature bottleneck with high performance metrics.`,
        dataset: 'Standard benchmark validation suite',
        method: 'Custom agent implementation and comparative evaluation',
        metrics: ['Performance Accuracy', 'Resource Footprint', 'Error Rate'],
        expectedOutcome: 'Superior performance over existing literature baselines.',
        status: 'Planning',
        workspaceId: activeWorkspaceId,
        milestones: [
          { id: 'm-10', title: 'Setup evaluation framework codebase', completed: false },
          { id: 'm-11', title: 'Run baseline benchmark experiments', completed: false },
          { id: 'm-12', title: 'Synthesize empirical results report', completed: false }
        ]
      };
      setExperiments(prev => [newExp, ...prev]);

      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        title: `Implement prototype for ${dir.title.slice(0, 40)}...`,
        description: `Create initial codebase for ${dir.title} as part of active research plan.`,
        priority: 'High',
        status: 'todo',
        assignee: 'Lead Researcher',
        deadline: new Date(Date.now() + 864000000).toISOString().split('T')[0],
        workspaceId: activeWorkspaceId,
        tag: 'Plan Action'
      };
      setTasks(prev => [newTask, ...prev]);

      setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { 
        ...w, 
        directionsCount: w.directionsCount + 1,
        activeExperimentsCount: w.activeExperimentsCount + 1 
      } : w));

      showToast('Added to Research Plan', `Created experiment & task for "${dir.title.slice(0, 30)}..."`, 'success');
    }
  };

  const runAgentWorkflowSim = async (selectedDocIds?: any, selectedPaperIds?: string[]) => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    
    const docIds = Array.isArray(selectedDocIds) ? selectedDocIds : (activeDocument ? [activeDocument.id] : documents.map(d => d.id));
    const paperIds = Array.isArray(selectedPaperIds) ? selectedPaperIds : papers.filter(p => p.isAddedToWorkspace).map(p => p.id);

    showToast('Agent Workflow Launched', `Processing ${docIds.length} document(s) & ${paperIds.length} paper(s) through 8 autonomous agents...`, 'info');

    const stepIds = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5', 'agent-6', 'agent-7', 'agent-8'];
    let currentStepIndex = 0;

    const interval = setInterval(async () => {
      if (currentStepIndex >= stepIds.length) {
        clearInterval(interval);

        const apiResponse = await apiService.runAgentPipeline(
          activeWorkspaceId,
          docIds[0],
          activeWorkspace.question,
          { documentIds: docIds, paperIds }
        );

        if (apiResponse && apiResponse.report) {
          setCurrentReport(apiResponse.report);
          if (apiResponse.report.potentialGaps) {
            setGaps(apiResponse.report.potentialGaps);
          }
          if (apiResponse.report.directions) {
            setDirections(apiResponse.report.directions);
          }
          if (apiResponse.report.tasks) {
            setTasks(apiResponse.report.tasks);
          }
          if (apiResponse.report.experiments) {
            setExperiments(apiResponse.report.experiments);
          }
        }

        setIsAgentRunning(false);
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, progress: 100 } : w));
        showToast('Autonomous Workflow Complete!', `Generated intelligence report (${apiResponse?.sourcesSummary || 'Multi-source'}).`, 'success');
        return;
      }

      const activeAgentId = stepIds[currentStepIndex];

      setAgents(prev => prev.map(a => {
        if (a.id === activeAgentId) {
          return { ...a, status: 'running', progress: 50 };
        }
        return a;
      }));

      const sourceLabel = `${docIds.length} document(s) & ${paperIds.length} paper(s)`;
      const logMessages = [
        `Orchestrator Agent initialized goal-driven execution plan for ${sourceLabel}.`,
        `Discovery Agent indexed concepts across multi-source literature corpus.`,
        `Analysis Agent extracted methodology, datasets & limitations from context.`,
        `Relationship Agent constructed multi-paper dependency graph.`,
        `Gap Agent identified potential research opportunities across papers.`,
        `Direction Agent synthesized novel research directions for '${activeWorkspace.question || 'Target Question'}'.`,
        `Task Planner Agent created customized task milestones.`,
        `Validation Agent verified grounding & compiled Final Intelligence Report.`
      ];

      setAgentLogs(prev => [`[${new Date().toLocaleTimeString()}] ${logMessages[currentStepIndex]}`, ...prev]);

      setTimeout(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === activeAgentId) {
            return { ...a, status: 'completed', progress: 100 };
          }
          return a;
        }));
      }, 500);

      currentStepIndex++;
    }, 1000);
  };

  const toggleMilestone = (expId: string, milestoneId: string) => {
    setExperiments(prev => prev.map(exp => {
      if (exp.id === expId) {
        const updatedMs = exp.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        return { ...exp, milestones: updatedMs };
      }
      return exp;
    }));
  };

  const createExperiment = (expData: Omit<Experiment, 'id' | 'workspaceId' | 'status'>) => {
    const newExp: Experiment = {
      ...expData,
      id: `exp-${Date.now()}`,
      status: 'Planning',
      workspaceId: activeWorkspaceId
    };
    setExperiments(prev => [newExp, ...prev]);
    showToast('Experiment Created', `Added "${newExp.title}" to planner.`, 'success');
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskItem['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const createTask = (taskData: Omit<TaskItem, 'id' | 'workspaceId'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task Created', `Added "${newTask.title}" to board.`, 'success');
  };

  const uploadDocument = async (name: string, size: string, content?: string) => {
    showToast('Uploading Document', `Processing '${name}' and extracting text content...`, 'info');
    
    try {
      const apiDoc = await apiService.uploadDocument(name, content, size, activeWorkspaceId);

      const newDoc: DocumentItem = apiDoc || {
        id: `doc-${Date.now()}`,
        name,
        fileSize: size,
        uploadDate: new Date().toISOString().split('T')[0],
        author: 'Uploaded Document',
        status: 'Analyzed',
        sourceType: 'FILE',
        fileType: name.toLowerCase().endsWith('.docx') ? 'DOCX' : name.toLowerCase().endsWith('.doc') ? 'DOC' : name.toLowerCase().endsWith('.txt') ? 'TXT' : 'PDF'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setActiveDocument(newDoc);
      setCurrentScreen('workflow');
      showToast('Document Processed', `Extracted text from '${name}'. Navigating to agent workflow.`, 'success');
    } catch (err: any) {
      showToast('Upload Error', err.message || 'Failed to upload document', 'warning');
    }
  };

  const createTextDocument = async (title: string, content: string) => {
    showToast('Processing Text Research', `Saving '${title}' and running topic extraction...`, 'info');
    
    try {
      const apiDoc = await apiService.createTextDocument(title, content, activeWorkspaceId);

      const newDoc: DocumentItem = apiDoc || {
        id: `doc-text-${Date.now()}`,
        name: title,
        fileSize: `${Math.max(1, Math.round((content.length / 1024) * 10) / 10)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        author: 'Text Input',
        status: 'Analyzed',
        sourceType: 'TEXT',
        fileType: 'TEXT',
        extractedText: content,
        textLength: content.length
      };

      setDocuments(prev => [newDoc, ...prev]);
      setActiveDocument(newDoc);
      setCurrentScreen('workflow');
      showToast('Research Document Saved', `Created '${title}'. Navigating to agent workflow.`, 'success');
    } catch (err: any) {
      showToast('Creation Error', err.message || 'Failed to create text research document', 'warning');
    }
  };

  const updateTextDocument = async (id: string, title: string, content: string) => {
    try {
      const updatedApiDoc = await apiService.updateTextDocument(id, title, content);
      
      setDocuments(prev => prev.map(d => {
        if (d.id === id) {
          return updatedApiDoc || {
            ...d,
            name: title,
            extractedText: content,
            textLength: content.length,
            fileSize: `${Math.max(1, Math.round((content.length / 1024) * 10) / 10)} KB`
          };
        }
        return d;
      }));

      if (activeDocument?.id === id) {
        setActiveDocument(updatedApiDoc || {
          ...activeDocument,
          name: title,
          extractedText: content,
          textLength: content.length,
          fileSize: `${Math.max(1, Math.round((content.length / 1024) * 10) / 10)} KB`
        });
      }

      showToast('Research Document Updated', `Saved changes to '${title}'.`, 'success');
    } catch (err: any) {
      showToast('Update Error', err.message || 'Failed to update text document', 'warning');
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (activeDocument?.id === docId) {
      setActiveDocument(documents[0] || null);
    }
    showToast('Document Deleted', 'Document removed from library.', 'info');
  };

  return (
    <ResearchContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      activeWorkspaceTab,
      setActiveWorkspaceTab,
      workspaces,
      activeWorkspaceId,
      activeWorkspace,
      setActiveWorkspaceId,
      createWorkspace,
      papers,
      addPaperToWorkspace,
      addDiscoveredPaperToWorkspace,
      removePaperFromWorkspace,
      toggleSavePaper,
      analyzePaper,
      selectedPaperForAnalysis,
      setSelectedPaperForAnalysis,
      discoveredPapers,
      isSearchingPapers,
      searchTotal,
      searchAcademicPapers,
      selectedPaperIdsForCompare,
      togglePaperSelectionForCompare,
      clearPaperComparisonSelection,
      activeComparison,
      runPaperComparison,
      isComparingPapers,
      gaps,
      exploreGap,
      directions,
      addDirectionToPlan,
      agents,
      isAgentRunning,
      runAgentWorkflowSim,
      agentLogs,
      experiments,
      toggleMilestone,
      createExperiment,
      tasks,
      updateTaskStatus,
      createTask,
      documents,
      activeDocument,
      setActiveDocument,
      uploadDocument,
      createTextDocument,
      updateTextDocument,
      deleteDocument,
      currentReport,
      setCurrentReport,
      toast,
      showToast,
      clearToast,
      searchQuery,
      setSearchQuery,
      isCreateWorkspaceModalOpen,
      setIsCreateWorkspaceModalOpen,
      isAskAIModalOpen,
      setIsAskAIModalOpen
    }}>
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
