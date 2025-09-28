from pathlib import Path
import sys
from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager

from src.api.base import router as base_router
from src.utils.redis_client import redis_client
from src.utils.database import db_manager
from src.utils.mock import create_mock_data
from src.api.predict import router as predict_router
from src.api.media import router as media_router
sys.path.append(str(Path(__file__).parent.parent))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Жизненный цикл приложения"""

    #старт

    #psql
    try:
        await db_manager.create_engine()
        app.state.db_session_factory = db_manager.session_factory
        
        # Создание mock данных при старте приложения
        await create_mock_data()
        
    except Exception as e:
        print(f" Ошибка подключения к БД: {e}")
    
    #reddis
    try:
        redis_client.ping()
    except Exception as e:
        print(f" Ошибка подключения к редису: {e}")
        
    
    yield

    # стоп
    await db_manager.close_engine()
    redis_client.disconnect()


app = FastAPI(
    title="MVP-Template",
    lifespan=lifespan
)

app.include_router(base_router)
app.include_router(predict_router)
app.include_router(media_router)

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)