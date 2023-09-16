import type { PageServerLoad } from "./$types";
import queryData from "$lib/server/query";
import { newFetcher } from "$lib/server/fetcher";
import type { Network } from "$lib/store/network";
import { error } from "@sveltejs/kit";
import { isBLS } from "$lib/utils/validation";
import { formatDate } from "$lib/utils";
import { subMonths } from "date-fns";

export const load = (async ({ url, fetch, params }) => {
  const network = params.network as Network;
  const search = url.searchParams.get("search");
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;

  if (!search) return;

  const fetcher = newFetcher(network, fetch);
  const data = await queryData({
    fetcher,
    search,
    endpoint: "/v1/eth/stakes",
    params: { current_page, page_size },
  });

  if (isBLS(search) && data && data.data.data?.length === 1) {
    const start_date = url.searchParams.get("start_date") || formatDate(subMonths(new Date(), 1));
    const end_date = url.searchParams.get("end_date") || formatDate(new Date());

    const rewards = await queryData({
      fetcher,
      search,
      endpoint: "/v1/eth/rewards",
      params: { start_date, end_date },
    });
    return { ...data, rewards: rewards?.data.data };
  }

  if (data !== null) return data;

  throw error(404, `Error: "${search}" is not a valid Address, BLS or Index`);
}) satisfies PageServerLoad;
