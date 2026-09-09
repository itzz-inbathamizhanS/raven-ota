"""Telemetry SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class TelemetrySample(Base):
    __tablename__ = "telemetry_samples"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    vehicle_id: Mapped[str] = mapped_column(String, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    cpu_utilization: Mapped[float] = mapped_column(Float)
    can_bus_load: Mapped[float] = mapped_column(Float)
    task_jitter: Mapped[float] = mapped_column(Float)
    ecu_temp: Mapped[float] = mapped_column(Float)
