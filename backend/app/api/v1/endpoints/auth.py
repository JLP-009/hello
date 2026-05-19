from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.schemas.auth import AuthVerifyRequest, TokenResponse, UserResponse
from app.services.auth_service import verify_and_login

router = APIRouter()


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: AuthVerifyRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    token, _ = await verify_and_login(payload, db)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def me(current_user=Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        id=str(current_user.id),
        phone_number=current_user.phone_number,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
    )
