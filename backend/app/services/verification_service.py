"""Verification artifact service layer."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.verification_repository import VerificationRepository
from app.models.verification import VerificationArtifact as VerificationModel
from app.schemas.verification import VerificationArtifactResponse
from app.core.exceptions import NotFoundError

class VerificationService:
    def __init__(self, session: AsyncSession):
        self.repo = VerificationRepository(session)

    async def get_artifact(self, artifact_id: str) -> VerificationArtifactResponse:
        artifact = await self.repo.get_by_id(artifact_id)
        if not artifact:
            raise NotFoundError("VerificationArtifact", artifact_id)
        
        return VerificationArtifactResponse(
            id=artifact.id,
            otaId=artifact.ota_id,
            hashDigest=artifact.hash_digest,
            signatureValidity=artifact.signature_validity,
            asilLevel=artifact.asil_level,
            formalInvariant=artifact.formal_invariant
        )
