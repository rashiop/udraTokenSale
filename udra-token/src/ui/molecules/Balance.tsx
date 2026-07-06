import { Skeleton } from '@/ui/atoms';

export interface BalanceProps {
  tokenName?: string;
  balance?: string;
  logo?: React.ReactNode;
  isLoading?: boolean;
}

export default function Balance({ tokenName, balance, logo, isLoading }: BalanceProps) {
  if (isLoading) {
    return (
      <div className="balance rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-900/40 to-purple-800/40 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex justify-between">
          <div className="balance__info">
            <Skeleton className="mb-2 h-9 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-14 w-14 rounded-lg" />
        </div>
      </div>
    );
  }

  if (balance === undefined || !tokenName || !logo) {
    return null;
  }

  return (
    <div className="balance rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-900/40 to-purple-800/40 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex justify-between">
        <div className="balance__info">
          <p className="text-3xl font-bold">{balance}</p>
          <p className="mt-1 text-sm text-gray-400">{tokenName}</p>
        </div>
        <div className="balance__logo flex items-center justify-center rounded-lg bg-linear-to-br from-purple-500/30 to-purple-600/30 p-4">
          <span className="text-xl">{logo}</span>
        </div>
      </div>
    </div>
  );
}
