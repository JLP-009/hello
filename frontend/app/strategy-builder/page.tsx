"use client";

import { useMemo, useState } from "react";
import { PayoffGraph } from "@/components/strategy/PayoffGraph";
import { computePayoffSummary } from "@/lib/payoff/payoffUtils";
import { useTradingStore } from "@/store/useTradingStore";
import { OptionLeg, OptionType, Side } from "@/types/options";

const expiries = ["2026-05-28", "2026-06-25", "2026-07-30"];
const strikes = Array.from({ length: 35 }, (_, i) => 21600 + i * 50);

const templates: Record<string, OptionLeg[]> = {
  "Long Call": [{ id: "1", side: "BUY", optionType: "CE", expiry: expiries[0], strike: 22500, quantity: 50, premium: 180, iv: 14 }],
  "Iron Condor": [
    { id: "1", side: "SELL", optionType: "PE", expiry: expiries[0], strike: 22300, quantity: 50, premium: 80, iv: 14 },
    { id: "2", side: "BUY", optionType: "PE", expiry: expiries[0], strike: 22100, quantity: 50, premium: 30, iv: 15 },
    { id: "3", side: "SELL", optionType: "CE", expiry: expiries[0], strike: 22600, quantity: 50, premium: 75, iv: 14 },
    { id: "4", side: "BUY", optionType: "CE", expiry: expiries[0], strike: 22800, quantity: 50, premium: 28, iv: 15 }
  ]
};

function LegRow({ leg, idx, onDragStart, onDrop }: { leg: OptionLeg; idx: number; onDragStart: (i: number) => void; onDrop: (i: number) => void }) {
  const { updateLeg, removeLeg, duplicateLeg } = useTradingStore();
  const onNum = (k: keyof OptionLeg, v: string) => updateLeg(leg.id, { [k]: Number(v) } as Partial<OptionLeg>);

  return <tr draggable onDragStart={() => onDragStart(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(idx)} className="border-b border-slate-800/80 text-xs hover:bg-slate-900/60">
    <td><select value={leg.side} onChange={(e) => updateLeg(leg.id, { side: e.target.value as Side })} className="rounded bg-slate-800 px-1 py-1"><option>BUY</option><option>SELL</option></select></td>
    <td><select value={leg.optionType} onChange={(e) => updateLeg(leg.id, { optionType: e.target.value as OptionType })} className="rounded bg-slate-800 px-1 py-1"><option>CE</option><option>PE</option><option>FUT</option></select></td>
    <td><select value={leg.expiry} onChange={(e) => updateLeg(leg.id, { expiry: e.target.value })} className="rounded bg-slate-800 px-1 py-1">{expiries.map((ex) => <option key={ex}>{ex}</option>)}</select></td>
    <td>{leg.optionType === "FUT" ? <span className="text-slate-400">—</span> : <select value={leg.strike} onChange={(e) => onNum("strike", e.target.value)} className="rounded bg-slate-800 px-1 py-1">{strikes.map((s) => <option key={s} value={s}>{s}</option>)}</select>}</td>
    <td><input value={leg.quantity} type="number" onChange={(e) => onNum("quantity", e.target.value)} className="w-20 rounded bg-slate-800 px-1 py-1" /></td>
    <td><input value={leg.premium} type="number" onChange={(e) => onNum("premium", e.target.value)} className="w-20 rounded bg-slate-800 px-1 py-1" /></td>
    <td><input value={leg.iv} type="number" onChange={(e) => onNum("iv", e.target.value)} className="w-16 rounded bg-slate-800 px-1 py-1" /></td>
    <td className="text-slate-400">live</td>
    <td><button onClick={() => duplicateLeg(leg.id)} className="rounded bg-slate-700 px-2 py-1">Duplicate</button></td>
    <td><button onClick={() => removeLeg(leg.id)} className="rounded bg-bear/70 px-2 py-1">Delete</button></td>
  </tr>;
}

export default function StrategyBuilder() {
  const { legs, setTemplate, addLeg, reorderLegs, resetStrategy, undo, redo, exportStrategy, importStrategy, spot, setSpot } = useTradingStore();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [json, setJson] = useState("");
  const summary = useMemo(() => computePayoffSummary(legs, spot), [legs, spot]);

  return <div className="space-y-3">
    <div className="flex items-center gap-2"><h1 className="text-xl font-semibold">Institutional Strategy Builder</h1><input type="number" value={spot} onChange={(e) => setSpot(Number(e.target.value))} className="ml-4 w-28 rounded bg-slate-800 px-2 py-1 text-sm" /><span className="text-xs text-slate-400">Spot</span></div>

    <div className="grid grid-cols-[1.5fr_0.5fr] gap-3">
      <section className="rounded-xl border border-terminal-border bg-terminal-card/70 p-2 backdrop-blur">
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <button className="rounded bg-info/80 px-2 py-1" onClick={() => addLeg()}>+ Add Leg</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={() => addLeg({ optionType: "FUT", strike: spot, premium: 0 })}>+ Add FUT Leg</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={undo}>Undo</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={redo}>Redo</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={resetStrategy}>Reset</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={() => setJson(exportStrategy())}>Export JSON</button>
          <button className="rounded bg-slate-700 px-2 py-1" onClick={() => importStrategy(json)}>Import JSON</button>
        </div>
        <div className="overflow-auto"><table className="w-full min-w-[960px]"><thead className="text-left text-[11px] text-slate-400"><tr><th>Side</th><th>Type</th><th>Expiry</th><th>Strike</th><th>Qty</th><th>Premium</th><th>IV</th><th>Greeks</th><th></th><th></th></tr></thead><tbody>{legs.map((leg, i) => <LegRow key={leg.id} leg={leg} idx={i} onDragStart={setDragIdx} onDrop={(to) => { if (dragIdx !== null) reorderLegs(dragIdx, to); }} />)}</tbody></table></div>
        <textarea className="mt-2 h-24 w-full rounded bg-slate-900 p-2 text-xs" placeholder="Import/Export strategy JSON" value={json} onChange={(e) => setJson(e.target.value)} />
      </section>

      <aside className="space-y-2 rounded-xl border border-terminal-border bg-terminal-card/70 p-2 text-xs backdrop-blur">
        <div>Max Profit: <span className="text-bull">{summary.maxProfit.toFixed(2)}</span></div>
        <div>Max Loss: <span className="text-bear">{summary.maxLoss.toFixed(2)}</span></div>
        <div>Breakevens: {summary.breakevens.join(", ") || "N/A"}</div>
        <div>POP: {summary.pop.toFixed(1)}%</div>
        <div>Margin Est: ₹{summary.margin.toFixed(0)}</div>
        <div>RR Ratio: {summary.rr.toFixed(2)}</div>
        <div>Δ {summary.netGreeks.delta.toFixed(2)} | Θ {summary.netGreeks.theta.toFixed(2)}</div>
        <div>Γ {summary.netGreeks.gamma.toFixed(3)} | V {summary.netGreeks.vega.toFixed(2)}</div>
        <div className="flex flex-wrap gap-1">{summary.tags.map((t) => <span key={t} className="rounded bg-slate-800 px-2 py-1">{t}</span>)}</div>
      </aside>
    </div>

    <div className="rounded-xl border border-terminal-border bg-terminal-card/70 p-2"><div className="h-[420px]"><PayoffGraph legs={legs} currentSpot={spot} /></div></div>

    <div className="flex flex-wrap gap-2">{Object.keys(templates).map((t) => <button key={t} className="rounded bg-slate-800 px-2 py-1 text-xs" onClick={() => setTemplate(templates[t])}>{t}</button>)}</div>
  </div>;
}
