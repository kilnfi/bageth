<script lang="ts">
  import SearchForm from "$lib/components/SearchForm.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import Stakes from "$lib/components/Stakes.svelte";
  import Rewards from "$lib/components/Rewards.svelte";
  import type { PageServerData } from "./$types";
  import Operations from "$lib/components/Operations.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { context } from "$lib/store/context";
  import { onMount } from "svelte";
  import Curl from "$lib/components/Curl.svelte";
  import Seo from "$lib/components/Seo.svelte";

  export let data: PageServerData;

  const tabs = ["stakes", "rewards", "operations"] as const;

  $context.type = data.type ?? "stakes";
  $context.search = data.search || "";

  onMount(() => {
    const unsub = context.subscribe(async (ctx) => {
      let initialUrl = $page.url.toString();
      let hasChangedType = ctx.type !== $page.url.searchParams.get("type");

      $page.url.searchParams.set("search", ctx.search);
      $page.url.searchParams.set("type", ctx.type);

      // all pages have pagination
      $page.url.searchParams.set("current_page", ctx.current_page.toString());
      $page.url.searchParams.set("page_size", ctx.page_size.toString());

      if (ctx.type === "rewards") {
        $page.url.searchParams.set("start_date", ctx.start_date);
        $page.url.searchParams.set("end_date", ctx.end_date);
      }

      if (ctx.type === "operations") {
        $page.url.searchParams.set("tab", ctx.tab);
      }

      // reset pagination
      if (hasChangedType) {
        $page.url.searchParams.delete("current_page");
        $page.url.searchParams.delete("page_size");
        $page.url.searchParams.delete("start_date");
        $page.url.searchParams.delete("end_date");
        $page.url.searchParams.delete("tab");
      }

      // Prevent unnecessary navigation
      if (initialUrl === $page.url.toString()) {
        return;
      }

      goto($page.url.toString(), { invalidateAll: true, noScroll: true });
    });

    return unsub;
  });
</script>

<Seo  />

<Tab active={$context.type} {tabs}>
  {#each tabs as t}
    <button on:click={() => ($context.type = t)}>/{t}</button>
  {/each}
</Tab>

<Curl url={data.url} />

<SearchForm error={data.error} search={$context.search} />

<div
  class="w-full sm:w-11/12 md:w-10/12 xl:w-8/12 flex flex-col items-center gap-y-10"
>
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
