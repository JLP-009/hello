export interface ScripMasterRow {
  symbol: string;
  token: string;
  exchange: "NSE" | "NFO";
  instrument_type: "CE" | "PE" | "FUT" | "SPOT";
  expiry?: string;
  strike?: number;
  lot_size: number;
}

export const openApiScripMaster: ScripMasterRow[] = [
  { symbol: "NIFTY", token: "26000", exchange: "NSE", instrument_type: "SPOT", lot_size: 75 },
  { symbol: "NIFTY", token: "NIFTY28MAY26FUT", exchange: "NFO", instrument_type: "FUT", expiry: "2026-05-28", strike: 22450, lot_size: 75 },
  ...[22300,22350,22400,22450,22500,22550,22600,22650,22700].flatMap((strike) => ([
    { symbol: "NIFTY", token: `NIFTY28MAY26${strike}CE`, exchange: "NFO", instrument_type: "CE", expiry: "2026-05-28", strike, lot_size: 75 },
    { symbol: "NIFTY", token: `NIFTY28MAY26${strike}PE`, exchange: "NFO", instrument_type: "PE", expiry: "2026-05-28", strike, lot_size: 75 }
  ] as ScripMasterRow[])),
  ...[22300,22400,22500,22600].flatMap((strike) => ([
    { symbol: "NIFTY", token: `NIFTY25JUN26${strike}CE`, exchange: "NFO", instrument_type: "CE", expiry: "2026-06-25", strike, lot_size: 75 },
    { symbol: "NIFTY", token: `NIFTY25JUN26${strike}PE`, exchange: "NFO", instrument_type: "PE", expiry: "2026-06-25", strike, lot_size: 75 }
  ] as ScripMasterRow[]))
];

export const getSymbolMeta = (symbol: string) => {
  const rows = openApiScripMaster.filter((r) => r.symbol === symbol);
  const expiries = [...new Set(rows.filter((r) => r.expiry).map((r) => r.expiry as string))].sort();
  const strikes = [...new Set(rows.filter((r) => typeof r.strike === "number").map((r) => r.strike as number))].sort((a,b)=>a-b);
  const lotSize = rows[0]?.lot_size ?? 1;
  return { expiries, strikes, lotSize, rows };
};
