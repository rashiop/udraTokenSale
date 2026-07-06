// UI timing
export const TOAST_AUTO_DISMISS_MS = 5000;

// React Query cache durations
export const CACHE_TIME = {
  DYNAMIC: 60_000, // 60 seconds for data that changes (balances, sale state)
  STATIC: Infinity, // Never expires for immutable data (symbol, name, decimals, rates)
} as const;

export const ERROR_MESSAGES = {
  USER_REJECTED: 'Transaction rejected',
  TRANSACTION_FAILED: 'Transaction failed',
  INSUFFICIENT_ETH: 'Insufficient ETH balance',
  INSUFFICIENT_TOKENS: 'Insufficient token balance',
} as const;

export const isUserRejectedError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return message.includes('user rejected') || message.includes('user denied');
};
