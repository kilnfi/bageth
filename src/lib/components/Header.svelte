<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import DarkModeSwitch from "./DarkModeSwitch.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
</script>

<header class="gap-y-4 mt-2 max-w-4xl flex flex-col w-full">
  <div class="flex justify-between items-center">
    <div>
      <a
        href="/"
        class="flex items-center rounded-md bg-black dark:border text-white"
      >
        <img
          src="/favicon.png"
          alt="logo"
          width="45"
          height="45"
          class="rounded-md"
        />
        <span class="px-1.5 py-0.5">bageth.xyz</span>
      </a>
    </div>

    <div class="flex items-center gap-x-2">
      <ConnectWallet />

      <DarkModeSwitch />

      <NetworkSelector />
    </div>
  </div>

  <a href="/">
    <img src="header.png" alt="header" class="rounded border-none" />
  </a>
</header>
