import createClient from "openapi-fetch";
import type { paths } from "../types/api";
import {
  KILN_MAINNET_API_KEY,
  KILN_BASE_MAINNET,
  KILN_BASE_GOERLI,
  KILN_BASE_HOLESKY,
  KILN_GOERLI_API_KEY,
  KILN_HOLESKY_API_KEY,
} from "$env/static/private";
import type { Network } from "$lib/store/network";
import type { PageServerLoadEvent } from "../../routes/[network=network]/$types";

const BASE_URL: Record<Network, string> = {
  goerli: KILN_BASE_GOERLI,
  holesky: KILN_BASE_HOLESKY,
  mainnet: KILN_BASE_MAINNET,
};

const API_TOKENS: Record<Network, string> = {
  goerli: KILN_GOERLI_API_KEY,
  holesky: KILN_HOLESKY_API_KEY,
  mainnet: KILN_MAINNET_API_KEY,
};

export const createServerClient = (network: Network, fetcher: PageServerLoadEvent["fetch"]) => {
  return createClient<paths>({
    baseUrl: BASE_URL[network],
    headers: { Authorization: `Bearer ${API_TOKENS[network]}` },
    fetch: fetcher,
  });
};

export type Fetcher = ReturnType<typeof createServerClient>;
