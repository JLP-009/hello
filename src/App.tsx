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
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { navItems, useTerminalStore } from './store/useTerminalStore'

const stats = [
  ['Live P&L', '+$18,420', 'bull'],
  ['Win Rate', '68.4%', 'accent'],
  ['Active Positions', '23', 'text'],
  ['Account Balance', '$1.28M', 'text'],
  ['Margin Used', '41%', 'bear'],
  ['Risk Meter', 'Moderate', 'accent'],
] as const

const optionRows = Array.from({ length: 22 }, (_, i) => {
  const strike = 24200 + i * 50
  return {
    strike,
    atm: strike === 24750,
    callIv: (11 + i / 5).toFixed(1),
    putIv: (10.2 + i / 4).toFixed(1),
    callLtp: (250 - i * 7.4).toFixed(2),
    putLtp: (14 + i * 7.8).toFixed(2),
    callOi: `${(130 + i * 12).toFixed(0)}k`,
    putOi: `${(90 + i * 11).toFixed(0)}k`,
  }
})

const pnlData = Array.from({ length: 16 }, (_, i) => ({
  t: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`,
  pnl: 11800 + i * 520 - (i > 8 ? (i - 8) * 260 : 0),
}))

const payoffData = Array.from({ length: 19 }, (_, i) => ({
  x: 23600 + i * 120,
  y: -3600 + i * 540 - Math.max(i - 10, 0) * 620,
}))

const navIcon = [
  LayoutDashboard,
  CandlestickChart,
  Target,
  Bot,
  Briefcase,
  ShieldAlert,
  Gauge,
  Bell,
  CandlestickChart,
  Settings,
]

const panel =
  'rounded-2xl border border-terminal-border bg-terminal-panel shadow-panel'

const metricColor: Record<string, string> = {
  bull: 'text-terminal-bull',
  bear: 'text-terminal-bear',
  accent: 'text-terminal-accent',
  text: 'text-terminal-text',
}

const chartTheme = {
  grid: '#24444D',
  axis: '#8CA7A3',
  tooltip: {
    background: '#102129',
    border: '1px solid #24444D',
    borderRadius: 12,
    color: '#E6F4F1',
  },
}

export function App() {
  const {
    activeNav,
    sidebarCollapsed,
    setActiveNav,
    toggleSidebar,
    strategyPreset,
    setStrategyPreset,
  } = useTerminalStore()

  return (
    <div className="min-h-screen bg-terminal-bg font-[Inter] text-terminal-text">
      <div className="flex">
        <aside
          className={`${panel} m-4 mr-0 flex h-[calc(100vh-32px)] flex-col p-4 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CandlestickChart className="text-terminal-accent" size={18} />
              <span className={`${sidebarCollapsed ? 'hidden' : ''} text-sm font-semibold tracking-wide`}>
                QuantEdge
              </span>
            </div>
            <button
              className="rounded-xl p-2 text-terminal-muted transition-colors hover:bg-terminal-mint/10 hover:text-terminal-text"
              onClick={toggleSidebar}
            >
              <Menu size={16} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item, idx) => {
              const Icon = navIcon[idx]
              const active = activeNav === item
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-terminal-accent/14 text-terminal-accent ring-1 ring-terminal-accent/30'
                      : 'text-terminal-muted hover:bg-terminal-mint/10 hover:text-terminal-text'
                  }`}
                >
                  <Icon size={16} />
                  {!sidebarCollapsed && item}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4">
          <header className={`${panel} mb-4 flex items-center justify-between px-4 py-3`}>
            <div className="flex min-w-[320px] items-center gap-3 rounded-xl border border-terminal-border bg-terminal-elevated px-4 py-2.5 text-terminal-muted">
              <Search size={16} />
              <span className="text-sm">Search instruments, strategies, orders...</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="rounded-xl border border-terminal-border bg-terminal-mint/20 px-3 py-1 font-medium text-terminal-accent">
                Market Open
              </span>
              <span className="text-terminal-muted">14:28:39 UTC</span>
              <span className="flex items-center gap-1 text-terminal-accent">
                <Wifi size={14} />
                Connected
              </span>
              <button className="rounded-xl p-2 text-terminal-muted transition-colors hover:bg-terminal-mint/10 hover:text-terminal-text">
                <Bell size={16} />
              </button>
              <UserCircle2 className="text-terminal-muted" size={18} />
            </div>
          </header>

          <section className="grid grid-cols-2 gap-4 xl:grid-cols-6">
            {stats.map(([label, value, key]) => (
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
                key={label}
                className={`${panel} p-4`}
              >
                <p className="text-xs font-medium text-terminal-muted">{label}</p>
                <p className={`mt-2 text-lg font-semibold ${metricColor[key]}`}>{value}</p>
              </motion.div>
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className={`${panel} p-4 xl:col-span-2`}>
              <h3 className="mb-3 text-sm font-semibold">Intraday P&L</h3>
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={pnlData}>
                    <defs>
                      <linearGradient id="pnl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={chartTheme.grid} strokeOpacity={0.55} />
                    <XAxis dataKey="t" stroke={chartTheme.axis} tickLine={false} axisLine={false} />
                    <YAxis stroke={chartTheme.axis} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTheme.tooltip} />
                    <Area type="monotone" dataKey="pnl" stroke="#0F5F5A" strokeWidth={1.8} fill="url(#pnl)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${panel} p-4`}>
              <h3 className="mb-3 text-sm font-semibold">Strategy Builder</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Iron Condor', 'Straddle', 'Strangle', 'Butterfly', 'Custom'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setStrategyPreset(p)}
                    className={`rounded-xl border px-3 py-2 font-medium transition-colors ${
                      strategyPreset === p
                        ? 'border-terminal-accent bg-terminal-mint/20 text-terminal-accent'
                        : 'border-terminal-border text-terminal-muted hover:bg-terminal-mint/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm text-terminal-muted">
                <p>Leg 1: NIFTY 24700 CE SELL 75</p>
                <p>Leg 2: NIFTY 24900 CE BUY 75</p>
                <p>Leg 3: NIFTY 24600 PE SELL 75</p>
                <p>Leg 4: NIFTY 24400 PE BUY 75</p>
              </div>
            </div>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className={`${panel} overflow-hidden p-0 xl:col-span-2`}>
              <div className="border-b border-terminal-border px-4 py-3 text-sm font-semibold">
                Option Chain
              </div>
              <div className="max-h-72 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-terminal-elevated text-terminal-muted">
                    <tr>
                      <th className="px-3 py-3 text-left font-medium">Call OI</th>
                      <th className="py-3 text-left font-medium">LTP</th>
                      <th className="py-3 text-left font-medium">IV</th>
                      <th className="py-3 text-left font-semibold text-terminal-text">Strike</th>
                      <th className="py-3 text-left font-medium">IV</th>
                      <th className="py-3 text-left font-medium">LTP</th>
                      <th className="py-3 text-left font-medium">Put OI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionRows.map((r) => (
                      <tr
                        key={r.strike}
                        className={`border-t border-terminal-border/80 transition-colors ${
                          r.atm
                            ? 'bg-terminal-mint/20 hover:bg-terminal-mint/30'
                            : 'hover:bg-terminal-mint/10'
                        }`}
                      >
                        <td className="px-3 py-2.5 text-terminal-bull">{r.callOi}</td>
                        <td className="py-2.5 text-terminal-text">{r.callLtp}</td>
                        <td className="py-2.5 text-terminal-muted">{r.callIv}%</td>
                        <td className="py-2.5 font-semibold text-terminal-text">{r.strike}</td>
                        <td className="py-2.5 text-terminal-muted">{r.putIv}%</td>
                        <td className="py-2.5 text-terminal-bear">{r.putLtp}</td>
                        <td className="py-2.5 text-terminal-bear">{r.putOi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${panel} p-4`}>
              <h3 className="mb-3 text-sm font-semibold">Payoff Curve</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={payoffData}>
                    <CartesianGrid stroke={chartTheme.grid} strokeOpacity={0.55} />
                    <XAxis dataKey="x" stroke={chartTheme.axis} tickLine={false} axisLine={false} />
                    <YAxis stroke={chartTheme.axis} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTheme.tooltip} />
                    <Line type="monotone" dataKey="y" stroke="#0F5F5A" strokeWidth={1.8} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className={`${panel} mt-4 overflow-hidden`}>
            <div className="border-b border-terminal-border px-4 py-3 text-sm font-semibold">Live Positions</div>
            <div className="grid grid-cols-8 px-4 py-2.5 text-xs font-medium text-terminal-muted">
              <span>Symbol</span><span>Qty</span><span>Avg</span><span>LTP</span><span>Realized</span><span>Unrealized</span><span>MTM</span><span>Status</span>
            </div>
            {[
              ['NIFTY 24700 CE', 75, 122.3, 138.2, '+$1,240', '+$780', '+$2,020', 'Open'],
              ['BANKNIFTY 52600 PE', 30, 214.1, 197.5, '-$420', '+$680', '+$260', 'Open'],
            ].map((p) => (
              <div key={p[0] as string} className="grid grid-cols-8 border-t border-terminal-border px-4 py-3 text-xs">
                <span>{p[0]}</span><span>{p[1]}</span><span>{p[2]}</span><span>{p[3]}</span>
                <span className="text-terminal-bull">{p[4]}</span>
                <span className="text-terminal-bull">{p[5]}</span>
                <span className="font-semibold text-terminal-accent">{p[6]}</span>
                <span>{p[7]}</span>
              </div>
            ))}
            <div className="sticky bottom-0 grid grid-cols-3 border-t border-terminal-border bg-terminal-elevated px-4 py-3 text-sm">
              <span>Total Realized: <b>$12,840</b></span>
              <span>Total Unrealized: <b className="text-terminal-bull">$4,290</b></span>
              <span>Total MTM: <b className="text-terminal-accent">$17,130</b></span>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
