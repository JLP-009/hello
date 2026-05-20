import { create } from 'zustand'

const navItems = ['Dashboard', 'Option Chain', 'Strategy Builder', 'Signals', 'Positions', 'Orders', 'Analytics', 'Alerts', 'Backtesting', 'Settings']

interface TerminalState {
  activeNav: string
  sidebarCollapsed: boolean
  strategyPreset: string
  setActiveNav: (item: string) => void
  toggleSidebar: () => void
  setStrategyPreset: (preset: string) => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  activeNav: navItems[0],
  sidebarCollapsed: false,
  strategyPreset: 'Iron Condor',
  setActiveNav: (item) => set({ activeNav: item }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setStrategyPreset: (preset) => set({ strategyPreset: preset }),
}))

export { navItems }
