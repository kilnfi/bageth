<script lang="ts">
  import { context } from "$lib/store/context";
  import { format, subMonths, subQuarters, subWeeks, subYears } from "date-fns";

  let start = $context.start_date;
  let end = $context.end_date;
  let active: "" | "week" | "month" | "quarter" | "semester" | "year" = "";

  function handleRange(newStart: string, newEnd: string) {
    if (newStart < newEnd) {
      start = newStart;
      end = newEnd;
    } else {
      start = newEnd;
      end = newEnd;
    }
    // reset pagination
    $context.current_page = 1;
    $context.start_date = start;
    $context.end_date = end;
  }

  function handleLastWeek() {
    active = "week";
    handleRange(
      format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd")
    );
  }

  function handleLastMonth() {
    active = "month";
    handleRange(
      format(subMonths(new Date(), 1), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd")
    );
  }

  function handleLastQuarter() {
    active = "quarter";
    handleRange(
      format(subQuarters(new Date(), 1), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd")
    );
  }

  function handleLastSemester() {
    active = "semester";
    handleRange(
      format(subMonths(new Date(), 6), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd")
    );
  }

  function handleLastYear() {
    active = "year";
    handleRange(
      format(subYears(new Date(), 1), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd")
    );
  }
</script>

<div class="flex flex-col gap-y-3 border bg-white dark:bg-black rounded-lg p-3">
  <div class="flex gap-x-3 items-center justify-center">
    <input
      type="date"
      value={start}
      max={end}
      on:change={(e) => {
        active = "";
        handleRange(e.currentTarget.value, end);
      }}
    />

    <span class="text-lg font-bold">to</span>

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

  <div class="flex items-start gap-3">
    <span
      class="bg-gray-200 border border-l-0 -ms-3 px-2 rounded-tr-lg rounded-br-lg"
    >
      last:
    </span>

    <div class="flex flex-wrap gap-2 overflow-x-auto">
      <button class:active={active === "week"} on:click={handleLastWeek}>
        week
      </button>
      <button class:active={active === "month"} on:click={handleLastMonth}>
        month
      </button>
      <button class:active={active === "quarter"} on:click={handleLastQuarter}>
        quarter
      </button>
      <button
        class:active={active === "semester"}
        on:click={handleLastSemester}
      >
        semester
      </button>
      <button class:active={active === "year"} on:click={handleLastYear}>
        year
      </button>
    </div>
  </div>
</div>

<style lang="postcss" scoped>
  input[type="date"] {
    @apply items-center rounded-lg border bg-gray-50 px-2 py-1
      outline-none focus:ring-2 focus:ring-black focus:ring-opacity-30;
  }
  button {
    @apply rounded-lg border border-gray-200 bg-gray-100 px-2 py-0.5 text-sm;
  }
  button.active {
    @apply bg-gray-200;
  }
</style>
