import { writable } from "svelte/store";

const persistedSearchParams = writable<URLSearchParams>(new URLSearchParams());

export default persistedSearchParams;
