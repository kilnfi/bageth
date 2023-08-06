<script lang="ts">
  import { context } from "$lib/store/context";

  type Meta = {
    property: string;
    content: string;
  };

  const META: Meta[] = [
    {
      property: "description",
      content: "A set of tools on Ethereum featuring Kiln's API",
    },
    {
      property: "og:title",
      content: "Bageth",
    },
    {
      property: "og:description",
      content: "A set of tools on Ethereum featuring Kiln's API",
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
      content: "A set of tools on Ethereum featuring Kiln's API",
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
