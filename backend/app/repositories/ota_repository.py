"""OTA repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.ota import OTAUpdate

class OTARepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[OTAUpdate]:
        result = await self.session.execute(select(OTAUpdate))
        return list(result.scalars().all())

    async def get_by_id(self, ota_id: str) -> OTAUpdate | None:
        result = await self.session.execute(select(OTAUpdate).where(OTAUpdate.id == ota_id))
        return result.scalars().first()

    async def create(self, ota: OTAUpdate) -> OTAUpdate:
        self.session.add(ota)
        await self.session.flush()
        return ota
