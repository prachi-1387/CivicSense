from pydantic import BaseModel, Field
from typing import Literal

# Data required for registration
class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: str
    password: str = Field(min_length=8, max_length=128)


# Data returned after registration
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class ComplaintCreate(BaseModel):
    title: str = Field(min_length=5, max_length=150)
    description: str = Field(min_length=10)
    location: str = Field(min_length=3, max_length=255)

    severity: float = Field(ge=0, le=100)
    public_impact: float = Field(ge=0, le=100)
    safety_risk: float = Field(ge=0, le=100)
    duration: float = Field(ge=0, le=100)


class ComplaintStatusUpdate(BaseModel):
    status: Literal["under_review", "assigned", "in_progress", "resolved"]
    note: str | None = Field(default=None, max_length=500)
    assigned_department: str | None = Field(default=None, max_length=100)