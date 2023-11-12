import type { PageServerLoad } from "./$types";
import { createServerClient } from "$lib/server/fetcher";
import { subDays } from "date-fns";
import { formatDate } from "$lib/utils";

export const load = (async ({ fetch, params, setHeaders }) => {
  const network = params.network;
  const fetcher = createServerClient(network, fetch);

  const [rewards, stats, price] = await Promise.all([
    fetcher
      .GET("/v1/eth/rewards", {
        params: { query: { scope: "network" } },
      })
      .then((e) => e.data?.data),
    fetcher
      .GET("/v1/eth/rewards", {
        params: { query: { scope: "network", start_date: formatDate(subDays(new Date(), 1)) } },
      })
      .then((e) => e.data?.data),
    fetcher.GET("/v1/eth/network-stats", {}).then((e) => e.data?.data?.eth_price_usd),
  ]);

  setHeaders({
    "cache-control": `max-age=${60 * 60 * 12}`,
  });

  return { rewards, stats, price };
}) satisfies PageServerLoad;
