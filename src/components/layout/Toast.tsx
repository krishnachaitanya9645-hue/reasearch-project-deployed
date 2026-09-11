import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useResearch();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white',
    info: 'border-indigo-200 bg-white',
    warning: 'border-amber-200 bg-white'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short max-w-sm w-full">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${borderColors[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
          <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
        </div>
        <button 
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
