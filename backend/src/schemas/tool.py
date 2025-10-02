from pydantic import BaseModel, Field

class ToolBase(BaseModel):
    name: str = Field(min_length = 1)
    serial_number: str = Field(min_length = 1)
    category: str = Field(min_length = 1)

class ToolCreate(ToolBase):
    pass

class ToolUpdate(BaseModel):
    name: str | None = Field(default = None, min_length = 1)
    serial_number: str | None = Field(default = None, min_length = 1)
    category: str | None = Field(default = None, min_length = 1)

class ToolRead(ToolBase):
    id: int