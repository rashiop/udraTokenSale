'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface TradeButtonProps {
  onClick: () => void;
  label: string;
  description: string;
  type: 'sell' | 'buy';
}

export default function TradeButton({ onClick, description, label, type }: TradeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'button-trade',
        {
          'button-trade--sell': type === 'sell',
          'button-trade--buy': type === 'buy',
        },
        'group relative cursor-pointer overflow-hidden rounded-2xl border',
        {
          'border-blue-500/20 bg-linear-to-br from-blue-900/40 to-blue-800/40': type === 'buy',
          'border-slate-500/20 bg-linear-to-br from-slate-800/40 to-slate-700/40': type === 'sell',
        },
        'p-6 shadow-lg backdrop-blur-sm transition-all',
        {
          'hover:border-blue-500/40 hover:from-blue-800/50 hover:to-blue-700/50': type === 'buy',
          'hover:border-slate-500/40 hover:from-slate-700/50 hover:to-slate-600/50': type === 'sell',
        }
      )}
    >
      {type === 'buy' ? (
        <>
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
          <TrendingUp className="relative z-10 mx-auto mb-2 h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-linear-to-r from-slate-400 via-slate-300 to-slate-400 opacity-0 blur-2xl transition-opacity group-hover:opacity-20" />
          <TrendingDown className="relative z-10 mx-auto mb-2 h-8 w-8 text-slate-400 transition-transform group-hover:scale-110" />
        </>
      )}
      <p className="relative z-10 text-xl font-bold">{label}</p>
      <p className="relative z-10 mt-1 text-sm text-gray-400">{description}</p>
    </button>
  );
}
