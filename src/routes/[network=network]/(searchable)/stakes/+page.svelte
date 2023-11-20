<script lang="ts">
  import { goto } from "$app/navigation";
  import { navigating } from "$app/stores";
  import CopyPaste from "$lib/components/Shared/CopyPaste.svelte";
  import DatePicker from "$lib/components/ui/DatePicker.svelte";
  import ExternalLink from "$lib/components/Shared/ExternalLink.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Paginate from "$lib/components/ui/Paginate.svelte";
  import RewardsBarChart from "$lib/components/Shared/RewardsGraph.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import network from "$lib/store/network";
  import pulseLoading from "$lib/use/pulseLoading";
  import tooltip from "$lib/use/tooltip";
  import { formatAddress, formatDate, formatEth, formatWithdrawalCredentials } from "$lib/utils";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  let isModalOpen = false;
  let json = "";

  const STATE_COLORS: Record<string, string> = {
    active_slashed: "bg-red-[#532222] border-[#753030]",
    exited_slashed: "bg-red-[#532222] border-[#753030]",

    withdrawal_done: "bg-[#494949] border-[#6E6E6E]",
    unknown: "bg-[#494949] border-[#6E6E6E]",
    unstaked: "bg-[#494949] border-[#6E6E6E]",

    active_exiting: "bg-[#504D1A] border-[#736F27]",
    exited_unslashed: "bg-[#504D1A] border-[#736F27]",
    exit_requested: "bg-[#504D1A] border-[#736F27]",
    pending_queued: "bg-[#504D1A] border-[#736F27]",
    deposit_in_progress: "bg-[#504D1A] border-[#736F27]",
    pending_initialized: "bg-[#504D1A] border-[#736F27]",
    withdrawal_possible: "bg-[#504D1A] border-[#736F27]",

    active_ongoing: "bg-[#35472C] border-[#547246]",
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

{#if data.data?.data?.length === 1}
  {@const stake = data.data.data[0]}
  {@const wallet = stake.withdrawal_credentials ? formatWithdrawalCredentials(stake.withdrawal_credentials) : undefined}

  <h2
    class="grid sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8
      w-full px-4 py-3
      border border-dark-light rounded-lg
      text-white bg-dark mb-4"
  >
    {#if stake.validator_address}
      <div class="flex flex-col gap-0.5 items-start">
        <span class="text-gray-400" use:tooltip={{ content: help.validator_address }}>Stake</span>

        <div class="flex items-center gap-2">
          <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_address}" class="text-lg break-all">
            {formatAddress(stake.validator_address, 16)}
          </ExternalLink>

          <CopyPaste on:copy={() => navigator.clipboard.writeText(stake.validator_address ?? "")} />
        </div>
      </div>
    {/if}

    <div class="h-[1px] w-full sm:h-full sm:w-[1px] bg-dark-light" />

    {#if stake.validator_index}
      <div class="flex flex-col gap-0.5 items-start">
        <span class="text-gray-400" use:tooltip={{ content: help.validator_index }}>Index</span>

        <div class="flex items-center gap-2">
          <ExternalLink variant="beaconcha.in" href="/validator/{stake.validator_index}">
            {stake.validator_index}
          </ExternalLink>

          <CopyPaste on:copy={() => navigator.clipboard.writeText(stake.validator_index?.toString() ?? "")} />
        </div>
      </div>
    {/if}
  </h2>

  <div class="grid md:grid-cols-2 mb-4 gap-4 [&>*]:overflow-auto">
    <div class="flex flex-col gap-8 p-5 border bg-dark border-dark-light rounded-lg">
      <div class="flex flex-col gap-y-0.5 items-start">
        <span class="text-gray-400" use:tooltip={{ content: help.rewards }}>Rewards</span>
        <span class="text-3xl whitespace-nowrap text-white">
          {stake.rewards ? `${formatEth(stake.rewards, 17)} ETH` : "-"}
        </span>
      </div>

      <div class="flex gap-5">
        <div class="relative flex w-1/2 pt-4 px-3 pb-2 border border-dark-light rounded-lg">
          <span
            class="absolute text-white text-sm top-[-16px] left-3.5 px-2 py-0.5 rounded-lg border bg-[#3F606F] border-[#548296]"
            use:tooltip={{ content: help.consensus_rewards }}
          >
            consensus rewards
          </span>
          <span class="text-lg whitespace-nowrap text-white">
            {stake.consensus_rewards ? `${formatEth(stake.consensus_rewards, 6)} ETH` : "-"}
          </span>
        </div>

        <div class="relative w-1/2 pt-4 px-3 pb-2 border border-dark-light rounded-lg">
          <span
            class="absolute text-white text-sm top-[-16px] left-3.5 px-2 py-0.5 rounded-lg border bg-[#463F6E] border-[#625997]"
            use:tooltip={{ content: help.execution_rewards }}
          >
            execution rewards
          </span>
          <span class="text-lg whitespace-nowrap text-white">
            {stake.execution_rewards ? `${formatEth(stake.execution_rewards, 6)} ETH` : "-"}
          </span>
        </div>
      </div>
    </div>

    <div class="border border-dark-light bg-dark flex flex-col gap-3 p-5 rounded-lg">
      <div class="flex flex-col gap-y-0.5 items-start">
        <span class="text-gray-400" use:tooltip={{ content: help.state }}>Status</span>
        <span class="text-2xl text-white px-4 py-2 rounded-2xl border-2 {STATE_COLORS[stake.state ?? '']}">
          {stake.state}
        </span>
      </div>

      <div class="flex flex-col gap-y-1.5 items-start">
        <span class="text-gray-400" use:tooltip={{ content: help.updated_at }}>Updated at</span>
        <span class="text-xl text-white">{stake.updated_at ? new Date(stake.updated_at).toLocaleString() : "-"} </span>
      </div>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4 mb-4 [&>*]:overflow-auto">
    <Table>
      <tbody slot="body">
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.activated_at }}>Activated at</td>
          <td>{stake.activated_at ? new Date(stake.activated_at).toLocaleString() : "-"}</td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.activated_epoch }}>Activated epoch</td>
          <td>
            {#if stake.activated_epoch}
              <ExternalLink variant="beaconcha.in" href="/epoch/{stake.activated_epoch}">
                {stake.activated_epoch}
              </ExternalLink>
            {:else}-{/if}
          </td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.delegated_at }}>Delegated at</td>
          <td>{stake.delegated_at ? new Date(stake.delegated_at).toLocaleString() : "-"}</td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.delegated_block }}>Delegated block</td>
          <td>
            {#if stake.delegated_block}
              <ExternalLink variant="beaconcha.in" href="/block/{stake.delegated_block}">
                {stake.delegated_block}
              </ExternalLink>
            {:else}-{/if}
          </td>
        </tr>
      </tbody>
    </Table>

    <Table>
      <tbody slot="body">
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.balance }}>Balance</td>
          <td>{stake.balance ? `${formatEth(stake.balance, 10)} ETH` : "-"}</td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.effective_balance }}>
            Effective balance
          </td>
          <td>{stake.effective_balance ? `${formatEth(stake.effective_balance, 10)} ETH` : "-"}</td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.withdrawal_credentials }}>
            Withdrawal credentials
          </td>
          <td>
            {#if wallet}
              <ExternalLink variant="etherscan.io" href="/address/{wallet}">
                {formatAddress(wallet, 12)}
              </ExternalLink>
            {:else}-{/if}
          </td>
        </tr>
        <tr>
          <td class="border-r border-dark-light" use:tooltip={{ content: help.execution_fee_recipient }}>
            Execution fee recipient
          </td>
          <td>
            {#if stake.execution_fee_recipient}
              <ExternalLink variant="etherscan.io" href="/address/{stake.execution_fee_recipient}">
                {formatAddress(stake.execution_fee_recipient, 12)}
              </ExternalLink>
            {:else}-{/if}
          </td>
        </tr>
      </tbody>
    </Table>
  </div>

  <DatePicker />

  {#key JSON.stringify(data.rewards)}
    <RewardsBarChart data={data.rewards ?? []} />
  {/key}
{:else}
  <Table>
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
        <th>JSON</th>
      </tr>
    </thead>

    <tbody
      slot="body"
      use:pulseLoading={Boolean($navigating)}
      class="{data.data?.data !== undefined && data.data?.data.length > 0
        ? '[&>tr]:cursor-pointer'
        : ''} [&_td:not(first-child)]:!pr-1"
    >
      {#each data?.data?.data ?? [] as item}
        {@const wallet = item.withdrawal_credentials
          ? formatWithdrawalCredentials(item.withdrawal_credentials)
          : undefined}
        <tr on:click={() => goto(`/${$network}/stakes?search=${item.validator_address}`)}>
          <td on:click|stopPropagation>
            {#if item.validator_address}
              <ExternalLink variant="beaconcha.in" href="/validator/{item.validator_address}">
                {formatAddress(item.validator_address)}
              </ExternalLink>
            {:else}-{/if}
          </td>
          <td on:click|stopPropagation>
            {#if item.validator_index}
              <ExternalLink variant="beaconcha.in" href="/validator/{item.validator_index}">
                {item.validator_index}
              </ExternalLink>
            {:else}-{/if}
          </td>
          <td>
            <div class="flex">
              <span class="px-2 py-1 border rounded-lg {STATE_COLORS[item.state ?? '']}">
                {item.state}
              </span>
            </div>
          </td>
          <td on:click|stopPropagation>
            {#if wallet}
              <ExternalLink variant="etherscan.io" href="/address/{wallet}">
                {formatAddress(wallet)}
              </ExternalLink>
            {:else}-{/if}
          </td>
          <td>{formatEth(item.balance ?? "0")} ETH</td>
          <td>{formatEth(item.rewards ?? "0")} ETH</td>
          <td>{item.gross_apy ? `${item.gross_apy.toFixed(2)}%` : "-"}</td>
          <td on:click|stopPropagation>
            {item.activated_at ? formatDate(item.activated_at) : "-"}
            {#if item.activated_epoch}
              / <ExternalLink variant="beaconcha.in" href="/epoch/{item.activated_epoch}">
                {item.activated_epoch}
              </ExternalLink>
            {/if}
          </td>
          <td>
            <button on:click|stopPropagation={() => handleShowJSON(item)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.16667 5H7.83333V6.66667H6.16667V10.8333C6.16667 11.2754 5.99107 11.6993 5.67851 12.0118C5.36595 12.3244 4.94203 12.5 4.5 12.5C4.94203 12.5 5.36595 12.6756 5.67851 12.9882C5.99107 13.3007 6.16667 13.7246 6.16667 14.1667V18.3333H7.83333V20H6.16667C5.275 19.775 4.5 19.25 4.5 18.3333V15C4.5 14.7811 4.45689 14.5644 4.37313 14.3622C4.28937 14.16 4.16661 13.9763 4.01184 13.8215C3.85708 13.6667 3.67335 13.544 3.47114 13.4602C3.26893 13.3764 3.0522 13.3333 2.83333 13.3333H2V11.6667H2.83333C3.27536 11.6667 3.69928 11.4911 4.01184 11.1785C4.32441 10.866 4.5 10.442 4.5 10V6.66667C4.5 6.22464 4.67559 5.80072 4.98816 5.48816C5.30072 5.17559 5.72464 5 6.16667 5ZM17.8333 5C18.2754 5 18.6993 5.17559 19.0118 5.48816C19.3244 5.80072 19.5 6.22464 19.5 6.66667V10C19.5 10.442 19.6756 10.866 19.9882 11.1785C20.3007 11.4911 20.7246 11.6667 21.1667 11.6667H22V13.3333H21.1667C20.9478 13.3333 20.7311 13.3764 20.5289 13.4602C20.3267 13.544 20.1429 13.6667 19.9882 13.8215C19.8334 13.9763 19.7106 14.16 19.6269 14.3622C19.5431 14.5644 19.5 14.7811 19.5 15V18.3333C19.5 18.7754 19.3244 19.1993 19.0118 19.5118C18.6993 19.8244 18.2754 20 17.8333 20H16.1667V18.3333H17.8333V14.1667C17.8333 13.7246 18.0089 13.3007 18.3215 12.9882C18.634 12.6756 19.058 12.5 19.5 12.5C19.058 12.5 18.634 12.3244 18.3215 12.0118C18.0089 11.6993 17.8333 11.2754 17.8333 10.8333V6.66667H16.1667V5H17.8333ZM12 15C12.221 15 12.433 15.0878 12.5893 15.2441C12.7455 15.4004 12.8333 15.6123 12.8333 15.8333C12.8333 16.0543 12.7455 16.2663 12.5893 16.4226C12.433 16.5789 12.221 16.6667 12 16.6667C11.779 16.6667 11.567 16.5789 11.4107 16.4226C11.2545 16.2663 11.1667 16.0543 11.1667 15.8333C11.1667 15.6123 11.2545 15.4004 11.4107 15.2441C11.567 15.0878 11.779 15 12 15ZM8.66667 15C8.7761 15 8.88446 15.0216 8.98557 15.0634C9.08667 15.1053 9.17854 15.1667 9.25592 15.2441C9.3333 15.3215 9.39469 15.4133 9.43657 15.5144C9.47845 15.6155 9.5 15.7239 9.5 15.8333C9.5 16.0543 9.4122 16.2663 9.25592 16.4226C9.09964 16.5789 8.88768 16.6667 8.66667 16.6667C8.44565 16.6667 8.23369 16.5789 8.07741 16.4226C7.92113 16.2663 7.83333 16.0543 7.83333 15.8333C7.83333 15.6123 7.92113 15.4004 8.07741 15.2441C8.23369 15.0878 8.44565 15 8.66667 15ZM15.3333 15C15.5543 15 15.7663 15.0878 15.9226 15.2441C16.0789 15.4004 16.1667 15.6123 16.1667 15.8333C16.1667 16.0543 16.0789 16.2663 15.9226 16.4226C15.7663 16.5789 15.5543 16.6667 15.3333 16.6667C15.1123 16.6667 14.9004 16.5789 14.7441 16.4226C14.5878 16.2663 14.5 16.0543 14.5 15.8333C14.5 15.6123 14.5878 15.4004 14.7441 15.2441C14.9004 15.0878 15.1123 15 15.3333 15Z"
                  fill="white"
                />
              </svg>
            </button>
          </td>
          <td>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 16L14 12L10 8"
                stroke="white"
                stroke-opacity="0.5"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </td>
        </tr>
      {:else}
        <td colspan="10" class="text-center p-4">No stakes found</td>
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
  <div slot="title" class="flex justify-between text-white border-dark-light border-b p-2">
    <h2>JSON</h2>

    <CopyPaste on:copy={() => navigator.clipboard.writeText(json)} />
  </div>

  <pre
    slot="content"
    class="p-2 rounded my-1 text-white
      overflow-auto whitespace-pre-wrap
      bg-dark-light">{json}</pre>
</Modal>
