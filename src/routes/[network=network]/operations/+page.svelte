<script lang="ts">
  import { formatAddress, formatEth, formatWithdrawalCredentials } from "$lib/utils";
  import { format } from "date-fns";
  import tooltip from "$lib/use/tooltip";
  import { navigating, page } from "$app/stores";
  import pulseLoading from "$lib/use/pulseLoading";
  import type { PageServerData } from "./$types";
  import { goto } from "$app/navigation";
  import Tab from "$lib/components/Tabs.svelte";
  import { parseOperationType } from "$lib/utils/validation";
  import Table from "$lib/components/Table.svelte";
  import ExternalLink from "$lib/components/ExternalLink.svelte";
  import Paginate from "$lib/components/Paginate.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import CopyPaste from "$lib/components/CopyPaste.svelte";
  import Curl from "$lib/components/Curl.svelte";

  export let data: PageServerData;

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

  let tabs = ["consensus_withdrawal", "deposit", "execution_reward"] as const;
  let isModalOpen = false;
  let json = "";

  $: activeTab = parseOperationType($page.url.searchParams.get("tab"));

  function handleShowJSON(item: any) {
    json = JSON.stringify(item, null, 2);
    isModalOpen = true;
  }

  function handleChangeTab(tab: (typeof tabs)[number]) {
    // reset page when changing tab
    let url = new URL($page.url);
    url.searchParams.set("tab", tab);
    url.searchParams.delete("current_page");
    goto(url.toString(), { noScroll: true });
  }
</script>

<div class="max-w-5xl w-full p-1.5 border rounded-lg">
  <Tab active={activeTab} {tabs}>
    <button slot="tab" let:tab on:click={() => handleChangeTab(tab)} class="p-1.5 w-full truncate">{tab}</button>
  </Tab>
</div>

<Curl url={data.url} />

<Table class="max-w-5xl">
  <thead slot="head">
    <tr>
      <th><span use:tooltip={{ content: help.date }}>Date</span></th>
      <th><span use:tooltip={{ content: help.validator_address }}>Validator</span></th>
      <th><span use:tooltip={{ content: help.block }}>Block</span></th>

      {#if activeTab === "consensus_withdrawal"}
        <th><span use:tooltip={{ content: help.fee_recipient }}>Fee recipient</span></th>
      {:else if activeTab === "deposit"}
        <th><span use:tooltip={{ content: help.tx_hash }}>Transaction hash</span></th>
        <th><span use:tooltip={{ content: help.proxies }}>Proxies</span></th>
        <th><span use:tooltip={{ content: help.withdrawal_credentials }}>Wallet</span></th>
      {:else if activeTab === "execution_reward"}
        <th><span use:tooltip={{ content: help.fee_recipient }}>Fee recipient</span></th>
        <th><span use:tooltip={{ content: help.mev_payout_tx_hash }}>MEV payout tx hash</span></th>
      {/if}

      <th><span use:tooltip={{ content: help.amount }}>Amount</span></th>
    </tr>
  </thead>

  <tbody slot="body" use:pulseLoading={Boolean($navigating)}>
    {#each data?.data?.data.filter((item) => item.type === activeTab) ?? [] as item}
      <tr class="group/row">
        <td>{format(new Date(item.time ?? 0), "yyyy-MM-dd")}</td>
        <td>
          {#if item.validator_address}
            <ExternalLink variant="beaconcha.in" href="/validator/{item.validator_address}">
              {formatAddress(item.validator_address)}
            </ExternalLink>
          {:else}
            -
          {/if}
        </td>
        <td>
          {#if item.block}
            <ExternalLink variant="beaconcha.in" href="/block/{item.block}">
              {item.block}
            </ExternalLink>
          {:else}
            -
          {/if}
        </td>

        {#if item.type === "consensus_withdrawal"}
          <td>
            {#if item.fee_recipient}
              <ExternalLink variant="beaconcha.in" href="/address/{item.fee_recipient}">
                {formatAddress(item.fee_recipient)}
              </ExternalLink>
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
              <ExternalLink variant="beaconcha.in" href="/tx/{item.tx_hash}">
                {formatAddress(item.tx_hash)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
          <td class="!p-0">
            <div
              style="--height: calc({item.proxies?.length} * 38px + 12px)"
              class="
                flex flex-col gap-1
                overflow-y-hidden p-2
                h-14 hover:max-h-44 hover:h-[--height]
                transition-[height] duration-200
              "
            >
              {#each item.proxies ?? [] as proxy}
                <div class="p-1 border rounded-lg">
                  <ExternalLink variant="beaconcha.in" href="/address/{proxy}">
                    {formatAddress(proxy)}
                  </ExternalLink>
                </div>
              {/each}
            </div>
          </td>
          <td>
            {#if wallet}
              <ExternalLink variant="etherscan.io" href="/address/{wallet}">
                {formatAddress(wallet)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        {:else if item.type === "execution_reward"}
          <td>
            {#if item.fee_recipient}
              <ExternalLink variant="beaconcha.in" href="/address/{item.fee_recipient}">
                {formatAddress(item.fee_recipient)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
          <td>
            {#if item.mev_payout_tx_hash}
              <ExternalLink variant="beaconcha.in" href="/tx/{item.mev_payout_tx_hash}">
                {formatAddress(item.mev_payout_tx_hash)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        {/if}

        <td>{formatEth(item.amount ?? "0")} ETH</td>
        <td class="p-0">
          <div class="relative hidden group-hover/row:block">
            <div class="absolute px-2 right-0 top-1/2 -translate-y-1/2">
              <button
                class="rounded-lg border border-green-300 bg-green-100
                    px-2 py-1 text-sm hover:bg-green-200 text-black"
                on:click={() => handleShowJSON(item)}
              >
                json
              </button>
            </div>
          </div>
        </td>
      </tr>
    {:else}
      <td colspan="10" class="text-center p-4">
        No {activeTab} operations found
      </td>
    {/each}
  </tbody>

  <Paginate
    slot="pagination"
    page_count={data.data?.pagination.total_pages ?? 0}
    current_page={data.data?.pagination.current_page ?? 0}
    page_size={data.data?.pagination.page_size ?? 0}
  />
</Table>

<Modal bind:open={isModalOpen}>
  <div slot="title" class="flex justify-between border-b p-2">
    <h2 class="">JSON</h2>

    <CopyPaste class="text-black" on:copy={() => navigator.clipboard.writeText(json)} />
  </div>

  <pre slot="content" class="font-mono overflow-auto bg-gray-100 text-black p-2 rounded my-1">{json}</pre>
</Modal>
