import { isAddress } from "viem";
import type { newFetcher } from "$lib/server/fetcher";
import type { paths } from "$lib/types/api";
import { createRange } from "$lib/utils";
import { isBLS, isIndex, isIndexRange } from "$lib/utils/validation";

type ApiRoutes = "/v1/eth/stakes" | "/v1/eth/rewards" | "/v1/eth/operations";
type Network = "mainnet" | "testnet";

type QueryParams<T extends ApiRoutes> = {
  fetcher: ReturnType<typeof newFetcher>;
  search: string;
  endpoint: T;
  params?: paths[T]["get"]["parameters"]["query"];
};

type ReturnData<T extends ApiRoutes> = Promise<{
  url: string;
  data: paths[T]["get"]["responses"][200]["content"]["application/json; charset=utf-8"];
} | null>;

function queryData({}: QueryParams<"/v1/eth/stakes">): ReturnData<"/v1/eth/stakes">;
function queryData({}: QueryParams<"/v1/eth/rewards">): ReturnData<"/v1/eth/rewards">;
function queryData({}: QueryParams<"/v1/eth/operations">): ReturnData<"/v1/eth/operations">;

async function queryData({ fetcher, search, endpoint, params }: QueryParams<ApiRoutes>): ReturnData<ApiRoutes> {
  // try address (wallet or proxy)
  if (isAddress(search)) {
    // first try wallets
    const reqWallet = await fetcher.GET(endpoint, {
      params: { query: { wallets: [search], ...params } },
    });
    if (
      // here we check if the data is empty and not undefined
      reqWallet?.data?.data !== undefined &&
      reqWallet?.data?.data.length !== 0
    ) {
      return { url: reqWallet.response.url, data: reqWallet.data };
    }

    // then try proxies
    const reqProxy = await fetcher.GET(endpoint, {
      params: { query: { proxies: [search], ...params } },
    });
    if (reqProxy?.data?.data !== undefined) {
      return { url: reqProxy.response.url, data: reqProxy.data };
    }
  }

  // try validator pubkey
  if (isBLS(search)) {
    const reqBls = await fetcher.GET(endpoint, {
      params: { query: { validators: [search], ...params } },
    });
    if (reqBls?.data?.data !== undefined) {
      return { url: reqBls.response.url, data: reqBls.data };
    }
  }

  // try validator index
  if (isIndex(search)) {
    const reqIndex = await fetcher.GET(endpoint, {
      params: { query: { validator_indexes: [Number(search)], ...params } },
    });
    if (reqIndex?.data?.data !== undefined) {
      return { url: reqIndex.response.url, data: reqIndex.data };
    }
  }

  // validator index range
  if (isIndexRange(search)) {
    const range = search.split("..");
    const indexRange = createRange(Number(range[0]), Number(range[1]));

    if (indexRange === null) {
      return null;
    }

    const data = await fetcher.GET(endpoint, {
      params: { query: { validator_indexes: indexRange, ...params } },
    });
    if (data?.data?.data !== undefined) {
      return { url: data.response.url, data: data.data };
    }
  }

  return null;
}

export default queryData;
