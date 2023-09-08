import { page } from "$app/stores";
import { OPERATIONS_TAB_MAPPING, isKeyOf, validateNetwork, validateType } from "$lib/utils";
import type { Page } from "@sveltejs/kit";
import { get, writable, type StartStopNotifier } from "svelte/store";

export type Context = {
  network: "mainnet" | "testnet" | undefined;
  search: string;
  type: "stakes" | "rewards" | "operations";
  current_page: number;
  page_size: number;
  start_date: string;
  end_date: string;
  tab: "withdrawals" | "deposit" | "rewards";
};

export const applyStateMachine = ($page: Page, ctx: Context) => {
  let hasChangedType = ctx.type !== $page.url.searchParams.get("type");

  $page.url.searchParams.set("search", ctx.search);
  $page.url.searchParams.set("type", ctx.type);
  if (ctx.network) $page.url.searchParams.set("network", ctx.network);

  // all pages have pagination
  $page.url.searchParams.set("current_page", ctx.current_page.toString());
  $page.url.searchParams.set("page_size", ctx.page_size.toString());

  if (ctx.type === "rewards") {
    $page.url.searchParams.set("start_date", ctx.start_date);
    $page.url.searchParams.set("end_date", ctx.end_date);
  }

  if (ctx.type === "operations") {
    $page.url.searchParams.set("tab", ctx.tab);
  }

  // reset pagination
  if (hasChangedType) {
    $page.url.searchParams.delete("current_page");
    $page.url.searchParams.delete("page_size");
    $page.url.searchParams.delete("start_date");
    $page.url.searchParams.delete("end_date");
    $page.url.searchParams.delete("tab");
  }
};

const initContext: StartStopNotifier<Context> = (set) => {
  let p = get(page);
  let type = p.url.searchParams.get("type");
  let tab = p.url.searchParams.get("tab");
  let network = p.url.searchParams.get("network");

  set({
    network: validateNetwork(network) ? network : undefined,
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
