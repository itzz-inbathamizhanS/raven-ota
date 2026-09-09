"""Incident repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.incident import Incident

class IncidentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[Incident]:
        result = await self.session.execute(
            select(Incident).order_by(Incident.timestamp.desc())
        )
        return list(result.scalars().all())

    async def get_by_vehicle_id(self, vehicle_id: str) -> list[Incident]:
        result = await self.session.execute(
            select(Incident).where(Incident.vehicle_id == vehicle_id).order_by(Incident.timestamp.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, incident_id: str) -> Incident | None:
        result = await self.session.execute(select(Incident).where(Incident.id == incident_id))
        return result.scalars().first()

    async def create(self, incident: Incident) -> Incident:
        self.session.add(incident)
        await self.session.flush()
        return incident
