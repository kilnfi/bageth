<script lang="ts">
  import { focusTrap } from "$lib/focusTrap";

  export let open = true;
  export let required = false;
  let className = "";
  export { className as class };
</script>

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
    class="fixed z-50 flex flex-col gap-y-3 bg-white shadow-2xl
      p-3 rounded-lg border top-[50%] max-w-[80vw] -translate-y-1/2 {className}"
  >
    <slot name="title" />

    <slot name="content" />

    <slot name="footer">
      <div class="flex justify-center">
        <button
          on:click={() => (open = false)}
          class="px-2 py-1 rounded-lg bg-black text-white w-20"
        >
          close
        </button>
      </div>
    </slot>
  </div>
{/if}
