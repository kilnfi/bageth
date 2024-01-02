<script lang="ts">
  import "../app.css";
  import "tippy.js/dist/tippy.css";
  import "tippy.js/themes/translucent.css";

  import { onMount } from "svelte";
  import nProgress from "nprogress";
  import { afterNavigate, beforeNavigate, onNavigate } from "$app/navigation";

  import Footer from "$lib/components/Shared/Footer.svelte";
  import NavBar from "$lib/components/Header/NavBar.svelte";
  import Seo from "$lib/components/Shared/Seo.svelte";

  onMount(() => {
    nProgress.configure({ showSpinner: false });
    nProgress.render();
  });
  afterNavigate(() => nProgress.done());
  onNavigate(() => void nProgress.start());
</script>

<Seo />

<NavBar />

<slot />

<Footer />
