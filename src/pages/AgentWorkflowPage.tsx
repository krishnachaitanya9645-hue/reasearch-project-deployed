import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Terminal, 
  ArrowDown, 
  Wrench, 
  Bot,
  Activity,
  FileText,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Square
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

export const AgentWorkflowPage: React.FC = () => {
  const {
    agents,
    isAgentRunning,
    runAgentWorkflowSim,
    agentLogs,
    activeWorkspace,
    activeDocument,
    documents,
    papers,
    setCurrentScreen
  } = useResearch();

  const workspacePapers = papers.filter(p => p.isAddedToWorkspace || p.workspaceId === activeWorkspace?.id);
  
  // DEFAULT SELECTION: Only the active / newly uploaded PDF document
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(() => {
    return activeDocument ? [activeDocument.id] : (documents[0] ? [documents[0].id] : []);
  });
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);

  // Sync selection to ONLY the active / newly uploaded document
  React.useEffect(() => {
    if (activeDocument) {
      setSelectedDocIds([activeDocument.id]);
      setSelectedPaperIds([]);
    }
  }, [activeDocument?.id]);

  const toggleDocSelection = (id: string) => {
    setSelectedDocIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const togglePaperSelection = (id: string) => {
    setSelectedPaperIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleRunWorkflow = () => {
    runAgentWorkflowSim(selectedDocIds, selectedPaperIds);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'running':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1 animate-pulse"><Activity className="w-3 h-3 text-indigo-600 animate-spin" /> Running</span>;
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3" /> Waiting</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Agent Workflow Pipeline</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            Executing 8 specialized autonomous agents on <strong className="text-emerald-300 font-mono">{selectedDocIds.length} Document(s) & {selectedPaperIds.length} Discovered Paper(s)</strong> to synthesize grounded research reports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={handleRunWorkflow}
            disabled={isAgentRunning}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isAgentRunning ? (
              <>
                <Activity className="w-4 h-4 text-emerald-200 animate-spin" />
                <span>Running Agents...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-200 fill-current" />
                <span>Run Agent Workflow ({selectedDocIds.length + selectedPaperIds.length} Sources)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentScreen('report')}
            className="w-full sm:w-auto px-5 py-3.5 bg-white text-indigo-950 hover:bg-slate-100 font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Reports</span>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Multi-Source Context Selector Drawer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Select Context Sources for Agent Intelligence Pipeline</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {selectedDocIds.length} PDFs + {selectedPaperIds.length} Academic Papers Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uploaded Documents Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Uploaded PDF Documents ({documents.length})</span>
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {documents.map(doc => {
                const selected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocSelection(doc.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      selected ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {selected ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{doc.fileSize}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discovered Academic Papers Column */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Discovered Papers ({workspacePapers.length})</span>
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {workspacePapers.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-2">No papers added to workspace yet. Add papers from Discovery page.</p>
              ) : (
                workspacePapers.map(paper => {
                  const selected = selectedPaperIds.includes(paper.id);
                  return (
                    <div
                      key={paper.id}
                      onClick={() => togglePaperSelection(paper.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                        selected ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {selected ? <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                        <span className="truncate">{paper.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{paper.year}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Graph + Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Graph Pipeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <span>Multi-Agent Execution Pipeline</span>
            </h2>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{selectedDocIds.length} PDFs + {selectedPaperIds.length} Papers</span>
            </span>
          </div>

          {/* Root Research Question Node */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl shadow-md space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              <span>Multi-Source Pipeline Context</span>
              <span>Root Pipeline Node</span>
            </div>
            <p className="text-xs font-bold text-slate-100 italic">
              "{activeWorkspace.question}"
            </p>
          </div>

          {/* Sequential Agent Flow List */}
          <div className="space-y-3 relative">
            {agents.map((agent, index) => {
              const isLast = index === agents.length - 1;
              return (
                <div key={agent.id} className="relative">
                  <div className={`p-5 rounded-2xl border transition-all ${
                    agent.status === 'running' 
                      ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-400/30 shadow-md animate-agent-pulse' 
                      : agent.status === 'completed'
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-75'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          agent.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : agent.status === 'running'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          0{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                            <span className="text-[10px] font-semibold text-slate-400">({agent.role})</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{agent.description}</p>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(agent.status)}</div>
                    </div>

                    {/* Progress Bar */}
                    {agent.status === 'running' && (
                      <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full w-2/3 animate-pulse" />
                      </div>
                    )}

                    {/* Tools Used Chips & Output Summary */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-600">Tools:</span>
                        <div className="flex flex-wrap gap-1">
                          {agent.toolsUsed.map((tool, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {agent.outputSummary}
                      </div>
                    </div>
                  </div>

                  {/* Downward Connector Arrow */}
                  {!isLast && (
                    <div className="flex justify-center my-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Agent Activity Log Terminal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl text-slate-200 space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Agent Telemetry Stream</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
              </div>
            </div>

            {/* Terminal Window Box */}
            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-2 h-[480px] overflow-y-auto border border-slate-800/80">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed border-b border-slate-900/60 pb-1">
                  <span className="text-slate-500 select-none">&gt; </span>
                  <span className={idx === 0 ? 'text-emerald-300 font-bold' : 'text-slate-300'}>{log}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Status: {isAgentRunning ? 'EXECUTING PIPELINE' : 'COMPLETE'}</span>
              <button 
                onClick={() => setCurrentScreen('report')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <span>View Generated Report →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
