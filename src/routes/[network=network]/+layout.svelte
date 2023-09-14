<script lang="ts">
  import { beforeNavigate, goto, onNavigate } from "$app/navigation";
  import { navigating, page } from "$app/stores";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import network from "$lib/store/network";

  const tabs = ["stakes", "rewards", "operations"] as const;

  let active = tabs.find((e) => $page.route.id?.endsWith(e)) ?? tabs[0];

  $: search = $page.url.searchParams.get("search") ?? "";
  $: loading = $navigating?.type === "form";

  onNavigate((url) => {
    active = tabs.find((e) => url.to?.route.id?.endsWith(e)) ?? tabs[0];
  });

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
</script>

<SearchForm {loading} {search} />

<slot />
