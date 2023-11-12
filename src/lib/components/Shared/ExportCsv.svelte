<script lang="ts">
  import network from "$lib/store/network";

  export let search: string;
  export let type: string;
</script>

<div class="w-full flex justify-end">
  <a
    href="/{$network}?search={search}&type={type}"
    download="{$network}-{type}-{search}.csv"
    class="px-3 py-1.5 text-white bg-dark border border-dark-light rounded-lg"
  >
    Export CSV
  </a>
</div>
