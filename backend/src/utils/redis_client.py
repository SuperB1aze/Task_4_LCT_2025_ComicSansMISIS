import redis
from typing import Optional, Any, Union
import json
from src.config import Settings

settings = Settings()


class RedisClient:
    """Клиент для работы с redis"""
    
    def __init__(self):
        self._client: Optional[redis.Redis] = None
    
    def connect(self) -> redis.Redis:
        """Подключение редиса"""
        if self._client is None:
            self._client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
        return self._client
    
    def disconnect(self):
        """Отключение"""
        if self._client:
            self._client.close()
            self._client = None
    
    def ping(self) -> bool:
        """Проверка подключения"""
        try:
            client = self.connect()
            return client.ping()
        except Exception:
            return False
    
    def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        """Установка значений"""
        try:
            client = self.connect()
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            return client.set(key, value, ex=ex)
        except Exception:
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Получение значений"""
        try:
            client = self.connect()
            value = client.get(key)
            if value is None:
                return None
            
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return value
        except Exception:
            return None
    
    def delete(self, *keys: str) -> int:
        """Удаления"""
        try:
            client = self.connect()
            return client.delete(*keys)
        except Exception:
            return 0
    
    def exists(self, key: str) -> bool:
        """Проверка на существование"""
        try:
            client = self.connect()
            return bool(client.exists(key))
        except Exception:
            return False
    
    def expire(self, key: str, time: int) -> bool:
        """Установка ttl"""
        try:
            client = self.connect()
            return client.expire(key, time)
        except Exception:
            return False
    
    def ttl(self, key: str) -> int:
        """Узнать ttl"""
        try:
            client = self.connect()
            return client.ttl(key)
        except Exception:
            return -1
    
    def keys(self, pattern: str = "*") -> list:
        """Проверка паттерна ключей"""
        try:
            client = self.connect()
            return client.keys(pattern)
        except Exception:
            return []
    
    def flushdb(self) -> bool:
        """Отчистка бд"""
        try:
            client = self.connect()
            return client.flushdb()
        except Exception:
            return False


redis_client = RedisClient()
