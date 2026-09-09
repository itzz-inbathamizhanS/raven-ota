"""Incidents API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.incident_repository import IncidentRepository
from app.schemas.incident import IncidentResponse
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/incidents", tags=["incidents"])


def to_response(incident) -> IncidentResponse:
    evidence = incident.evidence_payload or {}
    return IncidentResponse(
        id=incident.id,
        vehicleId=incident.vehicle_id,
        timestamp=incident.timestamp.isoformat(),
        severity=incident.severity,
        otaVersion=evidence.get("otaVersion"),
        constraintViolated=incident.description,
        mitigationAction=incident.mitigation_applied,
        resolved=bool(evidence.get("resolved", False)),
    )

@router.get("", response_model=list[IncidentResponse])
async def get_all_incidents(db: AsyncSession = Depends(get_db)):
    repo = IncidentRepository(db)
    incidents = await repo.get_all()
    return [to_response(incident) for incident in incidents]

@router.get("/{vehicle_id}", response_model=list[IncidentResponse])
async def get_vehicle_incidents(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    repo = IncidentRepository(db)
    incidents = await repo.get_by_vehicle_id(vehicle_id)
    return [to_response(incident) for incident in incidents]
