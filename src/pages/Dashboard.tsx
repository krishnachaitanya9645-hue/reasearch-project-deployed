import React from 'react';
import { 
  FolderKanban, 
  FileText, 
  Sparkles, 
  Compass, 
  FlaskConical, 
  Plus, 
  Search, 
  Upload, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Zap,
  Cpu
} from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const Dashboard: React.FC = () => {
  const { 
    workspaces, 
    papers, 
    gaps, 
    directions, 
    experiments, 
    setCurrentScreen, 
    setActiveWorkspaceId, 
    setIsCreateWorkspaceModalOpen,
    setIsAskAIModalOpen,
    analyzePaper,
    runAgentWorkflowSim,
    isAgentRunning
  } = useResearch();

  const { user } = useAuth();

  const getRoleText = (role?: string | null) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'STAFF': return 'Staff';
      case 'RESEARCHER': return 'Researcher';
      default: return 'Researcher';
    }
  };

  const totalPapersAnalyzed = papers.filter(p => p.isAnalyzed).length;

  const quickStats = [
    { label: 'Workspaces', value: workspaces.length, icon: <FolderKanban className="w-5 h-5 text-indigo-600" />, color: 'bg-indigo-50 border-indigo-100', change: `${workspaces.length} active` },
    { label: 'Papers Analyzed', value: totalPapersAnalyzed, icon: <FileText className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50 border-blue-100', change: `${papers.length} indexed` },
    { label: 'Gaps Discovered', value: gaps.length, icon: <Sparkles className="w-5 h-5 text-purple-600" />, color: 'bg-purple-50 border-purple-100', change: '94% high confidence' },
    { label: 'Research Directions', value: directions.length, icon: <Compass className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-100', change: `${directions.length} active` },
    { label: 'Active Experiments', value: experiments.length, icon: <FlaskConical className="w-5 h-5 text-amber-600" />, color: 'bg-amber-50 border-amber-100', change: 'In progress' }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 backdrop-blur-xs border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Research Intelligence Platform v2.4</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role: {getRoleText(user?.role)}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Researcher'}
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            ResearchPilot is actively synthesizing literature graphs, identifying unaddressed scientific research gaps, and updating your experiment plans.
          </p>

          {/* Quick Action Bar Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setIsCreateWorkspaceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-slate-100 font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>New Research Workspace</span>
            </button>

            <button
              onClick={() => setCurrentScreen('discovery')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs border border-indigo-500/40 backdrop-blur-xs transition-all"
            >
              <Search className="w-4 h-4 text-indigo-300" />
              <span>Find Papers</span>
            </button>

            <button
              onClick={() => setCurrentScreen('documents')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs border border-indigo-500/40 backdrop-blur-xs transition-all"
            >
              <Upload className="w-4 h-4 text-indigo-300" />
              <span>Upload PDF Paper</span>
            </button>

            <button
              onClick={() => setIsAskAIModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Ask ResearchPilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${stat.color} bg-white shadow-xs transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                {stat.icon}
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
              <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>{stat.change}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Spans): Active Workspaces & Papers */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Research Projects */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Research Workspaces</h3>
                <p className="text-xs text-slate-500">Projects currently managed by multi-agent reasoning chains</p>
              </div>
              <button
                onClick={() => setCurrentScreen('workspace')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {workspaces.map((ws) => (
                <div 
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspaceId(ws.id);
                    setCurrentScreen('workspace');
                  }}
                  className="p-5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="indigo">{ws.field}</Badge>
                        <span className="text-[11px] text-slate-400 font-medium">Created {ws.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-indigo-600 transition-colors">
                        {ws.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                        "{ws.question}"
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-xs font-black text-indigo-600">{ws.progress}% Complete</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ws.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> {ws.papersCount} Papers</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-500" /> {ws.gapsCount} Gaps</span>
                    <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-indigo-500" /> {ws.directionsCount} Directions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Indexed Papers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Academic Literature</h3>
                <p className="text-xs text-slate-500">Indexed from arXiv & PubMed into vector store</p>
              </div>
              <button
                onClick={() => setCurrentScreen('discovery')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Paper Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {papers.slice(0, 3).map((paper) => (
                <div key={paper.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="purple">{paper.journalOrConf}</Badge>
                      <span className="text-[11px] text-slate-400 font-medium">{paper.year} • {paper.citations} Citations</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => analyzePaper(paper.id)}>
                      {paper.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      Authors: {paper.authors.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => analyzePaper(paper.id)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    AI Analysis
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live AI Insights & Autonomous Agent Status */}
        <div className="space-y-8">
          {/* Live Agent Pipeline Controller */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Autonomous Workflow</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                Agentic Pipeline
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              ResearchPilot orchestrates 8 specialized autonomous agents (Discovery, Analysis, Relationship, Gap, Direction, Task, Validation) to synthesize research without manual prompts.
            </p>

            <button
              onClick={runAgentWorkflowSim}
              disabled={isAgentRunning}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isAgentRunning ? 'Pipeline Running...' : 'Launch Agent Workflow'}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('workflow')}
              className="w-full mt-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors text-center block"
            >
              View Agent Graph Architecture →
            </button>
          </div>

          {/* AI Research Insights Feed */}
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 rounded-2xl border border-indigo-100 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent AI Intelligence Findings</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 mb-1">
                  <span>Literature Bottleneck Detected</span>
                  <span className="text-slate-400">10m ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  SMT graph verifiers introduce 85ms turn latency on edge devices.
                </p>
                <button 
                  onClick={() => setCurrentScreen('gaps')} 
                  className="text-[11px] font-bold text-indigo-600 hover:underline mt-2 inline-block"
                >
                  Explore Research Gap →
                </button>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 mb-1">
                  <span>Novel Direction Proposed</span>
                  <span className="text-slate-400">1h ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Asynchronous Gossip-Graph Verification (AGGV) for Quantized Ensembles.
                </p>
                <button 
                  onClick={() => setCurrentScreen('directions')} 
                  className="text-[11px] font-bold text-purple-600 hover:underline mt-2 inline-block"
                >
                  Inspect Direction →
                </button>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 mb-1">
                  <span>Experiment Milestone Verified</span>
                  <span className="text-slate-400">3h ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Binary lookup tables generated for SMT graph constraints.
                </p>
                <button 
                  onClick={() => setCurrentScreen('experiments')} 
                  className="text-[11px] font-bold text-emerald-600 hover:underline mt-2 inline-block"
                >
                  View Milestones →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
