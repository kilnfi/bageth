import { page } from "$app/stores";
import { derived } from "svelte/store";

export const NETWORKS = ["mainnet", "goerli", "holesky"] as const;

export type Network = (typeof NETWORKS)[number];

const network = derived(
  page,
  ($page, set) => {
    for (const network of NETWORKS) {
      if ($page.url.pathname.startsWith(`/${network}`)) {
        set(network);
        break;
      }
    }
  },
  "goerli" as Network
);

export default network;
