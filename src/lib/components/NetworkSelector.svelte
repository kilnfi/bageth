<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import network, { NETWORKS } from "$lib/store/network";
</script>

<select
  class="
    px-1.5 py-1
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
