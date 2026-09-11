import React from 'react';
import { Compass, Sparkles, Plus, Check, Zap, Layers, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Badge } from '../components/common/Badge';

export const DirectionsPage: React.FC = () => {
  const { directions, addDirectionToPlan, setCurrentScreen, runAgentWorkflowSim, isAgentRunning } = useResearch();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Novelty Synthesis Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI-Generated Research Directions</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            Formulated solutions derived directly from identified literature gaps. Select directions to auto-generate experimental plans & Kanban tasks.
          </p>
        </div>

        <button
          onClick={runAgentWorkflowSim}
          disabled={isAgentRunning}
          className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>{isAgentRunning ? 'Synthesizing...' : 'Synthesize New Directions'}</span>
        </button>
      </div>

      {/* Grid of Direction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {directions.map((dir) => (
          <div 
            key={dir.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <Badge variant="indigo">Novelty Score: {dir.noveltyScore}%</Badge>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    dir.expectedImpact === 'Ultra High'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  }`}>
                    {dir.expectedImpact} Impact
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                    Difficulty: {dir.difficulty}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {dir.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium">
                {dir.description}
              </p>

              {/* Target Gap Addressed */}
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Target Literature Gap Addressed</span>
                <p className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{dir.targetGapTitle}</span>
                </p>
              </div>

              {/* Supporting Evidence List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supporting Evidence</span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {dir.supportingEvidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{dir.potentialVenue}</span>
              </span>

              <button
                onClick={() => addDirectionToPlan(dir.id)}
                disabled={dir.isAddedToPlan}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                  dir.isAddedToPlan
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {dir.isAddedToPlan ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>In Research Plan</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Research Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
