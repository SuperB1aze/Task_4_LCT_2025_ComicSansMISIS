from sqlalchemy import delete, insert, select, update
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from typing import Optional




class BaseRepo:
    model = None
    schema: BaseModel = None

    def __init__(self, session):
        self.session = session

    async def add(self, data: BaseModel):
        add_data_stmt = (
            insert(self.model)
            .values(**data.model_dump())
        )
        result = await self.session.execute(add_data_stmt)
        return result

    async def get(self, *filters, options=None):
        get_data_stmt = select(self.model)
        if options:
            for opt in options:
                get_data_stmt = get_data_stmt.options(opt)
        if filters:
            get_data_stmt = get_data_stmt.where(*filters)
        result = await self.session.execute(get_data_stmt)
        return result.scalars().all()

    async def update(self, filters, update_data: dict):
        update_data_stmt = (
            update(self.model)
            .where(*filters)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        result = await self.session.execute(update_data_stmt)
        return result

    async def get_filtred(self, **filters):
        query = select(self.model).filter_by(**filters)
        res = await self.session.execute(query)
        res = res.scalars().all()
        res = [self.schema.from_orm(row) for row in res]
        return res
    
    async def update_data(self, idDcomm, data: BaseModel):
        update_data_stmt = (
            update(self.model)
            .values(**data.model_dump(exclude_unset=True))
            .where(self.model.idDcomm == idDcomm)
        )
        result = await self.session.execute(update_data_stmt)
        return result
