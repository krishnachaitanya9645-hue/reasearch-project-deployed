import React, { useState } from 'react';
import { FlaskConical, Plus, CheckCircle2, Clock, Sparkles, Target, Layers } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Badge } from '../components/common/Badge';

export const ExperimentPlannerPage: React.FC = () => {
  const { experiments, toggleMilestone, createExperiment, directions, activeWorkspace } = useResearch();
  const [showNewExpModal, setShowNewExpModal] = useState(false);

  const [title, setTitle] = useState('');
  const [directionTitle, setDirectionTitle] = useState(directions[0]?.title || '');
  const [hypothesis, setHypothesis] = useState('');
  const [dataset, setDataset] = useState('');
  const [method, setMethod] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hypothesis) return;

    createExperiment({
      title,
      directionTitle: directionTitle || 'General Research Direction',
      hypothesis,
      dataset: dataset || 'GSM8K benchmark dataset',
      method: method || 'Quantitative comparative benchmarking',
      metrics: ['Accuracy (%)', 'Latency (ms)', 'VRAM (GB)'],
      expectedOutcome: expectedOutcome || 'Outperform state of the art baselines.',
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Prepare evaluation dataset', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Implement baseline code model', completed: false }
      ]
    });

    setTitle('');
    setHypothesis('');
    setDataset('');
    setMethod('');
    setExpectedOutcome('');
    setShowNewExpModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Experiment Planner & Benchmarks</h1>
          <p className="text-xs text-slate-500 mt-1">Translate research directions into testable hypotheses, metrics, and milestone checkpoints</p>
        </div>
        <button
          onClick={() => setShowNewExpModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* Experiments Grid */}
      <div className="space-y-6">
        {experiments.map((exp) => {
          const completedMsCount = exp.milestones.filter(m => m.completed).length;
          const pct = Math.round((completedMsCount / (exp.milestones.length || 1)) * 100);

          return (
            <div key={exp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber">{exp.status}</Badge>
                    <span className="text-xs text-slate-400 font-semibold">Direction: {exp.directionTitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{exp.title}</h3>
                </div>

                <div className="w-48 shrink-0">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Milestones</span>
                    <span className="text-indigo-600 font-extrabold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Hypothesis</span>
                  <p className="font-semibold text-slate-800 italic">"{exp.hypothesis}"</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Methodology & Setup</span>
                  <p className="font-medium text-slate-800">{exp.method}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Dataset / Benchmarks</span>
                  <p className="font-medium text-slate-800">{exp.dataset}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Target Metrics</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.metrics.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md border border-indigo-200 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones Checkpoint Checklist */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Milestone Verification Checklist ({completedMsCount}/{exp.milestones.length})</span>
                </h4>

                <div className="space-y-2">
                  {exp.milestones.map((m) => (
                    <label 
                      key={m.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        m.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => toggleMilestone(exp.id, m.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-xs ${m.completed ? 'line-through text-slate-400 font-normal' : 'font-bold text-slate-800'}`}>
                        {m.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Experiment Modal */}
      {showNewExpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Experiment</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experiment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AGGV Latency Benchmark on 4x Edge Nodes"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hypothesis</label>
                <textarea
                  required
                  rows={2}
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="Quantized binary lookup verification tables will maintain <15ms verification latency..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dataset / Method</label>
                <input
                  type="text"
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  placeholder="GSM8K, HumanEval"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewExpModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  Save Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
