import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, Plus, Sparkles, BookOpen, ExternalLink, Check, Loader2, X, Info } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { Badge } from '../components/common/Badge';

export const DiscoveryPage: React.FC = () => {
  const {
    activeWorkspace,
    papers,
    discoveredPapers,
    isSearchingPapers,
    searchTotal,
    searchAcademicPapers,
    addDiscoveredPaperToWorkspace,
    analyzePaper,
    searchQuery,
    setSearchQuery
  } = useResearch();

  const [yearFilter, setYearFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('relevance');
  const [selectedPaperDetails, setSelectedPaperDetails] = useState<any | null>(null);

  // Auto trigger search on mount if query exists
  useEffect(() => {
    const initialQuery = searchQuery || activeWorkspace?.question || 'machine learning congestion control';
    if (discoveredPapers.length === 0 && !isSearchingPapers) {
      searchAcademicPapers(initialQuery, { sort: sortOption });
    }
  }, [activeWorkspace?.id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAcademicPapers(searchQuery, {
      yearFrom: yearFilter !== 'all' ? parseInt(yearFilter, 10) : undefined,
      sort: sortOption
    });
  };

  const handleFilterChange = (year: string, sort: string) => {
    setYearFilter(year);
    setSortOption(sort);
    searchAcademicPapers(searchQuery, {
      yearFrom: year !== 'all' ? parseInt(year, 10) : undefined,
      sort
    });
  };

  const isPaperInWorkspace = (p: any) => {
    return papers.some(
      wp => wp.id === p.id ||
      (wp.doi && p.doi && wp.doi === p.doi) ||
      wp.title.toLowerCase().trim() === p.title.toLowerCase().trim()
    );
  };

  const displayList = discoveredPapers.length > 0 ? discoveredPapers : papers;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Paper Discovery</h1>
          <p className="text-xs text-slate-500 mt-1">Search, filter, and import open-access peer-reviewed literature into active workspaces via OpenAlex API</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>{searchTotal || displayList.length} Real Academic Papers Found</span>
        </div>
      </div>

      {/* Main Search & Filter Control Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, authors, paper title, or DOI (e.g. congestion control, multi-agent reinforcement learning)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingPapers}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            {isSearchingPapers ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-indigo-200" />
                <span>Search Literature</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filters:</span>
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => handleFilterChange(e.target.value, sortOption)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortOption}
              onChange={(e) => handleFilterChange(yearFilter, e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="citations">Sort by Citations</option>
              <option value="publication_date">Sort by Publication Date</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Active Workspace: <strong className="text-slate-800">{activeWorkspace?.name}</strong>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {isSearchingPapers && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Searching Academic Literature...</h3>
          <p className="text-xs text-slate-500">Querying OpenAlex global repository index for peer-reviewed papers</p>
        </div>
      )}

      {/* Empty State */}
      {!isSearchingPapers && displayList.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No papers found for this research query</h3>
          <p className="text-xs text-slate-500">Try broadening your search query keywords or resetting year filters.</p>
        </div>
      )}

      {/* Paper List Grid */}
      {!isSearchingPapers && displayList.length > 0 && (
        <div className="space-y-4">
          {displayList.map((paper) => {
            const added = isPaperInWorkspace(paper);
            return (
              <div 
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="purple">{paper.venue || paper.journalOrConf || 'Academic Literature'}</Badge>
                      <span className="text-xs text-slate-400 font-semibold">{paper.publicationYear || paper.year}</span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {paper.citations || 0} Citations
                      </span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                        Source: {paper.source || 'OpenAlex'}
                      </span>
                      {paper.doi && (
                        <span className="text-[11px] text-slate-400 font-mono">DOI: {paper.doi}</span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setSelectedPaperDetails(paper)}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors pt-1"
                    >
                      {paper.title}
                    </h3>

                    <p className="text-xs font-medium text-slate-500">
                      Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedPaperDetails(paper)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => addDiscoveredPaperToWorkspace(paper)}
                      disabled={added}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                        added
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>In Workspace</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Workspace</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        addDiscoveredPaperToWorkspace(paper);
                        analyzePaper(paper.id);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>

                {/* Abstract */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {paper.abstract}
                </p>

                {/* Tags Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {(paper.concepts || paper.tags || []).map((tag: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Open Source Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paper Details Modal */}
      {selectedPaperDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="purple">{selectedPaperDetails.venue || 'Academic Literature'}</Badge>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Source: {selectedPaperDetails.source || 'OpenAlex'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedPaperDetails.title}</h2>
              </div>
              <button
                onClick={() => setSelectedPaperDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <strong className="text-slate-900 font-bold block mb-1">Authors:</strong>
                <p className="text-slate-600">
                  {Array.isArray(selectedPaperDetails.authors) ? selectedPaperDetails.authors.join(', ') : selectedPaperDetails.authors}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Publication Year</span>
                  <strong className="text-slate-900">{selectedPaperDetails.publicationYear || selectedPaperDetails.year}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Citations</span>
                  <strong className="text-slate-900">{selectedPaperDetails.citations || 0}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">DOI</span>
                  <strong className="text-slate-900 truncate block">{selectedPaperDetails.doi || 'Not available'}</strong>
                </div>
              </div>

              <div>
                <strong className="text-slate-900 font-bold block mb-1">Abstract:</strong>
                <p className="text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100 font-normal">
                  {selectedPaperDetails.abstract}
                </p>
              </div>

              {(selectedPaperDetails.concepts || selectedPaperDetails.tags) && (
                <div>
                  <strong className="text-slate-900 font-bold block mb-1">Concepts & Fields:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedPaperDetails.concepts || selectedPaperDetails.tags || []).map((c: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {selectedPaperDetails.url ? (
                <a
                  href={selectedPaperDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                >
                  <span>Open Source Publication</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400">Source URL not available</span>
              )}

              <button
                onClick={() => {
                  addDiscoveredPaperToWorkspace(selectedPaperDetails);
                  setSelectedPaperDetails(null);
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
