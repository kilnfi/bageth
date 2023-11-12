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
  <div class="w-full flex flex-col items-center">
    <button
      on:click={() => (show = !show)}
      class="pl-4 pr-2 py-0.5 w-20
        border border-t-0 rounded-br-lg rounded-bl-lg
        text-sm text-white flex gap-x-0.5 items-center
        bg-[#232540] border-[#414473]"
    >
      curl
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="{show ? 'rotate-180' : ''} transition-transform duration-200"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M8 10L12 14L16 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    {#if show}
      <div
        class="w-full relative
          flex flex-col gap-4 mt-2 p-4
          bg-[#232540] border border-[#414473] rounded-lg"
        in:slide={{ duration: 200 }}
        out:slide={{ duration: 200 }}
      >
        <CopyPaste
          class="absolute top-1.5 right-1.5 bg-white px-2 py-1 border rounded-lg"
          on:copy={() => navigator.clipboard.writeText(curl)}
        />

        <pre class="overflow-hidden text-white/90 hover:overflow-x-auto">{curl}</pre>

        <div class="w-full h-[1px] bg-[#414473]" />

        <div class="font-mono flex flex-col gap-2">
          <div class="text-lg text-white/90 truncate">{baseUrl}</div>

          <div class="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1.5 pl-4">
            {#each U.searchParams as param}
              <span class="text-white/40"> {param[0]} </span>
              <span class="text-gray-500"> = </span>
              <span class="text-white/60 overflow-x-hidden hover:overflow-x-auto"> {param[1]} </span>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
