from fastapi import APIRouter, WebSocket
import json

router = APIRouter()

@router.websocket('/ws/market')
async def market_stream(ws: WebSocket):
    await ws.accept()
    await ws.send_text(json.dumps({"type": "welcome", "scope": "analytics-only-no-execution"}))
    while True:
        _ = await ws.receive_text()
        await ws.send_text(json.dumps({"type": "tick", "symbol": "NIFTY", "ltp": 22450.0}))
