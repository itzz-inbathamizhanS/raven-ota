"""Vehicle-related Pydantic schemas."""

from pydantic import BaseModel, Field
from typing import Literal

AssuranceState = Literal["NORMAL", "WARNING", "DEGRADED", "UNSAFE"]
ResponseAction = Literal[
    "CONTINUE",
    "MONITOR",
    "REDUCE_NON_CRITICAL_WORKLOAD",
    "ISOLATE_FUNCTION",
    "ENTER_DEGRADED_MODE",
    "DELAY_OTA",
    "ROLLBACK",
]

class VehicleContext(BaseModel):
    dominantWorkload: str
    environmentalCondition: str
    roadType: str

class TelemetrySample(BaseModel):
    timestamp: str
    cpuUtilization: float
    canBusLoad: float
    taskJitter: float
    ecuTemp: float

class SafetyMargin(BaseModel):
    metric: str
    value: float
    threshold: float
    marginPercent: float
    status: AssuranceState

class Prediction(BaseModel):
    timeToBoundarySeconds: float
    confidence: float
    predictedConstraint: str

class VehicleResponse(BaseModel):
    id: str
    model: str
    softwareVersion: str
    assuranceState: AssuranceState
    envelopeMargin: float
    dominantConstraint: str | None
    context: VehicleContext
    currentTelemetry: TelemetrySample
    margins: list[SafetyMargin]
    prediction: Prediction | None
    activeMitigation: ResponseAction | None
