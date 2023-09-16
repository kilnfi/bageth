<script lang="ts">
  import { navigating } from "$app/stores";
  import CopyPaste from "$lib/components/CopyPaste.svelte";
  import Curl from "$lib/components/Curl.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import ExternalLink from "$lib/components/ExternalLink.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Paginate from "$lib/components/Paginate.svelte";
  import RewardsBarChart from "$lib/components/RewardsBarChart.svelte";
  import Table from "$lib/components/Table.svelte";
  import network from "$lib/store/network";
  import pulseLoading from "$lib/use/pulseLoading";
  import tooltip from "$lib/use/tooltip";
  import { formatAddress, formatDate, formatEth, formatWithdrawalCredentials } from "$lib/utils";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  let isModalOpen = false;
  let json = "";

  const STATE_COLORS: Record<string, string> = {
    active_slashed: "bg-red-200 border-red-400",
    exited_slashed: "bg-red-200 border-red-400",

    withdrawal_done: "bg-gray-200 border-gray-400",
    unknown: "bg-gray-200 border-gray-400",
    unstaked: "bg-gray-200 border-gray-400",

    active_exiting: "bg-orange-200 border-orange-400",
    exited_unslashed: "bg-orange-200 border-orange-400",
    exit_requested: "bg-orange-200 border-orange-400",
    pending_queued: "bg-orange-200 border-orange-400",
    deposit_in_progress: "bg-orange-200 border-orange-400",
    pending_initialized: "bg-orange-200 border-orange-400",
    withdrawal_possible: "bg-orange-200 border-orange-400",

    active_ongoing: "bg-green-200 border-green-400",
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

{#if data.data?.data?.length === 1}
  {@const stake = data.data.data[0]}
  {@const wallet = stake.withdrawal_credentials ? formatWithdrawalCredentials(stake.withdrawal_credentials) : undefined}

  <h2
    class="
      grid sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8
      w-full max-w-5xl px-4 py-3
      border rounded-lg
      dark:text-white
    "
  >
    {#if stake.validator_address}
      <div class="flex flex-col gap-0.5 items-start">
        <span class="text-gray-500 dark:text-gray-300" use:tooltip={{ content: help.validator_address }}>Stake</span>

        <div class="flex items-center gap-2">
          <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_address}" class="text-lg break-all">
            {formatAddress(stake.validator_address, 16)}
          </ExternalLink>

          <CopyPaste on:copy={() => navigator.clipboard.writeText(stake.validator_address ?? "")} />
        </div>
      </div>
    {/if}

    <div class="h-[1px] w-full sm:h-full sm:w-[1px] bg-gray-200" />

    {#if stake.validator_index}
      <div class="flex flex-col gap-0.5 items-start">
        <span class="text-gray-500 dark:text-gray-300" use:tooltip={{ content: help.validator_index }}>Index</span>

        <div class="flex items-center gap-2">
          <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_index}">
            {stake.validator_index}
          </ExternalLink>

          <CopyPaste on:copy={() => navigator.clipboard.writeText(stake.validator_index?.toString() ?? "")} />
        </div>
      </div>
    {/if}
  </h2>

  <div class="grid md:grid-cols-2 w-full max-w-5xl gap-4 [&>*]:overflow-auto">
    <div class="flex flex-col gap-8 p-5 border rounded-lg">
      <div class="flex flex-col gap-y-0.5 items-start">
        <span class="text-gray-500 dark:text-gray-300" use:tooltip={{ content: help.rewards }}>Rewards</span>
        <span class="text-3xl font-mono dark:text-white whitespace-nowrap">
          {stake.rewards ? `${formatEth(stake.rewards, 17)} ETH` : "-"}
        </span>
      </div>

      <div class="flex gap-5">
        <div class="relative pt-4 px-3 pb-2 border rounded-lg">
          <span
            class="absolute text-sm top-[-14px] left-2.5 px-1 rounded-lg border bg-blue-200 border-blue-400"
            use:tooltip={{ content: help.consensus_rewards }}
          >
            consensus rewards
          </span>
          <span class="text-lg font-mono whitespace-nowrap text-gray-500 dark:text-gray-100">
            {stake.consensus_rewards ? `${formatEth(stake.consensus_rewards, 10)} ETH` : "-"}
          </span>
        </div>

        <div class="relative pt-4 px-3 pb-2 border rounded-lg">
          <span
            class="absolute text-sm top-[-14px] left-2.5 px-1 rounded-lg border bg-green-200 border-green-400"
            use:tooltip={{ content: help.execution_rewards }}
          >
            execution rewards
          </span>
          <span class="text-lg font-mono whitespace-nowrap text-gray-500 dark:text-gray-100">
            {stake.execution_rewards ? `${formatEth(stake.execution_rewards, 10)} ETH` : "-"}
          </span>
        </div>
      </div>
    </div>

    <div class="border flex flex-col gap-3 p-5 rounded-lg">
      <div class="flex flex-col gap-y-0.5 items-start">
        <span class="text-gray-500 dark:text-gray-300" use:tooltip={{ content: help.state }}>Status</span>
        <span
          class="
            text-2xl font-mono text-gray-600
            px-4 py-2
            rounded-2xl border-2 {STATE_COLORS[stake.state ?? '']}
          "
        >
          {stake.state}
        </span>
      </div>

      <div class="flex flex-col gap-y-1.5 items-start">
        <span class="text-gray-500 dark:text-gray-300" use:tooltip={{ content: help.updated_at }}>Updated at</span>
        <span class="text-xl font-mono text-gray-700 dark:text-white">
          {stake.updated_at ? new Date(stake.updated_at).toLocaleString() : "-"}
        </span>
      </div>
    </div>
  </div>

  <div class="grid md:grid-cols-2 w-full max-w-5xl gap-4 [&>*]:overflow-auto">
    <Table>
      <tbody slot="body">
        <tr>
          <td class="border-r" use:tooltip={{ content: help.activated_at }}>Activated at</td>
          <td>{stake.activated_at ? new Date(stake.activated_at).toLocaleString() : "-"}</td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.activated_epoch }}>Activated epoch</td>
          <td>
            {#if stake.activated_epoch}
              <ExternalLink variant="beaconcha.in" href="/epoch/{stake.activated_epoch}">
                {stake.activated_epoch}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.delegated_at }}>Delegated at</td>
          <td>{stake.delegated_at ? new Date(stake.delegated_at).toLocaleString() : "-"}</td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.delegated_block }}>Delegated block</td>
          <td>
            {#if stake.delegated_block}
              <ExternalLink variant="beaconcha.in" href="/block/{stake.delegated_block}">
                {stake.delegated_block}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        </tr>
      </tbody>
    </Table>

    <Table>
      <tbody slot="body">
        <tr>
          <td class="border-r" use:tooltip={{ content: help.balance }}>Balance</td>
          <td>{stake.balance ? `${formatEth(stake.balance, 10)} ETH` : "-"}</td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.effective_balance }}>Effective balance</td>
          <td>{stake.effective_balance ? `${formatEth(stake.effective_balance, 10)} ETH` : "-"}</td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.withdrawal_credentials }}>Withdrawal credentials</td>
          <td>
            {#if wallet}
              <ExternalLink variant="etherscan.io" href="/address/{wallet}">
                {formatAddress(wallet, 12)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        </tr>
        <tr>
          <td class="border-r" use:tooltip={{ content: help.execution_fee_recipient }}>Execution fee recipient</td>
          <td>
            {#if stake.execution_fee_recipient}
              <ExternalLink variant="etherscan.io" href="/address/{stake.execution_fee_recipient}">
                {formatAddress(stake.execution_fee_recipient, 12)}
              </ExternalLink>
            {:else}
              -
            {/if}
          </td>
        </tr>
      </tbody>
    </Table>
  </div>

  <DatePicker />

  {#key JSON.stringify(data.rewards)}
    <div
      class="
        overflow-x-auto
        relative w-full max-w-5xl p-4
        bg-white dark:bg-black
        border rounded-lg mb-10
      "
      use:pulseLoading={Boolean($navigating)}
    >
      <div class="w-[715px] lg:w-auto">
        <RewardsBarChart data={data.rewards ?? []} />
      </div>

      {#if data.rewards?.length === 0}
        <div
          class="
            absolute top-0 left-0 w-full h-full
            flex justify-center items-center
            bg-white/60 backdrop-blur-sm
          "
        >
          <p class="text-center px-6 py-3 bg-white rounded-lg border">No rewards found</p>
        </div>
      {/if}
    </div>
  {/key}
{:else}
  <Table class="max-w-5xl">
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
