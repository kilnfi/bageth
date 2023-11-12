<script lang="ts">
  import network, { type Network } from "$lib/store/network";

  export let href = "";
  export let variant: "beaconcha.in" | "etherscan.io" = "beaconcha.in";

  let clazz = "";
  export { clazz as class };

  let baseUrl = "";

  $: {
    if (variant === "beaconcha.in") {
      const subdomains: Record<Network, string> = {
        holesky: "holesky.",
        goerli: "prater.",
        mainnet: "",
      };
      baseUrl = `https://${subdomains[$network]}beaconcha.in`;
    } else if (variant === "etherscan.io") {
      const subdomains: Record<Network, string> = {
        goerli: "goerli.",
        holesky: "holesky.",
        mainnet: "",
      };
      baseUrl = `https://${subdomains[$network]}etherscan.io`;
    }
  }
</script>

<a target="_blank" class="underline {clazz}" href={new URL(href, baseUrl).toString()}>
  <slot />
</a>
