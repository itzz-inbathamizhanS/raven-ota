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
from app.repositories.telemetry_repository import TelemetryRepository
from app.services.assurance_service import AssuranceService
from app.algorithms.trend_predictor import TrendPredictor
from app.algorithms.response_orchestrator import ResponseOrchestrator
from app.models.incident import Incident
from app.core.exceptions import NotFoundError
from uuid import uuid4

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
        
    # Resolve the envelope from the OTA campaign that supplied this software build.
    ota = await OTARepository(db).get_for_software_version(vehicle.software_version)
    if not ota:
        raise NotFoundError("OTA update for vehicle software", vehicle.software_version)

    env_repo = EnvelopeRepository(db)
    envelope = await env_repo.get_by_artifact_ref(ota.verification_artifact_id)
    if not envelope:
        raise NotFoundError("SafetyEnvelope for verification artifact", ota.verification_artifact_id)
        
    env_dict = {
        "maxCpuUtilization": envelope.max_cpu_utilization,
        "maxCanBusLoad": envelope.max_can_bus_load,
        "maxTaskJitter": envelope.max_task_jitter,
        "maxEcuTemp": envelope.max_ecu_temp
    }
    
    margins = MarginEngine.evaluate(vehicle.current_telemetry, env_dict)
    
    # Save the margins back to the vehicle model
    vehicle.margins = margins
    worst_margin = min(margins, key=lambda margin: margin["marginPercent"])
    vehicle.envelope_margin = worst_margin["marginPercent"]
    vehicle.dominant_constraint = worst_margin["metric"]

    samples = await TelemetryRepository(db).get_by_vehicle_id(vehicle_id, limit=10)
    samples.sort(key=lambda sample: sample.timestamp)
    prediction = None
    if len(samples) >= 3:
        history = [
            {"timestamp": sample.timestamp.timestamp(), "value": sample.cpu_utilization}
            for sample in samples
        ]
        prediction = TrendPredictor.predict(
            history, samples[-1].cpu_utilization, envelope.max_cpu_utilization, "CPU Core Load"
        )
        vehicle.prediction = prediction

    previous_state = vehicle.assurance_state
    decision = await AssuranceService(db).process_assurance(vehicle_id)
    dominant_status = decision.new_state if decision else previous_state
    action = ResponseOrchestrator.determine_action(
        dominant_status, vehicle.dominant_constraint, vehicle.envelope_margin, prediction
    )
    vehicle.active_mitigation = action

    if dominant_status in {"DEGRADED", "UNSAFE"} and dominant_status != previous_state:
        db.add(Incident(
            id=f"INC-{uuid4()}",
            vehicle_id=vehicle.id,
            severity=dominant_status,
            description=f"{vehicle.dominant_constraint} margin is {vehicle.envelope_margin:.1f}%",
            mitigation_applied=action,
            evidence_payload={
                "otaVersion": ota.version,
                "margins": margins,
                "prediction": prediction,
                "action": action,
                "resolved": False,
            },
        ))
    
    return AssuranceEvaluationResponse(
        vehicleId=vehicle_id,
        margins=margins,
        dominantStatus=dominant_status
    )
