<script lang="ts">
  import "../app.css";
  import "tippy.js/dist/tippy.css";

  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import Seo from "$lib/components/Seo.svelte";
</script>

<Seo />

<Header />

<slot />

<Footer />
