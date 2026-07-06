import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>&copy; {new Date().getFullYear()} Udra&apos;s Store.</span>
            <span>Built on Sepolia Testnet.</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-400 transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-white">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
