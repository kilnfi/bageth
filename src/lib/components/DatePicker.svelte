<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { format, subMonths, subQuarters, subWeeks, subYears } from "date-fns";

  let clazz = "";
  export { clazz as class };

  export let start = "";
  export let end = "";

  let active: "" | "week" | "month" | "quarter" | "semester" | "year" | "all" = "";

  function handleRange(newStart: string, newEnd: string) {
    if (newStart < newEnd) {
      start = newStart;
      end = newEnd;
    } else {
      start = newEnd;
      end = newEnd;
    }

    let url = new URL($page.url);
    url.searchParams.delete("current_page");
    url.searchParams.set("start_date", start);
    url.searchParams.set("end_date", end);
    goto(url, { noScroll: true, invalidateAll: true });
  }

  function handleLastWeek() {
    active = "week";
    handleRange(format(subWeeks(new Date(), 1), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd"));
  }

  function handleLastMonth() {
    active = "month";
    handleRange(format(subMonths(new Date(), 1), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd"));
  }

  function handleAll() {
    active = "all";
    // there was no staking yet in 2020
    handleRange("2020-01-01", format(new Date(), "yyyy-MM-dd"));
  }

  function handleLastQuarter() {
    active = "quarter";
    handleRange(format(subQuarters(new Date(), 1), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd"));
  }

  function handleLastSemester() {
    active = "semester";
    handleRange(format(subMonths(new Date(), 6), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd"));
  }

  function handleLastYear() {
    active = "year";
    handleRange(format(subYears(new Date(), 1), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd"));
  }
</script>

<div
  class="
    w-full max-w-5xl p-2
    flex flex-wrap justify-center gap-3
    border rounded-lg
    bg-white dark:bg-black
    {clazz}
  "
>
  <div class="flex gap-3 items-center flex-wrap">
    <span class="font-bold dark:text-white">From</span>

    <input
      type="date"
      value={start}
      max={end}
      on:change={(e) => {
        active = "";
        handleRange(e.currentTarget.value, end);
      }}
    />

    <span class="font-bold dark:text-white">to</span>

    <input
      type="date"
      value={end}
      min={start}
      max={format(new Date(), "yyyy-MM-dd")}
      on:change={(e) => {
        active = "";
        handleRange(start, e.currentTarget.value);
      }}
    />
  </div>

  <div class="flex items-center gap-3 flex-wrap">
    <span class="font-bold dark:text-white">Or last</span>

    <div class="flex gap-2 flex-wrap">
      <button class:active={active === "week"} on:click={handleLastWeek}> week </button>
      <button class:active={active === "month"} on:click={handleLastMonth}> month </button>
      <button class:active={active === "quarter"} on:click={handleLastQuarter}> quarter </button>
      <button class:active={active === "semester"} on:click={handleLastSemester}> semester </button>
      <button class:active={active === "year"} on:click={handleLastYear}> year </button>
      <button class:active={active === "all"} on:click={handleAll}> all </button>
    </div>
  </div>
</div>

<style lang="postcss" scoped>
  input[type="date"] {
    @apply border rounded-lg
      px-2 py-1
      outline-none
      bg-gray-50
      focus:ring-2 focus:ring-black focus:ring-opacity-30;
  }
  button {
    @apply rounded-lg border border-gray-200 bg-gray-100 px-2 py-1;
  }
  button.active {
    @apply bg-gray-200;
  }
</style>
