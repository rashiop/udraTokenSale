import { Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-block rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-400" />
        </div>

        <h1 className="mb-2 text-6xl font-bold text-red-400">404</h1>

        <h2 className="mb-4 text-2xl font-bold text-gray-200">Page Not Found</h2>

        <p className="mb-8 text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>

        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium transition-colors hover:bg-purple-500"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
