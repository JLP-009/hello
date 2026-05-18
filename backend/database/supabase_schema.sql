create table if not exists option_chain_live (
  symbol text not null,
  strike numeric not null,
  option_type text not null,
  ltp numeric,
  oi bigint,
  oi_change bigint,
  volume bigint,
  iv numeric,
  delta numeric,
  theta numeric,
  gamma numeric,
  vega numeric,
  timestamp timestamptz default now()
);

create table if not exists strategy_positions (
  strategy_id text not null,
  legs jsonb not null,
  pnl numeric,
  delta numeric,
  theta numeric,
  gamma numeric,
  vega numeric,
  timestamp timestamptz default now()
);

create table if not exists market_structure (
  symbol text not null,
  vwap numeric,
  cpr jsonb,
  trend text,
  support jsonb,
  resistance jsonb,
  timestamp timestamptz default now()
);
