import { create } from "zustand";
import { OptionLeg } from "@/types/options";

interface TradingState {
  symbol: string;
  expiry: string;
  spot: number;
  connected: boolean;
  legs: OptionLeg[];
  setSymbol: (s: string) => void;
  setExpiry: (s: string) => void;
  setConnection: (v: boolean) => void;
  upsertLeg: (leg: OptionLeg) => void;
  removeLeg: (id: string) => void;
  setTemplate: (legs: OptionLeg[]) => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  symbol: "NIFTY",
  expiry: "2026-05-28",
  spot: 22450,
  connected: true,
  legs: [],
  setSymbol: (symbol) => set({ symbol }),
  setExpiry: (expiry) => set({ expiry }),
  setConnection: (connected) => set({ connected }),
  upsertLeg: (leg) => set((s) => ({ legs: s.legs.some((l) => l.id === leg.id) ? s.legs.map((l) => (l.id === leg.id ? leg : l)) : [...s.legs, leg] })),
  removeLeg: (id) => set((s) => ({ legs: s.legs.filter((l) => l.id !== id) })),
  setTemplate: (legs) => set({ legs })
}));
