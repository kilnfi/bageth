<script lang="ts">
  import "../app.css";
  import "tippy.js/dist/tippy.css";

  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<slot />

<Footer />
