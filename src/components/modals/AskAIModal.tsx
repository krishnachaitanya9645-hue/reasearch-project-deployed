import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, FileText, Lightbulb, Compass } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const AskAIModal: React.FC = () => {
  const { isAskAIModalOpen, setIsAskAIModalOpen, activeWorkspace, showToast } = useResearch();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Hello Dr. Rivera! I am your ResearchPilot AI Co-Pilot for "${activeWorkspace.name}". Ask me to find literature gaps, synthesize methodology comparisons, or suggest experiment baselines.`,
      time: '12:00 PM'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isAskAIModalOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim() || isThinking) return;

    const userMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      let responseText = "Based on our indexed literature database, ";
      if (query.toLowerCase().includes('gap') || query.toLowerCase().includes('bottleneck')) {
        responseText += "the most prominent research gap is real-time dynamic verification for quantized small models on edge hardware. Current SMT verifiers like GraphVerify carry an 85ms overhead that exceeds edge node constraints.";
      } else if (query.toLowerCase().includes('paper') || query.toLowerCase().includes('discovery')) {
        responseText += "I evaluated 14 papers linked to your workspace. Reflexion (NeurIPS 2024) and GraphVerify (ICLR 2025) represent the strongest methodological baselines.";
      } else {
        responseText += `I analyzed your question regarding "${query}". For the active workspace "${activeWorkspace.name}", we recommend linking 2 additional literature papers and running the Gap Agent verification cycle.`;
      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsThinking(false);
    }, 1200);
  };

  const samplePrompts = [
    "Synthesize research gaps in multi-agent verification",
    "Compare Reflexion vs GraphVerify methodologies",
    "Suggest experimental metrics for edge model reasoning"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ask ResearchPilot Co-Pilot</h3>
              <p className="text-xs text-indigo-600 font-medium">{activeWorkspace.name}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAskAIModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {msg.sender === 'user' ? 'AR' : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[10px] block mt-1.5 ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium italic p-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
              <span>ResearchPilot AI is analyzing indexed workspace papers...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] rounded-full font-medium whitespace-nowrap transition-colors border border-slate-200"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Prompt Input Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about literature, research gaps, methodology..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!prompt.trim() || isThinking}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
