import { browser } from "$app/environment";
import { writable } from "svelte/store";

const darkmode = writable<boolean>(false, (set) => {
  if (browser) {
    set(localStorage.getItem("darkmode") === "true");
  }
});

export default darkmode;
