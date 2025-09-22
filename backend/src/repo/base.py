from sqlalchemy import delete, insert, select, update, inspect, func, exists
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Type, TypeVar, Any, Sequence

TModel = TypeVar("TModel")

class BaseRepo:
    model = Type[TModel]
    schema: BaseModel | None = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, data: BaseModel, commit: bool = False):
        stmt = (
            insert(self.model)
            .values(**data.model_dump())
        )

        result = await self.session.execute(stmt)
        if commit:
            await self.session.commit()
        else:
            await self.session.flush()

        return result.scalar_one_or_none()

    async def get(self, 
                  *filters: Any,
                  load_options: Sequence[Any] | None = None,
                  order_by: Sequence[Any] | None = None,
                  limit: int | None = None,
                  offset: int | None = None):
        stmt = select(self.model)

        if load_options:
            for opt in load_options:
                stmt = stmt.options(opt)
        if filters:
            stmt = stmt.where(*filters)
        if order_by:
            stmt = stmt.order_by(*order_by)
        else:
            stmt = stmt.order_by(*inspect(self.model).primary_key)
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
        
        result = await self.session.execute(stmt)
        final_res = result.scalars().unique().all()
        
        if self.schema is None:
            return final_res
        return [self.schema.model_validate(r, from_attributes=True) for r in final_res]
    
    async def get_one(self, *filters, **kw):
        kw.pop("limit", None)
        result = await self.get(*filters, limit=1, **kw)
        return result[0] if result else None
    
    async def get_by_id(self, pk, **kw):
        return await self.get_one(getattr(self.model, "id") == pk, **kw)

    async def update(self, 
                     *filters: Any, 
                     update_data: dict | BaseModel,
                     exclude_none: bool = False,
                     commit: bool = False,
                     return_models: bool = True):
        if not filters:
            raise ValueError("Refusing to update without filters.")
        
        if isinstance(update_data, BaseModel):
            payload = update_data.model_dump(exclude_unset=True, exclude_none=exclude_none)
        else:
            payload = update_data
            if exclude_none:
                payload = {k: v for k, v in payload.items() if v is not None}

        if not payload:
            return [] if return_models else 0

        stmt = (
            update(self.model)
            .where(*filters)
            .values(**payload)
            .execution_options(synchronize_session="fetch")
        )

        if return_models:
            stmt = stmt.returning(self.model)

        result = await self.session.execute(stmt)

        if commit:
            await self.session.commit()
        else:
            await self.session.flush()

        if return_models:
            return result.scalars().all()
        else:
            return result.rowcount if isinstance(result.rowcount, int) and result.rowcount > 0 else 0
        
    async def delete(self, *filters: Any, commit: bool = False):
        if not filters:
            raise ValueError("Refusing to delete without filters.")
        stmt = delete(self.model).where(*filters)
        result = await self.session.execute(stmt)

        if commit:
            await self.session.commit()
        else:
            await self.session.flush()

        return result.rowcount if isinstance(result.rowcount, int) and result.rowcount > 0 else 0
    
    async def count(self, *filters: Any):
        stmt = select(func.count()).select_from(self.model)
        if filters:
            stmt = stmt.where(*filters)
        res = await self.session.execute(stmt)
        return res.scalar_one()
    
    async def exists(self, *filters: Any):
        stmt = select(exists().where(*filters))
        res = await self.session.execute(stmt)
        return res.scalar()