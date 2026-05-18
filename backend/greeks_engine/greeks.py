from dataclasses import dataclass
from math import log, sqrt, exp
from statistics import NormalDist

N = NormalDist()

@dataclass
class Greeks:
    delta: float
    gamma: float
    theta: float
    vega: float


def bs_greeks(flag: str, s: float, k: float, t: float, r: float, sigma: float) -> Greeks:
    d1 = (log(s / k) + (r + sigma * sigma / 2) * t) / (sigma * sqrt(t))
    d2 = d1 - sigma * sqrt(t)
    nd1 = N.pdf(d1)
    delta = N.cdf(d1) if flag == "c" else N.cdf(d1) - 1
    gamma = nd1 / (s * sigma * sqrt(t))
    theta = (-(s * nd1 * sigma) / (2 * sqrt(t)) - r * k * exp(-r * t) * (N.cdf(d2) if flag == "c" else N.cdf(-d2))) / 365
    vega = (s * nd1 * sqrt(t)) / 100
    return Greeks(delta=delta, gamma=gamma, theta=theta, vega=vega)
