<script lang="ts">
  type Meta = {
    property: string;
    content: string;
  };

  const META: Meta[] = [
    {
      property: "description",
      content: "Ethereum Explorer of the Beacon Chain",
    },
    {
      property: "og:title",
      content: "Bageth",
    },
    {
      property: "og:description",
      content: "Ethereum Explorer of the Beacon Chain",
    },
    {
      property: "og:image",
      content: "https://www.bageth.xyz/favicon.ico",
    },
    {
      property: "og:url",
      content: "https://www.bageth.xyz",
    },
    {
      property: "twitter:title",
      content: "Bageth",
    },
    {
      property: "twitter:image",
      content: "https://www.bageth.xyz/favicon.ico",
    },
    {
      property: "twitter:description",
      content: "Ethereum Explorer of the Beacon Chain",
    },
    {
      property: "twitter:card",
      content: "summary",
    },
  ];

  const title = "Bageth";
</script>

<svelte:head>
  <title>{title}</title>

  {#each META as { property, content }}
    <meta {property} {content} />
  {/each}
</svelte:head>
