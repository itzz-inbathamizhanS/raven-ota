"""Vehicle repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.vehicle import Vehicle

class VehicleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[Vehicle]:
        result = await self.session.execute(select(Vehicle))
        return list(result.scalars().all())

    async def get_by_id(self, vehicle_id: str) -> Vehicle | None:
        result = await self.session.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
        return result.scalars().first()

    async def create(self, vehicle: Vehicle) -> Vehicle:
        self.session.add(vehicle)
        await self.session.flush()
        return vehicle
