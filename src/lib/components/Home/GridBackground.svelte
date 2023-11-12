<script lang="ts">
  import Gradients from "./Gradients.svelte";
</script>

<div class="w-full grow relative overflow-hidden">
  <slot />

  <Gradients />
</div>

<style>
  div {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #131313 100%);
  }

  div::before {
    @apply absolute content-[''] top-0 left-0 right-0 bottom-0;
    border-bottom: 1px solid #2f2c27;
    border-right: 1px solid #2f2c27;
    background-image: url("/bg-cell.svg");
    background-repeat: repeat;
    z-index: -1;
  }
</style>
