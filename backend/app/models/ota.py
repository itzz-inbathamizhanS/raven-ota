"""OTAUpdate SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class OTAUpdate(Base):
    __tablename__ = "ota_updates"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    version: Mapped[str] = mapped_column(String)
    release_date: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    rollout_percentage: Mapped[float] = mapped_column(Float)
    target_vehicles: Mapped[int] = mapped_column(Integer)
    verification_artifact_id: Mapped[str] = mapped_column(String)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
