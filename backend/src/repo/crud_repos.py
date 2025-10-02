from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from src.repo.base import BaseRepo
from src.models.models import User, Tool, ToolKit, ToolKitItem
from src.schemas.user import UserRead
from src.schemas.tool import ToolRead
from typing import cast, Sequence, Any

class UserRepo(BaseRepo):
    model = User
    schema = cast(BaseModel, UserRead)

    async def get_by_employee_number(self, employee_num: str) -> UserRead | None:
        return cast(UserRead | None, await self.get_one(User.employee_number == employee_num))
    

class ToolRepo(BaseRepo):
    model = Tool
    schema = cast(BaseModel, ToolRead)

    async def get_by_serial(self, serial: str) -> ToolRead | None:
        return cast(ToolRead | None, await self.get_one(Tool.serial_number == serial))
    
class ToolKitRepo(BaseRepo):
    model = ToolKit
    schema = None

    async def get_with_items(self, toolkit_id: int) -> ToolKit | None:
        res = await self.session.execute(
            select(ToolKit)
            .where(ToolKit.id == toolkit_id)
            .options(
                selectinload(ToolKit.items).selectinload(ToolKitItem.tool)
            )
        )
        return res.scalar_one_or_none()

    async def list_with_items(
        self,
        *filters: Any,
        limit: int | None = None,
        offset: int | None = None,
        order_by: Sequence[Any] | None = None
    ):
        stmt = (
            select(ToolKit)
            .options(selectinload(ToolKit.items).selectinload(ToolKitItem.tool))
        )
        if filters:
            stmt = stmt.where(*filters)
        if order_by:
            stmt = stmt.order_by(*order_by)
        else:
            stmt = stmt.order_by(ToolKit.id)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)

        rows = await self.session.execute(stmt)
        return rows.scalars().unique().all()

    async def items_count(self, toolkit_id: int) -> int:
        query = select(func.count()).select_from(ToolKitItem).where(ToolKitItem.toolkit_id == toolkit_id)
        res = await self.session.execute(query)
        return int(res.scalar_one())
    
class ToolKitItemRepo(BaseRepo):
    model = ToolKitItem
    schema = None

    async def list_for_toolkit(self, toolkit_id: int):
        res = await self.session.execute(
            select(ToolKitItem)
            .where(ToolKitItem.toolkit_id == toolkit_id)
            .options(selectinload(ToolKitItem.tool))
            .order_by(ToolKitItem.id)
        )
        return res.scalars().all()

    async def get_for_toolkit(self, toolkit_id: int, item_id: int):
        res = await self.session.execute(
            select(ToolKitItem)
            .where(ToolKitItem.toolkit_id == toolkit_id, ToolKitItem.id == item_id)
            .options(selectinload(ToolKitItem.tool))
        )
        return res.scalar_one_or_none()

    async def upsert(self, toolkit_id: int, tool_id: int, quantity: int) -> ToolKitItem:
        res = await self.session.execute(
            select(ToolKitItem).where(
                ToolKitItem.toolkit_id == toolkit_id,
                ToolKitItem.tool_id == tool_id
            )
        )
        obj = res.scalar_one_or_none()
        if obj:
            obj.quantity = quantity
            await self.session.flush()
            return obj
        obj = ToolKitItem(toolkit_id=toolkit_id, tool_id=tool_id, quantity=quantity)
        self.session.add(obj)
        await self.session.flush()
        return obj