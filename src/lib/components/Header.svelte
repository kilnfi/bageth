<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
</script>

<header class="p-2 w-full xl:fixed flex justify-between items-center">
  <h1 class="bg-black text-white flex rounded text-xl gap-x-2">
    <div class="w-10 bg-center bg-contain bg-no-repeat bg-[url(/favicon.png)]" />

    <a href="/" class="pr-2 py-1"> bageth </a>
  </h1>

  <div class="flex items-center gap-x-2">
    <ConnectWallet />

    <NetworkSelector />
  </div>
</header>

<!-- for spacing -->
<div class="hidden xl:block" />
