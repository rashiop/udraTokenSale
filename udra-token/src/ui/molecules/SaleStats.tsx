'use client';

import { Database } from 'lucide-react';
import { useChainId } from 'wagmi';

import { useTokenMetadata, useTokenSaleState } from '@/hooks';
import { divideBigInts, formatEth, formatToken } from '@/lib/utils';

import { Skeleton } from '@/ui/atoms';

export default function SaleStats() {
  const chainId = useChainId();

  const { saleState, isLoading: isSaleLoading } = useTokenSaleState(chainId);
  const { symbol: tokenSymbol, decimals, isLoading: isTokenLoading } = useTokenMetadata(chainId);

  const isLoading = isSaleLoading || isTokenLoading;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-indigo-500/30 bg-linear-to-br from-indigo-900/40 to-indigo-800/40 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-indigo-600">
            <Database className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Contract State</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg bg-white/5 p-4">
              <Skeleton className="mb-2 h-3 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!saleState || !decimals) return null;

  const remainingCapPercentage = divideBigInts(saleState.remainingCap, saleState.maxSupply, 6).value * 100;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-linear-to-br from-indigo-900/40 to-indigo-800/40 p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-indigo-600">
          <Database className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-bold">Contract State</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white/5 p-4">
          <p className="mb-1 text-xs text-gray-400">Token Reserve</p>
          <p className="text-lg font-bold">
            {formatToken(saleState.tokenReserve, decimals, { useGrouping: true })} {tokenSymbol}
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <p className="mb-1 text-xs text-gray-400">ETH Liquidity</p>
          <p className="text-lg font-bold">{formatEth(saleState.ethLiquidity, { useGrouping: true })} ETH</p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <p className="mb-1 text-xs text-gray-400">Total Supply</p>
          <p className="text-lg font-bold">
            {formatToken(saleState.totalSupply, decimals, { useGrouping: true })} {tokenSymbol}
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <p className="mb-1 text-xs text-gray-400">Max Supply</p>
          <p className="text-lg font-bold">
            {formatToken(saleState.maxSupply, decimals, { useGrouping: true })} {tokenSymbol}
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-4 md:col-span-2">
          <p className="mb-2 text-xs text-gray-400">Remaining Cap</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all"
                  style={{
                    width: `${remainingCapPercentage}%`,
                  }}
                />
              </div>
            </div>
            <p className="min-w-fit text-lg font-bold">
              {formatToken(saleState.remainingCap, decimals, { useGrouping: true })} {tokenSymbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
