<script lang="ts">
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
  import Table from "./Table.svelte";
  import Tab from "./Tab.svelte";
  import tooltip from "$lib/tooltip";
  import { context } from "$lib/store/context";
  import Paginate from "./Paginate.svelte";
  import EtherscanLink from "./EtherscanLink.svelte";

  export let data: Extract<PageServerData, { type: "operations" }>["data"];

  const help = {
    date: "Time of the operation",
    validator_address: "Validator address of the operation",
    block: "Block number of the reward",
    fee_recipient: "Fee recipient of the reward",
    mev_payout_tx_hash: "Hash of the MEV payout transaction if appliable",
    amount: "Amount in WEI of the reward",
    tx_hash: "Hash of the transaction",
    proxies: "Ordered list of smart-contracts in the calling chain",
    withdrawal_credentials: "Withdrawal credentials of the deposit",
  };

  const fullType = {
    withdrawals: "consensus_withdrawal",
    deposit: "deposit",
    rewards: "execution_reward",
  };

  let tabs = ["withdrawals", "deposit", "rewards"] as const;
  let isModalOpen = false;
  let json = "";

  function handleShowJSON(item: any) {
    json = JSON.stringify(item, null, 2);
    isModalOpen = true;
  }
</script>

<Tab active={$context.tab} {tabs}>
  {#each tabs as t (t)}
    <button
      on:click={() => {
        // reset page when changing tab
        $context.current_page = 1;
        $context.tab = t;
      }}
    >
      {t}
    </button>
  {/each}
</Tab>

<div class="w-11/12 xl:w-8/12 my-6">
  <Table>
    <thead slot="head">
      <th><span use:tooltip={{ content: help.date }}>Date</span></th>
      <th>
        <span use:tooltip={{ content: help.validator_address }}>
          Validator
        </span>
      </th>
      <th>
        <span use:tooltip={{ content: help.block }}>Block</span>
      </th>

      {#if $context.tab === "withdrawals"}
        <th>
          <span use:tooltip={{ content: help.fee_recipient }}>
            Fee recipient
          </span>
        </th>
      {:else if $context.tab === "deposit"}
        <th>
          <span use:tooltip={{ content: help.tx_hash }}>Transaction hash</span>
        </th>
        <th><span use:tooltip={{ content: help.proxies }}>Proxies</span></th>
        <th>
          <span use:tooltip={{ content: help.withdrawal_credentials }}>
            Wallet
          </span>
        </th>
      {:else if $context.tab === "rewards"}
        <th>
          <span use:tooltip={{ content: help.fee_recipient }}>
            Fee recipient
          </span>
        </th>
        <th>
          <span use:tooltip={{ content: help.mev_payout_tx_hash }}>
            MEV payout tx hash
          </span>
        </th>
      {/if}

      <th><span use:tooltip={{ content: help.amount }}>Amount</span></th>
    </thead>

    <tbody slot="body">
      {#each data?.data?.filter((item) => item.type === fullType[$context.tab]) ?? [] as item}
        <tr class="group/row relative">
          <td>{format(new Date(item.time ?? 0), "dd-MM-yyyy")}</td>
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
            {#if item.block}
              <BeaconchainLink href="/block/{item.block}">
                {item.block}
              </BeaconchainLink>
            {:else}
              -
            {/if}
          </td>

          {#if item.type === "consensus_withdrawal"}
            <td>
              {#if item.fee_recipient}
                <BeaconchainLink href="/address/{item.fee_recipient}">
                  {formatAddress(item.fee_recipient)}
                </BeaconchainLink>
              {:else}
                -
              {/if}
            </td>
          {:else if item.type === "deposit"}
            {@const wallet = item.withdrawal_credentials
              ? formatWithdrawalCredentials(item.withdrawal_credentials)
              : undefined}
            <td>
              {#if item.tx_hash}
                <BeaconchainLink href="/tx/{item.tx_hash}">
                  {formatAddress(item.tx_hash)}
                </BeaconchainLink>
              {:else}
                -
              {/if}
            </td>
            <td class="!p-0">
              <div class="flex gap-1 overflow-x-auto w-44 p-4">
                {#each item.proxies ?? [] as proxy}
                  <div class="p-1 border rounded-lg">
                    <BeaconchainLink href="/address/{proxy}">
                      {formatAddress(proxy)}
                    </BeaconchainLink>
                  </div>
                {/each}
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
          {:else if item.type === "execution_reward"}
            <td>
              {#if item.fee_recipient}
                <BeaconchainLink href="/address/{item.fee_recipient}">
                  {formatAddress(item.fee_recipient)}
                </BeaconchainLink>
              {:else}
                -
              {/if}
            </td>
            <td>
              {#if item.mev_payout_tx_hash}
                <BeaconchainLink href="/tx/{item.mev_payout_tx_hash}">
                  {formatAddress(item.mev_payout_tx_hash)}
                </BeaconchainLink>
              {:else}
                -
              {/if}
            </td>
          {/if}

          <td>{formatEth(item.amount ?? "0")} ETH</td>
          <td
            class="table-btn hidden group-hover/row:flex h-full w-14 items-center"
          >
            <button class="json-btn" on:click={() => handleShowJSON(item)}>
              json
            </button>
          </td>
        </tr>
      {:else}
        <td colspan="10" class="text-center p-4">
          No {$context.tab} operations found
        </td>
      {/each}
    </tbody>

    <Paginate
      slot="pagination"
      count={data.pagination.total_pages}
      index={data.pagination.current_page}
      size={data.pagination.page_size}
    />
  </Table>
</div>

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

<style lang="postcss" scoped>
  .json-btn {
    @apply rounded-lg border border-green-300 bg-green-100 px-2 py-1 text-sm hover:bg-green-200;
  }
</style>
