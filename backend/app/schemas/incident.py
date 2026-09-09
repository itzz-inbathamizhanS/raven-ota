"""Incident schema."""

from pydantic import BaseModel

class IncidentResponse(BaseModel):
    id: str
    vehicleId: str
    timestamp: str
    severity: str
    description: str
    mitigationApplied: str | None
    evidencePayload: dict | None
