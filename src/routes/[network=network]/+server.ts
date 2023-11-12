import { createServerClient } from "$lib/server/fetcher";
import { queryOperations, queryRewards, queryStakes } from "$lib/server/query";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

function createCSV(data: Record<string, any>[]) {
  const header = [
    ...data
      .map((e) => Object.keys(e))
      .reduce((acc, e) => {
        e.forEach((e) => acc.add(e));
        return acc;
      }, new Set())
      .keys(),
  ];

  const csv_data = Array.from({ length: data.length }).map(() => new Map(header.map((e) => [e, null])));

  data.forEach((e, i) => {
    Object.entries(e).forEach(([key, value]) => {
      csv_data[i].set(key, value);
    });
  });

  const csv = `${header.join(",")}\n${csv_data.map((e) => [...e.values()].join(",")).join("\n")}\n`;

  return new Blob([csv], { type: "text/csv; charset=utf-8" });
}

export const GET = (async ({ url, fetch, params }) => {
  const network = params.network;
  const search = url.searchParams.get("search");
  const type = url.searchParams.get("type");
  const fetcher = createServerClient(network, fetch);

  if (search === null || type === null) throw error(400, "Missing search parameter");

  const data = await (() => {
    if (type === "stakes") return queryStakes({ fetcher, search });
    if (type === "rewards") return queryRewards({ fetcher, search });
    if (type === "operations") return queryOperations({ fetcher, search });
    throw error(400, "Invalid type");
  })();

  if (data?.data.data === undefined) throw error(404, "Not found");

  return new Response(createCSV(data?.data.data));
}) satisfies RequestHandler;
