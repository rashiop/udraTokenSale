'use client';

import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ message, onClose }: SuccessToastProps) {
  return (
    <div className="animate-in slide-in-from-top-5 fixed top-20 right-4 z-100 max-w-md">
      <div className="rounded-xl border border-green-500/50 bg-linear-to-br from-green-900/90 to-green-800/90 p-4 shadow-2xl shadow-green-500/30 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="mb-1 font-semibold text-green-100">Success</h4>
            <p className="text-sm text-green-200">{message}</p>
          </div>
          <button onClick={onClose} className="shrink-0 text-green-300 transition-colors hover:text-green-100">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
