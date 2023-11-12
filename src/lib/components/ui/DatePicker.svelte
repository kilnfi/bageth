<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { formatDate, parseDate } from "$lib/utils";
  import { addDays, format, subMonths, subQuarters, subWeeks, subYears } from "date-fns";

  export let start = formatDate(subMonths(new Date(), 1));
  export let end = formatDate(new Date());

  let active: "" | "week" | "month" | "quarter" | "semester" | "year" | "all" = "";

  function handleRange(newStart: string, newEnd: string) {
    start = newStart;
    end = newEnd;

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
  class="grid sm:grid-cols-[auto_auto_1fr] gap-3 mb-4
    border border-dark-light rounded-lg max-w-full
    overflow-auto px-4 py-2 bg-dark"
>
  <div class="flex gap-3">
    <div class="flex items-center gap-3">
      <span class="text-gray-400">From</span>

      <input
        type="date"
        value={start}
        max={end}
        on:change={(e) => {
          active = "";
          handleRange(e.currentTarget.value, end);
        }}
      />
    </div>

    <div class="flex items-center gap-3">
      <span class="text-gray-400">To</span>

      <input
        type="date"
        value={end}
        min={formatDate(addDays(parseDate(start), 1))}
        max={formatDate(new Date())}
        on:change={(e) => {
          active = "";
          handleRange(start, e.currentTarget.value);
        }}
      />
    </div>
  </div>

  <div class="h-[1px] w-full sm:h-full sm:w-[1px] bg-dark-light" />

  <div class="flex items-center w-full gap-3">
    <span class="text-gray-400">Preset</span>

    <div class="flex w-full gap-2">
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
      bg-dark-light border-dark-light text-white;
    color-scheme: dark;
  }
  button {
    @apply md:w-full text-gray-300 rounded-lg border border-dark-light bg-dark px-2 py-1;
  }
  button.active {
    @apply bg-gray-200 text-dark;
  }
</style>
