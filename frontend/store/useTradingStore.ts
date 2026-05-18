import { create } from "zustand";
import { OptionLeg } from "@/types/options";
import { getSymbolMeta } from "@/lib/scripmaster/mockOpenApiScripMaster";

interface TradingState {
  symbol: string; expiry: string; spot: number; connected: boolean; lotSize: number;
  strikes: number[]; expiries: string[]; legs: OptionLeg[]; history: OptionLeg[][]; future: OptionLeg[][];
  setSymbol: (s: string) => void; setExpiry: (s: string) => void; setSpot: (v: number) => void; setConnection: (v: boolean) => void;
  addLeg: (leg?: Partial<OptionLeg>) => void; updateLeg: (id: string, patch: Partial<OptionLeg>) => void; removeLeg: (id: string) => void;
  duplicateLeg: (id: string) => void; reorderLegs: (from: number, to: number) => void; setTemplate: (legs: OptionLeg[]) => void;
  resetStrategy: () => void; undo: () => void; redo: () => void; exportStrategy: () => string; importStrategy: (json: string) => { ok: boolean; error?: string };
}
const uid = () => Math.random().toString(36).slice(2, 10);
const makeDefault = (expiry: string, strike: number): OptionLeg => ({ id: uid(), side: "BUY", optionType: "CE", expiry, strike, quantity: 75, premium: 100, iv: 14 });
const hist = (s: TradingState, legs: OptionLeg[]) => ({ legs, history: [...s.history, s.legs], future: [] });

const meta = getSymbolMeta("NIFTY");
export const useTradingStore = create<TradingState>((set, get) => ({
  symbol: "NIFTY", expiry: meta.expiries[0], spot: 22450, connected: true, lotSize: meta.lotSize, strikes: meta.strikes, expiries: meta.expiries, legs: [], history: [], future: [],
  setSymbol: (symbol) => set((s) => { const m = getSymbolMeta(symbol); return { ...s, symbol, expiries: m.expiries, strikes: m.strikes, lotSize: m.lotSize, expiry: m.expiries[0] ?? s.expiry }; }),
  setExpiry: (expiry) => set({ expiry }), setSpot: (spot) => set({ spot }), setConnection: (connected) => set({ connected }),
  addLeg: (leg) => set((s) => hist(s, [...s.legs, { ...makeDefault(s.expiry, s.spot), ...leg, id: uid() }])),
  updateLeg: (id, patch) => set((s) => hist(s, s.legs.map((l) => l.id === id ? { ...l, ...patch } : l))),
  removeLeg: (id) => set((s) => hist(s, s.legs.filter((l) => l.id !== id))), duplicateLeg: (id) => set((s) => { const i = s.legs.findIndex((l) => l.id===id); if (i<0) return s; const c={...s.legs[i], id:uid()}; const n=[...s.legs.slice(0,i+1),c,...s.legs.slice(i+1)]; return hist(s,n); }),
  reorderLegs: (from, to) => set((s) => { const n=[...s.legs]; const [m]=n.splice(from,1); n.splice(to,0,m); return hist(s,n); }),
  setTemplate: (legs) => set((s) => hist(s, legs.map((l)=>({...l,id:uid()})))), resetStrategy: () => set((s) => hist(s, [])),
  undo: () => set((s)=> !s.history.length ? s : { legs: s.history.at(-1) ?? [], history: s.history.slice(0,-1), future: [s.legs, ...s.future] }),
  redo: () => set((s)=> !s.future.length ? s : { legs: s.future[0], history: [...s.history, s.legs], future: s.future.slice(1) }),
  exportStrategy: () => JSON.stringify({ symbol:get().symbol, spot:get().spot, lotSize:get().lotSize, legs:get().legs },null,2),
  importStrategy: (json) => { try { const p=JSON.parse(json) as { legs?: OptionLeg[]; symbol?: string; spot?: number }; if(!Array.isArray(p.legs)) return {ok:false,error:"Invalid legs"}; set((s)=> ({...s, ...hist(s,p.legs.map((l)=>({...l,id:uid()}))), symbol:p.symbol ?? s.symbol, spot:p.spot ?? s.spot })); return {ok:true}; } catch { return {ok:false,error:"JSON parse failed"}; } }
}));
