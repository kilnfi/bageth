<script lang="ts">
  import { context } from "$lib/store/context";

  function onChangeNetwork() {
    let newNetwork: "mainnet" | "testnet" =
      $context.network === "mainnet" ? "testnet" : "mainnet";
    $context.network = newNetwork;
    localStorage.setItem("network", newNetwork);
  }
</script>

<button
  class="bg-black w-24 text-white border dark:bg-white dark:text-black
    px-1.5 py-0.5 rounded-md"
  on:click={onChangeNetwork}
>
  {$context.network === "mainnet" ? "[mainnet]" : "[goerli]"}
</button>
