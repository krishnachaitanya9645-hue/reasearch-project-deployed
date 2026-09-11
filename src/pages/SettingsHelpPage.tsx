import React from 'react';
import { Settings, HelpCircle, Key, Cpu, Shield, Globe, BookOpen, MessageSquare, Terminal } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

export const SettingsHelpPage: React.FC = () => {
  const { currentScreen, showToast } = useResearch();

  const handleSave = () => {
    showToast('Settings Saved', 'Platform parameters updated successfully.', 'success');
  };

  if (currentScreen === 'help') {
    return (
      <div className="p-8 space-y-6 max-w-5xl mx-auto font-sans">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Help & Documentation</h1>
          <p className="text-xs text-slate-500 mt-1">ResearchPilot AI Autonomous Platform User Guide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">How to Create a Workspace</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click "+ New Workspace" in the header or sidebar. Enter your core research question, target domain, and keywords. ResearchPilot will automatically initialize a multi-agent literature indexing loop.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Running the Agentic Workflow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Navigate to "Agent Workflow" and click "Run Autonomous Agent Workflow". Watch as 8 specialized agents execute literature extraction, gap finding, and experiment generation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure AI model parameters, academic API keys, and workspace defaults</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Academic API Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Semantic Scholar API Key</label>
              <input
                type="password"
                defaultValue="sk-sch-849204928194"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">PubMed Entrez API Key</label>
              <input
                type="password"
                defaultValue="sk-pmd-992019482019"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
