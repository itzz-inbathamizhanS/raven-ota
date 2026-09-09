"""Telemetry repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.telemetry import TelemetrySample

class TelemetryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_vehicle_id(self, vehicle_id: str, limit: int = 100) -> list[TelemetrySample]:
        result = await self.session.execute(
            select(TelemetrySample)
            .where(TelemetrySample.vehicle_id == vehicle_id)
            .order_by(TelemetrySample.timestamp.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, sample: TelemetrySample) -> TelemetrySample:
        self.session.add(sample)
        await self.session.flush()
        return sample
