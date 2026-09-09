"""OTA-related Pydantic schemas."""

from pydantic import BaseModel
from typing import Literal

OTAStatus = Literal["DRAFT", "VERIFYING", "VERIFIED", "ROLLING_OUT", "COMPLETED", "HALTED"]

class OTAUpdateResponse(BaseModel):
    id: str
    version: str
    releaseDate: str
    type: str
    status: OTAStatus
    rolloutPercentage: float
    targetVehicles: int
    verificationArtifactId: str
