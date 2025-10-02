from pydantic import BaseModel, Field
from src.models.enums import RoleEnum

class UserBase(BaseModel):
    name: str = Field(min_length = 1)
    employee_number: str = Field(min_length = 1)
    role: RoleEnum | None = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: str | None = Field(default = None, min_length=1)
    employee_number: str | None = Field(default = None, min_length = 1)
    role: RoleEnum | None = None

class UserRead(UserBase):
    id: int