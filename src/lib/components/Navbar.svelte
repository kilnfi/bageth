<script lang="ts">
  import { page } from "$app/stores";
  import network from "$lib/store/network";
  import persistedSearchParams from "$lib/store/persistedSearchParams";
  import Tabs from "./Tabs.svelte";

  const links = ["stakes", "rewards", "operations"] as const;

  let activeColor = "#FFF";
  let hovering: string | null = null;

  function defaultActive(page: typeof $page) {
    return links.find((e) => page.route.id?.endsWith(e)) ?? null;
  }

  $: active = defaultActive($page);
</script>

<Tabs
  tabs={links}
  active={hovering ?? active}
  {activeColor}
  on:mouseleave={() => {
    activeColor = "#FFF";
    hovering = null;
  }}
>
  <a
    slot="tab"
    let:tab
    href="/{$network}/{tab}?{$persistedSearchParams.toString()}"
    on:click={() => {
      activeColor = "#FFF";
    }}
    on:mouseenter={() => {
      activeColor = "#FFF";
      hovering = tab;
    }}
    class="py-1 px-3 w-full dark:text-white"
  >
    {tab}
  </a>
</Tabs>
