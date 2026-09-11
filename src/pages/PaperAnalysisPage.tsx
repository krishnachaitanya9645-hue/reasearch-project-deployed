import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Quote, 
  Layers,
  Search,
  Bookmark,
  Share2
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Badge } from '../components/common/Badge';

export const PaperAnalysisPage: React.FC = () => {
  const { selectedPaperForAnalysis, papers, setSelectedPaperForAnalysis, addPaperToWorkspace, toggleSavePaper, setCurrentScreen } = useResearch();
  
  const paper = selectedPaperForAnalysis || papers[0];
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('discovery')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs"
          >
            ← Back to Discovery
          </button>
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">AI Deep Extraction Engine</span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight truncate max-w-xl">{paper.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSavePaper(paper.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
              paper.isSaved ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{paper.isSaved ? 'Saved' : 'Save Paper'}</span>
          </button>

          <button
            onClick={() => addPaperToWorkspace(paper.id)}
            disabled={paper.isAddedToWorkspace}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all ${
              paper.isAddedToWorkspace
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {paper.isAddedToWorkspace ? 'Added to Workspace' : '+ Link to Workspace'}
          </button>
        </div>
      </div>

      {/* Main Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side (5 Cols): Paper Preview & Metadata */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{paper.journalOrConf}</Badge>
              <span className="text-xs text-slate-400 font-semibold">{paper.year} • {paper.citations} Citations</span>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">{paper.title}</h2>
            <p className="text-xs font-semibold text-slate-600">Authors: {paper.authors.join(', ')}</p>

            {/* Abstract Preview Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Abstract</span>
              <p className="text-xs text-slate-700 leading-relaxed font-serif italic">{paper.abstract}</p>
            </div>

            {/* Evidence Source Quote Inspector */}
            {paper.evidenceQuotes && paper.evidenceQuotes.length > 0 && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Quote className="w-3 h-3" />
                  <span>Verified Source Text Snippets ({paper.evidenceQuotes.length})</span>
                </span>
                <div className="space-y-2">
                  {paper.evidenceQuotes.map((eq, i) => (
                    <div 
                      key={i} 
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        highlightedEvidence === eq.location
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-semibold ring-2 ring-amber-400/40'
                          : 'bg-white border-amber-200 text-slate-800'
                      }`}
                    >
                      <p className="italic">"{eq.text}"</p>
                      <span className="text-[10px] font-bold text-amber-700 block mt-1">
                        📍 {eq.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document PDF Mockup Link */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[180px]">{paper.title}.pdf</span>
                  <span className="text-[10px] text-slate-500">2.4 MB • Text Stream Verified</span>
                </div>
              </div>
              <a 
                href={paper.url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Full PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side (7 Cols): AI Structural Analysis Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-extrabold text-slate-900">AI Structural Analysis</h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Confidence 98%
              </span>
            </div>

            {/* Section 1: Research Objective */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>1. Research Objective</span>
                </h3>
                <button 
                  onClick={() => setHighlightedEvidence('Section 3.2, Page 4')}
                  className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  Evidence [Sec 3.2]
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium">
                {paper.objective || 'Primary objective extracted by AI analysis pipeline.'}
              </p>
            </div>

            {/* Section 2: Methodology */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>2. Methodology</span>
                </h3>
                <button 
                  onClick={() => setHighlightedEvidence('Section 3.2, Page 4')}
                  className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  Evidence [Sec 3.2]
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium">
                {paper.methodology || 'Methodology pipeline extracted.'}
              </p>
            </div>

            {/* Section 3: Dataset & Benchmarks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>3. Dataset & Benchmarks</span>
                </h3>
                <button 
                  onClick={() => setHighlightedEvidence('Section 4.1, Page 6')}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  Evidence [Sec 4.1]
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium">
                {paper.dataset || 'Evaluated on standard benchmarks.'}
              </p>
            </div>

            {/* Section 4: Key Findings */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>4. Key Findings</span>
              </h3>
              <ul className="space-y-2">
                {paper.keyFindings?.map((finding, idx) => (
                  <li key={idx} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-slate-800 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      Verified
                    </span>
                  </li>
                )) || <p className="text-xs text-slate-500">Key findings list loading...</p>}
              </ul>
            </div>

            {/* Section 5: Results & Empirical Claims */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>5. Empirical Results</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-medium">
                {paper.resultsSummary || 'Empirical metrics synthesized.'}
              </p>
            </div>

            {/* Section 6: Limitations (Critical for Gaps!) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>6. Stated & Inferred Limitations</span>
                </h3>
                <button 
                  onClick={() => setHighlightedEvidence('Section 5.1, Page 8')}
                  className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  Evidence [Sec 5.1]
                </button>
              </div>
              <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium leading-relaxed">
                {paper.limitations || 'No explicit limitations reported in abstract.'}
              </div>
            </div>

            {/* Section 7: Important AI Insights for Workspace */}
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider">ResearchPilot Insight Recommendation</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                This study strongly supports your workspace objective by proving that agent self-correction does not require fine-tuning weights. However, its memory accumulation limitation provides a direct rationale for your <strong>Hierarchical Information-Bottleneck (HIB-MP)</strong> direction.
              </p>
              <button 
                onClick={() => setCurrentScreen('gaps')}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                View Related Research Gaps →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
