<script lang="ts">
  import network from "$lib/store/network";

  export let href = "";
  export let variant: "beaconcha.in" | "etherscan.io" = "beaconcha.in";

  let clazz = "";
  export { clazz as class };

  let baseUrl = "";

  $: {
    if (variant === "beaconcha.in") {
      baseUrl = `https://${$network === "goerli" ? "prater." : ""}beaconcha.in`;
    } else if (variant === "etherscan.io") {
      baseUrl = `https://${$network === "goerli" ? "goerli." : ""}etherscan.io`;
    }
  }
</script>

<a target="_blank" class="underline {clazz}" href={new URL(href, baseUrl).toString()}>
  <slot />
</a>
