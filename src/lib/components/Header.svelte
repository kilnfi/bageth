<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import DarkModeSwitch from "./DarkModeSwitch.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
</script>

<header class="py-2 xl:px-2 w-full flex justify-between items-center">
  <div>
    <a
      href="/"
      class="flex items-center rounded-md bg-black dark:border text-white"
    >
      <img
        src="/favicon.png"
        alt="logo"
        width="30"
        height="30"
        class="rounded-md"
      />
      <span class="px-1.5 py-0.5">bageth</span>
    </a>
  </div>

  <div class="flex items-center gap-x-2">
    <ConnectWallet />

    <DarkModeSwitch />

    <NetworkSelector />
  </div>
</header>
