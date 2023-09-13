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
  class="
    w-full max-w-5xl p-1 relative
    flex items-center gap-x-4
    border rounded-lg
    bg-white dark:bg-black
    text-black dark:text-white
  "
  style="--width: {width}%"
>
  {#each tabs as tab}
    <div class="w-[--width] rounded-lg px-3 py-2 text-center">
      <slot name="tab" {tab} />
    </div>
  {/each}

  <span
    style="width: calc({width}% - 0.5rem); left: calc({$tabPos}% + 0.25rem);"
    class="
      h-[calc(100%-0.5rem)]
      absolute top-[0.25rem]
      rounded-lg
      bg-white mix-blend-difference
    "
  />
</div>
