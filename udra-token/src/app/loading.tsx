import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-400" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
