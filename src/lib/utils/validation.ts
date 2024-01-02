import type { Network } from "$lib/store/network";
import type { Address } from "viem";

const blsRegex = /^0x[a-fA-F0-9]{96}$/;

export function isBLS(bls: string): bls is Address {
  return blsRegex.test(bls);
}

const indexRegex = /^[0-9]+$/;

export function isIndex(index: string) {
  return indexRegex.test(index);
}

export function isIndexRange(index: string): index is `${string}..${string}` {
  if (!index.includes("..")) return false;
  const range = index.split("..");
  return range.length === 2 && range.every((x) => isIndex(x));
}

export function isNetwork(network: string): network is Network {
  return network === "mainnet" || network === "goerli" || network === "holesky";
}

export function parseNetwork(network: unknown): Network {
  return typeof network === "string" && isNetwork(network) ? network : "mainnet";
}

export function isKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

export const OPERATIONS_TAB = ["consensus_withdrawal", "deposit", "execution_reward"] as const;

export type Operation = (typeof OPERATIONS_TAB)[number];

export function isOperationType(tab: unknown): tab is Operation {
  return typeof tab === "string" && OPERATIONS_TAB.includes(tab as any);
}

export function parseOperationType(tab: unknown): Operation {
  return typeof tab === "string" && isOperationType(tab) ? tab : "deposit";
}
