import { create } from "zustand";
import { OptionLeg } from "@/types/options";

interface TradingState {
  symbol: string;
  expiry: string;
  spot: number;
  connected: boolean;
  legs: OptionLeg[];
  history: OptionLeg[][];
  future: OptionLeg[][];
  setSymbol: (s: string) => void;
  setExpiry: (s: string) => void;
  setConnection: (v: boolean) => void;
  setSpot: (v: number) => void;
  addLeg: (leg?: Partial<OptionLeg>) => void;
  updateLeg: (id: string, patch: Partial<OptionLeg>) => void;
  removeLeg: (id: string) => void;
  duplicateLeg: (id: string) => void;
  reorderLegs: (from: number, to: number) => void;
  setTemplate: (legs: OptionLeg[]) => void;
  resetStrategy: () => void;
  undo: () => void;
  redo: () => void;
  exportStrategy: () => string;
  importStrategy: (json: string) => { ok: boolean; error?: string };
}

const uid = () => Math.random().toString(36).slice(2, 10);
const defaultLeg = (): OptionLeg => ({ id: uid(), side: "BUY", optionType: "CE", expiry: "2026-05-28", strike: 22450, quantity: 50, premium: 100, iv: 14 });

const withHistory = (prev: TradingState, nextLegs: OptionLeg[]) => ({
  legs: nextLegs,
  history: [...prev.history, prev.legs],
  future: []
});

export const useTradingStore = create<TradingState>((set, get) => ({
  symbol: "NIFTY",
  expiry: "2026-05-28",
  spot: 22450,
  connected: true,
  legs: [],
  history: [],
  future: [],
  setSymbol: (symbol) => set({ symbol }),
  setExpiry: (expiry) => set({ expiry }),
  setConnection: (connected) => set({ connected }),
  setSpot: (spot) => set({ spot }),
  addLeg: (leg) => set((s) => withHistory(s, [...s.legs, { ...defaultLeg(), ...leg, id: uid() }])),
  updateLeg: (id, patch) => set((s) => withHistory(s, s.legs.map((l) => (l.id === id ? { ...l, ...patch } : l)))),
  removeLeg: (id) => set((s) => withHistory(s, s.legs.filter((l) => l.id !== id))),
  duplicateLeg: (id) => set((s) => {
    const idx = s.legs.findIndex((l) => l.id === id);
    if (idx < 0) return s;
    const copy = { ...s.legs[idx], id: uid() };
    const next = [...s.legs.slice(0, idx + 1), copy, ...s.legs.slice(idx + 1)];
    return withHistory(s, next);
  }),
  reorderLegs: (from, to) => set((s) => {
    const next = [...s.legs];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return withHistory(s, next);
  }),
  setTemplate: (legs) => set((s) => withHistory(s, legs.map((l) => ({ ...l, id: uid() })))),
  resetStrategy: () => set((s) => withHistory(s, [])),
  undo: () => set((s) => {
    if (!s.history.length) return s;
    const prev = s.history[s.history.length - 1];
    return { legs: prev, history: s.history.slice(0, -1), future: [s.legs, ...s.future] };
  }),
  redo: () => set((s) => {
    if (!s.future.length) return s;
    const next = s.future[0];
    return { legs: next, history: [...s.history, s.legs], future: s.future.slice(1) };
  }),
  exportStrategy: () => JSON.stringify({ symbol: get().symbol, spot: get().spot, legs: get().legs }, null, 2),
  importStrategy: (json) => {
    try {
      const parsed = JSON.parse(json) as { symbol?: string; spot?: number; legs?: OptionLeg[] };
      if (!Array.isArray(parsed.legs)) return { ok: false, error: "Invalid strategy JSON" };
      set((s) => ({ ...withHistory(s, parsed.legs.map((l) => ({ ...defaultLeg(), ...l, id: uid() }))), symbol: parsed.symbol ?? s.symbol, spot: parsed.spot ?? s.spot }));
      return { ok: true };
    } catch {
      return { ok: false, error: "JSON parse failed" };
    }
  }
}));
