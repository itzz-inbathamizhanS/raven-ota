"""Incidents API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.incident_repository import IncidentRepository
from app.schemas.incident import IncidentResponse
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=list[IncidentResponse])
async def get_all_incidents(db: AsyncSession = Depends(get_db)):
    repo = IncidentRepository(db)
    incidents = await repo.get_all()
    return [
        IncidentResponse(
            id=i.id,
            vehicleId=i.vehicle_id,
            timestamp=i.timestamp.isoformat(),
            severity=i.severity,
            description=i.description,
            mitigationApplied=i.mitigation_applied,
            evidencePayload=i.evidence_payload
        ) for i in incidents
    ]

@router.get("/{vehicle_id}", response_model=list[IncidentResponse])
async def get_vehicle_incidents(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    repo = IncidentRepository(db)
    incidents = await repo.get_by_vehicle_id(vehicle_id)
    return [
        IncidentResponse(
            id=i.id,
            vehicleId=i.vehicle_id,
            timestamp=i.timestamp.isoformat(),
            severity=i.severity,
            description=i.description,
            mitigationApplied=i.mitigation_applied,
            evidencePayload=i.evidence_payload
        ) for i in incidents
    ]
