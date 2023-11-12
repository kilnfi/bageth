<script lang="ts">
  let clazz = "";
  export { clazz as class };
</script>

<div class="w-full flex flex-col gap-y-4 {clazz}">
  <div class="max-w-full overflow-x-auto rounded-lg border border-dark-light">
    <table class="table w-full bg-dark">
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
    @apply border-b border-dark-light;
  }
  :global(table tbody tr) {
    @apply transition-colors duration-200 hover:bg-dark-light/40;
  }
  :global(table tbody td) {
    @apply whitespace-nowrap px-4 py-5 text-white;
  }
  :global(table thead th) {
    @apply whitespace-nowrap p-3 text-[#91908F];
  }
</style>
