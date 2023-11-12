<script>
  import LoopIcon from "../icons/LoopIcon.svelte";
  import DiceIcon from "../icons/DiceIcon.svelte";
  import { getRandomRange } from "$lib/utils";
  import { goto } from "$app/navigation";
  import network from "$lib/store/network";

  function random() {
    goto(`${$network}/stakes?search=${getRandomRange()}`);
  }
</script>

<form
  action="/{$network}/stakes"
  class="flex gap-x-3 items-center
    mx-4 sm:mx-auto mb-20 lg:mb-28
    max-w-xl px-5 py-2 bg-dark
    border border-dark-light rounded-[49px]"
>
  <div class="max-sm:hidden">
    <LoopIcon />
  </div>

  <input
    class="text-base cursor-text outline-none grow text-white placeholder:text-white/50 bg-transparent leading-6"
    type="text"
    name="search"
    placeholder="Search stakes..."
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
</form>
