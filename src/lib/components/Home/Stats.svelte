<script lang="ts">
  import type { PageServerData } from "../../../routes/[network=network]/$types";
  import { formatEth, formatNumber } from "$lib/utils";

  export let data: PageServerData["stats"];
  export let price: number;

  let stats = data?.at(0);
  let validator_count = formatNumber(stats?.active_validator_count ?? 0, 0);
  let staked_balance = formatEth(stats?.stake_balance ?? "0");
  let concensus_rewards = formatEth(stats?.consensus_rewards ?? "0");
  let execution_rewards = formatEth(stats?.execution_rewards ?? "0");
  let median_execution_rewards = formatEth(stats?.median_execution_reward ?? "0");
</script>

<section
  class="mx-4 xl:mx-auto max-w-[calc(100%-32px)] xl:max-w-6xl p-4 border w-full mb-4
   text-white bg-dark border-dark-light rounded-lg"
>
  <div class="flex gap-x-2 items-center mb-4">
    <h3 class="text-xl text-gray-300">Network stats</h3>
    <span class="text-gray-500"> / </span>
    <h3 class="text-xl text-gray-300">Last 24h</h3>
  </div>

  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
    <div class="flex flex-col gap-0.5 border-dark-light max-sm:pb-4 max-sm:border-b sm:border-r">
      <span class="text-gray-400">Active validator count</span>
      <span class="text-2xl whitespace-nowrap text-white">{validator_count}</span>
    </div>
    <div class="flex flex-col gap-0.5 md:border-dark-light md:border-r">
      <span class="text-gray-400">Staked balance</span>
      <span class="text-2xl whitespace-nowrap text-white">{staked_balance} ETH</span>
    </div>
    <div class="flex max-md:hidden flex-col gap-0.5">
      <span class="text-gray-400">ETH price</span>
      <span class="text-2xl whitespace-nowrap text-white">$ {price}</span>
    </div>
  </div>

  <div class="w-full md:hidden h-px bg-dark-light mb-4" />

  <div class="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
    <div class="flex flex-col gap-0.5 border-dark-light max-sm:pb-4 max-sm:border-b sm:border-r">
      <span class="text-gray-400">ETH price</span>
      <span class="text-2xl whitespace-nowrap text-white">$ {price}</span>
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-gray-400">Consensus rewards</span>
      <span class="text-2xl whitespace-nowrap text-white">{concensus_rewards} ETH</span>
    </div>
  </div>

  <div class="w-full h-px bg-dark-light mb-4" />

  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div class="flex max-md:hidden flex-col gap-0.5 border-dark-light border-r">
      <span class="text-gray-400">Consensus rewards</span>
      <span class="text-2xl whitespace-nowrap text-white">{concensus_rewards} ETH</span>
    </div>
    <div class="flex flex-col gap-0.5 border-dark-light max-sm:pb-4 max-sm:border-b sm:border-r">
      <span class="text-gray-400">Execution rewards</span>
      <span class="text-2xl whitespace-nowrap text-white">{execution_rewards} ETH</span>
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-gray-400">Median exec rewards</span>
      <span class="text-2xl whitespace-nowrap text-white">{median_execution_rewards} ETH</span>
    </div>
  </div>
</section>
