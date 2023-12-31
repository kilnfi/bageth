import type { PageServerLoad } from "./$types";
import { queryRewards } from "$lib/server/query";
import { createServerClient } from "$lib/server/fetcher";
import { formatDate, parseDate } from "$lib/utils";
import { subMonths } from "date-fns";
import paginate from "$lib/server/paginate";
import { error } from "@sveltejs/kit";

export const load = (async ({ url, fetch, params }) => {
  const network = params.network;
  const search = url.searchParams.get("search");
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;
  const start_date = url.searchParams.get("start_date") || formatDate(subMonths(new Date(), 1));
  const end_date = url.searchParams.get("end_date") || formatDate(new Date());

  if (!search) return;

  const fetcher = createServerClient(network, fetch);
  const data = await queryRewards({ fetcher, search, params: { start_date, end_date } });

  if (data !== null && data.data?.data) {
    const rewards = data.data?.data;

    return {
      url: data.url,
      data: {
        // needed for the graph
        fullData: rewards,
        ...paginate(
          // sort rewards in descending order
          [...rewards].sort((a, b) => parseDate(b.date!).getTime() - parseDate(a.date!).getTime()),
          current_page,
          page_size
        ),
      },
    };
  }

  throw error(404, `Error: "${search}" is not a valid Address, BLS or Index`);
}) satisfies PageServerLoad;
