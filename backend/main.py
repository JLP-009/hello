from fastapi import FastAPI
from api.routes import router as api_router
from websocket.stream import router as ws_router

app = FastAPI(title="Institutional Options Intelligence API")
app.include_router(api_router, prefix="/api")
app.include_router(ws_router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "options-intelligence"}
