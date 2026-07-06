'use client';

import { useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { TokenSaleAbi, getContractAddress } from '@/contracts/';

import { safeParseEther } from '@/lib/utils';

import { CACHE_TIME } from '@/config/constants';

/**
 * Hook to read static sale rates (BUY_RATE, SELL_RATE).
 * Data is cached indefinitely since rates are immutable.
 */
export function useSaleRates(chainId: number) {
  const tokenSaleAddress = getContractAddress('tokenSale', chainId);

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: tokenSaleAddress, abi: TokenSaleAbi, functionName: 'BUY_RATE' },
      { address: tokenSaleAddress, abi: TokenSaleAbi, functionName: 'SELL_RATE' },
    ],
    query: {
      enabled: !!tokenSaleAddress,
      staleTime: CACHE_TIME.STATIC,
      gcTime: CACHE_TIME.STATIC,
    },
  });

  return {
    buyRate: data?.[0]?.result as bigint | undefined,
    sellRate: data?.[1]?.result as bigint | undefined,
    isLoading,
    hasContract: !!tokenSaleAddress,
  };
}

/**
 * Hook for dynamic sale state
 */
export function useTokenSaleState(chainId: number) {
  const tokenSaleAddress = getContractAddress('tokenSale', chainId);

  const {
    data: saleState,
    refetch: refetchSaleState,
    isLoading: isSaleStateLoading,
  } = useReadContract({
    address: tokenSaleAddress,
    abi: TokenSaleAbi,
    functionName: 'getSaleState',
    query: {
      enabled: !!tokenSaleAddress,
      staleTime: CACHE_TIME.DYNAMIC,
    },
  });

  return {
    saleState,
    refetchSaleState,
    isLoading: isSaleStateLoading,
  };
}

export function useBuyTokens() {
  const { mutate, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buy = (address: `0x${string}`, ethAmount: string) => {
    const weiAmount = safeParseEther(ethAmount);
    mutate({
      address,
      abi: TokenSaleAbi,
      functionName: 'buy',
      value: weiAmount ?? BigInt(0),
    });
  };

  return {
    buy,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

export function useSellTokens() {
  const { mutate, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sell = (address: `0x${string}`, tokenAmount: bigint) => {
    mutate({
      address,
      abi: TokenSaleAbi,
      functionName: 'sell',
      args: [tokenAmount],
    });
  };

  return {
    sell,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
