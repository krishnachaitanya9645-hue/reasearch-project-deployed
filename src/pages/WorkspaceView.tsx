import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Compass, 
  FlaskConical, 
  CheckSquare, 
  Clock, 
  Plus, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Zap,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { WorkspaceTab } from '../types/research';
import { Badge } from '../components/common/Badge';

export const WorkspaceView: React.FC = () => {
  const { 
    activeWorkspace, 
    activeWorkspaceTab, 
    setActiveWorkspaceTab, 
    papers, 
    gaps, 
    directions, 
    experiments, 
    tasks, 
    setCurrentScreen,
    analyzePaper,
    exploreGap,
    addDirectionToPlan,
    toggleMilestone,
    updateTaskStatus,
    runAgentWorkflowSim,
    isAgentRunning,
    showToast
  } = useResearch();

  const workspacePapers = papers.filter(p => p.isAddedToWorkspace);
  const workspaceGaps = gaps.filter(g => g.workspaceId === activeWorkspace.id || g.workspaceId === 'ws-1');
  const workspaceDirections = directions.filter(d => d.workspaceId === activeWorkspace.id || d.workspaceId === 'ws-1');
  const workspaceExperiments = experiments.filter(e => e.workspaceId === activeWorkspace.id || e.workspaceId === 'ws-1');
  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspace.id || t.workspaceId === 'ws-1');

  const tabs: { id: WorkspaceTab; label: string; count?: number; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'papers', label: 'Papers', count: workspacePapers.length, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis', count: workspacePapers.filter(p => p.isAnalyzed).length, icon: <FileText className="w-4 h-4" /> },
    { id: 'gaps', label: 'Gaps', count: workspaceGaps.length, icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
    { id: 'directions', label: 'Directions', count: workspaceDirections.length, icon: <Compass className="w-4 h-4 text-indigo-500" /> },
    { id: 'experiments', label: 'Experiments', count: workspaceExperiments.length, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', count: workspaceTasks.length, icon: <CheckSquare className="w-4 h-4" /> },
  ];

  const handleAnalyzeMyResearch = () => {
    runAgentWorkflowSim();
    showToast('AI Intelligence Active', 'Running multi-agent literature extraction & gap detection analysis...', 'info');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Workspace Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo">{activeWorkspace.field}</Badge>
              <span className="text-xs text-slate-400 font-medium">Created {activeWorkspace.createdAt}</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                Active Research Phase
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeWorkspace.name}
            </h1>

            {/* Core Research Question Callout */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Core Research Question
              </span>
              <p className="text-sm font-semibold text-indigo-950 italic">
                "{activeWorkspace.question}"
              </p>
            </div>

            {/* Objectives & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Key Objectives</span>
                <ul className="space-y-1">
                  {activeWorkspace.objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeWorkspace.keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Box & Overall Progress */}
          <div className="w-full lg:w-72 bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 rounded-xl p-5 shrink-0 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Workspace Progress</span>
                <span className="text-indigo-600 font-extrabold">{activeWorkspace.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeWorkspace.progress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Literature search completed. 3 research directions ready for experiment planning.
              </p>
            </div>

            {/* Analyze My Research Prominent Action Button */}
            <button
              onClick={handleAnalyzeMyResearch}
              disabled={isAgentRunning}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all group"
            >
              <Sparkles className={`w-4 h-4 text-purple-300 ${isAgentRunning ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              <span>{isAgentRunning ? 'Analyzing Workspace...' : 'Analyze My Research'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-200 mt-8 pt-4 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeWorkspaceTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: Summary & Recent Papers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Executive AI Research Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Intelligence Executive Summary</h3>
              </div>
              <div className="prose prose-slate text-xs text-slate-700 leading-relaxed space-y-3">
                <p>
                  Initial analysis of indexed academic literature reveals a structural shift from single-prompt LLM agents toward formal multi-agent topologies (Reflexion, ChatDev, GraphVerify).
                </p>
                <p className="p-3 bg-indigo-50/60 border-l-4 border-indigo-600 rounded-r-xl font-medium text-indigo-950">
                  <strong className="font-bold">Key Discovery:</strong> SMT verifiers achieve high formal accuracy (hallucination reduction from 34% to 3.8%), but impose an 85ms compute overhead per turn that breaks edge consumer hardware constraints.
                </p>
                <p>
                  We recommend focusing immediate experimental effort on <strong>Asynchronous Gossip-Graph Verification (AGGV)</strong> to combine 4-bit small quantized models with low-latency binary lookup tables.
                </p>
              </div>
            </div>

            {/* Workspace Linked Papers */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Linked Literature ({workspacePapers.length})</h3>
                <button 
                  onClick={() => setCurrentScreen('discovery')} 
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Papers</span>
                </button>
              </div>

              <div className="space-y-3">
                {workspacePapers.map((paper) => (
                  <div key={paper.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="purple">{paper.journalOrConf}</Badge>
                        <span className="text-[11px] text-slate-400 font-medium">{paper.year} • {paper.citations} citations</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => analyzePaper(paper.id)}>
                        {paper.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{paper.abstract}</p>
                    </div>
                    <button
                      onClick={() => analyzePaper(paper.id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0 shadow-2xs"
                    >
                      AI Analysis
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights & Activity Timeline */}
          <div className="space-y-6">
            {/* Quick Action Next Steps */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Recommended AI Actions</h3>
              </div>
              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => setCurrentScreen('gaps')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-between"
                >
                  <span>1. Explore Gap-1: Edge SMT Bottleneck</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </button>
                <button 
                  onClick={() => setCurrentScreen('directions')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-between"
                >
                  <span>2. Review AGGV Research Direction</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </button>
                <button 
                  onClick={() => setCurrentScreen('workflow')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-between"
                >
                  <span>3. Run Autonomous Agent Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Workspace Activity Timeline</span>
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-4 text-xs">
                <div className="relative">
                  <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full absolute -left-[31px] top-1 ring-4 ring-white" />
                  <p className="font-bold text-slate-900">Gap Agent Discovered 3 Bottlenecks</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Today at 10:45 AM</p>
                </div>

                <div className="relative">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute -left-[31px] top-1 ring-4 ring-white" />
                  <p className="font-bold text-slate-900">Added GraphVerify paper to library</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Yesterday at 4:20 PM</p>
                </div>

                <div className="relative">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -left-[31px] top-1 ring-4 ring-white" />
                  <p className="font-bold text-slate-900">Workspace Created by Dr. Rivera</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Aug 15, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Papers Tab */}
      {activeWorkspaceTab === 'papers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Workspace Academic Papers ({workspacePapers.length})</h3>
            <button 
              onClick={() => setCurrentScreen('discovery')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find More Papers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspacePapers.map((paper) => (
              <div key={paper.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="indigo">{paper.journalOrConf}</Badge>
                    <span className="text-xs text-slate-400 font-medium">{paper.year} • {paper.citations} citations</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{paper.authors.join(', ')}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{paper.abstract}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {paper.isAnalyzed ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        AI Analyzed
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Pending Analysis
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => analyzePaper(paper.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    View AI Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeWorkspaceTab === 'analysis' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Synthesized Paper Methodology Matrix</h3>
              <p className="text-xs text-slate-500">Cross-paper AI extraction of objectives, datasets, and limitations</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('comparison')}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Open Full Comparison Matrix →
            </button>
          </div>

          <div className="space-y-4">
            {workspacePapers.filter(p => p.isAnalyzed).map((paper) => (
              <div key={paper.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                  <Badge variant="purple">{paper.journalOrConf}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-indigo-600 block mb-1">Methodology</span>
                    <p className="text-slate-700">{paper.methodology || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-indigo-600 block mb-1">Dataset / Benchmark</span>
                    <p className="text-slate-700">{paper.dataset || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-rose-600 block mb-1">Stated Limitations</span>
                    <p className="text-slate-700">{paper.limitations || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gaps Tab */}
      {activeWorkspaceTab === 'gaps' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Discovered Research Gaps ({workspaceGaps.length})</h3>
            <button 
              onClick={() => setCurrentScreen('gaps')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Open Gap Detection Screen →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaceGaps.map((gap) => (
              <div key={gap.id} className="p-5 rounded-xl border border-purple-200 bg-purple-50/20 hover:bg-white transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple">Confidence: {gap.confidenceScore}%</Badge>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {gap.impactLevel} Impact
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{gap.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{gap.description}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => exploreGap(gap.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Explore Gap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directions Tab */}
      {activeWorkspaceTab === 'directions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Proposed Research Directions ({workspaceDirections.length})</h3>
            <button 
              onClick={() => setCurrentScreen('directions')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Open Research Directions Screen →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workspaceDirections.map((dir) => (
              <div key={dir.id} className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/20 hover:bg-white transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo">Novelty Score: {dir.noveltyScore}%</Badge>
                  <Badge variant="emerald">Impact: {dir.expectedImpact}</Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{dir.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{dir.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Target Venue: {dir.potentialVenue}</span>
                  <button
                    onClick={() => addDirectionToPlan(dir.id)}
                    disabled={dir.isAddedToPlan}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      dir.isAddedToPlan
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {dir.isAddedToPlan ? 'In Research Plan' : '+ Add to Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experiments Tab */}
      {activeWorkspaceTab === 'experiments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Experiments ({workspaceExperiments.length})</h3>
            <button 
              onClick={() => setCurrentScreen('experiments')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Open Experiment Planner →
            </button>
          </div>

          <div className="space-y-4">
            {workspaceExperiments.map((exp) => (
              <div key={exp.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                  <Badge variant="amber">{exp.status}</Badge>
                </div>
                <p className="text-xs text-slate-600"><strong className="font-semibold">Hypothesis:</strong> {exp.hypothesis}</p>
                
                {/* Milestones checklist */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Milestone Checkpoints</span>
                  <div className="space-y-1.5">
                    {exp.milestones.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={m.completed}
                          onChange={() => toggleMilestone(exp.id, m.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={m.completed ? 'line-through text-slate-400' : 'font-medium'}>{m.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeWorkspaceTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Workspace Task Board ({workspaceTasks.length})</h3>
            <button 
              onClick={() => setCurrentScreen('tasks')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Open Interactive Kanban Board →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workspaceTasks.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={t.priority === 'High' ? 'rose' : 'slate'}>{t.priority} Priority</Badge>
                    <span className="text-[11px] text-slate-400 font-medium">Assignee: {t.assignee}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{t.description}</p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 shrink-0"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
