"""Assurance repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.assurance import AssuranceDecision

class AssuranceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_vehicle_id(self, vehicle_id: str, limit: int = 10) -> list[AssuranceDecision]:
        result = await self.session.execute(
            select(AssuranceDecision)
            .where(AssuranceDecision.vehicle_id == vehicle_id)
            .order_by(AssuranceDecision.timestamp.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, decision: AssuranceDecision) -> AssuranceDecision:
        self.session.add(decision)
        await self.session.flush()
        return decision
