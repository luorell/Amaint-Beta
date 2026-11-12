import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-primary shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-surface-container-high/95';
      case 'warn':
        return 'border-amber-500/40 bg-surface-container-high/95';
      case 'error':
        return 'border-rose-500/40 bg-surface-container-high/95';
      default:
        return 'border-primary/40 bg-surface-container-high/95';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 ${getBorderColor()}`}
      >
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono">
            {toast.title}
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed font-sans">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
