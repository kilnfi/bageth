<script lang="ts">
  import type { PageServerData } from "../../routes/[network=network]/rewards/$types";
  import { onDestroy, onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { formatEther } from "viem";
  import { format } from "date-fns";
  import darkmode from "$lib/store/darkmode";

  export let data: NonNullable<PageServerData["data"]>["fullData"];

  let canvasRef: HTMLCanvasElement;
  let chart: Chart;

  let destroyChart = () => {};

  function initChart() {
    const plottedData =
      data.map((d) => ({
        date: format(new Date(d.date!), "yyyy-MM-dd"),
        consensus_rewards: Number(formatEther(BigInt(d.consensus_rewards ?? "0"))),
        execution_rewards: Number(formatEther(BigInt(d.execution_rewards ?? "0"))),
      })) ?? [];

    const cumulativeRewards = plottedData.reduce((a: number[], e) => {
      a.push(e.consensus_rewards + e.execution_rewards + (a.at(-1) ?? 0));
      return a;
    }, []);

    chart = new Chart(canvasRef, {
      type: "bar",
      data: {
        labels: plottedData.map((d) => d.date),
        datasets: [
          {
            label: "Consensus rewards",
            data: plottedData.map((e) => e.consensus_rewards),
            borderWidth: 2,
            backgroundColor: "#bfdbfe",
            borderColor: "#60a5fa",
            hoverBackgroundColor: "#60a5fa",
            hoverBorderColor: "#2563eb",
          },
          {
            label: "Execution rewards",
            data: plottedData.map((e) => e.execution_rewards),
            borderWidth: 2,
            backgroundColor: "#bbf7d0",
            borderColor: "#4ade80",
            hoverBackgroundColor: "#4ade80",
            hoverBorderColor: "#16a34a",
          },
          {
            hidden: true,
            type: "line",
            data: cumulativeRewards,
            label: "Cumulative rewards",
            tension: 0.2,
            borderWidth: 2,
            backgroundColor: (ctx: any) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.chartArea?.height ?? 0);
              gradient.addColorStop(0, "#fecaca");
              gradient.addColorStop(1, "#FFFFFF00");
              return gradient;
            },
            fill: true,
            pointBackgroundColor: "#fecaca",
            borderColor: "#fca5a5",
            hoverBorderColor: "#fca5a5",
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
        hover: { intersect: false, axis: "x" },
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
        plugins: {
          legend: {
            align: "center",
            position: "bottom",
            labels: {
              padding: 20,
              color: $darkmode ? "white" : "black",
              pointStyle: "circle",
              usePointStyle: true,
              font: { size: 16, weight: "normal" },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
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
                let label = context.dataset.label;
                let value = context.parsed.y;
                return ` ${label}: ${value.toFixed(5)} ETH`;
              },
              footer: (context) => {
                let rewards = context.reduce((a, c) => a + (c.datasetIndex !== 2 ? c.parsed.y : 0), 0);
                return `Total rewards: ${rewards.toFixed(5)} ETH`;
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
