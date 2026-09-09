"""SafetyEnvelope SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class SafetyEnvelope(Base):
    __tablename__ = "safety_envelopes"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    artifact_ref: Mapped[str] = mapped_column(String, index=True)
    max_cpu_utilization: Mapped[float] = mapped_column(Float)
    max_can_bus_load: Mapped[float] = mapped_column(Float)
    max_task_jitter: Mapped[float] = mapped_column(Float)
    max_ecu_temp: Mapped[float] = mapped_column(Float)
    temporal_boundaries: Mapped[dict] = mapped_column(JSON)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
