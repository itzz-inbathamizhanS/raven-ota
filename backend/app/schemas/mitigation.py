"""Mitigation schema."""

from pydantic import BaseModel
from typing import Literal

ResponseAction = Literal[
    "CONTINUE",
    "MONITOR",
    "REDUCE_NON_CRITICAL_WORKLOAD",
    "ISOLATE_FUNCTION",
    "ENTER_DEGRADED_MODE",
    "DELAY_OTA",
    "ROLLBACK",
]

class MitigationResponse(BaseModel):
    vehicleId: str
    recommendedAction: ResponseAction
    reason: str
