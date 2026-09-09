"""Analytics API routes (Baselines, Ablation, Fleet, Evidence)."""

from fastapi import APIRouter
from pydantic import BaseModel

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
async def get_baselines():
    # Return mock baseline data that frontend expects
    return [
        {"timestamp": "00:00", "cpu": 45, "memory": 55, "latency": 12, "boundary": 85},
        {"timestamp": "00:05", "cpu": 52, "memory": 58, "latency": 14, "boundary": 85},
        {"timestamp": "00:10", "cpu": 48, "memory": 54, "latency": 11, "boundary": 85},
        {"timestamp": "00:15", "cpu": 60, "memory": 62, "latency": 18, "boundary": 85},
        {"timestamp": "00:20", "cpu": 65, "memory": 65, "latency": 22, "boundary": 85},
        {"timestamp": "00:25", "cpu": 58, "memory": 60, "latency": 15, "boundary": 85},
        {"timestamp": "00:30", "cpu": 50, "memory": 55, "latency": 12, "boundary": 85},
    ]

@router.get("/ablation", response_model=list[AblationResult])
async def get_ablation_studies():
    return [
        {"id": "ABL-01", "componentRemoved": "Formal Verification Pre-Check", "impactOnSafety": "Critical (3 unhandled edge cases)", "performanceDelta": "+15% Deploy Speed", "verdict": "Unsafe"},
        {"id": "ABL-02", "componentRemoved": "Margin Engine (CPU)", "impactOnSafety": "High (Task starvation observed)", "performanceDelta": "+5% Throughput", "verdict": "Unsafe"},
        {"id": "ABL-03", "componentRemoved": "Predictive Degradation", "impactOnSafety": "Medium (Delayed mitigation)", "performanceDelta": "-2% Overhead", "verdict": "Degraded"},
        {"id": "ABL-04", "componentRemoved": "Context-Aware Workload Orchestrator", "impactOnSafety": "Medium (Suboptimal QoS)", "performanceDelta": "-5% Overhead", "verdict": "Degraded"},
    ]

@router.get("/fleet")
async def get_fleet_summary():
    return {
        "totalVehicles": 15420,
        "normal": 14200,
        "warning": 850,
        "degraded": 350,
        "unsafe": 20
    }

@router.get("/evidence/{incident_id}")
async def get_evidence_chain(incident_id: str):
    return {
        "incidentId": incident_id,
        "cryptographicHash": "a3b4c9e7f...82d1",
        "timestamp": "2026-09-09T18:15:00Z",
        "telemetrySnapshot": {"cpu": 95.2, "can": 88.1, "jitter": 3.2},
        "formalContract": "ENV-8821",
        "signatureValid": True
    }
