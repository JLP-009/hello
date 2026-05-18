"use client";
import Link from "next/link";
import { useTradingStore } from "@/store/useTradingStore";

const nav = ["dashboard", "strategy-builder", "option-chain", "analytics", "market-structure", "saved-strategies"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { symbol, setSymbol, expiry, setExpiry, connected } = useTradingStore();
  return <div className="min-h-screen">
    <header className="sticky top-0 z-20 border-b border-terminal-border bg-terminal-bg/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-2 text-sm">
        <div className="font-semibold text-info">OptiTerminal</div>
        <input className="rounded bg-slate-800 px-2 py-1" value={symbol} onChange={(e)=>setSymbol(e.target.value.toUpperCase())} />
        <input className="rounded bg-slate-800 px-2 py-1" value={expiry} onChange={(e)=>setExpiry(e.target.value)} />
        <select className="rounded bg-slate-800 px-2 py-1"><option>NSE</option><option>BSE</option></select>
        <span className={connected ? "text-bull" : "text-bear"}>{connected ? "● WebSocket Connected" : "● Disconnected"}</span>
        <span className="text-warn">Market: OPEN</span>
        <div className="ml-auto">Institutional User</div>
      </div>
    </header>
    <div className="grid grid-cols-[220px_1fr]">
      <aside className="min-h-[calc(100vh-42px)] border-r border-terminal-border p-3 text-sm">
        {nav.map((item)=><Link key={item} className="block rounded px-3 py-2 hover:bg-slate-800" href={`/${item}`}>{item.replace("-"," ")}</Link>)}
        <Link className="block rounded px-3 py-2 hover:bg-slate-800" href="#">settings</Link>
      </aside>
      <main className="p-4">{children}</main>
    </div>
  </div>;
}
