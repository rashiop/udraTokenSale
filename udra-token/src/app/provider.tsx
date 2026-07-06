'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

import { config } from '@/config/wagmi';

export function Providers({ children }: { children: React.ReactNode }) {
  /**
   *                           
    - SSR issue: 
    Outside component = created once on server, shared across requests 
    = data leaks between users (A might see B balance cached by server)                                                            
    - Hydration mismatch: Server and client might have different instances
    - Why inside useState:                                                                
      - Created once per client
      - Same instance across re-renders
      - Not recreated on every render    
   */

  const queryClient = useQueryClient(
    new QueryClient({
      defaultOptions: {
        queries: {
          // Prevent refetch on window focus
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions
          theme={lightTheme({
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'large',
          })}
          initialChain={sepolia}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
