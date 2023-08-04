<script lang="ts">
  import network from "$lib/store/network";

  export let href = "";
</script>

<a
  target="_blank"
  class="underline"
  href="https://{$network === 'testnet' ? 'prater.' : ''}beaconcha.in/{href}"
>
  <slot />
</a>
