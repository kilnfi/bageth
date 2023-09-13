<script lang="ts">
  import { browser } from "$app/environment";
  import { createWalletClient, custom, type WalletClient } from "viem";
  import { goerli, mainnet, type Chain } from "viem/chains";
  import CopyPaste from "./CopyPaste.svelte";
  import { formatAddress } from "$lib/utils";
  import network, { type Network } from "$lib/store/network";

  let client: WalletClient | null;
  let address = "";

  if (browser) {
    const CHAINS: Record<Network, Chain> = {
      mainnet: mainnet,
      goerli: goerli,
      holesky: undefined as any,
    };

    try {
      client = createWalletClient({
        chain: CHAINS[$network],
        transport: custom((window as any).ethereum),
      });
    } catch {
      console.error("Can't create wallet client");
      client = null;
    }
    address = localStorage.getItem("address") ?? "";
  }

  const connectWallet = async () => {
    if (!client) return;
    const data = await client.requestAddresses();
    address = data[0];
    localStorage.setItem("address", address);
  };

  const disconnectWallet = async () => {
    localStorage.removeItem("address");
    address = "";
  };
</script>

{#if client !== null}
  {#if address === ""}
    <button
      on:click={connectWallet}
      class="
        px-2 py-1
        border rounded-md
        text-white dark:text-black
        bg-black dark:bg-gray-100
        text-sm
      "
    >
      Connect wallet
    </button>
  {:else}
    <div
      class="
        px-1.5 py-1
        flex items-center gap-x-1.5
        border rounded-md
        text-black dark:text-white
        bg-white dark:bg-black
      "
    >
      <span class="text-sm">{formatAddress(address)}</span>

      <CopyPaste on:copy={() => navigator.clipboard.writeText(address)} />

      <button class="text-red-500" on:click={disconnectWallet}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </button>
    </div>
  {/if}
{/if}
