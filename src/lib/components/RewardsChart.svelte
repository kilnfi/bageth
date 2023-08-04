<script lang="ts">
  import type { PageServerData } from "../../routes/$types";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { formatEther } from "viem";
  import { format } from "date-fns";

  export let data: Extract<PageServerData, { type: "rewards" }>["data"];

  let canvasRef: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    const plottedData =
      data?.fullData?.map((d) => {
        return {
          date: format(new Date(d.date!), "dd-MM-yyyy"),
          consensus_rewards: Number(
            formatEther(BigInt(d.consensus_rewards ?? "0"))
          ),
          execution_rewards: Number(
            formatEther(BigInt(d.execution_rewards ?? "0"))
          ),
        };
      }) ?? [];

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
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { stacked: true },
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              text: "Income [ETH]",
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
            labels: { padding: 20, pointStyle: "circle", usePointStyle: true },
          },
          tooltip: {
            mode: "x",
            backgroundColor: "#000",
            titleFont: { weight: "normal", size: 16 },
            footerFont: { weight: "normal", size: 15 },
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
                let amount = context.reduce((a, c) => a + c.parsed.y, 0);
                return `Total: ${amount.toFixed(5)} ETH`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chart) chart.destroy();
    };
  });
</script>

<canvas bind:this={canvasRef} />
