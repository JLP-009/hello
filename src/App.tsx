import {
  Bell, Bot, Briefcase, CandlestickChart, Gauge, LayoutDashboard, Menu, Search, Settings, ShieldAlert, Target, UserCircle2, Wifi,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { navItems, useTerminalStore } from './store/useTerminalStore'

type OptionRow = {
  callOi: string; callLtp: string; callIv: string; strike: number; putIv: string; putLtp: string; putOi: string; atm: boolean
}

const stats = [
  ['Live P&L', '+$18,420', 'bull'], ['Win Rate', '68.4%', 'accent'], ['Active Positions', '23', 'text'],
  ['Account Balance', '$1.28M', 'text'], ['Margin Used', '41%', 'bear'], ['Risk Meter', 'Moderate', 'accent'],
] as const

const optionRows: OptionRow[] = Array.from({ length: 140 }, (_, i) => {
  const strike = 24200 + i * 25
  return {
    strike,
    atm: strike === 24750,
    callIv: (11 + i / 14).toFixed(1),
    putIv: (10.2 + i / 15).toFixed(1),
    callLtp: (320 - i * 2.1).toFixed(2),
    putLtp: (10 + i * 2.2).toFixed(2),
    callOi: `${(130 + i * 2.6).toFixed(0)}k`,
    putOi: `${(90 + i * 2.9).toFixed(0)}k`,
  }
})

const optionColumns: ColumnDef<OptionRow>[] = [
  { accessorKey: 'callOi', header: 'CALL OI' },
  { accessorKey: 'callLtp', header: 'CALL LTP' },
  { accessorKey: 'callIv', header: 'CALL IV' },
  { accessorKey: 'strike', header: 'STRIKE' },
  { accessorKey: 'putIv', header: 'PUT IV' },
  { accessorKey: 'putLtp', header: 'PUT LTP' },
  { accessorKey: 'putOi', header: 'PUT OI' },
]

const pnlData = Array.from({ length: 16 }, (_, i) => ({ t: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`, pnl: 11800 + i * 520 - (i > 8 ? (i - 8) * 260 : 0) }))
const payoffData = Array.from({ length: 19 }, (_, i) => ({ x: 23600 + i * 120, y: -3600 + i * 540 - Math.max(i - 10, 0) * 620 }))

const navIcon = [LayoutDashboard, CandlestickChart, Target, Bot, Briefcase, ShieldAlert, Gauge, Bell, CandlestickChart, Settings]
const panel = 'rounded-2xl border border-terminal-border bg-terminal-panel shadow-panel'
const metricColor: Record<string, string> = { bull: 'text-terminal-bull', bear: 'text-terminal-bear', accent: 'text-terminal-accent', text: 'text-terminal-text' }

export function App() {
  const { activeNav, sidebarCollapsed, setActiveNav, toggleSidebar, strategyPreset, setStrategyPreset } = useTerminalStore()
  const table = useReactTable({ data: optionRows, columns: optionColumns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="min-h-screen bg-terminal-bg font-[Inter] text-terminal-text antialiased">
      <div className="flex">
        <aside className={`${panel} m-4 mr-0 flex h-[calc(100vh-32px)] flex-col p-4 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-2"><CandlestickChart className="text-terminal-accent" size={18} /><span className={`${sidebarCollapsed ? 'hidden' : ''} text-sm font-semibold tracking-wide`}>QuantEdge</span></div><button className="rounded-xl p-2 text-terminal-muted transition-colors hover:bg-terminal-mint/10 hover:text-terminal-text" onClick={toggleSidebar}><Menu size={16} /></button></div>
          <nav className="space-y-2">{navItems.map((item, idx) => { const Icon = navIcon[idx]; const active = activeNav === item; return <button key={item} onClick={() => setActiveNav(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${active ? 'bg-terminal-accent/14 text-terminal-accent ring-1 ring-terminal-accent/30' : 'text-terminal-muted hover:bg-terminal-mint/10 hover:text-terminal-text'}`}><Icon size={16} />{!sidebarCollapsed && item}</button> })}</nav>
        </aside>

        <main className="flex-1 p-4">
          <header className={`${panel} mb-4 flex items-center justify-between px-4 py-3`}>
            <div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-terminal-border bg-terminal-elevated px-4 py-2.5 text-terminal-muted"><Search size={16} /><span className="text-sm">Search instruments, strategies, orders...</span></div>
            <div className="flex items-center gap-4 text-sm"><span className="rounded-xl border border-terminal-border bg-terminal-mint/20 px-3 py-1 font-medium text-terminal-accent">Market Open</span><span className="text-terminal-muted">14:28:39 UTC</span><span className="flex items-center gap-1 text-terminal-accent"><Wifi size={14} />Connected</span><button className="rounded-xl p-2 text-terminal-muted transition-colors hover:bg-terminal-mint/10 hover:text-terminal-text"><Bell size={16} /></button><UserCircle2 className="text-terminal-muted" size={18} /></div>
          </header>

          <section className="grid grid-cols-2 gap-4 xl:grid-cols-6">{stats.map(([label, value, key]) => <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} key={label} className={`${panel} p-4`}><p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">{label}</p><p className={`mt-2 text-[26px] font-bold leading-tight ${metricColor[key]}`}>{value}</p></motion.div>)}</section>

          <section className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className={`${panel} p-4 xl:col-span-2`}><h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">Intraday P&L</h3><div className="h-56"><ResponsiveContainer><AreaChart data={pnlData}><defs><linearGradient id="pnl" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#24444D" strokeOpacity={0.35} /><XAxis dataKey="t" stroke="#8CA7A3" tickLine={false} axisLine={false} /><YAxis stroke="#8CA7A3" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#102129', border: '1px solid #24444D', borderRadius: 12, color: '#E6F4F1' }} /><Area type="monotone" dataKey="pnl" stroke="#0F5F5A" strokeWidth={1.5} fill="url(#pnl)" /></AreaChart></ResponsiveContainer></div></div>
            <div className={`${panel} p-4`}><h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">Strategy Builder</h3><div className="flex flex-wrap gap-2 text-xs">{['Iron Condor', 'Straddle', 'Strangle', 'Butterfly', 'Custom'].map((p) => <button key={p} onClick={() => setStrategyPreset(p)} className={`rounded-xl border px-3 py-2 font-medium transition-colors ${strategyPreset === p ? 'border-terminal-accent bg-terminal-mint/20 text-terminal-accent' : 'border-terminal-border text-terminal-muted hover:bg-terminal-mint/10'}`}>{p}</button>)}</div><div className="mt-4 space-y-2 text-sm text-terminal-muted"><p>Leg 1: NIFTY 24700 CE SELL 75</p><p>Leg 2: NIFTY 24900 CE BUY 75</p><p>Leg 3: NIFTY 24600 PE SELL 75</p><p>Leg 4: NIFTY 24400 PE BUY 75</p></div></div>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className={`${panel} overflow-hidden p-0 xl:col-span-2`}><div className="border-b border-terminal-border px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">Option Chain</div><div className="max-h-72 overflow-auto"><table className="w-full table-fixed text-xs"><thead className="sticky top-0 z-10 bg-terminal-elevated text-terminal-muted">{table.getHeaderGroups().map((headerGroup) => (<tr key={headerGroup.id}>{headerGroup.headers.map((header, i) => <th key={header.id} className={`py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] ${i===0?'px-3':''} ${i===3?'sticky left-[208px] z-20 bg-terminal-elevated text-terminal-text':''}`}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>))}</thead><tbody>{table.getRowModel().rows.slice(0, 52).map((row) => { const r = row.original; return <tr key={row.id} className={`border-t border-terminal-border/80 transition-colors ${r.atm ? 'bg-terminal-mint/20 hover:bg-terminal-mint/30' : 'hover:bg-terminal-mint/10'}`}>{row.getVisibleCells().map((cell, i) => <td key={cell.id} className={`py-2 text-[12px] ${i===0?'px-3 text-terminal-bull':''} ${i===1?'text-terminal-text':''} ${i===2?'text-terminal-muted':''} ${i===3?'sticky left-[208px] z-[1] bg-terminal-panel font-semibold text-terminal-text':''} ${i===4?'text-terminal-muted':''} ${i===5?'text-terminal-bear':''} ${i===6?'text-terminal-bear':''}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>})}</tbody></table></div></div>
            <div className={`${panel} p-4`}><h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">Payoff Curve</h3><div className="h-64"><ResponsiveContainer><LineChart data={payoffData}><CartesianGrid stroke="#24444D" strokeOpacity={0.35} /><XAxis dataKey="x" stroke="#8CA7A3" tickLine={false} axisLine={false} /><YAxis stroke="#8CA7A3" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#102129', border: '1px solid #24444D', borderRadius: 12, color: '#E6F4F1' }} /><Line type="monotone" dataKey="y" stroke="#0F5F5A" strokeWidth={1.6} dot={false} /></LineChart></ResponsiveContainer></div></div>
          </section>

          <section className={`${panel} mt-4 overflow-hidden`}><div className="border-b border-terminal-border px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-terminal-muted">Live Positions</div><div className="grid grid-cols-8 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-terminal-muted"><span>Symbol</span><span>Qty</span><span>Avg</span><span>LTP</span><span>Realized</span><span>Unrealized</span><span>MTM</span><span>Status</span></div>{[['NIFTY 24700 CE', 75, 122.3, 138.2, '+$1,240', '+$780', '+$2,020', 'Open'], ['BANKNIFTY 52600 PE', 30, 214.1, 197.5, '-$420', '+$680', '+$260', 'Open']].map((p) => <div key={p[0] as string} className="grid grid-cols-8 border-t border-terminal-border px-4 py-3 text-xs"><span>{p[0]}</span><span>{p[1]}</span><span>{p[2]}</span><span>{p[3]}</span><span className="text-terminal-bull">{p[4]}</span><span className="text-terminal-bull">{p[5]}</span><span className="font-semibold text-terminal-accent">{p[6]}</span><span>{p[7]}</span></div>)}<div className="sticky bottom-0 grid grid-cols-3 border-t border-terminal-border bg-terminal-elevated px-4 py-3 text-sm"><span>Total Realized: <b>$12,840</b></span><span>Total Unrealized: <b className="text-terminal-bull">$4,290</b></span><span>Total MTM: <b className="text-terminal-accent">$17,130</b></span></div></section>
        </main>
      </div>
    </div>
  )
}
