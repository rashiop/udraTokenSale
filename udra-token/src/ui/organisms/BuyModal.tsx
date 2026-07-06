'use client';

import { useEffect, useMemo, useState } from 'react';
import { useConnection, useBalance, useChainId } from 'wagmi';

import { getContractAddress } from '@/contracts';
import { useSaleRates, useBuyTokens, useTokenMetadata } from '@/hooks';
import { formatEth, safeParseEther } from '@/lib/utils';

import Modal from '@/ui/molecules/Modal';

import { ERROR_MESSAGES, isUserRejectedError } from '@/config/constants';
export interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuyModal({ isOpen, onClose, onSuccess }: BuyModalProps) {
  const chainId = useChainId();
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { address, isConnected } = useConnection();
  const { data: balance } = useBalance({ address });
  const { symbol, tokenName } = useTokenMetadata(chainId);
  const { buyRate, hasContract } = useSaleRates(chainId);

  const { buy, isPending, isConfirming, isSuccess, error, reset } = useBuyTokens();

  // Calculate ETH cost based on token amount and sell rate (memoized)
  const weiCost = useMemo(() => {
    if (!amount || !buyRate) return BigInt(0);
    try {
      return BigInt(amount) * (buyRate as bigint);
    } catch {
      return BigInt(0);
    }
  }, [amount, buyRate]);

  const formattedEthCost = formatEth(weiCost, { useGrouping: true });

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      reset();
      onSuccess();
      onClose();
    }
  }, [isSuccess, reset, onClose, onSuccess]);

  const handleBuy = () => {
    if (!amount || !buyRate) return;

    const tokenSaleAddress = getContractAddress('tokenSale', chainId);
    if (!tokenSaleAddress) return;

    // Validate ETH amount can be parsed
    const parsedEth = safeParseEther(formattedEthCost);
    if (!parsedEth) {
      setValidationError('Invalid amount');
      return;
    }

    const hasInsufficientBalance = !balance?.value || weiCost > balance.value;
    if (hasInsufficientBalance) {
      setValidationError(ERROR_MESSAGES.INSUFFICIENT_ETH);
      return;
    }

    buy(tokenSaleAddress, formattedEthCost);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationError) setValidationError(null);
    const value = e.target.value;
    const isPositiveInteger = value === '' || /^\d+$/.test(value);
    if (isPositiveInteger) setAmount(value);
  };

  const handleModalClose = () => {
    setAmount('');
    setValidationError(null);
    reset();
    onClose();
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isPending) return 'Confirm in wallet...';
    if (isConfirming) return 'Processing...';
    return 'Buy Tokens';
  };

  if (!hasContract || !address || !buyRate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      header={
        <h3 className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
          Buy {tokenName}
        </h3>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-400">Amount of {symbol}</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          min="1"
          step="1"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-blue-500/50 focus:outline-none"
        />
      </div>

      {amount && Number(amount) > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-400">You pay</span>
            <span className="font-bold">{formattedEthCost} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You receive</span>
            <span className="font-bold">
              {amount} {symbol}
            </span>
          </div>
        </div>
      )}

      {(error || validationError) && (
        <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-3 text-sm text-red-400">
          {validationError ||
            (error && isUserRejectedError(error) ? ERROR_MESSAGES.USER_REJECTED : ERROR_MESSAGES.TRANSACTION_FAILED)}
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={!isConnected || !amount || Number(amount) <= 0 || isPending || isConfirming}
        className="w-full cursor-pointer rounded-lg bg-linear-to-r from-blue-600 to-blue-700 py-4 shadow-lg transition-all hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
      >
        {getButtonText()}
      </button>
    </Modal>
  );
}
