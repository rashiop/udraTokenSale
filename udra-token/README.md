# Udra's Store

A decentralized token sale platform built on Ethereum's Sepolia testnet. Trade Udra tokens seamlessly with ETH.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2
- **Styling:** Tailwind CSS 4
- **Web3:**
  - wagmi v3 - React hooks for Ethereum
  - viem - TypeScript Ethereum library
  - RainbowKit - Wallet connection UI
- **State Management:** TanStack Query

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- A WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url  # optional
```

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

If you encounter memory issues, the dev script already includes increased Node.js memory limits. You can also run:

```bash
pnpm dev:clean  # clears .next cache and starts fresh
```

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page (trading interface)
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   └── provider.tsx        # Web3 providers (Wagmi, RainbowKit, React Query)
├── config/
│   ├── constants.ts        # App constants
│   ├── contracts.ts        # Contract configuration
│   └── wagmi.ts            # Wagmi/RainbowKit configuration
├── contracts/
│   ├── abi/                # Contract ABIs
│   └── addresses.ts        # Deployed contract addresses
├── hooks/
│   ├── useToken.ts         # Token read/approve hooks
│   ├── useTokenSale.ts     # Token sale read/buy/sell hooks
│   └── useMounted.ts       # SSR hydration helper
├── lib/
│   └── utils.ts            # Utility functions (cn)
└── ui/
    ├── atoms/              # Small reusable components
    │   ├── Skeleton.tsx
    │   ├── SuccessToast.tsx
    │   └── TradeButton.tsx
    ├── molecules/          # Composed components
    │   ├── Balance.tsx
    │   ├── Modal.tsx
    │   ├── PriceInfo.tsx
    │   └── SaleStats.tsx
    ├── organisms/          # Complex components
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── BuyModal.tsx
    │   └── SellModal.tsx
    └── font.ts             # Font configuration
```

## Features

- Connect wallet via RainbowKit (MetaMask, WalletConnect, etc.)
- View ETH and token balances
- Buy tokens with ETH
- Sell tokens for ETH
- View token sale statistics
- Responsive design

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm dev:clean` | Clear cache and start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm typecheck` | Run TypeScript type checking |

## Network

This application is configured for **Sepolia testnet** only. Get testnet ETH from:

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

## License
MIT
