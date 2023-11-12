<script lang="ts">
  import { cubicInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { page } from "$app/stores";
  import network from "$lib/store/network";
  import Logo from "./Logo.svelte";
  import NetworkSelector from "./NetworkSelector.svelte";
  import { onNavigate } from "$app/navigation";

  const LINKS = [
    { name: "Home", href: "/" },
    { name: "Stakes", href: "/stakes" },
    { name: "Rewards", href: "/rewards" },
    { name: "Operations", href: "/operations" },
  ] as const;

  const [send, receive] = crossfade({
    duration: 400,
    easing: cubicInOut,
  });

  let showNavbar = false;

  onNavigate(() => {
    showNavbar = false;
  });

  $: active = LINKS.find((e) => $page.url.pathname.endsWith(e.href))?.href ?? LINKS[0].href;
</script>

<header class="w-full relative p-4 lg:px-28 lg:py-6 flex gap-y-3 items-center bg-darker border-b">
  <a href="/">
    <Logo />
  </a>

  <nav
    class="{showNavbar
      ? `max-lg:absolute max-lg:top-full max-lg:left-0 max-lg:bg-darker
         max-lg:w-full max-lg:pt-2 max-lg:pb-6 max-lg:px-2 max-lg:flex
         max-lg:justify-center max-lg:flex-wrap max-lg:z-10`
      : 'max-lg:hidden'} gap-x-6 ml-auto"
  >
    {#each LINKS as link (link.href)}
      <a
        href="/{$network}{link.href}"
        class="relative lg:px-4 lg:py-2 transition-colors duration-200
          {active === link.href ? 'text-white' : 'text-white/50 hover:text-white/80'}"
      >
        {link.name}

        {#if active === link.href}
          <div
            in:send={{ key: "active_link" }}
            out:receive={{ key: "active_link" }}
            class="w-4 h-0.5 rounded-full bg-white absolute bottom-0 left-1/2 -translate-x-1/2"
          />
        {/if}
      </a>
    {/each}
  </nav>

  <div class="{showNavbar ? 'max-lg:block max-lg:ml-auto' : 'max-lg:hidden'} ml-10">
    <NetworkSelector />
  </div>

  <button class="{showNavbar ? 'max-lg:ml-4' : 'max-lg:ml-auto'} lg:hidden" on:click={() => (showNavbar = !showNavbar)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="10" y="19" width="20" height="2" rx="1" fill="white" />
      <rect x="2" y="11" width="28" height="2" rx="1" fill="white" />
    </svg>
  </button>
</header>

<style>
  header {
    border-image-slice: 1;
    border-image-source: radial-gradient(circle, #ffb82f 0%, #b0b8ff 40%, #131313ff 85%);
  }
</style>
