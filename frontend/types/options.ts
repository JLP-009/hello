export type OptionType = "CE" | "PE";
export type Side = "BUY" | "SELL";

export interface OptionLeg {
  id: string;
  side: Side;
  optionType: OptionType;
  expiry: string;
  strike: number;
  quantity: number;
  premium: number;
  iv: number;
}

export interface GreeksSnapshot {
  delta: number;
  theta: number;
  gamma: number;
  vega: number;
}
