import React, { useState } from 'react';
import { X, Sparkles, FolderPlus } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const CreateWorkspaceModal: React.FC = () => {
  const { isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen, createWorkspace } = useResearch();

  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [field, setField] = useState('Artificial Intelligence / Machine Learning');
  const [objectivesStr, setObjectivesStr] = useState('');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreateWorkspaceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !question.trim()) return;

    const objectives = objectivesStr.split('\n').filter(o => o.trim().length > 0);
    const keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

    createWorkspace({
      name,
      question,
      field,
      objectives: objectives.length > 0 ? objectives : ['Systematic literature review & baseline benchmarking'],
      keywords: keywords.length > 0 ? keywords : ['AI Research', 'Autonomous Workflows'],
      description: description || 'Autonomous intelligence research workspace created in ResearchPilot.'
    });

    // Reset form
    setName('');
    setQuestion('');
    setObjectivesStr('');
    setKeywordsStr('');
    setDescription('');
    setIsCreateWorkspaceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Research Workspace</h3>
              <p className="text-xs text-slate-500">Configure your autonomous research intelligence project</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreateWorkspaceModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Research Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Quantum-Enhanced Drug Discovery Algorithms"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Research Question <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How can hybrid VQE optimization minimize parameter decoherence in noisy intermediate-scale quantum hardware?"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Research Field</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Artificial Intelligence / Machine Learning">Artificial Intelligence / Machine Learning</option>
                <option value="Renewable Energy & Climate ML">Renewable Energy & Climate ML</option>
                <option value="Computational Biology & Genomics">Computational Biology & Genomics</option>
                <option value="Quantum Computing & Hardware">Quantum Computing & Hardware</option>
                <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
                <option value="Cybersecurity & Distributed Systems">Cybersecurity & Distributed Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                placeholder="VQE, Decoherence, NISQ, Molecular Docking"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Research Objectives (One per line)</label>
            <textarea
              rows={3}
              value={objectivesStr}
              onChange={(e) => setObjectivesStr(e.target.value)}
              placeholder="1. Benchmark state-of-the-art VQE implementations&#10;2. Extract hardware noise thresholds from 10 papers&#10;3. Formulate novel error-mitigation ansatz"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this research workspace aims to accomplish..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateWorkspaceModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
