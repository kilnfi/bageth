import type { Action } from "svelte/action";

const pulseLoading: Action<Element, boolean> = (node, isLoading) => {
  return {
    update(isLoading) {
      if (isLoading) {
        node.classList.add("pulse-loading");
      } else {
        node.classList.remove("pulse-loading");
      }
    },
    destroy() {
      node.classList.remove("pulse-loading");
    },
  };
};

export default pulseLoading;
