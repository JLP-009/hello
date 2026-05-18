import { OptionLeg } from "@/types/options";

export interface PayoffPoint { spot: number; expiry: number; live: number }
export interface Greeks { delta: number; gamma: number; theta: number; vega: number }
export interface PayoffSummary {
  points: PayoffPoint[];
  breakevens: number[];
  maxProfit: number;
  maxLoss: number;
  netGreeks: Greeks;
  pop: number;
  margin: number;
  rr: number;
  tags: string[];
}

const normCdf = (x: number): number => { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp((-x * x) / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
const normPdf = (x: number): number => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);

const bs = (spot: number, strike: number, t: number, ivPct: number, isCall: boolean, r = 0.06) => {
  const iv = Math.max(ivPct, 1) / 100;
  const sqrtT = Math.sqrt(Math.max(t, 1e-6));
  const d1 = (Math.log(spot / strike) + (r + (iv * iv) / 2) * t) / (iv * sqrtT);
  const d2 = d1 - iv * sqrtT;
  const price = isCall ? spot * normCdf(d1) - strike * Math.exp(-r * t) * normCdf(d2) : strike * Math.exp(-r * t) * normCdf(-d2) - spot * normCdf(-d1);
  const delta = isCall ? normCdf(d1) : normCdf(d1) - 1;
  const gamma = normPdf(d1) / (spot * iv * sqrtT);
  const theta = (-(spot * normPdf(d1) * iv) / (2 * sqrtT)) / 365;
  const vega = (spot * normPdf(d1) * sqrtT) / 100;
  return { price, delta, gamma, theta, vega };
};

const legExpiry = (l: OptionLeg, s: number) => {
  if (l.optionType === "FUT") return (l.side === "BUY" ? 1 : -1) * (s - l.strike - l.premium) * l.quantity;
  const intrinsic = l.optionType === "CE" ? Math.max(s - l.strike, 0) : Math.max(l.strike - s, 0);
  return (l.side === "BUY" ? 1 : -1) * (intrinsic - l.premium) * l.quantity;
};

export const computePayoffSummary = (legs: OptionLeg[], currentSpot: number): PayoffSummary => {
  if (!legs.length) return { points: [], breakevens: [], maxProfit: 0, maxLoss: 0, netGreeks: { delta: 0, gamma: 0, theta: 0, vega: 0 }, pop: 0, margin: 0, rr: 0, tags: [] };
  const strikes = legs.map((l) => l.strike);
  const min = Math.floor((Math.min(...strikes, currentSpot) * 0.82) / 50) * 50;
  const max = Math.ceil((Math.max(...strikes, currentSpot) * 1.18) / 50) * 50;
  const points: PayoffPoint[] = [];
  for (let s = min; s <= max; s += 50) {
    const expiry = legs.reduce((a, l) => a + legExpiry(l, s), 0);
    const live = legs.reduce((a, l) => {
      if (l.optionType === "FUT") return a + (l.side === "BUY" ? 1 : -1) * (s - l.strike - l.premium) * l.quantity;
      const model = bs(s, l.strike, 7 / 365, l.iv, l.optionType === "CE");
      return a + (l.side === "BUY" ? 1 : -1) * (model.price - l.premium) * l.quantity;
    }, 0);
    points.push({ spot: s, expiry, live });
  }
  const be: number[] = [];
  for (let i = 1; i < points.length; i++) if ((points[i - 1].expiry <= 0 && points[i].expiry >= 0) || (points[i - 1].expiry >= 0 && points[i].expiry <= 0)) be.push(points[i].spot);
  const payouts = points.map((p) => p.expiry);
  let delta = 0, gamma = 0, theta = 0, vega = 0;
  for (const l of legs) {
    if (l.optionType === "FUT") { delta += (l.side === "BUY" ? 1 : -1) * l.quantity; continue; }
    const g = bs(currentSpot, l.strike, 7 / 365, l.iv, l.optionType === "CE");
    const sign = l.side === "BUY" ? 1 : -1;
    delta += sign * g.delta * l.quantity; gamma += sign * g.gamma * l.quantity; theta += sign * g.theta * l.quantity; vega += sign * g.vega * l.quantity;
  }
  const pop = (points.filter((p) => p.expiry > 0).length / points.length) * 100;
  const margin = legs.reduce((a, l) => a + Math.abs(l.quantity * (l.optionType === "FUT" ? l.strike * 0.12 : l.premium * 15)), 0);
  const maxProfit = Math.max(...payouts); const maxLoss = Math.min(...payouts);
  const rr = Math.abs(maxLoss) > 0 ? maxProfit / Math.abs(maxLoss) : 0;
  const tags = [delta > 0 ? "Bullish" : delta < 0 ? "Bearish" : "Neutral", theta > 0 ? "Theta Positive" : "Theta Negative", Math.abs(gamma) > 10 ? "Gamma Risk" : "Gamma Controlled", Math.abs(vega) > 100 ? "IV Sensitive" : "IV Balanced"];
  return { points, breakevens: be, maxProfit, maxLoss, netGreeks: { delta, gamma, theta, vega }, pop, margin, rr, tags };
};
