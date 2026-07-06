import { twMerge } from 'tailwind-merge';
import { formatUnits, parseEther, parseUnits } from 'viem';
import { clsx, type ClassValue } from 'clsx';

/**
 * Merge conflict for tailwind classname
 * https://dev.to/sheraz4194/mastering-tailwind-css-overcome-styling-conflicts-with-tailwind-merge-and-clsx-1dol
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format wallet address to readable address
 * @param address - wallet address
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface FormatTokenOptions {
  /** Number of decimals to display (default: 4) */
  displayDecimals?: number;
  /** Show thousand separators (default: true) */
  useGrouping?: boolean;
}

/**
 * Format token amount from wei to human readable
 * @param value - BigInt value in wei
 * @param decimals - Token decimals from contract
 * @param options - Formatting options
 *
 * @example
 * const { decimals } = useTokenMetadata(chainId);
 * formatToken(balance, decimals)           // "1,000.1234"
 * formatToken(balance, decimals, { displayDecimals: 2, useGrouping: true }) // "1,000.12"
 */
export function formatToken(
  value: bigint | undefined | null,
  decimals: number | undefined,
  options: FormatTokenOptions = {}
): string {
  if (!value || !decimals) return '0';

  const { displayDecimals = 4, useGrouping = true } = options;
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
    useGrouping,
  });
}

/**
 * Format ETH amount (always 18 decimals)
 * @param value - BigInt value in wei
 * @param options - Formatting options
 */
export function formatEth(value: bigint | undefined | null, options: FormatTokenOptions = {}): string {
  return formatToken(value, 18, options);
}

export function safeParseEther(value: string): bigint | null {
  try {
    if (!value || value.trim() === '') return null;
    return parseEther(value);
  } catch {
    return null;
  }
}

export function safeParseUnits(value: string, decimals: number): bigint | null {
  try {
    if (!value || value.trim() === '' || decimals === undefined) return null;
    return parseUnits(value, decimals);
  } catch {
    return null;
  }
}

/**
 * Divide two bigints with decimal precision
 * @param numerator
 * @param denominator
 * @param precision - number of decimal places (default: 18)
 * @returns object with text and value properties
 */
export function divideBigInts(numerator: bigint, denominator: bigint, precision = 18): { text: string; value: number } {
  const factor = BigInt(10) ** BigInt(precision);
  const result = (numerator * factor) / denominator;
  const str = result.toString().padStart(precision + 1, '0');
  return {
    text: str.slice(0, -precision) + '.' + str.slice(-precision),
    value: parseFloat(str.slice(0, -precision) + '.' + str.slice(-precision)),
  };
}
