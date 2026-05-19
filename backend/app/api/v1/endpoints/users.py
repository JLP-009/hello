from fastapi import APIRouter, Depends
from app.api.v1.deps import get_current_user
from app.schemas.auth import UserResponse

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def profile(current_user=Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        id=str(current_user.id),
        phone_number=current_user.phone_number,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
    )
