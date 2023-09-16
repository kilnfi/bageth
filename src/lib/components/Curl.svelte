<script lang="ts">
  import { slide } from "svelte/transition";
  import CopyPaste from "./CopyPaste.svelte";

  export let url = "";

  let show = false;
  let curl = "";
  let baseUrl = "";
  let U: URL | null = null;

  $: {
    curl = `curl --location '${url}' \\
     --header 'Authorization: Bearer {api_token}'`;
    try {
      U = new URL(url);
      baseUrl = `${U.protocol}//${U.hostname}${U.pathname}`;
    } catch {
      U = null;
      baseUrl = "";
    }
  }
</script>

{#if url && U}
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
      <div
        class="
          mt-2 p-4
          w-full relative
          flex flex-col gap-4
          bg-gray-50 border rounded-lg
        "
        in:slide={{ duration: 200 }}
        out:slide={{ duration: 200 }}
      >
        <CopyPaste
          class="absolute top-1.5 right-1.5 bg-white px-2 py-1 border rounded-lg"
          on:copy={() => navigator.clipboard.writeText(curl)}
        />

        <pre class="overflow-hidden hover:overflow-x-auto">{curl}</pre>

        <div class="w-full h-[1px] bg-gray-200" />

        <div class="font-mono flex flex-col gap-2">
          <div class="text-lg truncate">{baseUrl}</div>

          <div class="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1.5 pl-4">
            {#each U.searchParams as param}
              <span class="text-gray-700"> {param[0]} </span>
              <span class="text-gray-400"> = </span>
              <span class="overflow-x-hidden hover:overflow-x-auto"> {param[1]} </span>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
