from dataclasses import dataclass
from typing import Any

@dataclass
class Instrument:
    symbol: str
    token: str
    instrument_type: str
    exchange: str
    lot_size: int
    expiry: str | None
    strike: float | None


def normalize_scripmaster(rows: list[dict[str, Any]], symbol: str) -> list[Instrument]:
    result = []
    for r in rows:
        if r.get("symbol") != symbol:
            continue
        result.append(Instrument(
            symbol=r.get("symbol", ""), token=str(r.get("token", "")), instrument_type=r.get("instrument_type", ""),
            exchange=r.get("exchange", ""), lot_size=int(r.get("lot_size", 1)), expiry=r.get("expiry"), strike=float(r["strike"]) if r.get("strike") is not None else None
        ))
    return result
