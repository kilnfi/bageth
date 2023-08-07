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
  :global(table td) {
    @apply whitespace-nowrap border-b border-gray-200 px-4 py-5 text-black;
  }

  :global(html.dark table th) {
    @apply border-white text-gray-200;
  }
  :global(html.dark table tr) {
    @apply hover:bg-neutral-900;
  }
  :global(html.dark table td) {
    @apply text-white;
  }
</style>
