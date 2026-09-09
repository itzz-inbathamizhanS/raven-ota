"""Database initialization — create tables."""

import logging
from sqlalchemy.ext.asyncio import AsyncEngine

import app.models  # noqa: F401
from app.db.base import Base
from sqlalchemy import func, select
from app.db.session import async_session_factory
from app.models.vehicle import Vehicle

logger = logging.getLogger(__name__)


async def init_db(engine: AsyncEngine) -> None:
    """Create all tables defined by ORM models."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session_factory() as session:
        vehicle_count = await session.scalar(select(func.count()).select_from(Vehicle))
    if not vehicle_count:
        from scripts.seed_demo_data import seed_data
        await seed_data()
    logger.info("Database tables created")
