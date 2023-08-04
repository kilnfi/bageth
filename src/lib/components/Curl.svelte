<script lang="ts">
  import { slide } from "svelte/transition";
  import CopyPaste from "./CopyPaste.svelte";

  export let url = "";

  $: curl = `curl --location '${url}' \\
     --header 'Authorization: Bearer {api_token}'`;
  let show = false;
</script>

{#if url}
  <div class="flex -mb-4 flex-col items-center w-full max-w-lg">
    <button
      on:click={() => (show = !show)}
      class="px-2 py-0.5 border border-b-0 rounded-tr-lg rounded-tl-lg bg-blue-50"
    >
      {!show ? "show" : "hide"} url
    </button>

    {#if show}
      <div
        class="mb-2 w-full relative"
        in:slide={{ duration: 200 }}
        out:slide={{ duration: 200 }}
      >
        <CopyPaste
          class="absolute top-1.5 right-1.5 bg-white px-2 py-1 border rounded-lg"
          on:copy={() => navigator.clipboard.writeText(curl)}
        />

        <pre
          class="bg-gray-50 border rounded-lg p-4 overflow-x-auto">{curl}</pre>
      </div>
    {/if}
  </div>
{/if}
