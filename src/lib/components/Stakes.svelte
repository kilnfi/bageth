<script lang="ts">
  import tooltip from "$lib/use/tooltip";
  import {
    formatAddress,
    formatEth,
    formatWithdrawalCredentials,
  } from "$lib/utils";
  import { format } from "date-fns";
  import type { PageServerData } from "../../routes/$types";
  import BeaconchainLink from "./BeaconchainLink.svelte";
  import CopyPaste from "./CopyPaste.svelte";
  import Modal from "./Modal.svelte";
  import Paginate from "./Paginate.svelte";
  import Table from "./Table.svelte";
  import EtherscanLink from "./EtherscanLink.svelte";
  import { navigating } from "$app/stores";
  import pulseLoading from "$lib/use/pulseLoading";

  export let data: Extract<PageServerData, { type: "stakes" }>["data"];

  let isModalOpen = false;
  let json = "";

  function handleShowJSON(item: any) {
    json = JSON.stringify(item, null, 2);
    isModalOpen = true;
  }

  function getStateColour(state: string | undefined) {
    if (state === undefined || state === "") return "";
    if (["active_slashed", "exited_slashed"].includes(state)) {
      return "bg-red-200";
    }
    if (["withdrawal_done", "unknown", "unstaked"].includes(state)) {
      return "bg-gray-200";
    }
    if (
      [
        "active_exiting",
        "exited_unslashed",
        "exit_requested",
        "pending_queued",
        "deposit_in_progress",
        "pending_initialized",
        "withdrawal_possible",
      ].includes(state)
    ) {
      return "bg-orange-200";
    }
    if (["active_ongoing"].includes(state)) {
      return "bg-green-200";
    }
  }

  const help = {
    balance: "Current balance on the Ethereum consensus layer",
    rewards: "Sum of consensus and execution rewards earned by this stake",
    state: "State of the Ethereum stake",
    activated_at: "Date of activation on the Ethereum consensus layer",
    gross_apy: "Gross annual percentage yield",
    validator_address: "Public key of the validator",
    withdrawal_credentials: "Ethereum withdrawal credentials",
  };
</script>

<Table>
  <thead slot="head">
    <th>
      <span use:tooltip={{ content: help.validator_address }}> Validator </span>
    </th>
    <th><span use:tooltip={{ content: help.state }}>Status</span></th>
    <th>
      <span use:tooltip={{ content: help.withdrawal_credentials }}>
        Wallet
      </span>
    </th>
    <th>
      <span use:tooltip={{ content: help.balance }}> Staked balance </span>
    </th>
    <th><span use:tooltip={{ content: help.rewards }}>Rewards</span></th>
    <th><span use:tooltip={{ content: help.gross_apy }}>GRR</span></th>
    <th>
      <span use:tooltip={{ content: help.activated_at }}>Activated at</span>
    </th>
  </thead>

  <tbody slot="body" use:pulseLoading={$navigating?.type === "goto"}>
    {#each data?.data ?? [] as item}
      {@const wallet = item.withdrawal_credentials
        ? formatWithdrawalCredentials(item.withdrawal_credentials)
        : undefined}
      <tr class="group/row">
        <td>
          {#if item.validator_address}
            <BeaconchainLink href="/validator/{item.validator_address}">
              {formatAddress(item.validator_address)}
            </BeaconchainLink>
          {:else}
            -
          {/if}
        </td>
        <td>
          <div class="flex">
            <span
              class="px-2 py-1 border rounded-lg text-black
                  {getStateColour(item.state)}">{item.state}</span
            >
          </div>
        </td>
        <td>
          {#if wallet}
            <EtherscanLink href="/address/{wallet}">
              {formatAddress(wallet)}
            </EtherscanLink>
          {:else}
            -
          {/if}
        </td>
        <td>{formatEth(item.balance ?? "0")} ETH</td>
        <td>{formatEth(item.rewards ?? "0")} ETH</td>
        <td>
          {#if item.gross_apy}
            {item.gross_apy.toFixed(2)}%
          {:else}
            -
          {/if}
        </td>
        <td>{format(new Date(item.activated_at ?? 0), "dd-MM-yyyy")}</td>
        <td class="p-0">
          <div class="relative hidden group-hover/row:block">
            <div class="absolute px-2 right-0 top-1/2 -translate-y-1/2">
              <button
                class="rounded-lg border border-green-300 bg-green-100
                  px-2 py-1 text-sm hover:bg-green-200"
                on:click={() => handleShowJSON(item)}
              >
                json
              </button>
            </div>
          </div>
        </td>
      </tr>
    {:else}
      <td colspan="10" class="text-center p-4">No stakes found</td>
    {/each}
  </tbody>

  <Paginate
    slot="pagination"
    size={data?.pagination?.page_size ?? 0}
    count={data?.pagination?.total_pages ?? 0}
    index={data?.pagination?.current_page ?? 0}
  />
</Table>

<Modal bind:open={isModalOpen}>
  <div slot="title" class="flex justify-between border-b p-2">
    <h2 class="">JSON</h2>

    <CopyPaste
      class="text-black"
      on:copy={() => navigator.clipboard.writeText(json)}
    />
  </div>

  <pre
    slot="content"
    class="font-mono overflow-auto bg-gray-100 text-black p-2 rounded my-1">{json}</pre>
</Modal>
