import React from 'react';
import { Sparkles, Table, CheckSquare, Square, Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { COMPARISON_MATRIX_DATA } from '../data/mockData';

export const PaperComparisonPage: React.FC = () => {
  const {
    papers,
    selectedPaperIdsForCompare,
    togglePaperSelectionForCompare,
    runPaperComparison,
    isComparingPapers,
    activeComparison,
    setCurrentScreen,
    activeWorkspace
  } = useResearch();

  const workspacePapers = papers.filter(p => p.isAddedToWorkspace || p.workspaceId === activeWorkspace?.id);
  const targetPapers = selectedPaperIdsForCompare.length >= 2
    ? workspacePapers.filter(p => selectedPaperIdsForCompare.includes(p.id))
    : workspacePapers.slice(0, 3);

  const matrixRows = activeComparison?.comparisonRows || COMPARISON_MATRIX_DATA;
  const synthesis = activeComparison?.aiSynthesis || 
    "Synthesized Analysis: Reflexion (NeurIPS 2024) achieves higher task flexibility via natural language episodic memory buffers, whereas GraphVerify (ICLR 2025) provides mathematical error guarantees at the cost of high compute latency.";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Multi-Paper Methodology Comparison</h1>
          <p className="text-xs text-slate-500 mt-1">Side-by-side comparative matrix of literature objectives, models, benchmarks, and limitations</p>
        </div>

        <button
          onClick={runPaperComparison}
          disabled={isComparingPapers || selectedPaperIdsForCompare.length < 2}
          className={`px-5 py-2.5 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 ${
            selectedPaperIdsForCompare.length >= 2
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isComparingPapers ? (
            <>
              <Loader2 className="w-4 h-4 text-indigo-200 animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Compare Selected ({selectedPaperIdsForCompare.length}) Papers</span>
            </>
          )}
        </button>
      </div>

      {/* Paper Selector Drawer / Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Select Workspace Papers to Compare (2–5 Papers)</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {selectedPaperIdsForCompare.length} of {workspacePapers.length} Selected
          </span>
        </div>

        {workspacePapers.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No papers added to current workspace yet. Add papers from Discovery page first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workspacePapers.map((paper) => {
              const isSelected = selectedPaperIdsForCompare.includes(paper.id);
              return (
                <div
                  key={paper.id}
                  onClick={() => togglePaperSelectionForCompare(paper.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{paper.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {paper.year} • {paper.journalOrConf || paper.venue || 'Academic Literature'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Matrix Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 overflow-hidden">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Literature Comparison Matrix</h2>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-4 border-r border-slate-800 min-w-[180px]">Comparison Metric</th>
                {targetPapers.map((p, idx) => (
                  <th key={p.id || idx} className="py-4 px-4 border-r border-slate-800 min-w-[220px]">
                    {p.title.slice(0, 30)}... ({p.year})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {matrixRows.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-200 bg-slate-100/60">
                    {row.feature}
                  </td>
                  {targetPapers.map((_, pIdx) => (
                    <td key={pIdx} className="py-3.5 px-4 border-r border-slate-200 leading-relaxed text-slate-700">
                      {row[`paper${pIdx + 1}`] || row.paper1 || 'Not available'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Generated Comparison Summary Box */}
      {synthesis && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">AI Comparative Synthesis</h3>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {synthesis}
          </p>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setCurrentScreen('gaps')}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>Explore Extracted Gaps →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
