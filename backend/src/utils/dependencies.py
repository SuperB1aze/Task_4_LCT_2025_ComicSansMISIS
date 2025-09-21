from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.redis_client import redis_client, RedisClient


def get_redis() -> RedisClient:
    """Зависимость для редиса"""
    return redis_client


async def get_db_session() -> AsyncSession:
    """Создание и получение сессии базы данных."""
    from src.utils.database import get_db_session as get_db_session_impl
    async for session in get_db_session_impl():
        yield session
