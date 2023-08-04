<script lang="ts">
  import { context } from "$lib/store/context";

  export let PAGE_SIZES = [10, 25, 50, 100];

  export let index = 1;
  export let size = 10;
  export let count = 1;

  function handleSizeChange(newSize: number) {
    if (newSize > size) index = 1;
    size = newSize;
    $context.current_page = index;
    $context.page_size = size;
  }

  function handleIndexChange(newIndex: number) {
    index = newIndex;
    $context.current_page = index;
  }
</script>

{#if count !== 0}
  <div class="flex gap-x-2 justify-center mb-4">
    <div class="flex gap-2">
      {#if count > 3 && index > 3}
        <button
          class="text-sm hover:bg-gray-300 border-gray-300
          bg-gray-100 border px-3 py-1 rounded"
          on:click={() => handleIndexChange(1)}
        >
          1
        </button>
        <span class="text-gray-500 px-2">...</span>
      {/if}
      {#each [...Array(count)]
        .map((_, i) => i + 1)
        .slice(Math.max(index - 3, 0), Math.min(index + 2, count)) as i}
        <button
          class="text-sm hover:bg-gray-300
          border border-gray-300 px-3 py-1 rounded
          {i === index ? 'bg-gray-300' : 'bg-gray-100'}"
          on:click={() => handleIndexChange(i)}
        >
          {i}
        </button>
      {/each}
      {#if count > 2 && index < count - 2}
        <span class="text-gray-500 px-2">...</span>
        <button
          class="text-sm hover:bg-gray-300 border-gray-300
          bg-gray-100 border px-3 py-1 rounded"
          on:click={() => handleIndexChange(count)}
        >
          {count}
        </button>
      {/if}
    </div>

    <select
      value={size}
      on:change={(e) => handleSizeChange(Number(e.currentTarget.value))}
      class="border border-gray-300 px-2 py-1 rounded"
    >
      {#each PAGE_SIZES as size}
        <option value={size}>{size}</option>
      {/each}
    </select>
  </div>
{/if}
