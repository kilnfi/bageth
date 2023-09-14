import type { PageServerLoad } from "./$types";
import queryData from "$lib/server/query";
import { newFetcher } from "$lib/server/fetcher";
import { formatDate } from "$lib/utils";
import { subMonths } from "date-fns";
import paginate from "$lib/server/paginate";
import type { Network } from "$lib/store/network";
import { error } from "@sveltejs/kit";

export const load = (async ({ url, fetch, params }) => {
  const network = params.network as Network;
  const search = url.searchParams.get("search");
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;
  const start_date = url.searchParams.get("start_date") || formatDate(subMonths(new Date(), 1));
  const end_date = url.searchParams.get("end_date") || formatDate(new Date());

  if (!search) return;

  const fetcher = newFetcher(network, fetch);
  const data = await queryData({
    fetcher,
    search,
    endpoint: "/v1/eth/rewards",
    params: { start_date, end_date },
  });

  if (data !== null && data.data?.data) {
    return {
      url: data.url,
      data: {
        // needed for the graph
        fullData: data.data.data,
        ...paginate(data.data?.data, current_page, page_size),
      },
    };
  }

  throw error(404, `Error: "${search}" is not a valid Address, BLS or Index`);
}) satisfies PageServerLoad;
