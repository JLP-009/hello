"use client";

import { useEffect } from "react";
import { PayoffGraph } from "@/components/strategy/PayoffGraph";
import { useTradingStore } from "@/store/useTradingStore";
import { OptionLeg } from "@/types/options";

const templates: Record<string, OptionLeg[]> = {
  "Long Call": [{ id: "1", side: "BUY", optionType: "CE", expiry: "2026-05-28", strike: 22500, quantity: 50, premium: 180, iv: 14 }],
  "Long Put": [{ id: "1", side: "BUY", optionType: "PE", expiry: "2026-05-28", strike: 22400, quantity: 50, premium: 160, iv: 15 }],
  "Bull Call Spread": [
    { id: "1", side: "BUY", optionType: "CE", expiry: "2026-05-28", strike: 22400, quantity: 50, premium: 220, iv: 14 },
    { id: "2", side: "SELL", optionType: "CE", expiry: "2026-05-28", strike: 22700, quantity: 50, premium: 95, iv: 14 }
  ],
  "Iron Condor": [
    { id: "1", side: "SELL", optionType: "PE", expiry: "2026-05-28", strike: 22300, quantity: 50, premium: 80, iv: 14 },
    { id: "2", side: "BUY", optionType: "PE", expiry: "2026-05-28", strike: 22100, quantity: 50, premium: 30, iv: 15 },
    { id: "3", side: "SELL", optionType: "CE", expiry: "2026-05-28", strike: 22600, quantity: 50, premium: 75, iv: 14 },
    { id: "4", side: "BUY", optionType: "CE", expiry: "2026-05-28", strike: 22800, quantity: 50, premium: 28, iv: 15 }
  ]
};

export default function StrategyBuilder() {
  const { legs, setTemplate, spot } = useTradingStore();

  useEffect(() => {
    if (!legs.length) {
      setTemplate(templates["Iron Condor"]);
    }
  }, [legs.length, setTemplate]);

  return <div className="space-y-4"><h1 className="text-xl font-semibold">Strategy Builder</h1>
    <div className="grid grid-cols-[1.2fr_0.8fr] gap-3"><section className="card p-3"><h2>Multi-leg Builder</h2><table className="mt-2 w-full text-xs"><thead><tr><th>Side</th><th>Type</th><th>Expiry</th><th>Strike</th><th>Qty</th><th>Premium</th><th>IV</th></tr></thead><tbody>{legs.map((l) => <tr key={l.id}><td>{l.side}</td><td>{l.optionType}</td><td>{l.expiry}</td><td>{l.strike}</td><td>{l.quantity}</td><td>{l.premium}</td><td>{l.iv}%</td></tr>)}</tbody></table></section>
      <section className="card p-3 text-sm"><h2>Realtime Analytics</h2><div className="grid grid-cols-2 gap-2"><div>Max Profit: Dynamic</div><div>Max Loss: Dynamic</div><div>Breakeven: Dynamic</div><div>POP: 64%</div><div>Net Delta: +0.12</div><div>Net Theta: +150</div><div>Net Gamma: -0.03</div><div>Net Vega: -220</div><div>Margin: ₹1.8L</div><div>RR: 1.5</div></div></section></div>
    <div className="card h-[420px] p-2"><PayoffGraph legs={legs} currentSpot={spot} /></div>
    <div className="card p-3"><h3>Ready-made Strategies</h3><div className="mt-2 flex flex-wrap gap-2">{Object.keys(templates).map((t) => <button key={t} className="rounded bg-slate-800 px-2 py-1" onClick={() => setTemplate(templates[t])}>{t}</button>)}</div></div>
    <div className="card p-3"><h3>Market Intelligence</h3><p>Suggested Strategy: Iron Condor — Range market, strong OI walls, theta effective, low gamma risk.</p></div>
  </div>;
}
