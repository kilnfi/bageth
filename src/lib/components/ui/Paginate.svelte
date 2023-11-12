<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Page } from "@sveltejs/kit";

  export let current_page: number;
  export let page_size: number;
  export let page_count: number;

  const sizes = [10, 25, 50, 100];

  function getPageLink(page: Page, newPage: number) {
    let url = new URL(page.url);
    url.searchParams.set("current_page", newPage.toString());
    return url.toString();
  }

  function changePageSize(newSize: number) {
    let url = new URL($page.url);
    if (newSize > page_size) {
      current_page = 1;
      url.searchParams.set("current_page", current_page.toString());
    }
    page_size = newSize;
    url.searchParams.set("page_size", page_size.toString());
    goto(url.toString(), { noScroll: true });
  }
</script>

{#if page_count !== 0}
  <div class="flex justify-between">
    <div
      class="flex border border-dark-light rounded text-white
        [&>*]:bg-dark overflow-hidden
        [&>a:hover]:bg-dark/70 [&>a:hover]:text-white/50
        [&>a]:transition-colors [&>a]:duration-200
        [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-dark-light"
    >
      {#if page_count > 3 && current_page > 3}
        <a data-sveltekit-noscroll href={getPageLink($page, 1)} class="px-3 py-1"> 1 </a>
        {#if current_page > 4}<span class="px-2">...</span>{/if}
      {/if}
      {#each [...Array(page_count)]
        .map((_, i) => i + 1)
        .slice(Math.max(current_page - 3, 0), Math.min(current_page + 2, page_count)) as i}
        <a
          data-sveltekit-noscroll
          href={getPageLink($page, i)}
          class="px-3 py-1 {i === current_page ? 'bg-dark-light' : ''}"
        >
          {i}
        </a>
      {/each}
      {#if page_count > 2 && current_page < page_count - 2}
        {#if current_page < page_count - 3}<span class="px-2">...</span>{/if}
        <a data-sveltekit-noscroll href={getPageLink($page, page_count)} class="px-3 py-1">
          {page_count}
        </a>
      {/if}
    </div>

    <select
      value={page_size}
      on:change={(e) => changePageSize(Number(e.currentTarget.value))}
      class="border border-dark-light px-2 py-1 rounded
        text-white bg-dark hover:bg-dark/80 hover:text-white/60
        transition-colors duration-200 cursor-pointer"
    >
      {#each sizes as size}
        <option value={size}>{size}</option>
      {/each}
    </select>
  </div>
{/if}
