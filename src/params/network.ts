import type { Network } from "$lib/store/network";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param): param is Network => {
  return param === "mainnet" || param === "goerli" || param === "holesky";
};
