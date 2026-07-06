import type { Address } from 'viem';

import { CappedTokenAbi, TokenSaleAbi } from '@/contracts/';

export const SEPOLIA_CHAIN_ID = process.env.NEXT_PUBLIC_ENABLE_TESTNETS ? 11155111 : undefined;

export const CONTRACT_ADDRESSES = {
  sepolia: {
    cappedToken: {
      address: process.env.NEXT_PUBLIC_CAPPED_TOKEN_ADDRESS as Address,
      abi: CappedTokenAbi,
    },
    tokenSale: {
      address: process.env.NEXT_PUBLIC_TOKEN_SALE_ADDRESS as Address,
      abi: TokenSaleAbi,
    },
  },
} as const;
