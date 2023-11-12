<script lang="ts">
  import { format } from "date-fns";
  import { formatEth } from "$lib/utils";
  import tooltip from "$lib/use/tooltip";
  import { navigating } from "$app/stores";
  import pulseLoading from "$lib/use/pulseLoading";
  import type { PageServerData } from "./$types";
  import DatePicker from "$lib/components/ui/DatePicker.svelte";
  import RewardsBarChart from "$lib/components/Shared/RewardsGraph.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import Paginate from "$lib/components/ui/Paginate.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import CopyPaste from "$lib/components/Shared/CopyPaste.svelte";

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

<DatePicker />

<!--
  rerender the chart only when the range changes,
  but not when we change page
-->
{#key JSON.stringify(data.data?.fullData)}
  {#if data.data?.fullData}
    <RewardsBarChart data={data.data?.fullData ?? []} />
  {/if}
{/key}

<Table>
  <thead slot="head">
    <tr>
      <th><span use:tooltip={{ content: help.date }}>Date</span></th>
      <th><span use:tooltip={{ content: help.cl_apy }}>CL APY</span></th>
      <th><span use:tooltip={{ content: help.el_apy }}>EL APY</span></th>
      <th><span use:tooltip={{ content: help.balance }}>Staked balance</span></th>
      <th><span use:tooltip={{ content: help.rewards }}>Rewards</span></th>
      <th><span use:tooltip={{ content: help.gross_apy }}>GRR</span></th>
      <th>JSON</th>
    </tr>
  </thead>

  <tbody slot="body" use:pulseLoading={Boolean($navigating)}>
    {#each data?.data?.data ?? [] as item}
      <tr>
        <td>{format(new Date(item.date ?? 0), "yyyy-MM-dd")}</td>
        <td>{item.cl_apy ? `${item.cl_apy.toFixed(2)}%` : "-"}</td>
        <td>{item.el_apy ? `${item.el_apy.toFixed(2)}%` : "-"}</td>
        <td>{formatEth(item.stake_balance ?? "0")} ETH</td>
        <td>{formatEth(item.rewards ?? "0")} ETH</td>
        <td>{item.gross_apy ? `${item.gross_apy?.toFixed(2)}%` : "-"}</td>
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
  <div slot="title" class="flex justify-between text-white border-dark-light border-b p-2">
    <h2>JSON</h2>
    <CopyPaste class="text-white" on:copy={() => navigator.clipboard.writeText(json)} />
  </div>

  <pre
    slot="content"
    class="p-2 rounded my-1 text-white overflow-auto
      whitespace-pre-wrap bg-dark-light">{json}</pre>
</Modal>
