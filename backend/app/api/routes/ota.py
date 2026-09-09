"""OTA Campaigns API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.ota_service import OTAService
from app.schemas.ota import OTAUpdateResponse

router = APIRouter(prefix="/ota", tags=["ota"])

@router.get("", response_model=list[OTAUpdateResponse])
async def get_ota_campaigns(db: AsyncSession = Depends(get_db)):
    service = OTAService(db)
    return await service.get_all_campaigns()

@router.get("/{ota_id}", response_model=OTAUpdateResponse)
async def get_ota_campaign(ota_id: str, db: AsyncSession = Depends(get_db)):
    service = OTAService(db)
    return await service.get_campaign(ota_id)
