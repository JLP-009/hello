from pydantic import BaseModel, Field


class AuthVerifyRequest(BaseModel):
    id_token: str = Field(min_length=10)
    phone_number: str = Field(min_length=8, max_length=24)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    phone_number: str
    full_name: str | None
    is_active: bool
