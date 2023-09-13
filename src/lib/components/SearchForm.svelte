<script lang="ts">
  import { isAddress } from "viem";
  import Spinner from "./Spinner.svelte";
  import { isBLS, isIndex, isIndexRange } from "$lib/utils/validation";
  import { slide } from "svelte/transition";
  import network from "$lib/store/network";

  export let loading: boolean;

  export let search = "";
  let ref: HTMLFormElement;
</script>

<form
  bind:this={ref}
  class="
    max-w-5xl w-full
    p-3 relative
    flex flex-col gap-y-3
    bg-white dark:bg-black
    border rounded-lg
  "
>
  <input type="hidden" name="network" value={$network} />

  <div class="w-full relative">
    <input
      name="search"
      placeholder="search..."
      bind:value={search}
      on:paste={() => setTimeout(() => ref.requestSubmit(), 100)}
      class="
        border-2 border-black rounded-lg
        w-full px-4 py-2
        text-lg font-mono outline-none
        focus:ring-2 focus:ring-black focus:ring-opacity-30
      "
      type="text"
    />

    {#if search.length > 0}
      <button
        in:slide={{ axis: "x", duration: 100 }}
        out:slide={{ axis: "x", duration: 100 }}
        type="submit"
        disabled={loading}
        class="
          p-1 w-28 xl:w-32
          absolute right-2 top-1/2 -translate-y-1/2
          flex items-center justify-center gap-x-2
          bg-black disabled:bg-gray-400
          text-white
          text rounded-lg
        "
      >
        {#if loading}
          <Spinner /> Loading
        {:else}
          Search
        {/if}
      </button>
    {/if}
  </div>

  <ul class="grid grid-cols-2 lg:grid-cols-4 gap-2">
    <li class:valid={isIndex(search) || isIndexRange(search)}>validator index</li>
    <li class:valid={isIndexRange(search)}>
      range format: <code class="px-1.5 py-0.5 bg-gray-50 rounded border"> start..end </code>
    </li>
    <li class:valid={isAddress(search)}>wallet/proxy address</li>
    <li class:valid={isBLS(search)}>validator public key</li>
  </ul>
</form>

<style lang="postcss" scoped>
  ul > li {
    @apply rounded-lg border px-2 py-1 text-center text-sm transition-colors duration-200;
  }
  ul > li.valid {
    @apply border-green-200 bg-green-100;
  }
  ul > li:not(.valid) {
    @apply border-red-200 bg-red-100;
  }
</style>
