from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.models import ToolKit
from src.schemas.toolkit import ToolKitCreate, ToolKitUpdate, ToolKitRead, ToolKitReadFull
from src.repo.crud_repos import ToolKitRepo

class ToolKitService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ToolKitRepo(session)

    async def list(self, limit: int, offset: int, *, query: str | None = None):
        filters = []
        if query:
            filters.append(ToolKit.name.ilike(f"%{query}%"))

        total = await self.repo.count(*filters)
        rows = await self.repo.get(*filters, limit=limit, offset=offset)
        items = [ToolKitRead.model_validate(r, from_attributes=True) for r in rows]
        return total, items

    async def get(self, toolkit_id: int) -> ToolKitReadFull:
        kit = await self.repo.get_with_items(toolkit_id)
        if not kit:
            raise HTTPException(404, "Набор не найден")
        return ToolKitReadFull.model_validate(kit, from_attributes=True)

    async def create(self, payload: ToolKitCreate) -> ToolKitRead:
        await self.repo.add(payload, commit=False)
        kit = await self.repo.get(ToolKit.name == payload.name, ToolKit.description == payload.description, limit=1)
        if not kit:
            await self.session.rollback()
            raise HTTPException(500, "Не удалось создать набор")
        await self.session.commit()
        return ToolKitRead.model_validate(kit[0], from_attributes=True)

    async def update(self, toolkit_id: int, payload: ToolKitUpdate) -> ToolKitRead:
        kit = await self.repo.get(ToolKit.id == toolkit_id, limit=1)
        if not kit:
            raise HTTPException(404, "Набор не найден")

        changed = await self.repo.update(
            ToolKit.id == toolkit_id,
            update_data=payload,
            exclude_none=True,
            commit=False,
            return_models=False
        )
        if not changed:
            return ToolKitRead.model_validate(kit[0], from_attributes=True)

        updated = await self.repo.get_by_id(toolkit_id)
        await self.session.commit()
        return ToolKitRead.model_validate(updated, from_attributes=True)

    async def delete(self, toolkit_id: int) -> None:
        if await self.repo.items_count(toolkit_id) > 0:
            raise HTTPException(409, "В наборе есть позиции. Сначала удалите их.")

        changed = await self.repo.delete(ToolKit.id == toolkit_id, commit=False)
        if not changed:
            raise HTTPException(404, "Набор не найден")
        await self.session.commit()