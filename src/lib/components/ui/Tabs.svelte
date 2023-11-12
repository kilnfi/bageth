<script lang="ts" generics="T">
  import { fade } from "svelte/transition";

  import { browser } from "$app/environment";
  import { spring } from "svelte/motion";

  export let tabs: ReadonlyArray<T>;
  export let active: T | null = null;
  export let activeColor: string = "#FFF";

  let width = (100 / tabs.length).toFixed(2);

  function getPos(tab: T) {
    return tabs.indexOf(tab) * Number(width);
  }

  const tabPos = spring(getPos(active ?? tabs[0]));

  $: if (browser && active) $tabPos = getPos(active);
</script>

<div role="navigation" class="relative flex items-center bg-dark" style="--width: {width}%">
  {#each tabs as tab (tab)}
    <div
      role="navigation"
      class="w-[--width] flex items-center justify-center
        text-white text-center"
    >
      <slot name="tab" {tab} />
    </div>
  {/each}

  {#if active}
    <span
      out:fade={{ duration: 150 }}
      in:fade={{ duration: 150 }}
      style="
        width: calc({width}%);
        left: calc({$tabPos}%);
        background-color: {activeColor};
      "
      class="absolute h-full
        rounded-lg
        pointer-events-none
        mix-blend-difference
        transition-colors duration-200"
    />
  {/if}
</div>
