<script lang="ts">
  import { navigating, page } from "$app/stores";
  import SearchForm from "$lib/components/SearchForm.svelte";
  import persistedSearchParams from "$lib/store/persistedSearchParams";

  $: search = $page.url.searchParams.get("search") ?? "";
  $: loading = $navigating?.type === "form";

  $: {
    // persist the search for all routes
    persistedSearchParams.update((u) => {
      u.set("search", search);
      return u;
    });
  }
</script>

<SearchForm {loading} {search} />

<slot />
