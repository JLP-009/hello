const indices = ["NIFTY","BANKNIFTY","FINNIFTY","SENSEX"];
export default function DashboardPage(){
return <div className="space-y-4">
  <h1 className="text-xl font-semibold">Institutional Options Cockpit</h1>
  <section className="grid grid-cols-4 gap-3">{indices.map(i=><div key={i} className="card p-3"><div>{i}</div><div className="text-lg font-semibold">22,450.30</div><div className="text-bull">+0.84%</div><div>VWAP: Above</div><div>Regime: Trend</div><div>Trend Strength: Strong</div><div>IV Regime: Compressed</div></div>)}</section>
  <section className="card p-3"><h2 className="mb-2 font-medium">Live Signal Summary</h2><div className="grid grid-cols-6 gap-2 text-sm"><div>Trend: Bullish</div><div>Vol Regime: Low</div><div>Theta: Effective</div><div>Gamma Risk: Moderate</div><div>OI Pressure: Put Heavy</div><div>PCR: 1.18</div></div></section>
  <section className="card p-3"><h2 className="mb-2 font-medium">Live Option Flow Panel</h2><div className="grid grid-cols-6 gap-2 text-sm"><div className="text-bear">CE Writing</div><div className="text-bull">PE Writing</div><div>CE Unwind</div><div>PE Unwind</div><div>Max Pain: 22400</div><div>PCR: 1.18</div></div><div className="mt-3 h-44 rounded bg-slate-900 p-2">Realtime heatmap/cluster placeholder</div></section>
</div>}
