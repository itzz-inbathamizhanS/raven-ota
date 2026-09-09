"""Safety envelope service layer."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.envelope_repository import EnvelopeRepository
from app.models.envelope import SafetyEnvelope as EnvelopeModel
from app.schemas.envelope import SafetyEnvelopeResponse
from app.core.exceptions import NotFoundError

class EnvelopeService:
    def __init__(self, session: AsyncSession):
        self.repo = EnvelopeRepository(session)

    async def get_envelope(self, envelope_id: str) -> SafetyEnvelopeResponse:
        envelope = await self.repo.get_by_id(envelope_id)
        if not envelope:
            raise NotFoundError("SafetyEnvelope", envelope_id)
        
        return SafetyEnvelopeResponse(
            id=envelope.id,
            artifactRef=envelope.artifact_ref,
            maxCpuUtilization=envelope.max_cpu_utilization,
            maxCanBusLoad=envelope.max_can_bus_load,
            maxTaskJitter=envelope.max_task_jitter,
            maxEcuTemp=envelope.max_ecu_temp,
            temporalBoundaries=envelope.temporal_boundaries
        )
