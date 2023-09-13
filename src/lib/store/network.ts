import { writable } from "svelte/store";

export const NETWORKS = ["mainnet", "goerli", "holesky"] as const;

export type Network = (typeof NETWORKS)[number];

const network = writable<Network>("mainnet");

export default network;
