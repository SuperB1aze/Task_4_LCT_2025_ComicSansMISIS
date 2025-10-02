from pydantic import BaseModel, Field
from typing import List
from src.schemas.toolkititems import ToolKitItemRead

class ToolKitBase(BaseModel):
    name: str = Field(min_length=1)
    description: str | None = None

class ToolKitCreate(ToolKitBase):
    pass

class ToolKitUpdate(BaseModel):
    name: str | None = Field(default = None, min_length = 1)
    description: str | None = None

# общая информация о наборе
class ToolKitRead(ToolKitBase):
    id: int

# полная информация о наборе
class ToolKitReadFull(ToolKitRead):
    items: List[ToolKitItemRead] = Field(default_factory = list)