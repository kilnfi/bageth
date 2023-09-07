<script lang="ts">
  import { context } from "$lib/store/context";

  type Meta = {
    property: string;
    content: string;
  };

  const META: Meta[] = [
    {
      property: "description",
      content: "Ethereum explorer of the beaconchain",
    },
    {
      property: "og:title",
      content: "Bageth",
    },
    {
      property: "og:description",
      content: "Ethereum explorer of the beaconchain",
    },
    {
      property: "og:image",
      content: "https://bageth.nakamotards.com/favicon.png",
    },
    {
      property: "og:url",
      content: "https://bageth.nakamotards.com",
    },
    {
      property: "twitter:title",
      content: "Bageth",
    },
    {
      property: "twitter:image",
      content: "https://bageth.nakamotards.com/favicon.png",
    },
    {
      property: "twitter:description",
      content: "Ethereum explorer of the beaconchain",
    },
    {
      property: "twitter:card",
      content: "summary",
    },
  ];

  $: title = `Bageth${$context.search !== "" ? " - " + $context.search : ""}`;
</script>

<svelte:head>
  <title>{title}</title>

  {#each META as { property, content }}
    <meta {property} {content} />
  {/each}
</svelte:head>
