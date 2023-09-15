<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import network, { NETWORKS } from "$lib/store/network";

  onMount(() => {
    const unsub = network.subscribe((value) => {
      console.log("network", value);
      let url = new URL($page.url);
      url.pathname = url.pathname.replace(/^\/\w+/, `/${value}`);
      if (url.toString() !== $page.url.toString()) {
        goto(url, { noScroll: true, invalidateAll: true });
      }
    });

    return unsub;
  });
</script>

<select
  class="
    px-1.5 py-1
    bg-black dark:bg-white
    text-white dark:text-black
    border rounded-md
  "
  bind:value={$network}
>
  {#each NETWORKS as net}
    <option value={net}>{net}</option>
  {/each}
</select>
