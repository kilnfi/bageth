<script lang="ts" generics="T">
  import { browser } from "$app/environment";
  import { spring } from "svelte/motion";

  export let tabs: ReadonlyArray<T>;
  export let active: T;

  let width = (100 / tabs.length).toFixed(2);

  function getPos(tab: T) {
    return tabs.indexOf(tab) * Number(width);
  }

  const tabPos = spring(getPos(active), { stiffness: 0.1, damping: 0.5 });

  $: if (browser) $tabPos = getPos(active);
</script>

<div
  class="w-full max-w-6xl tabs flex items-center gap-x-4 p-2
    border rounded-lg relative bg-white text-black dark:bg-black dark:text-white"
  style="--width: {width}%"
>
  <slot />

  <span
    style="width: calc({width}% - 1rem); left: calc({$tabPos}% + 0.5rem);"
    class="h-[calc(100%-1rem)] rounded-lg absolute top-[0.5rem] bg-white mix-blend-difference"
  />
</div>

<style lang="postcss" scoped>
  :global(.tabs button) {
    @apply w-[--width] rounded-lg px-3 py-2 text-center;
  }
</style>
