from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.dependencies import get_db_session
from src.schemas.page import Page, PageParametres
from src.schemas.toolkit import ToolKitCreate, ToolKitUpdate, ToolKitRead, ToolKitReadFull
from src.schemas.toolkititems import ToolKitItemRead, ToolKitItemCreate, ToolKitItemUpdate
from src.services.toolkit_service import ToolKitService
from src.services.toolkititem_service import ToolKitItemService

router = APIRouter(prefix="/toolkits", tags=["ToolKits"])

# ToolKitService
@router.get("/", response_model=Page[ToolKitRead])
async def list_toolkits(
    params: PageParametres = Depends(),
    q: str | None = Query(None, description="Поиск по имени набора"),
    session: AsyncSession = Depends(get_db_session),
):
    service = ToolKitService(session)
    total, items = await service.list(limit=params.limit, offset=params.offset, query=q)
    return Page[ToolKitRead](total=total, items=items, **params.model_dump())

@router.get("/{toolkit_id}", response_model=ToolKitReadFull)
async def get_toolkit(
    toolkit_id: int,
    session: AsyncSession = Depends(get_db_session),
):
    return await ToolKitService(session).get(toolkit_id)

@router.post("/", response_model=ToolKitRead, status_code=201)
async def create_toolkit(
    payload: ToolKitCreate,
    session: AsyncSession = Depends(get_db_session),
):
    return await ToolKitService(session).create(payload)

@router.put("/{toolkit_id}", response_model=ToolKitRead)
async def update_toolkit(
    toolkit_id: int,
    payload: ToolKitUpdate,
    session: AsyncSession = Depends(get_db_session),
):
    return await ToolKitService(session).update(toolkit_id, payload)

@router.delete("/{toolkit_id}", status_code=204)
async def delete_toolkit(
    toolkit_id: int,
    session: AsyncSession = Depends(get_db_session),
):
    await ToolKitService(session).delete(toolkit_id)

# ToolKitItemService
@router.get("/{toolkit_id}/items", response_model=list[ToolKitItemRead])
async def list_items(
    toolkit_id: int, 
    session: AsyncSession = Depends(get_db_session)
):
    return await ToolKitItemService(session).list(toolkit_id)

@router.get("/{toolkit_id}/items/{item_id}", response_model=ToolKitItemRead)
async def get_item(
    toolkit_id: int, 
    item_id: int, 
    session: AsyncSession = Depends(get_db_session)
):
    return await ToolKitItemService(session).get(toolkit_id, item_id)

@router.post("/{toolkit_id}/items", response_model=ToolKitItemRead, status_code=201)
async def add_or_replace_item(
    toolkit_id: int, 
    payload: ToolKitItemCreate, 
    session: AsyncSession = Depends(get_db_session)
):
    return await ToolKitItemService(session).create_or_replace(toolkit_id, payload)

@router.put("/{toolkit_id}/items/{item_id}", response_model=ToolKitItemRead)
async def update_item(
    toolkit_id: int, 
    item_id: int, 
    payload: ToolKitItemUpdate, 
    session: AsyncSession = Depends(get_db_session)
):
    return await ToolKitItemService(session).update(toolkit_id, item_id, payload)

@router.delete("/{toolkit_id}/items/{item_id}", status_code=204)
async def delete_item(
    toolkit_id: int, 
    item_id: int, 
    session: AsyncSession = Depends(get_db_session)
):
    await ToolKitItemService(session).delete(toolkit_id, item_id)

@router.delete("/{toolkit_id}/items", status_code=200)
async def clear_items(
    toolkit_id: int, 
    session: AsyncSession = Depends(get_db_session)
):
    deleted = await ToolKitItemService(session).clear_all(toolkit_id)
    return {"deleted": deleted}