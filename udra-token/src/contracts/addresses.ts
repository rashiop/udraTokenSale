import { SEPOLIA_CHAIN_ID } from '@/config/contracts';
import type { Address } from 'viem';

export const CONTRACT_ADDRESSES = {
  sepolia: {
    cappedToken: process.env.NEXT_PUBLIC_CAPPED_TOKEN_ADDRESS as Address | undefined,
    tokenSale: process.env.NEXT_PUBLIC_TOKEN_SALE_ADDRESS as Address | undefined,
  },
} as const;

export function getContractAddress(contract: 'cappedToken' | 'tokenSale', chainId: number): Address | undefined {
  if (chainId === SEPOLIA_CHAIN_ID) {
    return CONTRACT_ADDRESSES.sepolia[contract];
  }
  return undefined;
}

export function hasValidContracts(chainId: number): boolean {
  if (chainId === SEPOLIA_CHAIN_ID) {
    const isValidContract = Boolean(CONTRACT_ADDRESSES.sepolia.cappedToken && CONTRACT_ADDRESSES.sepolia.tokenSale);
    return isValidContract;
  }
  return false;
}
