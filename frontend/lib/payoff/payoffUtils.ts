import { OptionLeg } from "@/types/options";

export interface PayoffPoint {
  spot: number;
  expiry: number;
  live: number;
}

export interface PayoffSummary {
  points: PayoffPoint[];
  breakevens: number[];
  maxProfit: number;
  maxLoss: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const normCdf = (x: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
};

const bsPrice = (spot: number, strike: number, t: number, iv: number, type: "CE" | "PE", r = 0.06): number => {
  if (t <= 0 || iv <= 0) {
    return Math.max(type === "CE" ? spot - strike : strike - spot, 0);
  }
  const sqrtT = Math.sqrt(t);
  const sigma = iv / 100;
  const d1 = (Math.log(spot / strike) + (r + (sigma * sigma) / 2) * t) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  if (type === "CE") return spot * normCdf(d1) - strike * Math.exp(-r * t) * normCdf(d2);
  return strike * Math.exp(-r * t) * normCdf(-d2) - spot * normCdf(-d1);
};

const expiryLegPnl = (leg: OptionLeg, spot: number): number => {
  const intrinsic = leg.optionType === "CE" ? Math.max(spot - leg.strike, 0) : Math.max(leg.strike - spot, 0);
  const unit = intrinsic - leg.premium;
  return (leg.side === "BUY" ? 1 : -1) * unit * leg.quantity;
};

const liveLegPnl = (leg: OptionLeg, spot: number, t = 7 / 365): number => {
  const theo = bsPrice(spot, leg.strike, t, clamp(leg.iv, 5, 120), leg.optionType);
  const unit = theo - leg.premium;
  return (leg.side === "BUY" ? 1 : -1) * unit * leg.quantity;
};

export const computePayoffSummary = (legs: OptionLeg[], currentSpot: number): PayoffSummary => {
  if (!legs.length) {
    return { points: [], breakevens: [], maxProfit: 0, maxLoss: 0 };
  }

  const strikes = legs.map((l) => l.strike);
  const minSpot = Math.floor((Math.min(...strikes, currentSpot) * 0.85) / 50) * 50;
  const maxSpot = Math.ceil((Math.max(...strikes, currentSpot) * 1.15) / 50) * 50;

  const points: PayoffPoint[] = [];
  for (let s = minSpot; s <= maxSpot; s += 50) {
    const expiry = legs.reduce((acc, l) => acc + expiryLegPnl(l, s), 0);
    const live = legs.reduce((acc, l) => acc + liveLegPnl(l, s), 0);
    points.push({ spot: s, expiry, live });
  }

  const breakevens: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if ((a.expiry <= 0 && b.expiry >= 0) || (a.expiry >= 0 && b.expiry <= 0)) {
      breakevens.push(b.spot);
    }
  }

  const payouts = points.map((p) => p.expiry);
  return {
    points,
    breakevens,
    maxProfit: Math.max(...payouts),
    maxLoss: Math.min(...payouts)
  };
};
