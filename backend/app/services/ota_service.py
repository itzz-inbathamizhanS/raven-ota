"""OTA service layer."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.ota_repository import OTARepository
from app.models.ota import OTAUpdate as OTAUpdateModel
from app.schemas.ota import OTAUpdateResponse
from app.core.exceptions import NotFoundError

class OTAService:
    def __init__(self, session: AsyncSession):
        self.repo = OTARepository(session)

    async def get_all_campaigns(self) -> list[OTAUpdateResponse]:
        campaigns = await self.repo.get_all()
        return [self._to_schema(c) for c in campaigns]

    async def get_campaign(self, ota_id: str) -> OTAUpdateResponse:
        campaign = await self.repo.get_by_id(ota_id)
        if not campaign:
            raise NotFoundError("OTAUpdate", ota_id)
        return self._to_schema(campaign)

    def _to_schema(self, ota: OTAUpdateModel) -> OTAUpdateResponse:
        return OTAUpdateResponse(
            id=ota.id,
            version=ota.version,
            releaseDate=ota.release_date,
            type=ota.type,
            status=ota.status,
            rolloutPercentage=ota.rollout_percentage,
            targetVehicles=ota.target_vehicles,
            verificationArtifactId=ota.verification_artifact_id
        )
