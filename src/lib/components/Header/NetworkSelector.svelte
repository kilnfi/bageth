<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import network, { NETWORKS } from "$lib/store/network";
</script>

<div class="relative">
  <select
    class="flex gap-x-1 items-center
      pl-2 py-1 xl:pl-3 pr-8 xl:py-2
      text-white hover:text-white/60
      bg-dark hover:bg-dark/80
      transition-colors duration-200
      border-dark-light border rounded-lg
      text-base capitalize appearance-none cursor-pointer"
    value={$network}
    on:change={(e) => {
      let url = new URL($page.url);
      url.pathname = url.pathname.replace(/^\/\w+/, `/${e.currentTarget.value}`);
      if (url.toString() !== $page.url.toString()) goto(url, { noScroll: true, invalidateAll: true });
    }}
  >
    {#each NETWORKS as net}
      <option value={net}>{net}</option>
    {/each}
  </select>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="absolute top-1/2 pointer-events-none -translate-y-1/2 right-1 block w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M8 10L12 14L16 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</div>
