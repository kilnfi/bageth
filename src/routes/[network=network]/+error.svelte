<script lang="ts">
  import { page } from "$app/stores";
</script>

<p
  class="
    px-3 py-2 my-4
    text-red-600 bg-red-50
    border rounded border-red-500
  "
>
  {$page.error?.message}
</p>
