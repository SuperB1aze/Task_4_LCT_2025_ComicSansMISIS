from pydantic import BaseModel, Field
from typing import List, Generic, TypeVar

ListClass = TypeVar("ListClass")

class PageParametres(BaseModel):
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)

class Page(PageParametres, Generic[ListClass]):
    total: int
    items: List[ListClass]