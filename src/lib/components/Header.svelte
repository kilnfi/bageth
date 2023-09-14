<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import DarkModeSwitch from "./DarkModeSwitch.svelte";
  import Navbar from "./Navbar.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
</script>

<header
  class="
    w-full mt-3 max-w-5xl
    flex gap-y-3
    flex-col md:flex-row
    items-center justify-between
  "
>
  <div class="flex items-center gap-2 sm:gap-4">
    <a href="/" class="flex items-center rounded-md bg-black dark:border text-white">
      <img src="/favicon.png" alt="logo" width="32" height="32" class="rounded-md" />
      <span class="hidden sm:block px-1.5 py-0.5">bageth.xyz</span>
    </a>

    <div class="w-80">
      <Navbar />
    </div>
  </div>

  <div class="flex items-center gap-x-2">
    <ConnectWallet />

    <DarkModeSwitch />

    <NetworkSelector />
  </div>
</header>
