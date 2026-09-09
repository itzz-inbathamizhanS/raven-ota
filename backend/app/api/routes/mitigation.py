"""Mitigation API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.vehicle_repository import VehicleRepository
from app.algorithms.response_orchestrator import ResponseOrchestrator
from app.schemas.mitigation import MitigationResponse
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/mitigation", tags=["mitigation"])

@router.post("/{vehicle_id}", response_model=MitigationResponse)
async def trigger_mitigation(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    """Evaluate and trigger a mitigation response for the vehicle."""
    v_repo = VehicleRepository(db)
    vehicle = await v_repo.get_by_id(vehicle_id)
    if not vehicle:
        raise NotFoundError("Vehicle", vehicle_id)
        
    action = ResponseOrchestrator.determine_action(
        assurance_state=vehicle.assurance_state,
        dominant_constraint=vehicle.dominant_constraint or "Unknown",
        margin=vehicle.envelope_margin,
        prediction=vehicle.prediction
    )
    
    vehicle.active_mitigation = action
    
    return MitigationResponse(
        vehicleId=vehicle_id,
        recommendedAction=action,
        reason=f"Action chosen due to state={vehicle.assurance_state}, margin={vehicle.envelope_margin}"
    )
