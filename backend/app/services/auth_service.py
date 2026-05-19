from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.db.models.user import User
from app.schemas.auth import AuthVerifyRequest
from app.services.firebase_service import verify_firebase_token
from app.core.security import create_access_token


async def verify_and_login(payload: AuthVerifyRequest, db: AsyncSession) -> tuple[str, User]:
    firebase_user = await verify_firebase_token(payload.id_token)
    firebase_uid = firebase_user.get("localId")
    phone = firebase_user.get("phoneNumber")

    if not firebase_uid or not phone:
        raise HTTPException(status_code=400, detail="Malformed Firebase response")

    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(firebase_uid=firebase_uid, phone_number=phone)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(str(user.id))
    return token, user
