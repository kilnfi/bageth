import type { PageServerLoad } from "./$types";
import { createServerClient } from "$lib/server/fetcher";
import { subDays } from "date-fns";
import { formatDate } from "$lib/utils";

export const load = (async ({ fetch, params }) => {
  const network = params.network;
  const fetcher = createServerClient(network, fetch);

  const rewards = await fetcher.GET("/v1/eth/rewards", { params: { query: { scope: "network" } } });

  const stats = await fetcher.GET("/v1/eth/rewards", {
    params: { query: { scope: "network", start_date: formatDate(subDays(new Date(), 1)) } },
  });

  const price = await fetcher.GET("/v1/eth/network-stats", {});

  return { rewards: rewards.data, stats: stats.data, price: price.data?.data?.eth_price_usd };
}) satisfies PageServerLoad;
