"""Telemetry and Assurance schema."""

from pydantic import BaseModel
from typing import Literal

AssuranceState = Literal["NORMAL", "WARNING", "DEGRADED", "UNSAFE"]

class MarginEvaluationRequest(BaseModel):
    # This might take telemetry directly if evaluating a live stream
    # or it might just trigger an evaluation of the latest telemetry
    pass

class SafetyMarginResponse(BaseModel):
    metric: str
    value: float
    threshold: float
    marginPercent: float
    status: AssuranceState

class AssuranceEvaluationResponse(BaseModel):
    vehicleId: str
    margins: list[SafetyMarginResponse]
    dominantStatus: AssuranceState
