<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let sizes = [10, 25, 50, 100];
  export let current_page = 1;
  export let page_size = 10;
  export let page_count = 1;

  function gotoPage(newPage: number) {
    let url = new URL($page.url);
    current_page = newPage;
    url.searchParams.set("current_page", current_page.toString());
    goto(url.toString(), { noScroll: true });
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
        <button
          class="
            text-sm px-3 py-1
            border rounded border-gray-400
            bg-gray-100 hover:bg-gray-400
          "
          on:click={() => gotoPage(1)}
        >
          1
        </button>
        {#if current_page > 4}
          <span class="text-gray-500 px-2">...</span>
        {/if}
      {/if}
      {#each [...Array(page_count)]
        .map((_, i) => i + 1)
        .slice(Math.max(current_page - 3, 0), Math.min(current_page + 2, page_count)) as i}
        <button
          class="
            text-sm px-3 py-1
            rounded border border-gray-400
            hover:bg-gray-400 {i === current_page ? 'bg-gray-400' : 'bg-gray-100'}
          "
          on:click={() => gotoPage(i)}
        >
          {i}
        </button>
      {/each}
      {#if page_count > 2 && current_page < page_count - 2}
        {#if current_page < page_count - 3}
          <span class="text-gray-500 px-2">...</span>
        {/if}
        <button
          class="
            text-sm px-3 py-1
            bg-gray-100 hover:bg-gray-400
            border border-gray-400 rounded
          "
          on:click={() => gotoPage(page_count)}
        >
          {page_count}
        </button>
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
