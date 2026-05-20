import { useMemo, useState } from 'react'
import { Bell, Bot, Briefcase, CandlestickChart, Gauge, LayoutDashboard, Menu, Search, Settings, ShieldAlert, Target, UserCircle2, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { navItems, useTerminalStore } from './store/useTerminalStore'
import { Badge, Card, SectionHeading } from './components/ui'

type OptionRow = { callOi: string; callVolume: string; callIv: string; callLtp: string; callDelta: string; strike: number; putDelta: string; putLtp: string; putIv: string; putVolume: string; putOi: string; bid: string; ask: string; atm: boolean }
type LegRow = { id: string; side: 'BUY'|'SELL'; strike: number; expiry: string; premium: number; delta: number; theta: number; qty: number; orderType: 'MKT'|'LMT' }

const stats = [['Live P&L', '+$18,420', 'success'], ['Win Rate', '68.4%', 'accent'], ['Active Positions', '23', 'neutral'], ['Account Balance', '$1.28M', 'neutral']] as const
const navIcon = [LayoutDashboard, CandlestickChart, Target, Bot, Briefcase, ShieldAlert, Gauge, Bell, CandlestickChart, Settings]
const optionRows: OptionRow[] = Array.from({ length: 1200 }, (_, i) => { const strike = 24200 + i * 5; return { strike, atm: strike === 24750, callOi: `${140 + i}k`, callVolume: `${20 + Math.floor(i / 4)}k`, callIv: (11 + i / 120).toFixed(2), callLtp: (340 - i * 0.45).toFixed(2), callDelta: (0.55 - i * 0.001).toFixed(2), putDelta: (-0.43 + i * 0.001).toFixed(2), putLtp: (10 + i * 0.45).toFixed(2), putIv: (10.5 + i / 120).toFixed(2), putVolume: `${16 + Math.floor(i / 4)}k`, putOi: `${100 + i}k`, bid: (120 + i * 0.22).toFixed(2), ask: (121 + i * 0.22).toFixed(2) } })

const columns: ColumnDef<OptionRow>[] = [
  { accessorKey: 'callOi', header: 'OI', size: 84 }, { accessorKey: 'callVolume', header: 'Vol', size: 78 }, { accessorKey: 'callIv', header: 'IV', size: 68 }, { accessorKey: 'callLtp', header: 'LTP', size: 72 }, { accessorKey: 'callDelta', header: 'Delta', size: 72 }, { accessorKey: 'strike', header: 'Strike', size: 92 }, { accessorKey: 'putDelta', header: 'Delta', size: 72 }, { accessorKey: 'putLtp', header: 'LTP', size: 72 }, { accessorKey: 'putIv', header: 'IV', size: 68 }, { accessorKey: 'putVolume', header: 'Vol', size: 78 }, { accessorKey: 'putOi', header: 'OI', size: 84 }, { accessorKey: 'bid', header: 'Bid', size: 72 }, { accessorKey: 'ask', header: 'Ask', size: 72 },
]

const pnlData = Array.from({ length: 24 }, (_, i) => ({ t: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`, pnl: 10200 + i * 580 - (i > 14 ? (i - 14) * 460 : 0) }))
const payoffData = Array.from({ length: 31 }, (_, i) => ({ x: 23600 + i * 60, y: -3100 + i * 320 - Math.max(0, i - 18) * 450 }))

const seedLegs: LegRow[] = [
  { id: '1', side: 'SELL', strike: 24700, expiry: '27 JUN', premium: 122.4, delta: 0.34, theta: 18.2, qty: 75, orderType: 'LMT' },
  { id: '2', side: 'BUY', strike: 24900, expiry: '27 JUN', premium: 61.8, delta: 0.21, theta: 9.7, qty: 75, orderType: 'LMT' },
]

export function App() {
  const { activeNav, sidebarCollapsed, setActiveNav, toggleSidebar, strategyPreset, setStrategyPreset } = useTerminalStore()
  const [selectedStrike, setSelectedStrike] = useState<number>(24750)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [legs] = useState(seedLegs)

  const table = useReactTable({ data: optionRows, columns, getCoreRowModel: getCoreRowModel(), columnResizeMode: 'onChange' })
  const visibleRows = useMemo(() => table.getRowModel().rows.slice(120, 420), [table])

  return <div className="min-h-screen bg-terminal-bg-primary font-[Inter] text-terminal-text-primary antialiased">
    <div className="flex">
      <aside className={`m-4 mr-0 flex h-[calc(100vh-32px)] flex-col rounded-2xl border border-terminal-border-subtle/70 bg-terminal-bg-secondary/90 p-3 shadow-panel transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-60'}`}>
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><CandlestickChart className="text-terminal-accent-primary" size={17} /><span className={`${sidebarCollapsed ? 'hidden' : ''} text-secondary-sm font-semibold`}>QuantEdge</span></div><button className="rounded-xl p-2 text-terminal-text-secondary hover:bg-terminal-bg-elevated/70" onClick={toggleSidebar}><Menu size={15} /></button></div>
        <nav className="space-y-1">{navItems.map((item, idx) => { const Icon = navIcon[idx]; const active = item === activeNav; return <button key={item} onClick={() => setActiveNav(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-secondary-sm font-medium transition-colors ${active ? 'bg-terminal-bg-elevated/80 text-terminal-text-primary' : 'text-terminal-text-secondary hover:bg-terminal-bg-elevated/50 hover:text-terminal-text-primary'}`}><Icon size={15} />{!sidebarCollapsed && item}</button> })}</nav>
      </aside>

      <main className="flex-1 p-4">
        <div className="mb-3 rounded-2xl border border-terminal-border-subtle/70 bg-terminal-bg-secondary px-4 py-3"><div className="flex items-center justify-between"><div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-terminal-border-subtle/70 bg-terminal-bg-elevated px-3 py-2"><Search size={15} className="text-terminal-text-secondary" /><span className="text-secondary-sm text-terminal-text-secondary">Search instruments, strategies, orders...</span></div><div className="flex items-center gap-3"><Badge tone="success">Market Open</Badge><span className="text-secondary-sm text-terminal-text-secondary">14:28:39 UTC</span><Badge tone="accent"><Wifi size={12} className="inline"/> Connected</Badge><Bell size={15} className="text-terminal-text-secondary" /><UserCircle2 size={17} className="text-terminal-text-secondary" /></div></div></div>

        <PanelGroup autoSaveId="terminal-workspace-v1" direction="vertical" className="h-[calc(100vh-132px)]">
          <Panel defaultSize={34} minSize={24} collapsible>
            <div className="rounded-2xl border border-terminal-border-subtle/60 bg-terminal-bg-secondary p-3">
              <div className="mb-3 flex items-center justify-between"><h1 className="text-section-title font-semibold">Dashboard</h1><Badge tone="neutral">Workspace: Core</Badge></div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-7">
                <div className="xl:col-span-4 grid grid-cols-2 gap-3">{stats.map(([l, v, tone]) => <motion.div whileHover={{ y: -1 }} key={l} className="rounded-xl bg-terminal-bg-elevated/70 p-3"><p className="text-label-xs uppercase tracking-[0.08em] text-terminal-text-secondary">{l}</p><p className={`mt-1 text-value-xl font-bold ${tone === 'success' ? 'text-terminal-success' : tone === 'accent' ? 'text-terminal-accent-primary' : 'text-terminal-text-primary'}`}>{v}</p></motion.div>)}</div>
                <div className="xl:col-span-3 rounded-xl bg-terminal-bg-elevated/40 p-3">
                  <SectionHeading title="Strategy Builder" subtitle="Execution legs + Greeks" />
                  <div className="mb-3 flex flex-wrap gap-2">{['Iron Condor', 'Straddle', 'Strangle', 'Butterfly'].map((p) => <button key={p} onClick={() => setStrategyPreset(p)} className={`rounded-xl px-3 py-2 text-label-xs font-semibold uppercase tracking-[0.06em] ${strategyPreset === p ? 'bg-terminal-accent-primary/15 text-terminal-accent-primary' : 'bg-terminal-bg-elevated text-terminal-text-secondary hover:text-terminal-text-primary'}`}>{p}</button>)}</div>
                  <div className="overflow-auto rounded-xl border border-terminal-border-subtle/70"><table className="w-full text-[12px]"><thead className="bg-terminal-bg-elevated/80 text-terminal-text-secondary"><tr><th className="px-2 py-2 text-left">Side</th><th className="px-2 py-2 text-left">Strike</th><th className="px-2 py-2 text-left">Expiry</th><th className="px-2 py-2 text-left">Premium</th><th className="px-2 py-2 text-left">Δ</th><th className="px-2 py-2 text-left">Θ</th><th className="px-2 py-2 text-left">Qty</th><th className="px-2 py-2 text-left">Type</th></tr></thead><tbody>{legs.map((leg)=><tr key={leg.id} className="border-t border-terminal-border-subtle/60"><td className={`px-2 py-2 ${leg.side==='BUY'?'text-terminal-success':'text-terminal-danger'}`}>{leg.side}</td><td className="px-2 py-2">{leg.strike}</td><td className="px-2 py-2">{leg.expiry}</td><td className="px-2 py-2">{leg.premium}</td><td className="px-2 py-2">{leg.delta}</td><td className="px-2 py-2">{leg.theta}</td><td className="px-2 py-2">{leg.qty}</td><td className="px-2 py-2">{leg.orderType}</td></tr>)}</tbody></table></div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="my-2 h-1 rounded bg-terminal-border-subtle/80" />

          <Panel defaultSize={66} minSize={42}>
            <PanelGroup autoSaveId="terminal-main-split-v1" direction="horizontal">
              <Panel defaultSize={72} minSize={58} collapsible>
                <Card className="h-full overflow-hidden border-terminal-border-subtle/60 bg-terminal-bg-secondary">
                  <div className="sticky top-0 z-40 flex items-center justify-between border-b border-terminal-border-subtle/60 bg-terminal-bg-secondary px-3 py-2"><SectionHeading title="Option Chain" subtitle="Pinned ATM • keyboard focus • resizable columns" /><Badge>ATM {selectedStrike}</Badge></div>
                  <div className="h-[calc(100%-76px)] overflow-auto"><table className="w-[1088px] table-fixed text-[12px]">
                    <thead className="sticky top-0 z-30 bg-terminal-bg-elevated/95"><tr>{table.getFlatHeaders().map((h) => <th key={h.id} style={{ width: h.getSize() }} className={`group relative border-b border-terminal-border-subtle/70 py-2 text-left text-label-xs font-semibold uppercase tracking-[0.08em] text-terminal-text-secondary ${h.id.includes('callOi') ? 'pl-3' : ''} ${h.id.includes('strike') ? 'sticky left-[374px] z-40 bg-terminal-bg-elevated text-terminal-text-primary' : ''}`}>{flexRender(h.column.columnDef.header, h.getContext())}<div onMouseDown={h.getResizeHandler()} onTouchStart={h.getResizeHandler()} className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-terminal-border-strong" /></th>)}</tr></thead>
                    <tbody>{visibleRows.map((row, idx) => { const isSelected = selectedRow === row.id; const isAtm = row.original.atm; return <tr key={row.id} tabIndex={0} onClick={() => { setSelectedRow(row.id); setSelectedStrike(row.original.strike) }} className={`${idx % 2 === 0 ? 'bg-transparent' : 'bg-terminal-bg-elevated/20'} ${isSelected ? 'bg-terminal-bg-elevated/70' : ''} ${isAtm ? 'sticky top-[34px] z-20 bg-terminal-accent-primary/15' : ''} border-b border-terminal-border-subtle/60 hover:bg-terminal-bg-elevated/55 focus-within:bg-terminal-bg-elevated/65`}>
                      {row.getVisibleCells().map((cell) => <td key={cell.id} className={`py-[7px] ${cell.column.id.includes('callOi') ? 'pl-3' : ''} ${cell.column.id.includes('strike') ? 'sticky left-[374px] z-30 bg-inherit font-semibold text-terminal-text-primary' : ''} ${['callOi','callVolume','callIv','callLtp','callDelta'].includes(cell.column.id) ? 'text-terminal-success' : ''} ${['putDelta','putLtp','putIv','putVolume','putOi'].includes(cell.column.id) ? 'text-terminal-danger' : ''}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                    </tr>})}</tbody>
                  </table></div>
                </Card>
              </Panel>

              <PanelResizeHandle className="mx-2 w-1 rounded bg-terminal-border-subtle/80" />

              <Panel defaultSize={28} minSize={24} collapsible>
                <div className="grid h-full gap-2">
                  <Card className="p-3 border-terminal-border-subtle/60 bg-terminal-bg-secondary"><SectionHeading title="Intraday P&L" /><div className="h-40"><ResponsiveContainer><AreaChart margin={{ top: 6, right: 6, bottom: 0, left: -18 }} data={pnlData}><CartesianGrid stroke="#1E3945" strokeOpacity={0.3} /><XAxis dataKey="t" tick={{ fontSize: 10 }} stroke="#8EA6AF" tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 10 }} stroke="#8EA6AF" tickLine={false} axisLine={false} /><Tooltip cursor={{ stroke: '#2B4B57', strokeDasharray: '4 2' }} contentStyle={{ background: '#132833', border: '1px solid #2B4B57', borderRadius: 8, fontSize: 11 }} /><Area dataKey="pnl" stroke="#3AA886" strokeWidth={1.4} fill="#3AA8862e" /></AreaChart></ResponsiveContainer></div></Card>
                  <Card className="p-3 border-terminal-border-subtle/60 bg-terminal-bg-secondary"><SectionHeading title="Payoff Visualization" /><div className="h-40"><ResponsiveContainer><LineChart margin={{ top: 6, right: 6, bottom: 0, left: -18 }} data={payoffData}><CartesianGrid stroke="#1E3945" strokeOpacity={0.3} /><XAxis tick={{ fontSize: 10 }} dataKey="x" stroke="#8EA6AF" tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 10 }} stroke="#8EA6AF" tickLine={false} axisLine={false} /><Tooltip cursor={{ stroke: '#2B4B57', strokeDasharray: '4 2' }} contentStyle={{ background: '#132833', border: '1px solid #2B4B57', borderRadius: 8, fontSize: 11 }} /><Line dataKey="y" stroke="#C39A63" strokeWidth={1.35} dot={false} activeDot={{ r: 2 }} /></LineChart></ResponsiveContainer></div></Card>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  </div>
}
