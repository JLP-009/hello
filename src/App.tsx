import { useMemo } from 'react'
import { Bell, Bot, Briefcase, CandlestickChart, Gauge, LayoutDashboard, Menu, Search, Settings, ShieldAlert, Target, UserCircle2, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { navItems, useTerminalStore } from './store/useTerminalStore'
import { Badge, Card, SectionHeading } from './components/ui'

type OptionRow = { callOi: string; callVolume: string; callIv: string; callLtp: string; callDelta: string; strike: number; putDelta: string; putLtp: string; putIv: string; putVolume: string; putOi: string; bid: string; ask: string; atm: boolean }
const stats = [['Live P&L', '+$18,420', 'success'], ['Win Rate', '68.4%', 'accent'], ['Active Positions', '23', 'neutral'], ['Account Balance', '$1.28M', 'neutral']] as const
const navIcon = [LayoutDashboard, CandlestickChart, Target, Bot, Briefcase, ShieldAlert, Gauge, Bell, CandlestickChart, Settings]

const optionRows: OptionRow[] = Array.from({ length: 900 }, (_, i) => {
  const strike = 24200 + i * 5
  return { strike, atm: strike === 24750, callOi: `${140 + i}k`, callVolume: `${20 + Math.floor(i / 4)}k`, callIv: (11 + i / 120).toFixed(2), callLtp: (340 - i * 0.45).toFixed(2), callDelta: (0.55 - i * 0.001).toFixed(2), putDelta: (-0.43 + i * 0.001).toFixed(2), putLtp: (10 + i * 0.45).toFixed(2), putIv: (10.5 + i / 120).toFixed(2), putVolume: `${16 + Math.floor(i / 4)}k`, putOi: `${100 + i}k`, bid: (120 + i * 0.22).toFixed(2), ask: (121 + i * 0.22).toFixed(2) }
})
const pnlData = Array.from({ length: 18 }, (_, i) => ({ t: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`, pnl: 10200 + i * 650 - (i > 12 ? (i - 12) * 420 : 0) }))
const payoffData = Array.from({ length: 22 }, (_, i) => ({ x: 23600 + i * 85, y: -3100 + i * 430 - Math.max(0, i - 12) * 510 }))

const columns: ColumnDef<OptionRow>[] = [
  { accessorKey: 'callOi', header: 'OI', size: 84 }, { accessorKey: 'callVolume', header: 'Vol', size: 78 }, { accessorKey: 'callIv', header: 'IV', size: 68 },
  { accessorKey: 'callLtp', header: 'LTP', size: 72 }, { accessorKey: 'callDelta', header: 'Delta', size: 72 }, { accessorKey: 'strike', header: 'Strike', size: 92 },
  { accessorKey: 'putDelta', header: 'Delta', size: 72 }, { accessorKey: 'putLtp', header: 'LTP', size: 72 }, { accessorKey: 'putIv', header: 'IV', size: 68 },
  { accessorKey: 'putVolume', header: 'Vol', size: 78 }, { accessorKey: 'putOi', header: 'OI', size: 84 }, { accessorKey: 'bid', header: 'Bid', size: 72 }, { accessorKey: 'ask', header: 'Ask', size: 72 },
]

export function App() {
  const { activeNav, sidebarCollapsed, setActiveNav, toggleSidebar, strategyPreset, setStrategyPreset } = useTerminalStore()
  const table = useReactTable({ data: optionRows, columns, getCoreRowModel: getCoreRowModel(), columnResizeMode: 'onChange' })
  const visibleRows = useMemo(() => table.getRowModel().rows.slice(80, 280), [table])

  return <div className="min-h-screen bg-terminal-bg-primary font-[Inter] text-terminal-text-primary antialiased">
    <div className="flex">
      <aside className={`m-4 mr-0 flex h-[calc(100vh-32px)] flex-col rounded-2xl border border-terminal-border-subtle bg-terminal-bg-secondary p-4 shadow-panel transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2"><CandlestickChart className="text-terminal-accent-primary" size={18} /><span className={`${sidebarCollapsed ? 'hidden' : ''} text-secondary-sm font-semibold`}>QuantEdge</span></div><button className="rounded-xl p-2 text-terminal-text-secondary hover:bg-terminal-bg-elevated" onClick={toggleSidebar}><Menu size={16} /></button></div>
        <nav className="space-y-1">{navItems.map((item, idx) => { const Icon = navIcon[idx]; const active = item === activeNav; return <button key={item} onClick={() => setActiveNav(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-secondary-sm font-medium ${active ? 'bg-terminal-bg-elevated text-terminal-text-primary ring-1 ring-terminal-border-strong' : 'text-terminal-text-secondary hover:bg-terminal-bg-elevated/70 hover:text-terminal-text-primary'}`}><Icon size={16} />{!sidebarCollapsed && item}</button> })}</nav>
      </aside>

      <main className="flex-1 p-4">
        <Card className="mb-4 bg-terminal-bg-secondary px-4 py-3"><div className="flex items-center justify-between"><div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-terminal-border-subtle bg-terminal-bg-elevated px-4 py-2"><Search size={16} className="text-terminal-text-secondary" /><span className="text-secondary-sm text-terminal-text-secondary">Search instruments, strategies, orders...</span></div><div className="flex items-center gap-3"><Badge tone="success">Market Open</Badge><span className="text-secondary-sm text-terminal-text-secondary">14:28:39 UTC</span><Badge tone="accent"><Wifi size={12} className="inline"/> Connected</Badge><Bell size={16} className="text-terminal-text-secondary" /><UserCircle2 size={18} className="text-terminal-text-secondary" /></div></div></Card>

        <h1 className="mb-4 text-page-title font-bold">Dashboard</h1>

        <PanelGroup direction="vertical" className="h-[calc(100vh-180px)]">
          <Panel defaultSize={38} minSize={30}>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Card className="p-4"><div className="grid grid-cols-2 gap-4">{stats.map(([l, v, tone]) => <motion.div whileHover={{ y: -2 }} key={l} className="rounded-xl border border-terminal-border-subtle bg-terminal-bg-elevated p-3"><p className="text-label-xs uppercase tracking-[0.08em] text-terminal-text-secondary">{l}</p><p className={`mt-2 text-value-xl font-bold ${tone === 'success' ? 'text-terminal-success' : tone === 'accent' ? 'text-terminal-accent-primary' : 'text-terminal-text-primary'}`}>{v}</p></motion.div>)}</div></Card>
              <Card className="p-4"><SectionHeading title="Strategy Builder" subtitle="Multi-leg setup and risk controls" /><div className="mb-3 flex flex-wrap gap-2">{['Iron Condor', 'Straddle', 'Strangle', 'Butterfly'].map((p) => <button key={p} onClick={() => setStrategyPreset(p)} className={`rounded-xl border px-3 py-2 text-label-xs font-semibold uppercase tracking-[0.06em] ${strategyPreset === p ? 'border-terminal-accent-primary bg-terminal-accent-primary/10 text-terminal-accent-primary' : 'border-terminal-border-subtle text-terminal-text-secondary hover:bg-terminal-bg-elevated'}`}>{p}</button>)}</div><div className="grid grid-cols-3 gap-3 text-secondary-sm"><div className="rounded-xl bg-terminal-bg-elevated p-3">Max Profit<br/><b className="text-terminal-success">$2,740</b></div><div className="rounded-xl bg-terminal-bg-elevated p-3">Max Loss<br/><b className="text-terminal-danger">$1,260</b></div><div className="rounded-xl bg-terminal-bg-elevated p-3">Theta<br/><b className="text-terminal-accent-primary">+84</b></div></div></Card>
            </div>
          </Panel>
          <PanelResizeHandle className="my-2 h-1 rounded bg-terminal-border-subtle" />
          <Panel defaultSize={62} minSize={40}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={70} minSize={55}>
                <Card className="h-full overflow-hidden">
                  <div className="flex items-center justify-between border-b border-terminal-border-subtle px-4 py-3"><SectionHeading title="Option Chain" subtitle="Institutional depth / sticky strike / dense execution view" /><Badge>ATM 24750</Badge></div>
                  <div className="h-[calc(100%-84px)] overflow-auto"><table className="w-[1060px] table-fixed text-[12px]">
                    <thead className="sticky top-0 z-20 bg-terminal-bg-elevated"><tr>{table.getFlatHeaders().map((h, i) => <th key={h.id} style={{ width: h.getSize() }} className={`group relative border-b border-terminal-border-subtle py-2 text-left text-label-xs font-semibold uppercase tracking-[0.08em] text-terminal-text-secondary ${i === 0 ? 'pl-3' : ''} ${h.id.includes('strike') ? 'sticky left-[374px] z-30 bg-terminal-bg-elevated text-terminal-text-primary' : ''}`}>{flexRender(h.column.columnDef.header, h.getContext())}<div onMouseDown={h.getResizeHandler()} onTouchStart={h.getResizeHandler()} className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent group-hover:bg-terminal-border-strong"/></th>)}</tr></thead>
                    <tbody>{visibleRows.map((row, rI) => <tr key={row.id} tabIndex={0} className={`${rI % 2 === 0 ? 'bg-transparent' : 'bg-terminal-bg-elevated/25'} border-b border-terminal-border-subtle/70 ${row.original.atm ? 'bg-terminal-accent-primary/12' : ''} hover:bg-terminal-bg-elevated focus-within:bg-terminal-bg-elevated`}>
                      {row.getVisibleCells().map((cell, cI) => <td key={cell.id} className={`py-2 ${cI === 0 ? 'pl-3' : ''} ${cell.column.id.includes('strike') ? 'sticky left-[374px] z-10 bg-inherit font-semibold text-terminal-text-primary' : ''} ${['callOi','callVolume','callIv','callLtp','callDelta'].includes(cell.column.id) ? 'text-terminal-success' : ''} ${['putDelta','putLtp','putIv','putVolume','putOi'].includes(cell.column.id) ? 'text-terminal-danger' : ''}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                    </tr>)}</tbody>
                  </table></div>
                </Card>
              </Panel>
              <PanelResizeHandle className="mx-2 w-1 rounded bg-terminal-border-subtle" />
              <Panel defaultSize={30} minSize={25}>
                <div className="grid h-full gap-4">
                  <Card className="p-4"><SectionHeading title="Intraday P&L" /><div className="h-40"><ResponsiveContainer><AreaChart data={pnlData}><CartesianGrid stroke="#1E3945" strokeOpacity={0.45} /><XAxis dataKey="t" stroke="#8EA6AF" tickLine={false} axisLine={false} /><YAxis stroke="#8EA6AF" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#132833', border: '1px solid #2B4B57', borderRadius: 8 }} /><Area dataKey="pnl" stroke="#3AA886" strokeWidth={1.5} fill="#3AA88633" /></AreaChart></ResponsiveContainer></div></Card>
                  <Card className="p-4"><SectionHeading title="Payoff Visualization" /><div className="h-40"><ResponsiveContainer><LineChart data={payoffData}><CartesianGrid stroke="#1E3945" strokeOpacity={0.45} /><XAxis dataKey="x" stroke="#8EA6AF" tickLine={false} axisLine={false} /><YAxis stroke="#8EA6AF" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#132833', border: '1px solid #2B4B57', borderRadius: 8 }} /><Line dataKey="y" stroke="#C39A63" strokeWidth={1.4} dot={false} /></LineChart></ResponsiveContainer></div></Card>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  </div>
}
