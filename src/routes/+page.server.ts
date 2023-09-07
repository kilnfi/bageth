import type { PageServerLoad } from "./$types";
import { format, subMonths } from "date-fns";
import { getOperationType, validateNetwork, validateType } from "$lib/utils";
import queryData from "$lib/server/query";
import paginate from "$lib/server/paginate";

export const load = (async ({ url }) => {
  const search = url.searchParams.get("search");
  const network = url.searchParams.get("network") || "testnet";
  const type = url.searchParams.get("type") || "stakes";

  if (!search) {
    return { search: "" };
  }

  if (!validateNetwork(network) || !validateType(type)) {
    return { search, error: "Invalid Network or Type" };
  }

  // all the pages use pagination
  const current_page = Number(url.searchParams.get("current_page")) || 1;
  const page_size = Number(url.searchParams.get("page_size")) || 10;

  if (type === "stakes") {
    const data = await queryData({
      network,
      search,
      endpoint: "/v1/eth/stakes",
      params: { current_page, page_size },
    });
    if (data !== null) return { search, type, ...data };
  }

  if (type === "rewards") {
    const start_date = url.searchParams.get("start_date") ?? format(subMonths(new Date(), 1), "yyyy-MM-dd");
    const end_date = url.searchParams.get("end_date") ?? format(new Date(), "yyyy-MM-dd");
    const data = await queryData({
      network,
      search,
      endpoint: "/v1/eth/rewards",
      params: { start_date, end_date },
    });
    if (data !== null && data.data?.data) {
      return {
        search,
        type,
        url: data.url,
        data: {
          // needed for the graph
          fullData: data.data.data,
          ...paginate(data.data?.data, current_page, page_size),
        },
      };
    }
  }

  if (type === "operations") {
    const tab = getOperationType(url.searchParams.get("tab"));
    const data = await queryData({
      network,
      search,
      endpoint: "/v1/eth/operations",
    });
    if (data !== null && data.data?.data) {
      const filteredData = data.data.data.filter((o) => o.type === tab);
      return {
        search,
        type,
        url: data.url,
        data: paginate(filteredData, current_page, page_size),
      };
    }
  }

  return { search, error: "Invalid Address, BLS or Index" };
}) satisfies PageServerLoad;
