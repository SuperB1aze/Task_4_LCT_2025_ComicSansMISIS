from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(".env", override=False)


class Settings(BaseSettings):

    #PSQL settings
    DB_NAME: str
    DB_PORT: int
    DB_HOST: str
    DB_USER: str
    DB_PASSWORD: str
    
    # Redis settings
    REDIS_HOST: str 
    REDIS_PORT: int 
    REDIS_PASSWORD: str 
    REDIS_DB: int 

    BASE_DIR: Path = Path(__file__).resolve().parent.parent


    @property
    def DB_URL(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def REDIS_URL(self):
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
