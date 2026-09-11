import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  PenTool, 
  FileCode, 
  X, 
  Save, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  AlignLeft
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { DocumentItem } from '../types/research';

export const DocumentLibrary: React.FC = () => {
  const { 
    documents, 
    activeDocument, 
    setActiveDocument, 
    uploadDocument, 
    createTextDocument, 
    updateTextDocument, 
    deleteDocument, 
    setCurrentScreen, 
    showToast 
  } = useResearch();

  const [inputTab, setInputTab] = useState<'file' | 'text'>('file');
  const [docSearch, setDocSearch] = useState('');

  // Text Input Editor Form State
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isSubmittingText, setIsSubmittingText] = useState(false);

  // View / Edit Modal State
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Word & Character count helpers
  const getWordCount = (str: string) => str.trim() ? str.trim().split(/\s+/).length : 0;
  const getCharCount = (str: string) => str.length;

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(docSearch.toLowerCase()) || 
    d.author.toLowerCase().includes(docSearch.toLowerCase())
  );

  const processUploadedFile = (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    const allowed = ['pdf', 'doc', 'docx', 'txt'];

    if (!allowed.includes(ext)) {
      showToast('Unsupported File', `File '.${ext}' is not supported. Allowed formats: PDF, DOC, DOCX, TXT.`, 'warning');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      uploadDocument(file.name, sizeMb, content);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleSaveTextResearch = async (runWorkflowImmediately: boolean = false) => {
    if (!textTitle.trim()) {
      showToast('Validation Error', 'Please enter a research title.', 'warning');
      return;
    }
    if (!textContent.trim()) {
      showToast('Validation Error', 'Please enter or paste research content.', 'warning');
      return;
    }

    setIsSubmittingText(true);
    await createTextDocument(textTitle.trim(), textContent.trim());
    setIsSubmittingText(false);
    
    setTextTitle('');
    setTextContent('');

    if (!runWorkflowImmediately) {
      showToast('Research Saved', 'Text research document saved to library.', 'success');
    }
  };

  const handleOpenViewModal = (doc: DocumentItem) => {
    setViewingDoc(doc);
    setEditTitle(doc.name);
    setEditContent(doc.extractedText || '');
    setIsEditingDoc(false);
  };

  const handleSaveDocEdits = async () => {
    if (!viewingDoc) return;
    if (!editTitle.trim() || !editContent.trim()) {
      showToast('Validation Error', 'Title and content cannot be empty.', 'warning');
      return;
    }

    await updateTextDocument(viewingDoc.id, editTitle.trim(), editContent.trim());
    setViewingDoc(prev => prev ? { ...prev, name: editTitle.trim(), extractedText: editContent.trim() } : null);
    setIsEditingDoc(false);
  };

  const getSourceBadge = (doc: DocumentItem) => {
    const type = (doc.fileType || doc.sourceType || 'PDF').toUpperCase();
    if (type === 'TEXT') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
          <PenTool className="w-3 h-3 text-emerald-600" /> TEXT
        </span>
      );
    }
    if (type === 'DOCX' || type === 'DOC') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
          <FileCode className="w-3 h-3 text-purple-600" /> DOCX
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
        <FileText className="w-3 h-3 text-blue-600" /> PDF
      </span>
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add & Manage Research Documents</h1>
          <p className="text-xs text-slate-500 mt-1">Provide research via File Upload (PDF, DOC, DOCX) or enter research text directly into the AI pipeline.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Active Selection: <strong className="text-slate-900 font-mono">{activeDocument?.name || 'None'}</strong></span>
        </div>
      </div>

      {/* Dual Input Mode Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Toggle Mode Buttons */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <button
            onClick={() => setInputTab('file')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputTab === 'file'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Option 1: Upload Document (PDF, DOC, DOCX)</span>
          </button>

          <button
            onClick={() => setInputTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Option 2: Enter Research as Text</span>
          </button>
        </div>

        {/* INPUT OPTION 1: FILE UPLOAD */}
        {inputTab === 'file' && (
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 p-8 text-center space-y-3 transition-colors bg-gradient-to-b from-indigo-50/20 to-white cursor-pointer relative"
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Research Document (PDF, DOC, DOCX, TXT)</h3>
              <p className="text-xs text-slate-500 mt-1">Drag and drop research files or click below to browse</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Supported formats:</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700">PDF</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700">DOC</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700">DOCX</span>
            </div>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs pointer-events-none inline-block mt-2">
              Browse Files from Computer
            </button>
          </div>
        )}

        {/* INPUT OPTION 2: ENTER AS TEXT */}
        {inputTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Research Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Enter research title, paper name, problem statement, or idea..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Research Content <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>Words: <strong>{getWordCount(textContent)}</strong></span>
                  <span>|</span>
                  <span>Characters: <strong>{getCharCount(textContent)}</strong></span>
                </div>
              </div>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                placeholder="Paste or type your research content, abstract, problem statement, literature review, research idea, notes, or experimental description here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans leading-relaxed resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSaveTextResearch(false)}
                disabled={isSubmittingText}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>Save Research Document</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveTextResearch(true)}
                disabled={isSubmittingText}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-indigo-200" />
                <span>Save & Run Agent Workflow →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar & Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search documents by title or author..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Showing {filteredDocs.length} documents</span>
        </div>

        {/* Professional Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4">Title / Name</th>
                <th className="py-3 px-4">Source Type</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDocs.map((doc) => {
                const isSelected = activeDocument?.id === doc.id;
                return (
                  <tr 
                    key={doc.id} 
                    onClick={() => setActiveDocument(doc)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/60 font-bold' : 'hover:bg-slate-50/70'}`}
                  >
                    <td className="py-3 px-4">
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-300 block" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getSourceBadge(doc)}
                    </td>
                    <td className="py-3 px-4">{doc.author}</td>
                    <td className="py-3 px-4 text-slate-500">{doc.uploadDate}</td>
                    <td className="py-3 px-4 text-slate-500">{doc.fileSize}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenViewModal(doc)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View / Edit Content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveDocument(doc);
                            setCurrentScreen('workflow');
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                        >
                          Run Workflow →
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW / EDIT DOCUMENT MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Research Document Inspector</h3>
                {getSourceBadge(viewingDoc)}
              </div>
              <button 
                onClick={() => setViewingDoc(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                {isEditingDoc ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60">{viewingDoc.name}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Extracted Content & Research Text</label>
                  <span className="text-[11px] text-slate-400 font-mono">Length: {viewingDoc.extractedText?.length || viewingDoc.textLength || 0} chars</span>
                </div>
                {isEditingDoc ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono leading-relaxed focus:bg-white"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-800 max-h-80 overflow-y-auto whitespace-pre-wrap">
                    {viewingDoc.extractedText || 'No extracted text content available.'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <div>
                {viewingDoc.sourceType === 'TEXT' && (
                  <button
                    onClick={() => setIsEditingDoc(!isEditingDoc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                  >
                    {isEditingDoc ? 'Cancel Editing' : 'Edit Document'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isEditingDoc ? (
                  <button
                    onClick={handleSaveDocEdits}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveDocument(viewingDoc);
                      setViewingDoc(null);
                      setCurrentScreen('workflow');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Run Agent Workflow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
