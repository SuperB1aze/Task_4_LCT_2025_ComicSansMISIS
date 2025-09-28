from fastapi import APIRouter, Depends, File, UploadFile
from src.utils.dependencies import get_redis, get_db_session
from src.utils.redis_client import RedisClient
from src.utils.database import check_postgres_connection
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

router=APIRouter(prefix="/base")

@router.get("/health")
async def health(redis: RedisClient = Depends(get_redis)):
    """Проверка состояния сервиса(подключение к бд)"""
    redis_status = redis.ping()
    
    postgres_status = await check_postgres_connection()
    
    overall_status = "healthy" if redis_status and postgres_status else "unhealthy"
    
    return {
        "status": overall_status,
        "services": {
            "redis": "connected" if redis_status else "disconnected",
            "postgresql": "connected" if postgres_status else "disconnected"
        }
    }

