import httpx
from fastapi import HTTPException
from app.core.config import settings


async def verify_firebase_token(id_token: str) -> dict:
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={settings.firebase_web_api_key}"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(url, json={"idToken": id_token})
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    data = response.json()
    users = data.get("users", [])
    if not users:
        raise HTTPException(status_code=401, detail="User not found in Firebase")
    return users[0]
