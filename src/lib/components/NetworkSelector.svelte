<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import network from "$lib/store/network";
  import { onDestroy } from "svelte";

  if (browser) {
    const unsubscribe = network.subscribe((value) => {
      localStorage.setItem("network", value);
    });
    onDestroy(unsubscribe);
  }

  function onChangeNetwork() {
    $network = $network === "testnet" ? "mainnet" : "testnet";
    $page.url.searchParams.set("network", $network);
    goto($page.url, { invalidateAll: true, noScroll: true });
  }
</script>

<button
  class="bg-black text-white px-1.5 py-0.5 rounded-md"
  on:click={onChangeNetwork}
>
  {#if $network === "mainnet"}
    [mainnet]
  {:else}
    [goerli]
  {/if}
</button>
