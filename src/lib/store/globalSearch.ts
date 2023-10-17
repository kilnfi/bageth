import { writable } from "svelte/store";

const globalSearch = writable<URLSearchParams>(new URLSearchParams());

export default globalSearch;
