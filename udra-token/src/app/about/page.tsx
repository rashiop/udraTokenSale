import type { Metadata } from 'next';
import { Coins, Shield, Zap, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Udra Store and its decentralized token sale platform on Sepolia testnet.',
};

const features = [
  {
    icon: Coins,
    title: 'Token Trading',
    description: 'Buy and sell from Udra Store directly with ETH using our bonding curve mechanism.',
  },
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'All transactions are executed on-chain with full transparency and security.',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Trades are settled instantly on the Sepolia testnet with low gas fees.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built for the community with fair token distribution and open-source code.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12 py-12">
        <div className="text-center">
          <h1 className="mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
            About Udra&apos;s Store
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            A decentralized token sale platform built on Ethereum&apos;s Sepolia testnet. Trade tokens seamlessly with
            our automated market maker.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500/20 to-cyan-500/20">
                <feature.icon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              Udra&apos;s Store uses a simple token sale contract where you can buy tokens by sending ETH and sell
              tokens to receive ETH back.
            </p>
            <p>
              The price is determined by fixed buy and sell rates set in the smart contract, ensuring predictable
              trading conditions.
            </p>
            <p>
              Connect your wallet, choose the amount you want to trade, and execute transactions directly on the
              blockchain.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This is a testnet application. No real funds are involved.</p>
          <p className="mt-1">Built with Next.js, RainbowKit, wagmi, and Udra&apos;support.</p>
        </div>
      </div>
    </div>
  );
}
