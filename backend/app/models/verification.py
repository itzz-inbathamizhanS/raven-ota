"""VerificationArtifact SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class VerificationArtifact(Base):
    __tablename__ = "verification_artifacts"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    ota_id: Mapped[str] = mapped_column(String, index=True)
    hash_digest: Mapped[str] = mapped_column(String)
    signature_validity: Mapped[bool] = mapped_column(Boolean)
    asil_level: Mapped[str] = mapped_column(String)
    formal_invariant: Mapped[str] = mapped_column(String)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
