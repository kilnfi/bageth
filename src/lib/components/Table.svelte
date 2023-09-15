<script lang="ts">
  let clazz = "";
  export { clazz as class };
</script>

<div class="w-full flex flex-col gap-y-4 {clazz}">
  <div class="max-w-full overflow-x-auto rounded-lg border">
    <table class="table w-full border-red-600">
      <slot name="head" />
      <slot name="body" />
    </table>
  </div>

  <slot name="pagination" />
</div>

<style lang="postcss">
  :global(table th) {
    @apply px-4 py-3 text-left font-normal text-gray-500;
  }
  :global(table tr:not(tbody :last-child)) {
    @apply border-b border-gray-200;
  }
  :global(table tbody tr) {
    @apply hover:bg-gray-100;
  }
  :global(table td) {
    @apply whitespace-nowrap px-4 py-5 text-black;
  }

  :global(html.dark table th) {
    @apply border-white text-gray-200;
  }
  :global(html.dark table tbody tr) {
    @apply hover:bg-neutral-900;
  }
  :global(html.dark table td) {
    @apply text-white;
  }
</style>
