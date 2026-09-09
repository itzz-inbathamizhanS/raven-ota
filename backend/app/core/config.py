"""RAVEN-OTA configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    DATABASE_URL: str = "sqlite+aiosqlite:///./raven_ota.db"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    APP_NAME: str = "RAVEN-OTA"
    APP_VERSION: str = "0.1.0"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
