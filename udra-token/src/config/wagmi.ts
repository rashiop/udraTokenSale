import { http, fallback, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    // browser's
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Udra Token dApp',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  }
);

export const config = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([
      http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
      http('https://eth-sepolia.public.blastapi.io'),
      http('https://rpc2.sepolia.org'),
      http(),
    ]),
  },
  ssr: true,
});
