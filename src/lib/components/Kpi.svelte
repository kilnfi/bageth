<script lang="ts">
  import tooltip from "$lib/use/tooltip";

  export let info = "";
  export let title = "";
  export let value = "";
</script>

<div
  class="
    p-4
    border rounded-lg
    flex flex-col gap-y-3
  "
>
  <h2 class="flex gap-x-2 items-center dark:text-white">
    {title}

    {#if info}
      <svg
        use:tooltip={{ content: info }}
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
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    {/if}
  </h2>

  <p
    class="
      font-mono p-2
      overflow-x-auto
      border rounded-lg bg-gray-50
    "
  >
    {#if value}
      {value}
    {:else}
      -
    {/if}
  </p>
</div>
