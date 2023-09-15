import darkmode from "$lib/store/darkmode";
import type { Action } from "svelte/action";
import tippy, { type Props } from "tippy.js";

const tooltip: Action<Element, Partial<Props>> = (node, options) => {
  const tooltip = tippy(node, options);

  const unsub = darkmode.subscribe((is_dark) => {
    if (is_dark) {
      tooltip.setProps({ theme: "light-border" });
    } else {
      tooltip.setProps({ theme: "material" });
    }
  });

  return {
    update(options) {
      tooltip.setProps(options);
    },
    destroy() {
      tooltip.destroy();
      unsub();
    },
  };
};

export default tooltip;
