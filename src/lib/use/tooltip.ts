import type { Action } from "svelte/action";
import tippy, { type Props } from "tippy.js";

const tooltip: Action<Element, Partial<Props>> = (node, options) => {
  const tooltip = tippy(node, options);

  return {
    update(options) {
      tooltip.setProps(options);
    },
    destroy() {
      tooltip.destroy();
    },
  };
};

export default tooltip;
