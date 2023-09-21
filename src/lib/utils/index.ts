import { format, parse } from "date-fns";
import { formatEther } from "viem";

export function createRange(start: number, end: number, max = 1_000): number[] | null {
  try {
    const size = end - start + 1;

    if (size > max) return null;

    return [...Array(size)].map((_, i) => i + start);
  } catch {
    return null;
  }
}

export function formatWithdrawalCredentials(withdrawal_credentials: string) {
  return withdrawal_credentials.replace("010000000000000000000000", "0x").toLowerCase();
}

export function formatAddress(address: string, length = 5) {
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatEth(eth: string, decimals = 4) {
  return parseFloat(formatEther(BigInt(eth))).toFixed(decimals);
}

export function formatDate(date: string | Date) {
  return format(date instanceof Date ? date : new Date(date), "yyyy-MM-dd");
}

export function parseDate(date: string) {
  return parse(date, "yyyy-MM-dd", new Date());
}

export function reverseObject<T extends PropertyKey, K extends PropertyKey>(object: Record<T, K>): Record<K, T> {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
}
