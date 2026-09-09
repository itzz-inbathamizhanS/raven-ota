"""Analytics API routes (Baselines, Ablation, Fleet, Evidence)."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.incident_repository import IncidentRepository
from app.core.exceptions import NotFoundError
import hashlib
import json

router = APIRouter(prefix="/analytics", tags=["analytics"])

class BaselineData(BaseModel):
    timestamp: str
    cpu: float
    memory: float
    latency: float
    boundary: float

class AblationResult(BaseModel):
    id: str
    componentRemoved: str
    impactOnSafety: str
    performanceDelta: str
    verdict: str

@router.get("/baselines", response_model=list[BaselineData])
async def get_baselines(db: AsyncSession = Depends(get_db)):
    """Return live fleet telemetry in the chart shape used by the dashboard."""
    vehicles = await VehicleRepository(db).get_all()
    return [
        {
            "timestamp": vehicle.id,
            "cpu": vehicle.current_telemetry.get("cpuUtilization", 0),
            "memory": 0,
            "latency": vehicle.current_telemetry.get("taskJitter", 0),
            "boundary": next((margin["threshold"] for margin in (vehicle.margins or []) if margin["metric"] == "CPU Core Load"), 0),
        }
        for vehicle in vehicles
    ]

@router.get("/ablation", response_model=list[AblationResult])
async def get_ablation_studies(db: AsyncSession = Depends(get_db)):
    vehicles = await VehicleRepository(db).get_all()
    elevated = sum(vehicle.assurance_state in {"DEGRADED", "UNSAFE"} for vehicle in vehicles)
    verdict = "Unsafe" if elevated else "Normal"
    return [
        {"id": "ABL-01", "componentRemoved": "Margin Engine", "impactOnSafety": f"{elevated} elevated vehicle(s) would be unclassified", "performanceDelta": "0%", "verdict": verdict},
        {"id": "ABL-02", "componentRemoved": "Prediction", "impactOnSafety": "No proactive boundary estimate", "performanceDelta": "0%", "verdict": "Degraded"},
    ]

@router.get("/fleet")
async def get_fleet_summary(db: AsyncSession = Depends(get_db)):
    vehicles = await VehicleRepository(db).get_all()
    counts = {"NORMAL": 0, "WARNING": 0, "DEGRADED": 0, "UNSAFE": 0}
    for vehicle in vehicles:
        counts[vehicle.assurance_state] = counts.get(vehicle.assurance_state, 0) + 1
    return {"totalVehicles": len(vehicles), **{key.lower(): value for key, value in counts.items()}}

@router.get("/evidence/{incident_id}")
async def get_evidence_chain(incident_id: str, db: AsyncSession = Depends(get_db)):
    incident = await IncidentRepository(db).get_by_id(incident_id)
    if not incident:
        raise NotFoundError("Incident", incident_id)
    evidence = incident.evidence_payload or {}
    record = {
        "incidentId": incident.id,
        "vehicleId": incident.vehicle_id,
        "timestamp": incident.timestamp.isoformat(),
        "severity": incident.severity,
        "constraint": incident.description,
        "mitigation": incident.mitigation_applied,
        "otaVersion": evidence.get("otaVersion"),
        "margins": evidence.get("margins", []),
        "prediction": evidence.get("prediction"),
    }
    record["cryptographicHash"] = hashlib.sha256(
        json.dumps(record, sort_keys=True, default=str, separators=(",", ":")).encode()
    ).hexdigest()
    return record
