import createClient from "openapi-fetch";
import type { paths } from "../api";
import {
  KILN_MAINNET_API_KEY,
  KILN_BASE_MAINNET,
  KILN_BASE_TESTNET,
  KILN_TESTNET_API_KEY,
} from "$env/static/private";

const fetcher = {
  mainnet: createClient<paths>({
    baseUrl: KILN_BASE_MAINNET,
    headers: { Authorization: `Bearer ${KILN_MAINNET_API_KEY}` },
  }),
  testnet: createClient<paths>({
    baseUrl: KILN_BASE_TESTNET,
    headers: { Authorization: `Bearer ${KILN_TESTNET_API_KEY}` },
  }),
};

export default fetcher;
