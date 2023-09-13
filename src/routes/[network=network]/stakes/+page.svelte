<script lang="ts">
  import { navigating } from "$app/stores";
  import CopyPaste from "$lib/components/CopyPaste.svelte";
  import Curl from "$lib/components/Curl.svelte";
  import ExternalLink from "$lib/components/ExternalLink.svelte";
  import Kpi from "$lib/components/Kpi.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Paginate from "$lib/components/Paginate.svelte";
  import Table from "$lib/components/Table.svelte";
  import network from "$lib/store/network";
  import pulseLoading from "$lib/use/pulseLoading";
  import tooltip from "$lib/use/tooltip";
  import { formatAddress, formatDate, formatEth, formatWithdrawalCredentials } from "$lib/utils";
  import { isBLS } from "$lib/utils/validation";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  let isModalOpen = false;
  let json = "";

  const STATE_COLORS: Record<string, string> = {
    active_slashed: "bg-red-200",
    exited_slashed: "bg-red-200",

    withdrawal_done: "bg-gray-200",
    unknown: "bg-gray-200",
    unstaked: "bg-gray-200",

    active_exiting: "bg-orange-200",
    exited_unslashed: "bg-orange-200",
    exit_requested: "bg-orange-200",
    pending_queued: "bg-orange-200",
    deposit_in_progress: "bg-orange-200",
    pending_initialized: "bg-orange-200",
    withdrawal_possible: "bg-orange-200",

    active_ongoing: "bg-green-200",
  };

  const help = {
    balance: "Current balance on the Ethereum consensus layer",
    validator_index: "Index of the validator in the consensus layer",
    rewards: "Sum of consensus and execution rewards earned by this stake",
    state: "State of the Ethereum stake",
    activated_at: "Date of activation on the Ethereum consensus layer",
    gross_apy: "Gross annual percentage yield",
    validator_address: "Public key of the validator",
    withdrawal_credentials: "Ethereum withdrawal credentials",
    activated_epoch: "Epoch of activation on the Ethereum consensus layer",
    delegated_at: "Timestamp of the block at which the corresponding staking transaction was executed",
    delegated_block: "Block at which the corresponding staking transaction was executed",
    consensus_rewards: "Sum of consensus rewards earned by this stake",
    execution_rewards: "Sum of execution rewards earned by this stake",
    deposit_tx_sender: "Address of the sender of the first deposit transaction",
    effective_balance: "Effective balance of the stake as seen by the Ethereum consensus layer",
    execution_fee_recipient: "Address of the last recipient of an execution reward",
    updated_at: "Last date this data was updated",
  };

  function handleShowJSON(item: any) {
    json = JSON.stringify(item, null, 2);
    isModalOpen = true;
  }
</script>

<Curl url={data.url} />

{#if data.error}
  <p
    class="
      px-3 py-2 my-4
      text-red-600 bg-red-50
      border rounded border-red-500
    "
  >
    {data.error}
  </p>
{:else if data.data?.data?.length === 1}
  {@const stake = data.data.data[0]}
  {@const wallet = stake.withdrawal_credentials ? formatWithdrawalCredentials(stake.withdrawal_credentials) : "-"}

  <h2
    class="
      flex gap-x-2
      w-full max-w-5xl p-3
      border rounded-lg
      dark:text-white
    "
  >
    {#if stake.validator_address}
      <div use:tooltip={{ content: help.validator_address }}>
        <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_address}">
          {formatAddress(stake.validator_address, 20)}
        </ExternalLink>
      </div>

      <CopyPaste on:copy={() => navigator.clipboard.writeText(stake.validator_address ?? "")} />
    {/if}

    {#if stake.validator_index}
      <span>-</span>
      <div use:tooltip={{ content: help.validator_index }}>
        <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_index}">
          {`(${stake.validator_index})`}
        </ExternalLink>
      </div>
    {/if}
  </h2>

  <div class="max-w-5xl w-full grid grid-cols-3 gap-3">
    <Kpi
      title="Activated at"
      info={help.activated_at}
      value={stake.activated_at ? new Date(stake.activated_at).toLocaleString() : "-"}
    />
    <Kpi title="Activated epoch" info={help.activated_epoch} value={stake.activated_epoch?.toString() ?? "-"} />
    <Kpi title="Balance" info={help.balance} value={stake.balance ? `${formatEth(stake.balance, 10)} ETH` : "-"} />
    <Kpi title="Wallet" info={help.withdrawal_credentials} value={wallet} />
    <Kpi
      title="Delegated at"
      info={help.delegated_at}
      value={stake.delegated_at ? new Date(stake.delegated_at).toLocaleString() : "-"}
    />
    <Kpi title="Delegated block" info={help.delegated_block} value={stake.delegated_block?.toString() ?? "-"} />
    <Kpi title="Rewards" info={help.rewards} value={stake.rewards ? `${formatEth(stake.rewards, 10)} ETH` : "-"} />
    <Kpi
      title="Consensus rewards"
      info={help.consensus_rewards}
      value={stake.consensus_rewards ? `${formatEth(stake.consensus_rewards, 10)} ETH` : "-"}
    />
    <Kpi
      title="Execution rewards"
      info={help.execution_rewards}
      value={stake.execution_rewards ? `${formatEth(stake.execution_rewards, 10)} ETH` : "-"}
    />
    <Kpi title="Deposit tx sender" info={help.deposit_tx_sender} value={stake.deposit_tx_sender ?? "-"} />
    <Kpi
      title="Effective balance"
      info={help.effective_balance}
      value={stake.effective_balance ? `${formatEth(stake.effective_balance, 10)} ETH` : "-"}
    />
    <Kpi
      title="Execution fee recipient"
      info={help.execution_fee_recipient}
      value={stake.execution_fee_recipient ?? "-"}
    />
    <Kpi
      title="Updated at"
      info={help.updated_at}
      value={stake.updated_at ? new Date(stake.updated_at).toLocaleString() : "-"}
    />
    <Kpi title="State" info={help.state} value={stake.state} />
  </div>
{:else}
  <Table class="max-w-5xl rounded">
    <thead slot="head">
      <tr>
        <th><span use:tooltip={{ content: help.validator_address }}>Validator</span></th>
        <th><span use:tooltip={{ content: help.validator_index }}>Index</span></th>
        <th><span use:tooltip={{ content: help.state }}>Status</span></th>
        <th><span use:tooltip={{ content: help.withdrawal_credentials }}>Wallet</span></th>
        <th><span use:tooltip={{ content: help.balance }}>Balance</span></th>
        <th><span use:tooltip={{ content: help.rewards }}>Rewards</span></th>
        <th><span use:tooltip={{ content: help.gross_apy }}>GRR</span></th>
        <th><span use:tooltip={{ content: help.activated_at }}>Activated at / Epoch</span></th>
      </tr>
    </thead>

    <tbody slot="body" use:pulseLoading={Boolean($navigating)} class="[&_td:not(first-child)]:!pr-1">
      {#each data?.data?.data ?? [] as item}
        {@const wallet = item.withdrawal_credentials
          ? formatWithdrawalCredentials(item.withdrawal_credentials)
          : undefined}
        <tr class="group/row">
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
            {#if item.validator_index}
              <ExternalLink variant="beaconcha.in" href="/validator/{item.validator_index}">
                {item.validator_index}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
          <td>
            <div class="flex">
              <span class="px-2 py-1 border rounded-lg text-black {STATE_COLORS[item.state ?? '']}">
                {item.state}
              </span>
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
          <td>{formatEth(item.balance ?? "0")} ETH</td>
          <td>{formatEth(item.rewards ?? "0")} ETH</td>
          <td>
            {#if item.gross_apy}
              {item.gross_apy.toFixed(2)}%
            {:else}
              -
            {/if}
          </td>
          <td class="pr-6">
            {#if item.activated_at}
              {formatDate(item.activated_at)}
            {:else}
              -
            {/if}
            {#if item.activated_epoch}
              /
              <ExternalLink variant="beaconcha.in" href="/epoch/{item.activated_epoch}">
                {item.activated_epoch}
              </ExternalLink>
            {/if}
          </td>
          <td class="p-0">
            <div class="relative hidden group-hover/row:block">
              <div class="absolute px-2 right-0 top-1/2 -translate-y-1/2">
                <a
                  href="/{$network}/stakes?search={item.validator_address}"
                  class="
                    px-2 py-1
                    text-sm text-black
                    rounded-lg border border-blue-300
                    bg-blue-100 hover:bg-blue-200
                  "
                >
                  view stake
                </a>

                <button
                  class="
                    px-2 py-1
                    text-sm text-black
                    rounded-lg border border-green-300
                    bg-green-100 hover:bg-green-200
                  "
                  on:click={() => handleShowJSON(item)}
                >
                  json
                </button>
              </div>
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="10" class="text-center p-4">No stakes found</td>
        </tr>
      {/each}
    </tbody>

    <Paginate
      slot="pagination"
      page_size={data?.data?.pagination?.page_size ?? 0}
      page_count={data?.data?.pagination?.total_pages ?? 0}
      current_page={data?.data?.pagination?.current_page ?? 0}
    />
  </Table>
{/if}

<Modal bind:open={isModalOpen}>
  <div slot="title" class="flex justify-between border-b p-2">
    <h2>JSON</h2>

    <CopyPaste class="text-black" on:copy={() => navigator.clipboard.writeText(json)} />
  </div>

  <pre
    slot="content"
    class="
      p-2 rounded my-1
      font-mono text-black
      overflow-auto whitespace-pre-wrap
      bg-gray-100
    ">{json}</pre>
</Modal>
