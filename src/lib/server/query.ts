import { isAddress } from "viem";
import fetcher from "$lib/server/fetcher";
import type { FetchOptions, FetchResponse, FilterKeys } from "openapi-fetch";
import type { paths } from "$lib/api";
import { isBLS, isIndex } from "$lib/utils";

type ApiRoutes = "/v1/eth/stakes" | "/v1/eth/rewards" | "/v1/eth/operations";
type Network = "mainnet" | "testnet";

type GetQueryParams<T extends ApiRoutes> = FetchOptions<
  FilterKeys<paths[T], "get">
>["params"]["query"];

type GetResponseType<T extends ApiRoutes> = FetchResponse<
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
): QueryDataReturnType<GetResponseType<QueryStakes["endpoint"]>>;
function queryData(
  params: BaseQueryParams & QueryRewards
): QueryDataReturnType<GetResponseType<QueryRewards["endpoint"]>>;
function queryData(
  params: BaseQueryParams & QueryOperations
): QueryDataReturnType<GetResponseType<QueryOperations["endpoint"]>>;
async function queryData({
  network,
  search,
  endpoint,
  params,
}: QueryParams): QueryDataReturnType {
  // try address (wallet or proxy)
  if (isAddress(search)) {
    // first try wallets
    const data = await fetcher[network].GET(endpoint, {
      params: { query: { wallets: [search], ...params } },
    });
    // here we check if the data is empty and not undefined
    if (data?.data?.data !== undefined && data?.data?.data.length !== 0) {
      return { url: data.response.url, data: data.data };
    }

    // then try proxies
    const data2 = await fetcher[network].GET(endpoint, {
      params: { query: { proxies: [search], ...params } },
    });
    if (data2?.data?.data !== undefined) {
      return { url: data2.response.url, data: data2.data };
    }
  }

  // try validator pubkey
  if (isBLS(search)) {
    const data = await fetcher[network].GET(endpoint, {
      params: { query: { validators: [search], ...params } },
    });
    if (data?.data?.data !== undefined) {
      return { url: data.response.url, data: data.data };
    }
  }

  // try validator index
  if (isIndex(search)) {
    const data = await fetcher[network].GET(endpoint, {
      params: { query: { validator_indexes: [Number(search)], ...params } },
    });
    if (data?.data?.data !== undefined) {
      return { url: data.response.url, data: data.data };
    }
  }

  return null;
}

export default queryData;
