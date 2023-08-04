<script lang="ts">
  import { isAddress } from "viem";
  import { navigating } from "$app/stores";
  import Spinner from "./Spinner.svelte";
  import { browser } from "$app/environment";
  import { isBLS, isIndex } from "$lib/utils";
  import { context } from "$lib/store/context";

  export let error = "";
  export let search: string;

  let searchOnPaste = browser
    ? localStorage.getItem("searchOnPaste") === "true"
    : true;

  function handleSearch() {
    $context.search = search;
    $context.current_page = 1;
    $context.page_size = 10;
  }

  $: if (browser) {
    localStorage.setItem("searchOnPaste", searchOnPaste.toString());
  }
</script>

<form
  on:submit|preventDefault={() => handleSearch()}
  class="flex flex-col max-w-lg w-full gap-y-3 items-center border p-3 rounded-lg relative"
>
  <input
    name="search"
    placeholder="search..."
    bind:value={search}
    on:paste={() => {
      setTimeout(() => {
        handleSearch();
      }, 100);
    }}
    class="border-2 border-black rounded-lg px-4 py-2
      text-lg font-mono w-full outline-none
      focus:ring-2 focus:ring-black focus:ring-opacity-30"
    type="text"
  />

  <ul class="flex items-center gap-2">
    <li class:valid={isIndex(search)}>validator index</li>
    <li class:valid={isAddress(search)}>wallet address/proxy</li>
    <li class:valid={isBLS(search)}>validator public key</li>
  </ul>

  {#if error}
    <p class="text-red-600">{error}</p>
  {/if}

  <button
    type="submit"
    disabled={$navigating?.type === "goto"}
    class="bg-black text-white px-3 py-2 w-28 xl:w-32 text rounded-lg
      disabled:bg-gray-400 flex items-center justify-center gap-x-2"
  >
    {#if $navigating?.type === "goto"}
      <Spinner /> Loading
    {:else}
      Search
    {/if}
  </button>

  <div class="text-sm absolute bottom-0 right-0 p-2">
    search on paste
    <button
      type="button"
      on:click={() => (searchOnPaste = !searchOnPaste)}
      class="{searchOnPaste ? 'text-green-600' : 'text-red-600'} underline"
    >
      {searchOnPaste ? "on" : "off"}
    </button>
  </div>
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
