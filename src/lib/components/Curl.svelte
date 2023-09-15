<script lang="ts">
  import { slide } from "svelte/transition";
  import CopyPaste from "./CopyPaste.svelte";

  export let url = "";

  $: curl = `curl --location '${url}' \\
     --header 'Authorization: Bearer {api_token}'`;
  let show = false;
</script>

{#if url}
  <div
    class="
      w-full max-w-5xl -mt-4
      flex flex-col items-center
    "
  >
    <button
      on:click={() => (show = !show)}
      class="
        px-2 py-0.5 w-20
        border border-t-0 rounded-br-lg rounded-bl-lg
        font-mono text-sm
        bg-blue-50
      "
    >
      {!show ? "curl" : "hide"}
    </button>

    {#if show}
      <div class="mt-2 w-full relative" in:slide={{ duration: 200 }} out:slide={{ duration: 200 }}>
        <CopyPaste
          class="absolute top-1.5 right-1.5 bg-white px-2 py-1 border rounded-lg"
          on:copy={() => navigator.clipboard.writeText(curl)}
        />

        <pre class="bg-gray-50 border whitespace-pre-wrap rounded-lg p-4 overflow-x-auto">{curl}</pre>
      </div>
    {/if}
  </div>
{/if}
