<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
  import { navigating, page } from "$app/stores";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import network from "$lib/store/network";

  const tabs = ["stakes", "rewards", "operations"] as const;

  let active = tabs.find((e) => $page.route.id?.endsWith(e)) ?? tabs[0];

  $: search = $page.url.searchParams.get("search") ?? "";
  $: loading = $navigating?.type === "form";

  beforeNavigate(({ from, to, cancel }) => {
    if (!to || !from) return;

    // if we exit the (search) layout we don't persist any search query
    if (tabs.every((tab) => !to.route.id?.includes(`/${tab}`))) return;

    // persist the search query
    if (from.url.searchParams.has("search") && !to.url.searchParams.has("search")) {
      cancel();
      to.url.searchParams.set("search", from.url.searchParams.get("search")!);
      goto(to.url);
    }
  });

  afterNavigate((url) => {
    active = tabs.find((e) => url.to?.route.id?.endsWith(e)) ?? tabs[0];
  });
</script>

<SearchForm {loading} {search} />

<Tab {active} {tabs}>
  <a slot="tab" let:tab href="/{$network}/{tab}" class="p-2">{tab}</a>
</Tab>

<slot />
