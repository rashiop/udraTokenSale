'use client';

import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, header, children }: ModalProps) {
  return (
    <div
      className={cn('ut-modal fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs', {
        hidden: !isOpen,
      })}
    >
      <div className="ut-modal__container w-full max-w-md rounded-2xl border border-purple-500/30 bg-linear-to-br from-slate-900 to-purple-900/50 p-8 shadow-2xs">
        <div className="ut-modal__header mb-6 flex items-center justify-between">
          {header}
          <button onClick={onClose} className="text-gray-400 transition-colors hover:cursor-pointer hover:text-white">
            ✕
          </button>
        </div>
        <div className="ut-modal__body space-y-4">{children}</div>
      </div>
    </div>
  );
}
