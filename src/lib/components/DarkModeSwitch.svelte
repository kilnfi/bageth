<script lang="ts">
  import darkmode from "$lib/store/darkmode";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let transitioning = false;

  function handleChangeTheme() {
    if (transitioning) return;
    $darkmode = !$darkmode;
    localStorage.setItem("dark", $darkmode.toString());
  }

  onMount(() => {
    if (localStorage.getItem("dark") === "true") {
      $darkmode = true;
    } else {
      $darkmode = false;
    }

    const unsub = darkmode.subscribe((value) => {
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

    return unsub;
  });
</script>

<button
  on:click={handleChangeTheme}
  class="
    px-2 py-1
    bg-white dark:bg-black
    text-black dark:text-white
    rounded-lg border
  "
>
  {#if $darkmode}
    <svg
      in:slide={{ axis: "y" }}
      out:slide={{ axis: "y" }}
      on:introstart={() =>
        // this is to prevent spam clicking the button and having glitches
        (transitioning = true)}
      on:introend={() => (transitioning = false)}
      on:outrostart={() => (transitioning = true)}
      on:outroend={() => (transitioning = false)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  {:else}
    <svg
      out:slide={{ axis: "y" }}
      in:slide={{ axis: "y" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  {/if}
</button>
