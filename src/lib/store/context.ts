import { page } from "$app/stores";
import { OPERATIONS_TAB_MAPPING, isKeyOf, validateType } from "$lib/utils";
import { get, writable, type StartStopNotifier } from "svelte/store";

export type Context = {
  search: string;
  type: "stakes" | "rewards" | "operations";
  current_page: number;
  page_size: number;
  start_date: string;
  end_date: string;
  tab: "withdrawals" | "deposit" | "rewards";
};

const initContext: StartStopNotifier<Context> = (set) => {
  let p = get(page);
  let type = p.url.searchParams.get("type");
  let tab = p.url.searchParams.get("tab");

  set({
    search: p.url.searchParams.get("search") || "",
    type: validateType(type) ? type : "stakes",
    current_page: Number(p.url.searchParams.get("current_page")) || 1,
    page_size: Number(p.url.searchParams.get("page_size")) || 10,
    start_date: p.url.searchParams.get("start_date") || "",
    end_date: p.url.searchParams.get("end_date") || "",
    tab: tab && isKeyOf(OPERATIONS_TAB_MAPPING, tab) ? tab : "withdrawals",
  });
};

export const context = writable<Context>({} as Context, initContext);
