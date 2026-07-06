'use client';

import { useEffect, useMemo, useState } from 'react';
import { useConnection, useChainId } from 'wagmi';

import { useSellTokens, useApproveToken, useTokenMetadata, useTokenBalance, useSaleRates } from '@/hooks';
import { getContractAddress } from '@/contracts';
import { formatEth, formatToken, safeParseUnits } from '@/lib/utils';

import Modal from '@/ui/molecules/Modal';

import { ERROR_MESSAGES, isUserRejectedError } from '@/config/constants';

export interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SellModal({ isOpen, onClose, onSuccess }: SellModalProps) {
  const chainId = useChainId();
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { address, isConnected } = useConnection();
  const { symbol, tokenName, decimals = 18 } = useTokenMetadata(chainId);
  const { balance: tokenBalance, allowance, refetch } = useTokenBalance(chainId, address);

  const { sellRate, hasContract } = useSaleRates(chainId);
  const {
    sell,
    isPending: isSellPending,
    isConfirming: isSellConfirming,
    isSuccess: isSellSuccess,
    error: sellError,
    reset: resetSell,
  } = useSellTokens();
  const {
    approve,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isSuccess: isApproveSuccess,
    error: approveError,
    reset: resetApprove,
  } = useApproveToken();

  const amountInWei = safeParseUnits(amount, decimals) ?? BigInt(0);

  // Check if approval is needed
  const needsApproval = amountInWei > BigInt(0) && (!allowance || (allowance as bigint) < amountInWei);

  // Calculate ETH received
  const weiReceived = useMemo(() => {
    if (!amountInWei || !sellRate) return BigInt(0);
    return (amountInWei * (sellRate as bigint)) / BigInt(10 ** 18);
  }, [amountInWei, sellRate]);

  const formattedEthReceived = formatEth(weiReceived);

  // Format max balance for display
  const maxBalance = formatToken(tokenBalance as bigint, decimals, { useGrouping: true });
  const handleMax = () => {
    if (validationError) setValidationError(null);
    setAmount(maxBalance);
  };

  // Track if we're waiting for allowance refetch after approval
  const [isRefetching, setIsRefetching] = useState(false);

  // Handle successful approval - refetch allowance and wait for it
  useEffect(() => {
    if (isApproveSuccess) {
      setIsRefetching(true);
      refetch().finally(() => {
        setIsRefetching(false);
        resetApprove();
      });
    }
  }, [isApproveSuccess, refetch, resetApprove]);

  // Handle successful sell
  useEffect(() => {
    if (isSellSuccess) {
      setAmount('');
      resetSell();
      onSuccess();
      onClose();
    }
  }, [isSellSuccess, resetSell, onClose, onSuccess]);

  const handleApprove = () => {
    if (!decimals || !amountInWei) return;

    const tokenAddress = getContractAddress('cappedToken', chainId);
    const tokenSaleAddress = getContractAddress('tokenSale', chainId);
    if (!tokenAddress || !tokenSaleAddress) return;

    // Approve the exact amount in wei (not the raw input number)
    approve(tokenAddress, tokenSaleAddress, amountInWei);
  };

  const handleSell = () => {
    if (!amount || !sellRate || !decimals) return;

    const tokenSaleAddress = getContractAddress('tokenSale', chainId);
    if (!tokenSaleAddress) return;

    // Check if user has enough tokens
    const insufficientBalance = tokenBalance && amountInWei > tokenBalance;
    if (insufficientBalance) {
      setValidationError(ERROR_MESSAGES.INSUFFICIENT_TOKENS);
      return;
    }

    sell(tokenSaleAddress, amountInWei);
  };

  const isPending = isApprovePending || isSellPending;
  const isConfirming = isApproveConfirming || isSellConfirming || isRefetching;
  const error = approveError || sellError;

  const handleModalClose = () => {
    setAmount('');
    setValidationError(null);
    resetSell();
    resetApprove();
    onClose();
  };

  if (!hasContract || !address || !sellRate) return null;

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isApprovePending) return 'Approve in wallet...';
    if (isApproveConfirming || isRefetching) return 'Approving...';
    if (isSellPending) return 'Confirm in wallet...';
    if (isSellConfirming) return 'Processing...';
    if (needsApproval) return 'Approve Token';
    return 'Confirm Sell';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      header={
        <h3 className="bg-linear-to-r from-slate-300 to-slate-400 bg-clip-text text-2xl font-bold text-transparent">
          Sell {tokenName}
        </h3>
      }
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-gray-400">Amount of {tokenName}</label>
          <button
            type="button"
            onClick={handleMax}
            className="cursor-pointer text-xs text-purple-400 transition-colors hover:text-purple-300"
          >
            Max: {maxBalance}
          </button>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              if (validationError) setValidationError(null);
              const value = e.target.value;
              const isPositiveNumber = value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0);
              if (isPositiveNumber) {
                setAmount(value);
              }
            }}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-16 transition-colors focus:border-slate-500/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleMax}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs font-medium transition-colors hover:bg-slate-600"
          >
            MAX
          </button>
        </div>
      </div>

      {amount && Number(amount) > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-400">You pay</span>
            <span className="font-bold">
              {amount} {symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You receive</span>
            <span className="font-bold">{formattedEthReceived} ETH</span>
          </div>
        </div>
      )}

      {needsApproval && amount && Number(amount) > 0 && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-900/20 p-3 text-sm text-yellow-400">
          You need to approve the contract to spend your tokens first.
        </div>
      )}

      {(error || validationError) && (
        <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-3 text-sm text-red-400">
          {validationError ||
            (error && isUserRejectedError(error) ? ERROR_MESSAGES.USER_REJECTED : ERROR_MESSAGES.TRANSACTION_FAILED)}
        </div>
      )}

      <button
        onClick={needsApproval ? handleApprove : handleSell}
        disabled={!isConnected || !amount || Number(amount) <= 0 || isPending || isConfirming}
        className="w-full cursor-pointer rounded-lg bg-linear-to-r from-slate-700 to-slate-800 py-4 shadow-lg transition-all hover:from-slate-600 hover:to-slate-700 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
      >
        {getButtonText()}
      </button>
    </Modal>
  );
}
