<script lang="ts">
  import * as echarts from "echarts";
  import { onMount } from "svelte";
  import type { PageServerData } from "../../../routes/[network=network]/(searchable)/rewards/$types";
  import { formatEther } from "viem";
  import { format } from "date-fns";

  export let data: NonNullable<PageServerData["data"]>["fullData"];

  const plottedData =
    data.map((d) => ({
      gross_apy: d.gross_apy,
      date: format(new Date(d.date!), "yyyy-MM-dd"),
      consensus_rewards: Number(formatEther(BigInt(d.consensus_rewards ?? "0"))),
      execution_rewards: Number(formatEther(BigInt(d.execution_rewards ?? "0"))),
    })) ?? [];

  const markLineHelper = (date: string, name: string) =>
    ({
      label: { show: true, position: "end", color: "white", formatter: name },
      xAxis: plottedData.findIndex((e) => e.date === date),
    } as const);

  let chartRef: HTMLElement | undefined;

  let option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      confine: true,
      valueFormatter: (value) => `${Number(value).toFixed(4)} ETH`,
      position: (pt) => [pt[0], "10%"],
    },
    legend: {
      inactiveColor: "#9ca3af4F",
      textStyle: { color: "#9ca3af", fontFamily: "Space grotesk", fontSize: 14 },
      data: ["Concensus rewards", "Execution rewards", "GRR"],
    },
    title: {
      textStyle: { color: "#9ca3af", fontFamily: "Space grotesk", fontWeight: "normal" },
      text: "Network rewards",
    },
    toolbox: {
      feature: {
        dataZoom: { iconStyle: { borderColor: "#9ca3af" }, yAxisIndex: "none" },
        restore: { iconStyle: { borderColor: "#9ca3af" } },
      },
    },
    grid: { width: "90%", left: "6%" },
    xAxis: {
      type: "category",
      data: plottedData.map((e) => e.date),
      splitLine: { show: true, lineStyle: { color: "#91908F4F" } },
      axisLine: { show: true, lineStyle: { color: "#91908F" } },
      axisTick: { show: true, lineStyle: { color: "#91908F" } },
    },
    yAxis: [
      {
        name: "Rewards",
        type: "value",
        splitLine: { show: true, lineStyle: { color: "#91908F4F" } },
        axisLine: { show: true, lineStyle: { color: "#91908F" } },
        axisTick: { show: true, lineStyle: { color: "#91908F" } },
      },
      {
        name: "GRR",
        type: "value",
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      { type: "inside", start: 100 - (1800000 /* days */ / plottedData.length) * 100, end: 100 },
      {
        textStyle: { color: "#B9B9B9" },
        moveHandleStyle: { color: "#B9B9B9" },
        borderColor: "#B9B9B9",
        fillerColor: "#B9B9B93F",
        start: 0,
        end: 0,
      },
    ],
    series: [
      {
        type: "line",
        markLine: {
          name: "Markline",
          symbol: ["none", "none"],
          animation: false,
          lineStyle: { color: "white", type: "dashed", width: 1 },
          data: [
            markLineHelper("2020-12-01", "Genesis"),
            markLineHelper("2021-04-15", "Berlin"),
            markLineHelper("2021-08-05", "London"),
            markLineHelper("2021-10-27", "Altair"),
            markLineHelper("2022-09-15", "Paris (The Merge)"),
            markLineHelper("2023-04-12", "Capella"),
          ],
        },
      },
      {
        name: "GRR",
        type: "scatter",
        symbol: "roundRect",
        z: 1,
        yAxisIndex: 1,
        itemStyle: { color: "#A17C3A" },
        tooltip: { valueFormatter: (e) => `${Number(e).toFixed(2)}%` },
        data: plottedData.map((e) => e.gross_apy ?? 0),
      },
      {
        name: "Concensus rewards",
        type: "line",
        symbol: "none",
        stack: "x",
        z: 0,
        yAxisIndex: 0,
        sampling: "lttb",
        itemStyle: { color: "#3F606F" },
        areaStyle: { color: "#3F606F" },
        data: plottedData.map((e) => e.consensus_rewards),
      },
      {
        name: "Execution rewards",
        type: "line",
        symbol: "none",
        stack: "x",
        z: 0,
        yAxisIndex: 0,
        sampling: "lttb",
        itemStyle: { color: "#463F6E" },
        areaStyle: { color: "#463F6E" },
        data: plottedData.map((e) => e.execution_rewards),
      },
    ],
  };

  onMount(() => {
    const chart = echarts.init(chartRef, null, { renderer: "canvas", width: "1120px", height: "680px" });
    chart.setOption(option);
  });
</script>

<div
  class="{data.length === 0 ? 'overflow-x-hidden' : 'overflow-x-auto'} relative
    max-w-6xl w-full p-4 bg-dark border-dark-light border rounded-lg mb-4"
>
  <div bind:this={chartRef} />

  {#if data.length === 0}
    <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white/5 backdrop-blur-sm">
      <p class="text-center px-6 py-3 bg-dark text-white rounded-lg border border-dark-light">No data to show</p>
    </div>
  {/if}
</div>
