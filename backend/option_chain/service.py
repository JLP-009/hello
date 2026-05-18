from smartapi.scripmaster import Instrument

def build_chain(instruments: list[Instrument], expiry: str):
    rows = [i for i in instruments if i.expiry == expiry and i.instrument_type in {"CE", "PE"}]
    strikes = sorted({int(i.strike) for i in rows if i.strike is not None})
    chain = []
    for s in strikes:
        ce = next((i for i in rows if int(i.strike or 0) == s and i.instrument_type == "CE"), None)
        pe = next((i for i in rows if int(i.strike or 0) == s and i.instrument_type == "PE"), None)
        chain.append({"strike": s, "ce_token": ce.token if ce else None, "pe_token": pe.token if pe else None})
    return chain
