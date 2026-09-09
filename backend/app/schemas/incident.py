"""Incident schema."""

from pydantic import BaseModel
from app.schemas.mitigation import ResponseAction

class IncidentResponse(BaseModel):
    id: str
    vehicleId: str
    timestamp: str
    severity: str
    otaVersion: str | None
    constraintViolated: str
    mitigationAction: ResponseAction | None
    resolved: bool
