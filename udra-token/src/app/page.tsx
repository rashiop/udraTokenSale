'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Wallet } from 'lucide-react';
import { useConnection, useChainId, useBalance } from 'wagmi';

import { useTokenMetadata, useTokenBalance, useTokenSaleState } from '@/hooks';
import { formatEth, formatToken } from '@/lib/utils';

import { SuccessToast, TradeButton } from '@/ui/atoms';
import { Balance, SaleStats, PriceInfo } from '@/ui/molecules';

import { TOAST_AUTO_DISMISS_MS } from '@/config/constants';

const BuyModal = dynamic(() => import('@/ui/organisms/BuyModal'), { ssr: false });
const SellModal = dynamic(() => import('@/ui/organisms/SellModal'), { ssr: false });

export default function App() {
  const chainId = useChainId();
  const { address, isConnected } = useConnection();
  const { data: ethBalanceData, refetch: refetchEthBalance } = useBalance({ address });
  const {
    balance: tokenBalance,
    refetch: refetchTokenBalance,
    isLoading: isTokenBalanceLoading,
  } = useTokenBalance(chainId, address);
  const { symbol: tokenSymbol, tokenName, decimals, isLoading: isTokenMetadataLoading } = useTokenMetadata(chainId);
  const { refetchSaleState } = useTokenSaleState(chainId);

  const formattedEthBalance = formatEth(ethBalanceData?.value, { useGrouping: true });
  const formattedTokenBalance = formatToken(tokenBalance, decimals, { useGrouping: true });

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), TOAST_AUTO_DISMISS_MS);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const refetchBalances = useCallback(async () => {
    await Promise.all([refetchEthBalance(), refetchTokenBalance(), refetchSaleState()]);
  }, [refetchEthBalance, refetchTokenBalance, refetchSaleState]);

  const handleBuySuccess = useCallback(() => {
    refetchBalances();
    setSuccessMessage('Tokens purchased successfully!');
  }, [refetchBalances]);

  const handleSellSuccess = useCallback(() => {
    refetchBalances();
    setSuccessMessage('Tokens sold successfully!');
  }, [refetchBalances]);

  const closeBuyModal = useCallback(() => setShowBuyModal(false), []);
  const closeSellModal = useCallback(() => setShowSellModal(false), []);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      {successMessage && <SuccessToast message={successMessage} onClose={() => setSuccessMessage(null)} />}
      <div className="w-full max-w-4xl">
        {!isConnected ? (
          <div className="py-20 text-center">
            <div className="mb-6 inline-block rounded-2xl border border-white/10 bg-linear-to-br from-purple-500/20 to-cyan-500/20 p-6 backdrop-blur-sm">
              <Wallet className="mx-auto h-16 w-16 text-purple-400" />
            </div>
            <h2 className="mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
              Connect Your Wallet
            </h2>
            <p className="mb-8 text-gray-400">Connect your wallet to start trading on Udra&apos;s Store</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Balance tokenName="Sepolia ETH" balance={formattedEthBalance} logo="ETH" />
              <Balance
                tokenName={tokenName}
                balance={formattedTokenBalance}
                logo={tokenSymbol}
                isLoading={isTokenBalanceLoading || isTokenMetadataLoading}
              />
            </div>
            <PriceInfo />
            <SaleStats />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TradeButton
                onClick={() => setShowBuyModal(true)}
                label={`Buy ${tokenName}`}
                description={`Trade ETH for ${tokenName}`}
                type="buy"
              />
              <TradeButton
                onClick={() => setShowSellModal(true)}
                label={`Sell ${tokenName}`}
                description={`Trade ${tokenName} for ETH`}
                type="sell"
              />
            </div>
          </div>
        )}
      </div>
      <BuyModal isOpen={showBuyModal} onClose={closeBuyModal} onSuccess={handleBuySuccess} />
      <SellModal isOpen={showSellModal} onClose={closeSellModal} onSuccess={handleSellSuccess} />
    </div>
  );
}
