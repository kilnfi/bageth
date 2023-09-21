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
  <div class="flex gap-x-2 justify-center mb-4">
    <div class="flex gap-2">
      {#if page_count > 3 && current_page > 3}
        <a
          data-sveltekit-noscroll
          href={getPageLink($page, 1)}
          class="
            text-sm px-3 py-1
            border rounded border-gray-400
            bg-gray-100 hover:bg-gray-400
          "
        >
          1
        </a>
        {#if current_page > 4}
          <span class="text-gray-500 px-2">...</span>
        {/if}
      {/if}
      {#each [...Array(page_count)]
        .map((_, i) => i + 1)
        .slice(Math.max(current_page - 3, 0), Math.min(current_page + 2, page_count)) as i}
        <a
          data-sveltekit-noscroll
          href={getPageLink($page, i)}
          class="
            text-sm px-3 py-1
            rounded border border-gray-400
            hover:bg-gray-400 {i === current_page ? 'bg-gray-400' : 'bg-gray-100'}
          "
        >
          {i}
        </a>
      {/each}
      {#if page_count > 2 && current_page < page_count - 2}
        {#if current_page < page_count - 3}
          <span class="text-gray-500 px-2">...</span>
        {/if}
        <a
          data-sveltekit-noscroll
          href={getPageLink($page, page_count)}
          class="
            text-sm px-3 py-1
            bg-gray-100 hover:bg-gray-400
            border border-gray-400 rounded
          "
        >
          {page_count}
        </a>
      {/if}
    </div>

    <select
      value={page_size}
      on:change={(e) => changePageSize(Number(e.currentTarget.value))}
      class="border border-gray-400 px-2 py-1 rounded"
    >
      {#each sizes as size}
        <option value={size}>{size}</option>
      {/each}
    </select>
  </div>
{/if}
