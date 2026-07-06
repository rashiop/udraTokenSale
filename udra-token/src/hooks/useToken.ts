'use client';

import { useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

import { CappedTokenAbi, getContractAddress } from '@/contracts';

import { CACHE_TIME } from '@/config/constants';

/**
 * Hook to read static token metadata (symbol, name, decimals).
 * Cached data indefinitely
 */
export function useTokenMetadata(chainId: number) {
  const tokenAddress = getContractAddress('cappedToken', chainId);

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: tokenAddress, abi: CappedTokenAbi, functionName: 'symbol' },
      { address: tokenAddress, abi: CappedTokenAbi, functionName: 'name' },
      { address: tokenAddress, abi: CappedTokenAbi, functionName: 'decimals' },
    ],
    query: {
      enabled: !!tokenAddress,
      staleTime: CACHE_TIME.STATIC,
      gcTime: CACHE_TIME.STATIC,
    },
  });

  return {
    symbol: data?.[0]?.result as string | undefined,
    tokenName: data?.[1]?.result as string | undefined,
    decimals: data?.[2]?.result as number | undefined,
    isLoading,
    hasContract: !!tokenAddress,
  };
}

/**
 * Hook to read dynamic token data (balance, allowance)
 */
export function useTokenBalance(chainId: number, userAddress?: `0x${string}`) {
  const tokenAddress = getContractAddress('cappedToken', chainId);
  const tokenSaleAddress = getContractAddress('tokenSale', chainId);

  const { data, refetch, isLoading } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: CappedTokenAbi,
        functionName: 'balanceOf',
        args: userAddress ? [userAddress] : undefined,
      },
      {
        address: tokenAddress,
        abi: CappedTokenAbi,
        functionName: 'allowance',
        args: userAddress && tokenSaleAddress ? [userAddress, tokenSaleAddress] : undefined,
      },
    ],
    query: {
      enabled: !!tokenAddress && !!userAddress,
      staleTime: CACHE_TIME.DYNAMIC,
    },
  });

  return {
    balance: data?.[0]?.result as bigint | undefined,
    allowance: data?.[1]?.result as bigint | undefined,
    refetch,
    isLoading,
  };
}

/**
 * Write hooks to approve token
 */
export function useApproveToken() {
  const { mutate, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
    mutate({
      address: tokenAddress,
      abi: CappedTokenAbi,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
