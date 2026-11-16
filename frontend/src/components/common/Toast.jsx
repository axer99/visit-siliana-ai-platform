import { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type = 'success' } = toast;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50',
    danger: 'bg-red-900/90 text-red-100 border-red-500/50',
    warning: 'bg-amber-900/90 text-amber-100 border-amber-500/50',
    info: 'bg-sky-900/90 text-sky-100 border-sky-500/50',
  }[type] || 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50';

  const iconColors = {
    success: 'text-emerald-400',
    danger: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-sky-400',
  }[type] || 'text-emerald-400';

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm w-full animate-bounce-once">
      <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${bgStyles}`}>
        <CheckCircleIcon className={`w-6 h-6 shrink-0 ${iconColors}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
