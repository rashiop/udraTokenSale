# Udra Token Sale Platform

A full-stack decentralized token sale application featuring Solidity smart contracts and a Next.js frontend, deployed on Ethereum Sepolia testnet.

## Overview

Udra Token Sale Platform allows users to buy ERC20 tokens with ETH and sell tokens back for ETH.
The system includes a capped token with role-based access control and a reserve-aware sale contract that prefers existing reserves over minting.

## Repository Structure

```
module-5/
├── contract/               # Solidity smart contracts (Foundry)
│   ├── src/
│   │   ├── CappedToken.sol    # ERC20 token with cap + roles
│   │   └── TokenSale.sol      # Buy/sell marketplace
│   ├── test/                  # Comprehensive test suite (51 tests)
│   ├── script/                # Deployment scripts
│   └── README.md              # Contract documentation
│
└── udra-token/             # Next.js frontend
    ├── src/
    │   ├── app/               # Pages and layouts
    │   ├── hooks/             # Web3 React hooks
    │   ├── contracts/         # ABIs and addresses
    │   └── ui/                # Components (atoms/molecules/organisms)
    └── README.md              # Frontend documentation
```

## Tech Stack

### Smart Contracts

| Category | Technology |
|----------|------------|
| Language | Solidity ^0.8.30 |
| Framework | Foundry |
| Libraries | OpenZeppelin Contracts |
| Network | Sepolia Testnet |

### Frontend

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| React | 19.2 |
| Styling | Tailwind CSS 4 |
| Web3 | wagmi v3, viem, RainbowKit |
| State | TanStack Query |

## Smart Contracts

### CappedToken

ERC20 token with:
- Hard cap on maximum supply
- Role-based minting (`MINTER_ROLE`)
- Pausable transfers (`PAUSER_ROLE`)
- Admin role with 3-day transfer delay

### TokenSale

Buy/sell marketplace with:
- Fixed buy/sell rates (spread creates revenue)
- Reserve-first logic (uses held tokens before minting)
- Cap-aware minting (never exceeds token cap)
- Secure ownership via `Ownable2Step`
- Reentrancy protection

### Deployed Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| CappedToken | `0x21b0942226368f094386dF5276281ad2e4777509` |
| TokenSale | `0xA026a31B0FFf97E3045FE02ccfF629b079eF4a1b` |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Foundry (for contracts)
- WalletConnect Project ID

### Contract Development

```bash
cd contract

# Install dependencies
forge install

# Run tests
forge test

# Run tests with verbosity
forge test -vvv

# Deploy to Sepolia
source .env
forge script script/DeployTokenSale.s.sol --rpc-url sepolia --broadcast --verify
```

### Frontend Development

```bash
cd udra-token

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your WalletConnect Project ID

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

### Contract (.env)

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
TOKEN_NAME="Udra Token"
TOKEN_SYMBOL="UTK"
ADMIN=0xYOUR_ADMIN_ADDRESS
ETHERSCAN_API_KEY=YOUR_API_KEY
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

## Features

### Smart Contract Features

- Capped ERC20 token with role-based access
- Buy tokens with ETH at fixed rate
- Sell tokens back for ETH at fixed rate
- Reserve-aware minting strategy
- Comprehensive test coverage (51 tests)
- Fuzz testing for edge cases

### Frontend Features

- Wallet connection via RainbowKit
- Real-time balance display
- Buy/sell token interface
- Transaction status feedback
- Contract state visualization
- Responsive dark theme

## Testing

### Contract Tests

```bash
cd contract

# Run all tests
forge test

# Run specific test file
forge test --match-contract TokenSaleBuyTest

# Run fuzz tests
forge test --match-contract TokenSaleFuzzTest

# Coverage report
forge coverage
```

### Test Coverage

| Category | Tests |
|----------|-------|
| Constructor | 3 |
| Buy | 10 |
| Sell | 5 |
| Withdraw | 8 |
| Ownership | 5 |
| View | 5 |
| Fuzz | 5 |
| Integration | 4 |
| CappedToken | 6 |
| **Total** | **51** |

## Security

- ReentrancyGuard on all state-changing functions
- CEI (Checks-Effects-Interactions) pattern
- Role-based access control with time delays
- Two-step ownership transfers
- Supply cap enforced at token level
- Custom errors for gas efficiency

## Documentation

- [Contract README](./contract/README.md) - Detailed smart contract documentation
- [Frontend README](./udra-token/README.md) - Frontend setup and architecture

## License

MIT
