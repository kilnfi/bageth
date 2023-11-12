import type { Network } from "$lib/store/network";
import network from "$lib/store/network";
import { format, parse } from "date-fns";
import { get } from "svelte/store";
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
  return formatNumber(Number(formatEther(BigInt(eth))), decimals);
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

export function getRandomRange() {
  const RANDOM_SEARCH: Record<Network, number> = {
    goerli: 500_000,
    mainnet: 800_000,
    holesky: 1_400_000,
  };
  const start = Math.floor(Math.random() * RANDOM_SEARCH[get(network)]);
  const end = start + Math.floor(Math.random() * 100) + 10;
  return `${start}..${end}`;
}

export function formatNumber(number: number, maximumFractionDigits: number = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(number);
}
