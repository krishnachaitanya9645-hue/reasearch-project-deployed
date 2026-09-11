import React from 'react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Search, 
  FileText, 
  Compass, 
  Cpu, 
  FlaskConical, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, setIsCreateWorkspaceModalOpen } = useResearch();

  const features = [
    {
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      title: "Paper Discovery & Vector Indexing",
      desc: "Connect to PubMed, arXiv, and Semantic Scholar APIs to index and rank relevant peer-reviewed studies."
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: "AI Methodology Extraction",
      desc: "Automatically extract research objectives, datasets, empirical benchmarks, and stated limitations."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      title: "Research Gap Triangulation",
      desc: "Isolate high-confidence literature gaps by cross-referencing user objectives against paper limitations."
    },
    {
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      title: "Novel Research Directions",
      desc: "Synthesize concrete technical research direction proposals with novelty scores and impact metrics."
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-600" />,
      title: "Autonomous Multi-Agent Pipeline",
      desc: "8 specialized autonomous agents handle literature search, comparison matrix, gap finding, and planning."
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-rose-600" />,
      title: "Experiment & Task Generation",
      desc: "Convert chosen research directions directly into interactive experiment plans and Kanban tasks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">Research<span className="text-indigo-600">Pilot</span></span>
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">AI Research Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentScreen('login')}
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-4 py-2 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/80 border border-indigo-200 rounded-full text-indigo-800 text-xs font-bold shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>The Autonomous AI Research Workspace for Scholars & R&D Teams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          From Research Question <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            to Research Direction
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          Accelerate literature discovery, extract deep methodologies, detect unaddressed scientific gaps, and synthesize novel experimental plans with an autonomous 8-agent AI workflow.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setIsCreateWorkspaceModalOpen(true);
              setCurrentScreen('dashboard');
            }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Start Research Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            Explore Interactive Demo
          </button>
        </div>
      </section>

      {/* Visual Workflow Pipeline Showcase Section */}
      <section className="py-12 px-8 max-w-6xl mx-auto w-full">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8 border border-slate-800">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">End-to-End Autonomous Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">How ResearchPilot Works</h2>
            <p className="text-slate-400 text-xs">Moving seamless from inquiry to validated tasks in minutes</p>
          </div>

          {/* Workflow Steps Line */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { step: '01', title: 'Research Question' },
              { step: '02', title: 'Orchestrator' },
              { step: '03', title: 'Paper Discovery' },
              { step: '04', title: 'Paper Analysis' },
              { step: '05', title: 'Gap Detection' },
              { step: '06', title: 'Directions' },
              { step: '07', title: 'Experiment Plan' },
              { step: '08', title: 'Kanban Tasks' },
            ].map((s, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-400">{s.step}</span>
                <span className="text-xs font-bold text-slate-200">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Built for Serious Academic & R&D Excellence</h2>
          <p className="text-slate-500 text-xs">Everything you need to publish high-impact peer-reviewed literature</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-8 text-center text-xs text-slate-500">
        <p>© 2026 ResearchPilot AI Platform. All rights reserved. Hackathon Demo Edition.</p>
      </footer>
    </div>
  );
};
