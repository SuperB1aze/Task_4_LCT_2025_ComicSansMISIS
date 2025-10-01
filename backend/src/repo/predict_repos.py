from src.repo.base import BaseRepo
from src.models.models import Tool, ToolKit, ToolKitItem
from src.schemas.predict import ToolInfo
from sqlalchemy.orm import selectinload
from typing import List, Sequence, cast


class ToolRepo(BaseRepo):
    model = Tool
    schema = None
    
    async def get_tools_by_ids(self, tool_ids: Sequence[int]) -> List[Tool]:
        """Получить инструменты по списку ID"""
        if not tool_ids:
            return []
        return cast(List[Tool], await self.get(self.model.id.in_(tool_ids)))


class ToolKitRepo(BaseRepo):
    model = ToolKit
    schema = None
    
    async def get_toolkit_with_items(self, toolkit_id: int) -> ToolKit | None:
        """Получить набор инструментов с его содержимым"""
        result = await self.get_one(
            ToolKit.id == toolkit_id,
            load_options=[selectinload(ToolKit.items).selectinload(ToolKitItem.tool)]
        )
        return cast(ToolKit | None, result)


class ToolKitItemRepo(BaseRepo):
    model = ToolKitItem
    schema = None
    
    async def get_items_by_toolkit_id(self, toolkit_id: int) -> List[ToolKitItem] | None:
        """Получить все элементы набора инструментов"""
        result = await self.get(
            ToolKitItem.toolkit_id == toolkit_id,
            load_options=[selectinload(ToolKitItem.tool)]
        )
        return cast(List[ToolKitItem] | None, result)