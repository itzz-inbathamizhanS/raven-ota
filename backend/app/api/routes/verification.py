"""Verification API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.verification_service import VerificationService
from app.schemas.verification import VerificationArtifactResponse

router = APIRouter(prefix="/verification", tags=["verification"])

@router.get("/{artifact_id}", response_model=VerificationArtifactResponse)
async def get_verification_artifact(artifact_id: str, db: AsyncSession = Depends(get_db)):
    service = VerificationService(db)
    return await service.get_artifact(artifact_id)
