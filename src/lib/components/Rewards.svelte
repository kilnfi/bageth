<script lang="ts">
  import CopyPaste from "./CopyPaste.svelte";
  import RewardsChart from "./RewardsChart.svelte";
  import DatePicker from "./DatePicker.svelte";
  import type { PageServerData } from "../../routes/$types";
  import { format } from "date-fns";
  import { formatEth } from "$lib/utils";
  import Modal from "./Modal.svelte";
  import Table from "./Table.svelte";
  import tooltip from "$lib/use/tooltip";
  import Paginate from "./Paginate.svelte";
  import { navigating } from "$app/stores";
  import pulseLoading from "$lib/use/pulseLoading";

  export let data: Extract<PageServerData, { type: "rewards" }>["data"];

  let isModalOpen = false;
  let json = "";

  function handleShowJSON(item: any) {
    json = JSON.stringify(item, null, 2);
    isModalOpen = true;
  }

  const help = {
    date: "Day for this reward entry",
    cl_apy: "Consensus annual percentage yield",
    el_apy: "Execution annual percentage yield",
    balance: "Sum of effective balances that contributed to these rewards",
    rewards: "Accumulated consensus and execution rewards during the day",
    gross_apy: "Gross annual percentage yield",
  };
</script>

<DatePicker class="max-w-4xl" />

<!-- rerender the chart only when the range changes,
       but not when we change page -->
{#key JSON.stringify(data.fullData)}
  {#if data.fullData.length > 0}
    <div
      class="overflow-x-auto w-full max-w-4xl border p-4 rounded-lg bg-white dark:bg-black"
    >
      <div
        use:pulseLoading={$navigating?.type === "goto"}
        class="w-[715px] lg:w-auto"
      >
        <RewardsChart {data} />
      </div>
    </div>
  {/if}
{/key}

<Table class="max-w-7xl">
  <thead slot="head">
    <th><span use:tooltip={{ content: help.date }}>Date</span></th>
    <th><span use:tooltip={{ content: help.cl_apy }}>CL APY</span></th>
    <th><span use:tooltip={{ content: help.el_apy }}>EL APY</span></th>
    <th>
      <span use:tooltip={{ content: help.balance }}>Staked balance</span>
    </th>
    <th><span use:tooltip={{ content: help.rewards }}>Rewards</span></th>
    <th><span use:tooltip={{ content: help.gross_apy }}>GRR</span></th>
  </thead>

  <tbody slot="body" use:pulseLoading={$navigating?.type === "goto"}>
    {#each data?.data ?? [] as item}
      <tr class="group/row">
        <td>{format(new Date(item.date ?? 0), "yyyy-MM-dd")}</td>
        <td>
          {#if item.cl_apy} {item.cl_apy.toFixed(2)}% {:else} - {/if}
        </td>
        <td>
          {#if item.el_apy} {item.el_apy.toFixed(2)}% {:else} - {/if}
        </td>
        <td>{formatEth(item.stake_balance ?? "0")} ETH</td>
        <td>{formatEth(item.rewards ?? "0")} ETH</td>
        <td>
          {#if item.gross_apy} {item.gross_apy?.toFixed(2)}% {:else} - {/if}
        </td>
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
      <td colspan="10" class="text-center p-4">No rewards found</td>
    {/each}
  </tbody>

  <Paginate
    slot="pagination"
    count={data.pagination.total_pages}
    index={data.pagination.current_page}
    size={data.pagination.page_size}
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
