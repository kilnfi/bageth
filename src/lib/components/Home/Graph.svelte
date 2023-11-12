<script lang="ts">
  import * as echarts from "echarts";
  import { onMount } from "svelte";
  import type { PageServerData } from "../../../routes/[network=network]/$types";
  import { formatEther } from "viem";
  import { format } from "date-fns";

  export let data: PageServerData["rewards"];

  const plottedData =
    data?.map((d) => ({
      mev: Number(formatEther(BigInt(d.mev_execution_rewards ?? "0"))),
      non_mev: Number(formatEther(BigInt(d.non_mev_execution_rewards ?? "0"))),
      consensus: Number(formatEther(BigInt(d.consensus_rewards ?? "0"))),
      date: format(new Date(d.date!), "yyyy-MM-dd"),
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
      data: [
        { icon: "circle", name: "Concensus rewards" },
        { icon: "circle", name: "Exec rewards (MEV)" },
        { icon: "circle", name: "Exec rewards (Non-MEV)" },
      ],
    },
    title: {
      textStyle: { color: "rgb(209,213,219)", fontSize: "20px", fontFamily: "Space grotesk", fontWeight: "normal" },
      text: "Network rewards",
      left: 0,
      padding: [2, 0],
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
    yAxis: {
      type: "value",
      splitLine: { show: true, lineStyle: { color: "#91908F4F" } },
      axisLine: { show: true, lineStyle: { color: "#91908F" } },
      axisTick: { show: true, lineStyle: { color: "#91908F" } },
    },
    dataZoom: [
      { type: "inside", start: 100 - (180 /* days */ / plottedData.length) * 100, end: 100 },
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
        name: "Concensus rewards",
        type: "line",
        symbol: "none",
        stack: "x",
        sampling: "lttb",
        itemStyle: { color: "#463F6E" },
        areaStyle: { color: "#463F6E" },
        data: plottedData.map((e) => e.consensus),
      },
      {
        name: "Exec rewards (MEV)",
        type: "line",
        symbol: "none",
        stack: "x",
        sampling: "lttb",
        itemStyle: { color: "#A17C3A" },
        areaStyle: { color: "#A17C3A" },
        data: plottedData.map((e) => e.mev),
      },
      {
        name: "Exec rewards (Non-MEV)",
        type: "line",
        symbol: "none",
        stack: "x",
        sampling: "lttb",
        itemStyle: { color: "#548296" },
        areaStyle: { color: "#548296" },
        data: plottedData.map((e) => e.non_mev),
      },
    ],
  };

  onMount(() => {
    const chart = echarts.init(chartRef, null, { renderer: "canvas", width: "1120px", height: "680px" });
    chart.setOption(option);
  });
</script>

<div
  class="overflow-x-auto max-w-[calc(100%-32px)] xl:max-w-6xl w-full p-4 mx-4
    bg-dark border-dark-light border rounded-lg mb-4"
>
  <div bind:this={chartRef} />
</div>
