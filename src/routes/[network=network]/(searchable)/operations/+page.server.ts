import type { PageServerLoad } from "./$types";
import { queryOperations } from "$lib/server/query";
import { parseOperationType } from "$lib/utils/validation";
import { createServerClient } from "$lib/server/fetcher";
import paginate from "$lib/server/paginate";
import { error } from "@sveltejs/kit";

export const load = (async ({ url, fetch, params }) => {
  const network = params.network;
  const search = url.searchParams.get("search");
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;
  const tab = parseOperationType(url.searchParams.get("tab"));

  if (!search) return;

  const fetcher = createServerClient(network, fetch);
  const data = await queryOperations({ fetcher, search });

  if (data !== null && data.data?.data) {
    const filteredData = data.data.data
      .filter((o) => o.type === tab)
      .sort((a, b) => new Date(b.time!).getTime() - new Date(a.time!).getTime());
    return {
      url: data.url,
      data: paginate(filteredData, current_page, page_size),
    };
  }

  throw error(404, `Error: "${search}" is not a valid Address, BLS or Index`);
}) satisfies PageServerLoad;
