<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import network, { NETWORKS } from "$lib/store/network";
</script>

<div class="relative">
  <select
    class="
      pl-2 pr-2.5 py-0.5 appearance-none w-24
      bg-black dark:bg-white
      text-white dark:text-black
      border rounded-md
    "
    value={$network}
    on:change={(e) => {
      let url = new URL($page.url);
      url.pathname = url.pathname.replace(/^\/\w+/, `/${e.currentTarget.value}`);
      if (url.toString() !== $page.url.toString()) {
        goto(url, { noScroll: true, invalidateAll: true });
      }
    }}
  >
    {#each NETWORKS as net}
      <option value={net}>{net}</option>
    {/each}
  </select>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2.5"
    stroke="currentColor"
    class="w-4 h-4 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
</div>
