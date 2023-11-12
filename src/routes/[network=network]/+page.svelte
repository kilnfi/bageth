<script lang="ts">
  import type { PageServerData } from "./$types";
  import Graph from "$lib/components/Home/Graph.svelte";
  import Stats from "$lib/components/Home/Stats.svelte";
  import Hero from "$lib/components/Home/Hero.svelte";
  import SearchBar from "$lib/components/Home/SearchBar.svelte";
  import GridBackground from "$lib/components/Home/GridBackground.svelte";

  export let data: PageServerData;
</script>

<GridBackground>
  <Hero />

  <SearchBar />

  <Stats data={data.stats} price={data.price ?? 0} />
</GridBackground>

{#if data.rewards?.data}
  <Graph data={data.rewards} />
{/if}
