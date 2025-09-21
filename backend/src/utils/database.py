from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from src.config import Settings

settings = Settings()


class Base(DeclarativeBase):
    """Базовый класс для бд"""
    pass


class DatabaseManager:
    """Менеджер подключений к бд"""
    
    def __init__(self):
        self.engine = None
        self.session_factory = None
    
    async def create_engine(self):
        """Создание движка базы данных"""
        if self.engine is None:
            self.engine = create_async_engine(
                settings.DB_URL,
                echo=False,
                pool_pre_ping=True,
                pool_recycle=300
            )
            self.session_factory = async_sessionmaker(
                self.engine,
                class_=AsyncSession,
                expire_on_commit=False
            )
        return self.engine
    
    async def close_engine(self):
        """Закрытие движка базы данных"""
        if self.engine:
            await self.engine.dispose()
            self.engine = None
            self.session_factory = None


db_manager = DatabaseManager()


async def check_postgres_connection() -> bool:
    """Проверка подключения"""
    try:
        if db_manager.engine is None:
            await db_manager.create_engine()
        
        async with db_manager.engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


async def get_db_session():
    """Получение сессии"""
    if db_manager.session_factory is None:
        await db_manager.create_engine()
    
    session = db_manager.session_factory()
    try:
        yield session
    finally:
        await session.close()