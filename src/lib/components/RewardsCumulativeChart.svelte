<script lang="ts">
  import type { PageServerData } from "../../routes/$types";
  import { onDestroy, onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { formatEther } from "viem";
  import { format } from "date-fns";
  import darkmode from "$lib/store/darkmode";

  export let data: Extract<PageServerData, { type: "rewards" }>["data"];

  let canvasRef: HTMLCanvasElement;
  let chart: Chart;

  let destroyChart = () => {};

  function initChart() {
    const plottedData =
      data?.fullData?.map((d) => ({
        date: format(new Date(d.date!), "yyyy-MM-dd"),
        consensus_rewards: Number(formatEther(BigInt(d.consensus_rewards ?? "0"))),
        execution_rewards: Number(formatEther(BigInt(d.execution_rewards ?? "0"))),
      })) ?? [];

    const cumulativeRewards = plottedData.reduce((a: number[], e) => {
      a.push(e.consensus_rewards + e.execution_rewards + (a.at(-1) ?? 0));
      return a;
    }, []);

    chart = new Chart(canvasRef, {
      type: "line",
      data: {
        labels: plottedData.map((d) => d.date),
        datasets: [
          {
            type: "line",
            data: cumulativeRewards,
            tension: 0.4,
            borderWidth: 2,
            backgroundColor: (ctx) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.chartArea?.height ?? 0);
              gradient.addColorStop(0, "#fecaca");
              gradient.addColorStop(1, "#FFFFFF00");
              return gradient;
            },
            fill: true,
            borderColor: "#fca5a5",
            hoverBackgroundColor: "#4ade80",
            hoverBorderColor: "#16a34a",
            pointRadius: 0,
            pointHitRadius: 20,
            pointHoverRadius: 6,
            pointHoverBorderColor: "#fca5a5",
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: "#FFF",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            grid: { color: $darkmode ? "#737373" : "#d4d4d4" },
            ticks: { color: !$darkmode ? "#737373" : "#d4d4d4" },
          },
          y: {
            beginAtZero: true,
            stacked: true,
            grid: { color: $darkmode ? "#737373" : "#d4d4d4" },
            ticks: { color: !$darkmode ? "#737373" : "#d4d4d4" },
            title: {
              text: "Income [ETH]",
              color: $darkmode ? "white" : "black",
              align: "center",
              display: true,
              font: { size: 14 },
            },
          },
        },
        hover: { intersect: false },
        plugins: {
          legend: { display: false },
          title: {
            text: "Cumulative rewards evolution",
            display: true,
            font: { size: 18, weight: "normal" },
            position: "bottom",
          },
          tooltip: {
            intersect: false,
            mode: "index",
            backgroundColor: $darkmode ? "white" : "black",
            titleColor: $darkmode ? "black" : "white",
            titleFont: { weight: "normal", size: 16 },
            footerColor: $darkmode ? "black" : "white",
            footerFont: { weight: "normal", size: 15 },
            bodyColor: $darkmode ? "black" : "white",
            bodyFont: { weight: "normal", size: 14 },
            usePointStyle: true,
            callbacks: {
              title: (context) => {
                let date = new Date(context[0].label).toDateString();
                let rawDate = context[0].label;
                return `${date} (${rawDate})`;
              },
              label: (context) => {
                let value = context.parsed.y;
                return ` ${value.toFixed(5)} ETH`;
              },
            },
          },
        },
      },
    });

    // set the cleanup function
    destroyChart = () => {
      if (chart) chart.destroy();
    };
  }

  onMount(() => {
    initChart();

    const unsub = darkmode.subscribe(() => {
      destroyChart();
      initChart();
    });
    return unsub;
  });

  onDestroy(() => {
    destroyChart();
  });
</script>

<canvas bind:this={canvasRef} />
