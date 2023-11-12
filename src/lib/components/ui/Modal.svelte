<script lang="ts">
  import { focusTrap } from "$lib/use/focusTrap";

  export let open = true;
  export let required = false;
  let clazz = "";
  export { clazz as class };
</script>

<svelte:window
  on:keydown={(e) => {
    if (
      e.key === "Escape" && // the key pressed is Escape
      open && //the modal is opened
      !required // the modal is not required to be closed manually
    ) {
      open = false;
    }
  }}
/>

{#if open}
  <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
  <div
    class="w-screen h-screen fixed top-0 left-0 backdrop-brightness-75 backdrop-blur-sm z-50"
    on:click={() => {
      if (!required) open = false;
    }}
  />

  <div
    use:focusTrap={open}
    role="dialog"
    class="z-50 p-3
      fixed top-[50%]
      max-w-[calc(100%-32px)] xl:max-w-6xl -translate-y-1/2 w-full
      flex flex-col gap-y-3
      bg-dark shadow-2xl
      rounded-lg border border-dark-light
      {clazz}"
  >
    <slot name="title" />

    <slot name="content" />

    <slot name="footer" />
  </div>
{/if}
