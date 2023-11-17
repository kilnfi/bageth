<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Curl from "$lib/components/Shared/Curl.svelte";
  import ExportCsv from "$lib/components/Shared/ExportCsv.svelte";
  import SearchForm from "$lib/components/Shared/SearchForm.svelte";
  import type { LayoutRouteId } from "./$types";

  $: search = $page.url.searchParams.get("search") ?? "";
  $: type = ($page.route.id as LayoutRouteId).split("(searchable)")[1].replace("/", "");

  beforeNavigate((e) => {
    if (
      e.to && // there is a destination
      e.to.route.id?.includes("(searchable)") && // it is in the searchbar context
      !e.to.url.searchParams.has("search") && // it doesn't have a search param
      search // we have smth to search for
    ) {
      e.to.url.searchParams.set("search", search);
      e.cancel();
      goto(e.to.url);
    }
  });
</script>

<div class="grow max-sm:mx-4 max-w-[calc(100%-32px)] xl:max-w-6xl w-full">
  <SearchForm {search} {type} />

  <Curl url={$page.data.url} />

  {#if search !== ""}
    <ExportCsv {search} {type} />
  {/if}

  <div class={search === "" ? "mt-8" : "mt-2"}>
    <slot />
  </div>
</div>
