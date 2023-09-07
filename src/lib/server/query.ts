import { isAddress } from "viem";
import fetcher from "$lib/server/fetcher";
import type { FetchOptions, FetchResponse, FilterKeys } from "openapi-fetch";
import type { paths } from "$lib/types/api";
import { createRange, isBLS, isIndex, isIndexRange } from "$lib/utils";

type ApiRoutes = "/v1/eth/stakes" | "/v1/eth/rewards" | "/v1/eth/operations";
type Network = "mainnet" | "testnet";

type GetQueryParams<T extends ApiRoutes> = FetchOptions<
  FilterKeys<paths[T], "get">
>["params"]["query"];

type GetResponse<T extends ApiRoutes> = FetchResponse<
  FilterKeys<paths[T], "get">
>["data"];

type QueryStakes = {
  endpoint: "/v1/eth/stakes";
  params?: GetQueryParams<"/v1/eth/stakes">;
};

type QueryRewards = {
  endpoint: "/v1/eth/rewards";
  params?: GetQueryParams<"/v1/eth/rewards">;
};

type QueryOperations = {
  endpoint: "/v1/eth/operations";
  params?: GetQueryParams<"/v1/eth/operations">;
};

type BaseQueryParams = {
  network: Network;
  search: string;
};

type DiscriminatedQuery = QueryStakes | QueryRewards | QueryOperations;

export type QueryParams = BaseQueryParams & DiscriminatedQuery;

export type QueryDataReturnType<T = any> = Promise<{
  url: string;
  data: T;
} | null>;

function queryData(
  params: BaseQueryParams & QueryStakes
): QueryDataReturnType<GetResponse<QueryStakes["endpoint"]>>;
function queryData(
  params: BaseQueryParams & QueryRewards
): QueryDataReturnType<GetResponse<QueryRewards["endpoint"]>>;
function queryData(
  params: BaseQueryParams & QueryOperations
): QueryDataReturnType<GetResponse<QueryOperations["endpoint"]>>;
async function queryData({
  network,
  search,
  endpoint,
  params,
}: QueryParams): QueryDataReturnType {
  // try address (wallet or proxy)
  if (isAddress(search)) {
    // first try wallets
    const reqWallet = await fetcher[network].GET(endpoint, {
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
    const reqProxy = await fetcher[network].GET(endpoint, {
      params: { query: { proxies: [search], ...params } },
    });
    if (reqProxy?.data?.data !== undefined) {
      return { url: reqProxy.response.url, data: reqProxy.data };
    }
  }

  // try validator pubkey
  if (isBLS(search)) {
    const reqBls = await fetcher[network].GET(endpoint, {
      params: { query: { validators: [search], ...params } },
    });
    if (reqBls?.data?.data !== undefined) {
      return { url: reqBls.response.url, data: reqBls.data };
    }
  }

  // try validator index
  if (isIndex(search)) {
    const reqIndex = await fetcher[network].GET(endpoint, {
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

    const data = await fetcher[network].GET(endpoint, {
      params: { query: { validator_indexes: indexRange, ...params } },
    });
    if (data?.data?.data !== undefined) {
      return { url: data.response.url, data: data.data };
    }
  }

  return null;
}

export default queryData;
