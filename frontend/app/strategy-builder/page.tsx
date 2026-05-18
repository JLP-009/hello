"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PayoffGraph } from "@/components/strategy/PayoffGraph";
import { computePayoffSummary } from "@/lib/payoff/payoffUtils";
import { useTradingStore } from "@/store/useTradingStore";
import { OptionLeg, OptionType, Side } from "@/types/options";

const tabs = ["Payoff Graph", "P&L Table", "Greeks Curve", "Strategy Chart", "OI Analysis"] as const;

type Tab = typeof tabs[number];

function LegRow({ leg, idx, onDragStart, onDrop }: { leg: OptionLeg; idx: number; onDragStart: (n: number) => void; onDrop: (n: number) => void }) {
  const { updateLeg, removeLeg, duplicateLeg, lotSize, expiries, strikes } = useTradingStore();
  const [lots, setLots] = useState(Math.max(1, Math.round(leg.quantity / lotSize)));
  const applyLots = (v: number) => { const l = Math.max(1, v); setLots(l); updateLeg(leg.id, { quantity: l * lotSize }); };
  return <tr draggable onDragStart={() => onDragStart(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(idx)} className="border-b border-slate-800 text-xs">
    <td><select value={leg.side} onChange={(e)=>updateLeg(leg.id,{side:e.target.value as Side})} className="bg-slate-800 rounded px-1 py-1"><option>BUY</option><option>SELL</option></select></td>
    <td><select value={leg.optionType} onChange={(e)=>updateLeg(leg.id,{optionType:e.target.value as OptionType})} className="bg-slate-800 rounded px-1 py-1"><option>CE</option><option>PE</option><option>FUT</option></select></td>
    <td><select value={leg.expiry} onChange={(e)=>updateLeg(leg.id,{expiry:e.target.value})} className="bg-slate-800 rounded px-1 py-1">{expiries.map(ex=><option key={ex}>{ex}</option>)}</select></td>
    <td><select value={leg.strike} onChange={(e)=>updateLeg(leg.id,{strike:Number(e.target.value)})} className="bg-slate-800 rounded px-1 py-1">{strikes.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
    <td><input className="w-16 bg-slate-800 rounded px-1 py-1" type="number" value={lots} onChange={(e)=>applyLots(Number(e.target.value))}/></td>
    <td><input className="w-16 bg-slate-800 rounded px-1 py-1" type="number" value={leg.premium} onChange={(e)=>updateLeg(leg.id,{premium:Number(e.target.value)})}/></td>
    <td><input className="w-14 bg-slate-800 rounded px-1 py-1" type="number" value={leg.iv} onChange={(e)=>updateLeg(leg.id,{iv:Number(e.target.value)})}/></td>
    <td className="text-slate-400">Δ/Θ/Γ/V</td><td><button className="bg-slate-700 rounded px-2 py-1" onClick={()=>duplicateLeg(leg.id)}>Dup</button></td><td><button className="bg-bear rounded px-2 py-1" onClick={()=>removeLeg(leg.id)}>Del</button></td>
  </tr>;
}

export default function StrategyBuilder() {
  const [tab, setTab] = useState<Tab>("Payoff Graph");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [json, setJson] = useState("");
  const { legs, addLeg, reorderLegs, spot, setSpot, undo, redo, resetStrategy, exportStrategy, importStrategy } = useTradingStore();
  const s = useMemo(() => computePayoffSummary(legs, spot), [legs, spot]);

  return <div className="space-y-3">
    <div className="grid grid-cols-[280px_1fr_300px] gap-3">
      <section className="rounded-xl border border-[#1E293B] bg-[#0B1120]/90 p-2">
        <div className="mb-2 text-sm font-semibold">Option Chain (workflow)</div>
        <div className="max-h-[360px] overflow-auto text-[11px]"><table className="w-full"><thead><tr><th className="text-bear">CALLS</th><th>STRIKE</th><th className="text-bull">PUTS</th></tr></thead><tbody>{[22300,22350,22400,22450,22500,22550,22600].map((k)=><tr key={k} className={k===22450?"bg-info/20":""}><td><button className="hover:text-bull" onClick={()=>addLeg({optionType:"CE", strike:k, side:"BUY"})}>Buy CE</button> | <button className="hover:text-bear" onClick={()=>addLeg({optionType:"CE", strike:k, side:"SELL"})}>Sell</button></td><td className="text-center sticky left-0 bg-[#0B1120]">{k}</td><td><button className="hover:text-bull" onClick={()=>addLeg({optionType:"PE", strike:k, side:"BUY"})}>Buy PE</button> | <button className="hover:text-bear" onClick={()=>addLeg({optionType:"PE", strike:k, side:"SELL"})}>Sell</button></td></tr>)}</tbody></table></div>
      </section>

      <section className="rounded-xl border border-[#1E293B] bg-[#101827]/85 p-2">
        <div className="mb-2 flex flex-wrap gap-2 text-xs"><button onClick={()=>addLeg()} className="rounded bg-info px-2 py-1">+ Leg</button><button onClick={()=>addLeg({optionType:"FUT", premium:0})} className="rounded bg-slate-700 px-2 py-1">+ FUT</button><button onClick={undo} className="rounded bg-slate-700 px-2 py-1">Undo</button><button onClick={redo} className="rounded bg-slate-700 px-2 py-1">Redo</button><button onClick={resetStrategy} className="rounded bg-slate-700 px-2 py-1">Reset</button><button onClick={()=>setJson(exportStrategy())} className="rounded bg-slate-700 px-2 py-1">Export</button><button onClick={()=>importStrategy(json)} className="rounded bg-slate-700 px-2 py-1">Import</button></div>
        <div className="overflow-auto"><table className="w-full min-w-[920px]"><thead className="text-left text-[11px] text-slate-400"><tr><th>Side</th><th>Type</th><th>Expiry</th><th>Strike</th><th>Lots</th><th>Premium</th><th>IV</th><th>Greeks</th><th></th><th></th></tr></thead><tbody>{legs.map((leg,i)=><LegRow key={leg.id} leg={leg} idx={i} onDragStart={setDragIdx} onDrop={(to)=>{if(dragIdx!==null) reorderLegs(dragIdx,to);}} />)}</tbody></table></div>
        <textarea value={json} onChange={(e)=>setJson(e.target.value)} className="mt-2 h-20 w-full rounded bg-[#050816] p-2 text-xs" placeholder="Strategy JSON" />
      </section>

      <aside className="rounded-xl border border-[#1E293B] bg-[#0B1120]/90 p-2 text-xs">
        <div>Max Profit: <span className="text-bull">{s.maxProfit.toFixed(0)}</span></div><div>Max Loss: <span className="text-bear">{s.maxLoss.toFixed(0)}</span></div><div>POP: {s.pop.toFixed(1)}%</div><div>RR: {s.rr.toFixed(2)}</div><div>Margin: ₹{s.margin.toFixed(0)}</div><div>Δ {s.netGreeks.delta.toFixed(2)} Θ {s.netGreeks.theta.toFixed(2)}</div><div>Γ {s.netGreeks.gamma.toFixed(3)} V {s.netGreeks.vega.toFixed(2)}</div><div className="mt-2 flex flex-wrap gap-1">{s.tags.map(t=><span key={t} className="rounded bg-slate-800 px-2 py-1">{t}</span>)}</div>
      </aside>
    </div>

    <div className="rounded-xl border border-[#1E293B] bg-[#101827]/80 p-2">
      <div className="mb-2 flex gap-2">{tabs.map((t)=><button key={t} onClick={()=>setTab(t)} className={`rounded px-2 py-1 text-xs ${tab===t?"bg-info text-white":"bg-slate-800"}`}>{t}</button>)}<input type="number" value={spot} onChange={(e)=>setSpot(Number(e.target.value))} className="ml-auto w-28 rounded bg-slate-900 px-2 py-1 text-xs"/></div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="h-[420px]">{tab==="Payoff Graph" ? <PayoffGraph legs={legs} currentSpot={spot}/> : <div className="h-full rounded bg-[#050816] p-3 text-sm text-slate-400">{tab} panel placeholder with institutional analytics workflow.</div>}</motion.div>
    </div>
  </div>;
}
