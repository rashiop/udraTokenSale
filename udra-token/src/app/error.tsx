'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-900/20 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Something went wrong</h2>
        <p className="mb-6 text-gray-400">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="cursor-pointer rounded-lg bg-red-600 px-6 py-3 font-medium transition-colors hover:bg-red-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
