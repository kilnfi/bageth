<script lang="ts">
  import SearchForm from "$lib/components/SearchForm.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import Stakes from "$lib/components/Stakes.svelte";
  import Rewards from "$lib/components/Rewards.svelte";
  import type { PageServerData } from "./$types";
  import Operations from "$lib/components/Operations.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { applyStateMachine, context } from "$lib/store/context";
  import { onMount } from "svelte";
  import Curl from "$lib/components/Curl.svelte";
  import Seo from "$lib/components/Seo.svelte";

  export let data: PageServerData;

  const tabs = ["stakes", "rewards", "operations"] as const;

  $context.type = data.type ?? "stakes";
  $context.search = data.search || "";

  onMount(() => {
    // if network was not set on the server try to read the local storage
    if ($context.network === undefined) {
      $context.network = localStorage.getItem("network") === "mainnet" ? "mainnet" : "testnet";
    }

    const unsub = context.subscribe(async (ctx) => {
      let initialUrl = $page.url.toString();

      applyStateMachine($page, ctx);

      // Prevent unnecessary navigation
      if (initialUrl === $page.url.toString()) return;

      goto($page.url.toString(), { invalidateAll: true, noScroll: true });
    });

    return unsub;
  });
</script>

<Seo />

<Tab active={$context.type} {tabs}>
  {#each tabs as t}
    <button on:click={() => ($context.type = t)}>{t}</button>
  {/each}
</Tab>

<Curl url={data.url} />

<SearchForm error={data.error} search={$context.search} />

<div class="w-full flex flex-col items-center gap-y-10">
  {#if data.type === "rewards"}
    <Rewards data={data.data} />
  {:else if data.type === "stakes"}
    <!-- spacer div  -->
    <div />
    <Stakes data={data.data} />
  {:else if data.type === "operations"}
    <Operations data={data.data} />
  {/if}
</div>
