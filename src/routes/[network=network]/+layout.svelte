<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { navigating, page } from "$app/stores";
  import SearchForm from "$lib/components/SearchForm.svelte";

  const tabs = ["stakes", "rewards", "operations"] as const;

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
</script>

<SearchForm {loading} {search} />

<slot />
