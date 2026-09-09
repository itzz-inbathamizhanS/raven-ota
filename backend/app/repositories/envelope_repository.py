"""Safety envelope repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.envelope import SafetyEnvelope

class EnvelopeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, envelope_id: str) -> SafetyEnvelope | None:
        result = await self.session.execute(select(SafetyEnvelope).where(SafetyEnvelope.id == envelope_id))
        return result.scalars().first()

    async def create(self, envelope: SafetyEnvelope) -> SafetyEnvelope:
        self.session.add(envelope)
        await self.session.flush()
        return envelope
