# Token Sale System

Capped ERC20 + reserve-aware buy/sell token sale contract (ETH ↔ ERC20) deployed on Sepolia.

## Overview

The Token Sale System provides a simple on-chain marketplace where users can **buy ERC20 tokens with ETH** and **sell tokens back for ETH** at a lower rate. The token supply is **capped**, and minting is **role-gated** to ensure controlled issuance.

### System Components

1. **CappedToken** - ERC20 + Cap + AccessControlDefaultAdminRules
   - Mintable ERC20 token with hard maximum supply enforced via `_update()`
   - Minting restricted to accounts with `MINTER_ROLE`
   - Optional pause/unpause capability via `PAUSER_ROLE`

2. **TokenSale** - Buy/Sell Contract + Ownable2Step
   - Buy tokens via `buy()` or by sending ETH directly (`receive()`)
   - Sell tokens back for ETH using `sell(amount)`
   - Prefers existing token reserves, minting only when insufficient
   - Prevents minting beyond `MAX_SUPPLY`
   - Owner can withdraw tokens and ETH via secure `Ownable2Step`

---

## Architecture

### Technologies

| Category | Technology |
|----------|------------|
| Language | Solidity ^0.8.30 |
| Framework | Foundry |
| Libraries | OpenZeppelin Contracts |
| Testnet | Sepolia |

### OpenZeppelin Dependencies

- `ERC20`, `ERC20Capped`, `ERC20Pausable`
- `AccessControlDefaultAdminRules`
- `Ownable2Step`
- `ReentrancyGuard`

### Project Structure

```
src/
├── CappedToken.sol          # ERC20 token with cap + roles
└── TokenSale.sol            # Buy/sell marketplace

test/
├── CappedToken.t.sol        # Token unit tests
├── TokenSale.base.sol       # Shared test setup + helpers
├── TokenSale.constructor.t.sol
├── TokenSale.buy.t.sol
├── TokenSale.sell.t.sol
├── TokenSale.withdraw.t.sol
├── TokenSale.ownership.t.sol
├── TokenSale.view.t.sol
├── TokenSale.fuzz.t.sol
└── TokenSale.integration.t.sol

script/
└── DeployTokenSale.s.sol    # Deployment script
```

---

## Contracts

### CappedToken.sol

| Feature | Description |
|---------|-------------|
| Standard | ERC20 with capped max supply |
| Cap Enforcement | Via `_update()` override using `ERC20Capped` |
| Access Control | `AccessControlDefaultAdminRules` with 3-day delay |
| Pausable | Optional pause/unpause for emergency stops |

**Roles**

| Role | Permission |
|------|------------|
| `DEFAULT_ADMIN_ROLE` | Manage roles (with time delay) |
| `MINTER_ROLE` | Call `mint(to, amount)` |
| `PAUSER_ROLE` | Call `pause()` / `unpause()` |

### TokenSale.sol

| Feature | Description |
|---------|-------------|
| Buy | Exchange ETH for tokens at `BUY_RATE` |
| Sell | Exchange tokens for ETH at `SELL_RATE` |
| Reserve-First | Uses held tokens before minting |
| Cap Aware | Never mints beyond token cap |
| Ownership | `Ownable2Step` for secure transfers |
| Security | `ReentrancyGuard` + CEI pattern |

**Pricing Formulas**

```
BASE_UNIT = 10^decimals (typically 1e18)

Buy:  tokensOut = ethIn × BASE_UNIT ÷ BUY_RATE
Sell: ethOut = tokensIn × SELL_RATE ÷ BASE_UNIT
```

**View Function for Frontend**

```solidity
struct SaleState {
    uint256 tokenReserve;  // Tokens held by contract
    uint256 ethLiquidity;  // ETH available for sells
    uint256 remainingCap;  // Tokens that can still be minted
    uint256 totalSupply;   // Current total supply
    uint256 maxSupply;     // Token cap
}

function getSaleState() external view returns (SaleState memory);
```

---

## Flows

### Buy Flow

```
User sends ETH → TokenSale.buy() or receive()
                      ↓
         Calculate tokensOut from BUY_RATE
                      ↓
         Check reserve balance
                      ↓
    ┌─────────────────┴─────────────────┐
    ↓                                   ↓
Reserve sufficient              Reserve insufficient
    ↓                                   ↓
Transfer from reserve      Mint deficit (if within cap)
                                        ↓
                           Transfer to user
```

### Sell Flow

```
User approves TokenSale → User calls sell(amount)
                                    ↓
                      Calculate ethOut from SELL_RATE
                                    ↓
                      Check contract ETH balance
                                    ↓
                 ┌──────────────────┴──────────────────┐
                 ↓                                     ↓
        ETH sufficient                        ETH insufficient
                 ↓                                     ↓
    Transfer tokens to reserve              Revert with error
                 ↓
        Send ETH to user
```

---

## Deployment

### Environment Variables

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
TOKEN_NAME="Udra Token"
TOKEN_SYMBOL="UTK"
ADMIN=0xYOUR_ADMIN_ADDRESS
ETHERSCAN_API_KEY=YOUR_API_KEY
CHAIN_ID=11155111
```

### Deploy Commands

```bash
# Load environment
source .env

# Deploy and verify on Sepolia
forge script script/DeployTokenSale.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify \
  --chain-id $CHAIN_ID
```

### Deployed Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| CappedToken | `0x21b0942226368f094386dF5276281ad2e4777509` |
| TokenSale | `0xA026a31B0FFf97E3045FE02ccfF629b079eF4a1b` |
| Admin | `0x405A10A6c4b207946d81a541DAdc76586719390d` |

---

## Testing

### Run Tests

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test file
forge test --match-contract TokenSaleBuyTest

# Run fuzz tests only
forge test --match-contract TokenSaleFuzzTest

# Run on fork
forge test --fork-url sepolia
```

### Test Coverage

| Category | Tests | Description |
|----------|-------|-------------|
| Constructor | 3 | Validation of parameters |
| Buy | 10 | Happy path, events, reverts, reserve logic |
| Sell | 5 | Happy path, events, reverts |
| Withdraw | 8 | Token/ETH withdrawal, access control |
| Ownership | 5 | Ownable2Step transfer flow |
| View | 5 | `getSaleState()` accuracy |
| Fuzz | 5 | Randomized buy/sell/state tests |
| Integration | 4 | Multi-user scenarios |
| CappedToken | 6 | Mint, pause, roles |

**Total: 51 tests**

### Test Features

- **Fuzz Testing** - Randomized inputs with `bound()` constraints
- **Event Testing** - `vm.expectEmit()` for all emitted events
- **Access Control** - Separate tests for unauthorized access

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| Reentrancy Protection | `ReentrancyGuard` modifier |
| CEI Pattern | State changes before external calls |
| Role-Based Access | `AccessControlDefaultAdminRules` |
| Two-Step Ownership | `Ownable2Step` prevents accidental transfers |
| Supply Cap | Enforced at token level via `_update()` |
| Custom Errors | Gas-efficient reverts with clear messages |

### Custom Errors

```solidity
error ExceededCap();
error FailToSendEth();
error FailToBuyToken();
error FailToSellToken();
error FailToWithdrawToken();
error InsufficientTokenBalance();
error InsufficientEthBalance();
error InsufficientPayment();
error NoZeroAmount();
error NoZeroAddress();
error UseBuy();
```

---

## Future Improvements

- [ ] Switch TokenSale transfers to `SafeERC20`
- [ ] Snapshot tests for storage layout (upgrade-safety)
- [x] ~~Fuzz tests for buy/sell~~ ✅ Implemented
- [x] ~~Event emission tests~~ ✅ Implemented
- [x] ~~Ownable2Step tests~~ ✅ Implemented
