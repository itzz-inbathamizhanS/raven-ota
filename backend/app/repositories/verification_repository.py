"""Verification artifact repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.verification import VerificationArtifact

class VerificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, artifact_id: str) -> VerificationArtifact | None:
        result = await self.session.execute(select(VerificationArtifact).where(VerificationArtifact.id == artifact_id))
        return result.scalars().first()

    async def create(self, artifact: VerificationArtifact) -> VerificationArtifact:
        self.session.add(artifact)
        await self.session.flush()
        return artifact
