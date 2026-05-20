import { useMemo, useState } from 'react'
import {
  Bell,
  Bot,
  Briefcase,
  CandlestickChart,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Target,
  UserCircle2,
  Wifi,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useNavigate } from 'react-router-dom'
import { navItems, useTerminalStore } from '../store/useTerminalStore'
import { useAuthStore } from '../store/useAuthStore'
import { Badge, Card, SectionHeading } from '../components/ui'
import { LightweightChart } from '../components/LightweightChart'

type OptionRow = {
  callOi: string
  callVolume: string
  callIv: string
  callLtp: string
  callDelta: string
  strike: number
  putDelta: string
  putLtp: string
  putIv: string
  putVolume: string
  putOi: string
  bid: string
  ask: string
  atm: boolean
}

const stats = [
  ['Live P&L', '+$18,420', 'success'],
  ['Win Rate', '68.4%', 'accent'],
  ['Active Positions', '23', 'neutral'],
  ['Account Balance', '$1.28M', 'neutral'],
] as const

const optionRows: OptionRow[] = Array.from({ length: 900 }, (_, i) => {
  const strike = 24200 + i * 5
  return {
    strike,
    atm: strike === 24750,
    callOi: `${140 + i}k`,
    callVolume: `${20 + Math.floor(i / 4)}k`,
    callIv: (11 + i / 120).toFixed(2),
    callLtp: (340 - i * 0.45).toFixed(2),
    callDelta: (0.55 - i * 0.001).toFixed(2),
    putDelta: (-0.43 + i * 0.001).toFixed(2),
    putLtp: (10 + i * 0.45).toFixed(2),
    putIv: (10.5 + i / 120).toFixed(2),
    putVolume: `${16 + Math.floor(i / 4)}k`,
    putOi: `${100 + i}k`,
    bid: (120 + i * 0.22).toFixed(2),
    ask: (121 + i * 0.22).toFixed(2),
  }
})

const optionColumns: ColumnDef<OptionRow>[] = [
  { accessorKey: 'callOi', header: 'CALL OI', size: 84 },
  { accessorKey: 'callVolume', header: 'VOL', size: 72 },
  { accessorKey: 'callIv', header: 'IV', size: 66 },
  { accessorKey: 'callLtp', header: 'LTP', size: 70 },
  { accessorKey: 'callDelta', header: 'DELTA', size: 70 },
  { accessorKey: 'strike', header: 'STRIKE', size: 92 },
  { accessorKey: 'putDelta', header: 'DELTA', size: 70 },
  { accessorKey: 'putLtp', header: 'LTP', size: 70 },
  { accessorKey: 'putIv', header: 'IV', size: 66 },
  { accessorKey: 'putVolume', header: 'VOL', size: 72 },
  { accessorKey: 'putOi', header: 'PUT OI', size: 84 },
  { accessorKey: 'bid', header: 'BID', size: 70 },
  { accessorKey: 'ask', header: 'ASK', size: 70 },
]

export function TerminalPage({ section = 'Dashboard' }: { section?: string }) {
  const navigate = useNavigate()
  const { activeNav, sidebarCollapsed, setActiveNav, toggleSidebar, strategyPreset, setStrategyPreset } = useTerminalStore()
  const logout = useAuthStore((s) => s.logout)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)

  const table = useReactTable({ data: optionRows, columns: optionColumns, getCoreRowModel: getCoreRowModel(), columnResizeMode: 'onChange' })
  const visibleRows = useMemo(() => table.getRowModel().rows.slice(80, 280), [table])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-terminal-bg-primary font-[Inter] text-terminal-text-primary antialiased">
      <div className="flex w-full overflow-x-hidden">
        <aside className={`m-4 mr-0 flex h-[calc(100vh-32px)] flex-col rounded-2xl border border-terminal-border-subtle bg-terminal-bg-secondary p-4 shadow-panel transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-2"><CandlestickChart className="text-terminal-accent-primary" size={18} /><span className={`${sidebarCollapsed ? 'hidden' : ''} text-sm font-semibold tracking-wide`}>QuantEdge</span></div><button className="rounded-xl p-2 text-terminal-text-secondary transition-colors hover:bg-terminal-hover/40" onClick={toggleSidebar}><Menu size={16} /></button></div>
          <nav className="space-y-2">{navItems.map((item, idx) => { const Icon = [LayoutDashboard, CandlestickChart, Target, Bot, Briefcase, ShieldAlert, Gauge, Bell, CandlestickChart, Settings][idx]; const active = activeNav === item; return <button key={item} onClick={() => { setActiveNav(item); navigate('/' + item.toLowerCase().replace(/\s+/g, '-')) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? 'bg-terminal-bg-elevated text-terminal-text-primary ring-1 ring-terminal-border-strong' : 'text-terminal-text-secondary hover:bg-terminal-hover/30 hover:text-terminal-text-primary'}`}><Icon size={16} />{!sidebarCollapsed && item}</button> })}</nav>
        </aside>

        <main className="min-w-0 flex-1 p-4">
          <Card className="mb-4 bg-terminal-bg-secondary px-4 py-3"><div className="flex items-center justify-between"><div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-terminal-border-subtle bg-terminal-bg-elevated px-4 py-2"><Search size={16} className="text-terminal-text-secondary" /><span className="text-secondary-sm text-terminal-text-secondary">Search instruments, strategies, orders...</span></div><div className="flex items-center gap-3"><Badge tone="success">Market Open</Badge><span className="text-secondary-sm text-terminal-text-secondary">14:28:39 UTC</span><Badge tone="accent"><Wifi size={12} className="inline" /> Connected</Badge><Bell size={16} className="text-terminal-text-secondary" /><UserCircle2 size={18} className="text-terminal-text-secondary" /><button onClick={() => { logout(); navigate('/login', { replace: true }) }} className="rounded-xl bg-terminal-bg-elevated px-3 py-1 text-label-xs uppercase tracking-[0.08em] text-terminal-text-secondary hover:bg-terminal-hover/40">Logout</button></div></div></Card>

          <h1 className="mb-4 text-page-title font-bold">{section}</h1>

          <PanelGroup direction="vertical" autoSaveId="terminal-workspace-v1" className="h-[calc(100vh-180px)]">
            <Panel defaultSize={38} minSize={30}>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card className="p-4"><div className="grid grid-cols-2 gap-4">{stats.map(([l, v, tone]) => <motion.div whileHover={{ y: -2 }} key={l} className="rounded-xl border border-terminal-border-subtle bg-terminal-bg-elevated p-3"><p className="text-label-xs uppercase tracking-[0.08em] text-terminal-text-secondary">{l}</p><p className={`mt-2 text-value-xl font-bold ${tone === 'success' ? 'text-terminal-success' : tone === 'accent' ? 'text-terminal-accent-primary' : 'text-terminal-text-primary'}`}>{v}</p></motion.div>)}</div></Card>
                <Card className="p-4"><SectionHeading title="Strategy Builder" subtitle="Multi-leg setup and risk controls" /><div className="mb-3 flex flex-wrap gap-2">{['Iron Condor', 'Straddle', 'Strangle', 'Butterfly'].map((p) => <button key={p} onClick={() => setStrategyPreset(p)} className={`rounded-xl border px-3 py-2 text-label-xs font-semibold uppercase tracking-[0.06em] ${strategyPreset === p ? 'border-terminal-accent-primary bg-terminal-accent-primary/10 text-terminal-accent-primary' : 'border-terminal-border-subtle text-terminal-text-secondary hover:bg-terminal-bg-elevated'}`}>{p}</button>)}</div><div className="grid grid-cols-3 gap-3 text-secondary-sm"><div className="rounded-xl bg-terminal-bg-elevated p-3">Max Profit<br /><b className="text-terminal-success">$2,740</b></div><div className="rounded-xl bg-terminal-bg-elevated p-3">Max Loss<br /><b className="text-terminal-danger">$1,260</b></div><div className="rounded-xl bg-terminal-bg-elevated p-3">Theta<br /><b className="text-terminal-accent-primary">+84</b></div></div></Card>
              </div>
            </Panel>
            <PanelResizeHandle className="my-2 h-1 rounded bg-terminal-border-subtle" />
            <Panel defaultSize={62} minSize={40}>
              <PanelGroup direction="horizontal" autoSaveId="terminal-main-split-v1">
                <Panel defaultSize={70} minSize={55}>
                  <Card className="h-full overflow-hidden"><div className="flex items-center justify-between border-b border-terminal-border-subtle px-4 py-3"><SectionHeading title="Option Chain" subtitle="Institutional depth / sticky strike / dense execution view" /><Badge>ATM 24750</Badge></div><div className="h-[calc(100%-84px)] overflow-y-auto overflow-x-auto"><table className="w-[1060px] table-fixed text-[12px]"><thead className="sticky top-0 z-20 bg-terminal-bg-elevated"><tr>{table.getFlatHeaders().map((h, i) => <th key={h.id} style={{ width: h.getSize() }} className={`group relative border-b border-terminal-border-subtle py-2 text-left text-label-xs font-semibold uppercase tracking-[0.08em] text-terminal-text-secondary ${i === 0 ? 'pl-3' : ''} ${h.id.includes('strike') ? 'sticky left-[374px] z-30 bg-terminal-bg-elevated text-terminal-text-primary' : ''}`}>{flexRender(h.column.columnDef.header, h.getContext())}<div onMouseDown={h.getResizeHandler()} onTouchStart={h.getResizeHandler()} className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent group-hover:bg-terminal-border-strong" /></th>)}</tr></thead><tbody>{visibleRows.map((row, rI) => <tr key={row.id} tabIndex={0} onClick={() => setSelectedRow(row.id)} className={`${rI % 2 === 0 ? 'bg-transparent' : 'bg-terminal-bg-elevated/25'} ${selectedRow === row.id ? 'bg-terminal-bg-elevated/70' : ''} border-b border-terminal-border-subtle/70 ${row.original.atm ? 'bg-terminal-accent-primary/12' : ''} hover:bg-terminal-bg-elevated focus-within:bg-terminal-bg-elevated`}>
                      {row.getVisibleCells().map((cell, cI) => <td key={cell.id} className={`py-2 text-[12px] ${cI === 0 ? 'pl-3' : ''} ${cell.column.id.includes('strike') ? 'sticky left-[374px] z-10 bg-inherit font-semibold text-terminal-text-primary' : ''} ${['callOi', 'callVolume', 'callIv', 'callLtp', 'callDelta'].includes(cell.column.id) ? 'text-terminal-success' : ''} ${['putDelta', 'putLtp', 'putIv', 'putVolume', 'putOi'].includes(cell.column.id) ? 'text-terminal-danger' : ''}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                    </tr>)}</tbody></table></div></Card>
                </Panel>
                <PanelResizeHandle className="mx-2 w-1 rounded bg-terminal-border-subtle" />
                <Panel defaultSize={30} minSize={25}><div className="grid h-full gap-4"><Card className="p-4"><SectionHeading title="Intraday P&L" /><LightweightChart tone="#14B8A6" /></Card><Card className="p-4"><SectionHeading title="Payoff Visualization" /><LightweightChart tone="#F59E0B" /></Card></div></Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </main>
      </div>
    </div>
  )
}
