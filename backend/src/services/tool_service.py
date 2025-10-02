from typing import cast
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.models import Tool
from src.schemas.tool import ToolCreate, ToolUpdate, ToolRead
from src.repo.crud_repos import ToolRepo

class ToolService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ToolRepo(session)

    async def list(self, limit: int, offset: int, *, category: str | None = None, query: str | None = None):
        filters = []
        if category:
            filters.append(Tool.category == category)
        if query:
            filters.append(Tool.name.ilike(f"%{query}%"))

        total = await self.repo.count(*filters)
        items = cast(list[ToolRead], await self.repo.get(*filters, limit=limit, offset=offset))
        return total, items

    async def get(self, tool_id: int) -> ToolRead:
        tool = cast(ToolRead | None, await self.repo.get_by_id(tool_id))
        if not tool:
            raise HTTPException(404, "Инструмент не найден")
        return tool

    async def create(self, payload: ToolCreate) -> ToolRead:
        if await self.repo.get_by_serial(payload.serial_number):
            raise HTTPException(409, "Инструмент с таким серийным номером уже существует")

        await self.repo.add(payload, commit=False)
        created = await self.repo.get_by_serial(payload.serial_number)
        if not created:
            await self.session.rollback()
            raise HTTPException(500, "Не удалось создать инструмент")
        await self.session.commit()
        return created

    async def update(self, tool_id: int, payload: ToolUpdate) -> ToolRead:
        current = await self.get(tool_id)

        new_serial = payload.serial_number
        if new_serial is not None and new_serial != current.serial_number:
            conflict = await self.repo.exists(
                Tool.serial_number == new_serial,
                Tool.id != tool_id
            )
            if conflict:
                raise HTTPException(409, "Инструмент с таким серийным номером уже существует")

        changed = await self.repo.update(
            Tool.id == tool_id,
            update_data=payload,
            exclude_none=True,
            commit=False,
            return_models=False,
        )
        if not changed:
            return current

        updated = await self.get(tool_id)
        await self.session.commit()
        return updated

    async def delete(self, tool_id: int) -> None:
        deleted = await self.repo.delete(Tool.id == tool_id, commit=False)
        if not deleted:
            raise HTTPException(404, "Инструмент не найден")
        await self.session.commit()