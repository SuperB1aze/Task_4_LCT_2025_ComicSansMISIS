from pydantic import BaseModel, Field
from src.schemas.tool import ToolRead

class ToolKitItemBase(BaseModel):
    tool_id: int
    quantity: int = Field(ge = 0)

class ToolKitItemCreate(ToolKitItemBase):
    pass

class ToolKitItemUpdate(BaseModel):
    quantity: int | None = Field(default = None, ge = 0)

class ToolKitItemRead(ToolKitItemBase):
    id: int
    toolkit_id: int
    tool: ToolRead | None = None
