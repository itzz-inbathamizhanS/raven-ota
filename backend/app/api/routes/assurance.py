"""Assurance Margin API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.assurance import AssuranceEvaluationResponse
from app.algorithms.margin_engine import MarginEngine

# We will need the vehicle and envelope to calculate margins
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.envelope_repository import EnvelopeRepository
from app.repositories.ota_repository import OTARepository
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/assurance", tags=["assurance"])

@router.post("/evaluate/{vehicle_id}", response_model=AssuranceEvaluationResponse)
async def evaluate_margins(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    """Evaluate current telemetry against the safety envelope."""
    v_repo = VehicleRepository(db)
    vehicle = await v_repo.get_by_id(vehicle_id)
    
    if not vehicle:
        raise NotFoundError("Vehicle", vehicle_id)
        
    if not vehicle.current_telemetry:
        return AssuranceEvaluationResponse(vehicleId=vehicle_id, margins=[], dominantStatus="NORMAL")
        
    # Find active OTA for this vehicle
    # In a full system, vehicle -> OTA -> Envelope mapping is stored in the DB.
    # We will use the seeded OTA / Envelope for demonstration
    env_repo = EnvelopeRepository(db)
    # The default envelope seeded is ENV-8821
    envelope = await env_repo.get_by_id("ENV-8821")
    if not envelope:
        raise NotFoundError("SafetyEnvelope", "ENV-8821")
        
    env_dict = {
        "maxCpuUtilization": envelope.max_cpu_utilization,
        "maxCanBusLoad": envelope.max_can_bus_load,
        "maxTaskJitter": envelope.max_task_jitter,
        "maxEcuTemp": envelope.max_ecu_temp
    }
    
    margins = MarginEngine.evaluate(vehicle.current_telemetry, env_dict)
    
    # Save the margins back to the vehicle model
    vehicle.margins = margins
    
    # Determine dominant status (worst status among all constraints)
    status_priority = {"NORMAL": 0, "WARNING": 1, "DEGRADED": 2, "UNSAFE": 3}
    dominant_status = "NORMAL"
    for m in margins:
        if status_priority[m["status"]] > status_priority[dominant_status]:
            dominant_status = m["status"]
            
    vehicle.assurance_state = dominant_status
    
    return AssuranceEvaluationResponse(
        vehicleId=vehicle_id,
        margins=margins,
        dominantStatus=dominant_status
    )
