<script lang="ts">
  import { isAddress } from "viem";
  import { isBLS, isIndex, isIndexRange } from "$lib/utils/validation";
  import network, { type Network } from "$lib/store/network";
  import DiceIcon from "../icons/DiceIcon.svelte";
  import { tick } from "svelte";

  export let type: string;

  const RANDOM_SEARCH: Record<Network, number> = {
    goerli: 500_000,
    mainnet: 800_000,
    holesky: 1_400_000,
  };

  export let search = "";
  let ref: HTMLFormElement;

  function random() {
    const start = Math.floor(Math.random() * RANDOM_SEARCH[$network]);
    const end = start + Math.floor(Math.random() * 100) + 10;
    search = `${start}..${end}`;
    setTimeout(() => ref.requestSubmit(), 100);
  }
</script>

<form
  bind:this={ref}
  data-sveltekit-keepfocus
  action="/{$network}/{type}"
  class="w-full p-4 mt-10 flex flex-col gap-y-4 overflow-auto
    bg-dark border border-dark-light rounded-2xl"
>
  <div
    class="w-full relative flex gap-x-3 items-center pl-8 pr-2 py-2
      bg-[#363534] border border-[#434343] rounded-[49px]"
  >
    <input
      class="text-base cursor-text outline-none max-sm:w-20 grow text-white placeholder:text-white/50 bg-transparent leading-6"
      type="text"
      name="search"
      bind:value={search}
      on:paste={() => tick().then(() => setTimeout(() => ref.requestSubmit(), 100))}
      placeholder="Search {type}..."
    />

    <button
      type="button"
      class="flex items-end gap-2 px-3 py-2
        transition-colors duration-200 text-white hover:text-white/60"
      on:click={random}
    >
      <DiceIcon />
      <span class="font-neue max-sm:hidden text-base font-medium leading-5">Randomize</span>
    </button>

    <div class="isolate relative">
      <button
        type="submit"
        class="px-10 py-2
          text-white font-neue text-base font-medium text-center leading-6
          rounded-full z-[1] hover:text-white/60 transition-colors duration-200
          bg-[#403323ee] hover:bg-[#403323dd]"
      >
        Search
      </button>
    </div>
  </div>

  <ul class="grid grid-cols-2 lg:grid-cols-4 gap-2">
    <li class:valid={isIndex(search) || isIndexRange(search)}>validator index</li>
    <li class:valid={isIndexRange(search)}>range format: start..end</li>
    <li class:valid={isAddress(search)}>wallet/proxy address</li>
    <li class:valid={isBLS(search)}>validator public key</li>
  </ul>
</form>

<style lang="postcss">
  ul > li {
    @apply rounded-lg whitespace-nowrap border px-4 py-2
      text-center text-base truncate transition-colors duration-200;
  }
  ul > li.valid {
    @apply text-white border-[#7B5A2B] bg-[#403423];
  }
  ul > li:not(.valid) {
    @apply text-white/60 border-[#433D34] bg-[#302D28];
  }

  button[type="submit"]::before {
    @apply content-[''] absolute -top-px -left-px -right-px -bottom-px rounded-full z-[-1];
    background: linear-gradient(to right bottom, #ffb82f, #b0b8ff);
  }
</style>
