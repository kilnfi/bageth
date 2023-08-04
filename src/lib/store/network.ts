import { browser } from "$app/environment";
import { writable } from "svelte/store";

const network = writable<"mainnet" | "testnet">(
  browser && localStorage.getItem("network") === "mainnet"
    ? "mainnet"
    : "testnet"
);

export default network;
