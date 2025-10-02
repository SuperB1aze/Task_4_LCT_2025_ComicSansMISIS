from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.models import User
from src.schemas.user import UserCreate, UserUpdate, UserRead
from src.repo.crud_repos import UserRepo
from typing import cast

class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = UserRepo(session)

    async def list(self, limit: int, offset: int):
        total = await self.repo.count()
        items = cast(list[UserRead], await self.repo.get(limit=limit, offset=offset))
        return total, items

    async def get(self, user_id: int) -> UserRead:
        user = cast(UserRead | None, await self.repo.get_by_id(user_id))
        if not user:
            raise HTTPException(404, "Пользователь не найден")
        return user

    async def get_by_employee_number(self, employee_number: str):
        return await self.repo.get_by_employee_number(employee_number)

    async def create(self, payload: UserCreate) -> UserRead:
        if await self.get_by_employee_number(payload.employee_number):
            raise HTTPException(409, "Пользователь с таким номером уже существует")

        await self.repo.add(payload, commit=False)
        created = await self.get_by_employee_number(payload.employee_number)
        if not created:
            await self.session.rollback()
            raise HTTPException(500, "Не удалось создать пользователя")
        await self.session.commit()
        return created

    async def update(self, user_id: int, payload: UserUpdate) -> UserRead:
        current = await self.get(user_id)

        if payload.employee_number is not None:
            user_info = await self.get_by_employee_number(payload.employee_number)
            if user_info and user_info.id != user_id:
                raise HTTPException(409, "Пользователь с таким номером уже существует")

        changed_user = await self.repo.update(
            User.id == user_id,
            update_data=payload,
            exclude_none=True,
            commit=False,
            return_models=False,
        )
        if not changed_user:
            return current

        updated = await self.get(user_id)
        await self.session.commit()
        return updated

    async def delete(self, user_id: int) -> None:
        deleted_user = await self.repo.delete(User.id == user_id, commit=False)
        if not deleted_user:
            raise HTTPException(404, "Пользователь не найден")
        await self.session.commit()