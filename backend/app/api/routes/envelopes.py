"""Safety Envelope API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.envelope_service import EnvelopeService
from app.schemas.envelope import SafetyEnvelopeResponse

router = APIRouter(prefix="/envelopes", tags=["envelopes"])

@router.get("/{envelope_id}", response_model=SafetyEnvelopeResponse)
async def get_safety_envelope(envelope_id: str, db: AsyncSession = Depends(get_db)):
    service = EnvelopeService(db)
    return await service.get_envelope(envelope_id)
