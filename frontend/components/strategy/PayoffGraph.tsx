"use client";

import Plot from "react-plotly.js";
import { OptionLeg } from "@/types/options";
import { computePayoffSummary } from "@/lib/payoff/payoffUtils";

export function PayoffGraph({ legs, currentSpot }: { legs: OptionLeg[]; currentSpot: number }) {
  const summary = computePayoffSummary(legs, currentSpot);

  if (!summary.points.length) {
    return <div className="h-full w-full rounded-lg border border-terminal-border bg-slate-900/40 p-4 text-sm text-slate-400">Add option legs to visualize payoff graph.</div>;
  }

  const x = summary.points.map((p) => p.spot);
  const expiry = summary.points.map((p) => p.expiry);
  const live = summary.points.map((p) => p.live);

  return (
    <Plot
      data={[
        {
          x,
          y: expiry,
          type: "scatter",
          mode: "lines",
          name: "Expiry Payoff",
          line: { color: "#22C55E", width: 3 }
        },
        {
          x,
          y: live,
          type: "scatter",
          mode: "lines",
          name: "Live Payoff",
          line: { color: "#3B82F6", width: 2, dash: "dot" }
        },
        {
          x: [currentSpot],
          y: [0],
          type: "scatter",
          mode: "markers",
          name: "Current Spot",
          marker: { color: "#EAB308", size: 10, symbol: "diamond" }
        }
      ]}
      layout={{
        autosize: true,
        paper_bgcolor: "#11182D",
        plot_bgcolor: "#0B1020",
        font: { color: "#E2E8F0" },
        xaxis: { title: "Underlying Spot", gridcolor: "#1F2A44", zerolinecolor: "#475569" },
        yaxis: { title: "P&L", gridcolor: "#1F2A44", zerolinecolor: "#64748B" },
        hovermode: "x unified",
        dragmode: "pan",
        shapes: [
          ...summary.breakevens.map((be) => ({
            type: "line",
            x0: be,
            x1: be,
            y0: summary.maxLoss,
            y1: summary.maxProfit,
            line: { color: "#F59E0B", width: 1, dash: "dash" }
          })),
          {
            type: "line",
            x0: Math.min(...x),
            x1: Math.max(...x),
            y0: 0,
            y1: 0,
            line: { color: "#64748B", width: 1 }
          }
        ],
        annotations: [
          ...summary.breakevens.map((be) => ({ x: be, y: summary.maxProfit, text: `BE ${be}`, showarrow: false, font: { size: 10, color: "#FCD34D" } })),
          { x: currentSpot, y: 0, text: `Spot ${currentSpot}`, showarrow: true, arrowcolor: "#EAB308", ay: -35 }
        ]
      }}
      config={{ responsive: true, displaylogo: false, modeBarButtonsToRemove: ["select2d", "lasso2d"] }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
}
