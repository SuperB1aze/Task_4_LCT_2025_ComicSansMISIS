from src.repo.base import BaseRepo
from src.models.models import Tool, ToolKit, ToolKitItem
from src.schemas.predict import ToolInfo
from sqlalchemy.orm import selectinload
from typing import List


class ToolRepo(BaseRepo):
    model = Tool
    
    async def get_tools_by_ids(self, tool_ids: List[int]) -> List[Tool]:
        """Получить инструменты по списку ID"""
        return await self.get(Tool.id.in_(tool_ids))


class ToolKitRepo(BaseRepo):
    model = ToolKit
    
    async def get_toolkit_with_items(self, toolkit_id: int) -> ToolKit:
        """Получить набор инструментов с его содержимым"""
        return await self.get_one(
            ToolKit.id == toolkit_id,
            load_options=[selectinload(ToolKit.items).selectinload(ToolKitItem.tool)]
        )


class ToolKitItemRepo(BaseRepo):
    model = ToolKitItem
    
    async def get_items_by_toolkit_id(self, toolkit_id: int) -> List[ToolKitItem]:
        """Получить все элементы набора инструментов"""
        return await self.get(
            ToolKitItem.toolkit_id == toolkit_id,
            load_options=[selectinload(ToolKitItem.tool)]
        )
