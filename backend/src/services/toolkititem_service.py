from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.models import ToolKitItem
from src.schemas.toolkititems import ToolKitItemCreate, ToolKitItemUpdate, ToolKitItemRead
from src.repo.crud_repos import ToolKitItemRepo

class ToolKitItemService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ToolKitItemRepo(session)

    async def list(self, toolkit_id: int) -> list[ToolKitItemRead]:
        rows = await self.repo.list_for_toolkit(toolkit_id)
        return [ToolKitItemRead.model_validate(r, from_attributes=True) for r in rows]

    async def get(self, toolkit_id: int, item_id: int) -> ToolKitItemRead:
        item = await self.repo.get_for_toolkit(toolkit_id, item_id)
        if not item:
            raise HTTPException(404, "Позиция набора не найдена")
        return ToolKitItemRead.model_validate(item, from_attributes=True)

    async def create_or_replace(self, toolkit_id: int, payload: ToolKitItemCreate) -> ToolKitItemRead:
        item = await self.repo.upsert(toolkit_id=toolkit_id, tool_id=payload.tool_id, quantity=payload.quantity)
        await self.session.commit()
        item = await self.repo.get_for_toolkit(toolkit_id, item.id) or item
        return ToolKitItemRead.model_validate(item, from_attributes=True)

    async def update(self, toolkit_id: int, item_id: int, payload: ToolKitItemUpdate) -> ToolKitItemRead:
        item = await self.repo.get_for_toolkit(toolkit_id, item_id)
        if not item:
            raise HTTPException(404, "Позиция набора не найдена")

        data = payload.model_dump(exclude_unset=True, exclude_none=True)
        if not data:
            return ToolKitItemRead.model_validate(item, from_attributes=True)

        if "quantity" in data:
            item.quantity = data["quantity"]

        await self.session.flush()
        await self.session.commit()
        return ToolKitItemRead.model_validate(item, from_attributes=True)

    async def delete(self, toolkit_id: int, item_id: int) -> None:
        item = await self.repo.get_for_toolkit(toolkit_id, item_id)
        if not item:
            raise HTTPException(404, "Позиция набора не найдена")
        await self.repo.delete(ToolKitItem.id == item_id, commit=False)
        await self.session.commit()

    async def clear_all(self, toolkit_id: int) -> int:
        changed = await self.repo.delete(ToolKitItem.toolkit_id == toolkit_id, commit=False)
        await self.session.commit()
        return changed
