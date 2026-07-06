'use client';

import { useChainId } from 'wagmi';

import { useSaleRates } from '@/hooks';
import { formatEth } from '@/lib/utils';

import { Skeleton } from '@/ui/atoms';

export default function PriceInfo() {
  const chainId = useChainId();
  const { buyRate, sellRate, hasContract, isLoading } = useSaleRates(chainId);

  if (!hasContract) return null;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-7 w-48" />
      </div>
    );
  }

  if (!buyRate || !sellRate) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex flex-col">
        <p className="mb-1 text-gray-400">Current Price</p>
        <div className="flex gap-3">
          <p className="text-xl font-bold">Buy: </p>
          <p className="text-xl text-green-400">{formatEth(buyRate, { useGrouping: true })}</p>
          <p className="text-xl font-bold">ETH</p>
        </div>
        <div className="flex gap-3">
          <p className="text-xl font-bold">Sell: </p>
          <p className="text-xl text-purple-400">{formatEth(sellRate, { useGrouping: true })}</p>
          <p className="text-xl font-bold">ETH</p>
        </div>
      </div>
    </div>
  );
}
