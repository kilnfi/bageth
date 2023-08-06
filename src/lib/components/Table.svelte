<div class="w-full flex flex-col gap-y-4">
  <div class="max-w-full overflow-x-auto">
    <table class="table w-full">
      <slot name="head" />
      <slot name="body" />
    </table>
  </div>

  <slot name="pagination" />
</div>

<style lang="postcss">
  :global(table th) {
    @apply border-b border-t border-gray-200 px-4 py-3 text-left font-normal text-gray-500;
  }
  :global(table tr) {
    @apply hover:bg-gray-100;
  }
  :global(table td:not(.table-btn)) {
    @apply whitespace-nowrap border-b border-gray-200 px-4 py-5 text-black;
  }
  :global(table td.table-btn) {
    @apply absolute right-0 top-0;
  }

  :global(html.dark table th) {
    @apply border-white text-gray-200;
  }
  :global(html.dark table tr) {
    @apply hover:bg-neutral-900;
  }
  :global(html.dark table td:not(.table-btn)) {
    @apply text-white;
  }
</style>
