import { page } from "$app/stores";
import { derived } from "svelte/store";

export const NETWORKS = ["mainnet", "goerli"] as const;

export type Network = (typeof NETWORKS)[number];

const network = derived(
  page,
  ($page, set) => {
    let network = NETWORKS.find((network) => $page.url.pathname.startsWith(`/${network}`));
    if (network) set(network);
  },
  "mainnet" as Network
);

export default network;
