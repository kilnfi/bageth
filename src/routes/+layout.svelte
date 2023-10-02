<script lang="ts">
  import "../app.css";
  import "tippy.js/dist/tippy.css";
  import "tippy.js/themes/light-border.css";
  import "tippy.js/themes/translucent.css";

  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import nProgress from "nprogress";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => nProgress.configure({ showSpinner: false }));
  afterNavigate(() => nProgress.done());
  beforeNavigate(() => nProgress.start());
</script>

<Seo />

<Header />

<slot />

<Footer />
