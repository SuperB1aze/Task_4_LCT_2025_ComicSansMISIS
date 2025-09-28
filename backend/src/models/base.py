"""Базовая модель"""

from src.utils.database import Base

class BaseModel(Base):
    """Базовая модель"""
    __abstract__ = True