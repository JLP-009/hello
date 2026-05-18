from dataclasses import dataclass
from typing import Literal

Side = Literal["BUY", "SELL"]
OptionType = Literal["CE", "PE", "FUT"]

@dataclass
class Leg:
    side: Side
    option_type: OptionType
    strike: float
    premium: float
    quantity: int


def _sign(side: Side) -> int:
    return 1 if side == "BUY" else -1


def leg_payoff(leg: Leg, spot: float) -> float:
    intrinsic = 0.0
    if leg.option_type == "CE":
        intrinsic = max(spot - leg.strike, 0)
    elif leg.option_type == "PE":
        intrinsic = max(leg.strike - spot, 0)
    elif leg.option_type == "FUT":
        intrinsic = spot - leg.strike
    return _sign(leg.side) * ((intrinsic - leg.premium) * leg.quantity)


def aggregate_payoff(legs: list[Leg], spots: list[float]) -> list[float]:
    return [sum(leg_payoff(l, s) for l in legs) for s in spots]


def breakevens(spots: list[float], pnl: list[float]) -> list[float]:
    points = []
    for i in range(1, len(spots)):
        if pnl[i - 1] == 0 or pnl[i] == 0 or (pnl[i - 1] < 0 < pnl[i]) or (pnl[i - 1] > 0 > pnl[i]):
            points.append(spots[i])
    return points
