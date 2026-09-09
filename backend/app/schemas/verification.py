"""VerificationArtifact Pydantic schemas."""

from pydantic import BaseModel

class VerificationArtifactResponse(BaseModel):
    id: str
    otaId: str
    hashDigest: str
    signatureValidity: bool
    asilLevel: str
    formalInvariant: str
