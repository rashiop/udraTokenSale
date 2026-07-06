'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-cyan-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h1 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
            Udra&apos;s store
          </h1>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-white" prefetch>
            About
          </Link>
          <ConnectButton
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </nav>
      </div>
    </header>
  );
}
