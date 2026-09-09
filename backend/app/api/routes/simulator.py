"""Simulator API routes."""

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.simulator import SimulatorService
from app.core.exceptions import ValidationError

router = APIRouter(prefix="/simulator", tags=["simulator"])

SCENARIOS = [
    {"id": "SCEN-01", "name": "Normal Operation", "description": "Nominal highway workload.", "category": "Nominal"},
    {"id": "SCEN-02", "name": "CPU Contention", "description": "ADAS workload contention.", "category": "Stress"},
    {"id": "SCEN-03", "name": "Network Congestion", "description": "Elevated communications load.", "category": "Stress"},
    {"id": "SCEN-04", "name": "Timing Degradation", "description": "Progressive timing pressure.", "category": "Anomaly"},
    {"id": "SCEN-05", "name": "Thermal Stress", "description": "Thermal workload pressure.", "category": "Stress"},
    {"id": "SCEN-06", "name": "ADAS Workload Surge", "description": "Dense urban perception surge.", "category": "Stress"},
    {"id": "SCEN-07", "name": "Combined Stress", "description": "Combined workload pressure.", "category": "Stress"},
    {"id": "SCEN-08", "name": "Benign Anomaly", "description": "Self-correcting sample variation.", "category": "Anomaly"},
    {"id": "SCEN-09", "name": "Persistent Critical", "description": "Sustained critical pressure.", "category": "Anomaly"},
    {"id": "SCEN-10", "name": "Campaign-Wide Pattern", "description": "Fleet-wide pressure pattern.", "category": "Anomaly"},
]

class SimulatorStartRequest(BaseModel):
    scenarioId: str = "SCEN-01"

@router.get("/scenarios")
async def get_scenarios():
    return SCENARIOS

@router.post("/start")
async def start_simulator(payload: SimulatorStartRequest = SimulatorStartRequest()):
    sim = SimulatorService()
    if payload.scenarioId not in {scenario["id"] for scenario in SCENARIOS}:
        raise ValidationError(f"Unknown scenario '{payload.scenarioId}'")
    await sim.start(payload.scenarioId)
    return {"status": "started", "scenarioId": payload.scenarioId}

@router.post("/stop")
async def stop_simulator():
    sim = SimulatorService()
    await sim.stop()
    return {"status": "stopped"}

@router.get("/status")
async def get_simulator_status():
    sim = SimulatorService()
    return {"isRunning": sim.is_running}
