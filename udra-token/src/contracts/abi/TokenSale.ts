export const TokenSaleAbi = [
  {
    type: 'function',
    name: 'BASE_UNIT',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'BUY_RATE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'SELL_RATE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'TOKEN',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract CappedToken',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'buy',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getSaleState',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct TokenSale.SaleState',
        components: [
          {
            name: 'tokenReserve',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'ethLiquidity',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'remainingCap',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'maxSupply',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'sell',
    inputs: [
      {
        name: 'sellAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Buy',
    inputs: [
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokensOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'ethIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Sell',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tokensIn',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'ethOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ExceededCap',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailToBuyToken',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailToSellToken',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailToSendEth',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientEthBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientPayment',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientTokenBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoZeroAmount',
    inputs: [],
  },
] as const;
