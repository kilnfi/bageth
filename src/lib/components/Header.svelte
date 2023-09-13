<script lang="ts">
  import network from "$lib/store/network";
  import ConnectWallet from "./ConnectWallet.svelte";
  import DarkModeSwitch from "./DarkModeSwitch.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
</script>

<header class="gap-y-3 mt-3 max-w-5xl flex flex-col w-full">
  <div class="flex justify-between items-center">
    <div class="flex gap-x-3 items-center">
      <a href="/" class="flex items-center rounded-md bg-black dark:border text-white">
        <img src="/favicon.png" alt="logo" width="32" height="32" class="rounded-md" />
        <span class="px-1.5 py-0.5">bageth.xyz</span>
      </a>

      <a
        href="/{$network}/stakes"
        class="
          px-2 py-1 h-[32px]
          flex items-center
          hover:bg-gray-100 dark:hover:bg-neutral-900
          border border-transparent hover:border-gray-200 rounded-lg
          dark:text-white
        "
      >
        explore
      </a>
    </div>

    <div class="flex items-center gap-x-2">
      <ConnectWallet />

      <DarkModeSwitch />

      <NetworkSelector />
    </div>
  </div>
</header>
