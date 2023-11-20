<script lang="ts">
  import { page } from "$app/stores";
</script>

<p
  class="
    px-5 py-3 my-5
    text-red-500/80 bg-dark
    border rounded-xl border-red-500/60
  "
>
  {$page.error?.message}
</p>
