import type { PageServerLoad } from "./$types";
import { queryRewards, queryStakes } from "$lib/server/query";
import { createServerClient } from "$lib/server/fetcher";
import { error } from "@sveltejs/kit";
import { formatDate } from "$lib/utils";
import { subMonths } from "date-fns";

export const load = (async ({ url, fetch, params }) => {
  const network = params.network;
  const search = url.searchParams.get("search");
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;

  if (!search) return;

  const fetcher = createServerClient(network, fetch);
  const data = await queryStakes({ fetcher, search, params: { current_page, page_size } });

  if (data && data.data.data?.length === 1) {
    const start_date = url.searchParams.get("start_date") || formatDate(subMonths(new Date(), 1));
    const end_date = url.searchParams.get("end_date") || formatDate(new Date());

    const rewards = await queryRewards({ fetcher, search, params: { start_date, end_date } });

    if (rewards !== null) {
      return { ...data, rewards: rewards.data.data };
    }
  }

  if (data !== null) return data;

  throw error(404, `Error: "${search}" is not a valid Address, BLS or Index`);
}) satisfies PageServerLoad;
