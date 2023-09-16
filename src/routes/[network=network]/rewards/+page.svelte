<script lang="ts">
  import { format } from "date-fns";
  import { formatEth } from "$lib/utils";
  import tooltip from "$lib/use/tooltip";
  import { navigating } from "$app/stores";
  import pulseLoading from "$lib/use/pulseLoading";
  import type { PageServerData } from "./$types";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import RewardsBarChart from "$lib/components/RewardsBarChart.svelte";
  import Table from "$lib/components/Table.svelte";
  import Paginate from "$lib/components/Paginate.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import CopyPaste from "$lib/components/CopyPaste.svelte";
  import Curl from "$lib/components/Curl.svelte";

  export let data: PageServerData;

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

<DatePicker class="max-w-5xl" />

<Curl url={data.url} />

<!--
    rerender the chart only when the range changes,
    but not when we change page
-->
{#key JSON.stringify(data.data?.fullData)}
  {#if data.data?.fullData && data.data?.fullData.length > 0}
    <div
      use:pulseLoading={$navigating?.type === "goto"}
      class="
        overflow-x-auto w-full max-w-5xl p-4
        bg-white dark:bg-black
        border rounded-lg
      "
    >
      <div class="w-[715px] lg:w-auto">
        <RewardsBarChart data={data.data?.fullData ?? []} />
      </div>
    </div>
  {/if}
{/key}

<Table class="max-w-5xl">
  <thead slot="head">
    <tr>
      <th><span use:tooltip={{ content: help.date }}>Date</span></th>
      <th><span use:tooltip={{ content: help.cl_apy }}>CL APY</span></th>
      <th><span use:tooltip={{ content: help.el_apy }}>EL APY</span></th>
      <th><span use:tooltip={{ content: help.balance }}>Staked balance</span></th>
      <th><span use:tooltip={{ content: help.rewards }}>Rewards</span></th>
      <th><span use:tooltip={{ content: help.gross_apy }}>GRR</span></th>
    </tr>
  </thead>

  <tbody slot="body" use:pulseLoading={Boolean($navigating)}>
    {#each data?.data?.data ?? [] as item}
      <tr class="group/row">
        <td>{format(new Date(item.date ?? 0), "yyyy-MM-dd")}</td>
        <td>
          {#if item.cl_apy}
            {item.cl_apy.toFixed(2)}%
          {:else}
            -
          {/if}
        </td>
        <td>
          {#if item.el_apy}
            {item.el_apy.toFixed(2)}%
          {:else}
            -
          {/if}
        </td>
        <td>{formatEth(item.stake_balance ?? "0")} ETH</td>
        <td>{formatEth(item.rewards ?? "0")} ETH</td>
        <td>
          {#if item.gross_apy}
            {item.gross_apy?.toFixed(2)}%
          {:else}
            -
          {/if}
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
    page_count={data?.data?.pagination.total_pages ?? 0}
    current_page={data?.data?.pagination.current_page ?? 0}
    page_size={data?.data?.pagination.page_size ?? 0}
  />
</Table>

<Modal bind:open={isModalOpen}>
  <div slot="title" class="flex justify-between border-b p-2">
    <h2 class="">JSON</h2>

    <CopyPaste class="text-black" on:copy={() => navigator.clipboard.writeText(json)} />
  </div>

  <pre slot="content" class="font-mono overflow-auto bg-gray-100 text-black p-2 rounded my-1">{json}</pre>
</Modal>
