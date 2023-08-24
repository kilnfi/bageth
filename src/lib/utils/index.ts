import { formatEther, type Address } from "viem";

const blsRegex = /^0x[a-fA-F0-9]{96}$/;

export function isBLS(bls: string): bls is Address {
  return blsRegex.test(bls);
}

const indexRegex = /^[0-9]+$/;

export function isIndex(index: string) {
  return indexRegex.test(index);
}

export function isIndexRange(index: string) {
  const range = index.split("..");
  return range.length === 2 && range.every((x) => isIndex(x))
}

export function validateNetwork(
  network: string | null
): network is "mainnet" | "testnet" {
  return network !== null && (network === "mainnet" || network === "testnet");
}

export function validateType(
  type: string | null
): type is "stakes" | "rewards" | "operations" {
  return (
    type !== null &&
    (type === "stakes" || type === "rewards" || type === "operations")
  );
}

export function isKeyOf<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return key in obj;
}

export const OPERATIONS_TAB_MAPPING = {
  withdrawals: "consensus_withdrawal",
  deposit: "deposit",
  rewards: "execution_reward",
} as const;

export function getOperationType(
  tab: string | null
): "consensus_withdrawal" | "deposit" | "execution_reward" {
  return tab && isKeyOf(OPERATIONS_TAB_MAPPING, tab)
    ? OPERATIONS_TAB_MAPPING[tab]
    : OPERATIONS_TAB_MAPPING["withdrawals"];
}

export function formatWithdrawalCredentials(withdrawal_credentials: string) {
  return withdrawal_credentials
    .replace("010000000000000000000000", "0x")
    .toLowerCase();
}

export function formatAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export function formatEth(eth: string, decimals = 4) {
  return parseFloat(formatEther(BigInt(eth))).toFixed(decimals);
}
