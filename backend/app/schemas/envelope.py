"""SafetyEnvelope Pydantic schemas."""

from pydantic import BaseModel

class SafetyEnvelopeResponse(BaseModel):
    id: str
    artifactRef: str
    maxCpuUtilization: float
    maxCanBusLoad: float
    maxTaskJitter: float
    maxEcuTemp: float
    temporalBoundaries: dict[str, float]
