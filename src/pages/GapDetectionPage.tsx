import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Quote, ShieldAlert, CheckCircle2, Zap, Layers, Compass } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Badge } from '../components/common/Badge';

export const GapDetectionPage: React.FC = () => {
  const { gaps, exploreGap, activeWorkspace, runAgentWorkflowSim, isAgentRunning } = useResearch();

  const [selectedGapId, setSelectedGapId] = useState<string>(gaps[0]?.id || 'gap-1');
  const activeGap = gaps.find(g => g.id === selectedGapId) || gaps[0];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Literature Gap Detection Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Unaddressed Research Gaps</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            ResearchPilot cross-references method limitations against stated research questions to isolate high-confidence scientific novelty opportunities.
          </p>
        </div>

        <button
          onClick={runAgentWorkflowSim}
          disabled={isAgentRunning}
          className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{isAgentRunning ? 'Scanning Literature...' : 'Re-Scan Research Gaps'}</span>
        </button>
      </div>

      {/* Main Grid: Gap Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 Spans): List of Gap Cards */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Identified Literature Bottlenecks</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">{gaps.length} Found</span>
          </h2>

          <div className="space-y-4">
            {gaps.map((gap) => {
              const isSelected = gap.id === activeGap.id;
              return (
                <div 
                  key={gap.id}
                  onClick={() => setSelectedGapId(gap.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                    isSelected 
                      ? 'bg-white border-purple-500 ring-2 ring-purple-400/30 shadow-md' 
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xs'
                  }`}
                >
                  {/* Badge & Confidence Score Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple">Confidence: {gap.confidenceScore}%</Badge>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                        gap.impactLevel === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {gap.impactLevel} Impact
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {gap.supportingPaperTitles.length} Supporting Papers
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {gap.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {gap.description}
                    </p>
                  </div>

                  {/* Supporting Evidence Quotes Preview */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Triangulated Evidence</span>
                    <p className="text-xs text-slate-700 italic font-serif">
                      "{gap.evidence[0]}"
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{gap.whyItMatters.slice(0, 45)}...</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exploreGap(gap.id);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                    >
                      <span>Explore Gap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Spans): Detailed Gap Inspection Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Gap Deep Inspection</h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                Score: {activeGap.confidenceScore}/100
              </span>
            </div>

            {/* Gap Title */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gap Subject</span>
              <h4 className="text-sm font-extrabold text-slate-900">{activeGap.title}</h4>
            </div>

            {/* Supporting Papers */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Supporting Literature Evidence</span>
              <ul className="space-y-2">
                {activeGap.supportingPaperTitles.map((title, i) => (
                  <li key={i} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs text-slate-800 flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence Quotes */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Verified Extracts</span>
              <div className="space-y-2">
                {activeGap.evidence.map((ev, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                    "{ev}"
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Gap Matters Callout */}
            <div className="p-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">Why This Gap Matters</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeGap.whyItMatters}
              </p>
            </div>

            <button
              onClick={() => exploreGap(activeGap.id)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-200" />
              <span>Generate Research Direction for this Gap →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
