from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.dependencies import get_db_session
from src.schemas.page import Page, PageParametres
from src.schemas.tool import ToolCreate, ToolUpdate, ToolRead
from src.services.tool_service import ToolService

router = APIRouter(prefix="/tools", tags=["Tools"])

@router.get("/", response_model=Page[ToolRead])
async def list_tools(
    params: PageParametres = Depends(),
    category: str | None = Query(None),
    q: str | None = Query(None, description="Поиск по имени/серийному номеру"),
    session: AsyncSession = Depends(get_db_session),
):
    tool_service = ToolService(session)
    total, items = await tool_service.list(limit=params.limit, offset=params.offset, category=category, query=q)
    return Page[ToolRead](total=total, items=items, **params.model_dump())

@router.get("/{tool_id}", response_model=ToolRead)
async def get_tool(tool_id: int, session: AsyncSession = Depends(get_db_session)):
    return await ToolService(session).get(tool_id)

@router.post("/", response_model=ToolRead, status_code=201)
async def create_tool(payload: ToolCreate, session: AsyncSession = Depends(get_db_session)):
    return await ToolService(session).create(payload)

@router.put("/{tool_id}", response_model=ToolRead)
async def update_tool(tool_id: int, payload: ToolUpdate, session: AsyncSession = Depends(get_db_session)):
    return await ToolService(session).update(tool_id, payload)

@router.delete("/{tool_id}", status_code=204)
async def delete_tool(tool_id: int, session: AsyncSession = Depends(get_db_session)):
    await ToolService(session).delete(tool_id)
