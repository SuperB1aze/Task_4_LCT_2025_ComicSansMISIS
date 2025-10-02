from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.dependencies import get_db_session
from src.schemas.page import Page, PageParametres
from src.schemas.user import UserCreate, UserUpdate, UserRead
from src.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=Page[UserRead])
async def list_users(
    params: PageParametres = Depends(),
    session: AsyncSession = Depends(get_db_session),
):
    user_service = UserService(session)
    total, items = await user_service.list(limit=params.limit, offset=params.offset)
    return Page[UserRead](total=total, items=items, **params.model_dump())

@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: int,
    session: AsyncSession = Depends(get_db_session),
):
    return await UserService(session).get(user_id)

@router.post("/", response_model=UserRead, status_code=201)
async def create_user(
    payload: UserCreate,
    session: AsyncSession = Depends(get_db_session),
):
    return await UserService(session).create(payload)

@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    payload: UserUpdate,
    session: AsyncSession = Depends(get_db_session),
):
    return await UserService(session).update(user_id, payload)

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    session: AsyncSession = Depends(get_db_session),
):
    await UserService(session).delete(user_id)
