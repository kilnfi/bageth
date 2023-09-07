<script lang="ts">
  import { context } from "$lib/store/context";

  export let href = "";
</script>

<a
  target="_blank"
  class="underline"
  href={new URL(href, `https://${$context.network === "testnet" ? "prater." : ""}beaconcha.in`).toString()}
>
  <slot />
</a>
