"""Context SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class VehicleContext(Base):
    __tablename__ = "vehicle_contexts"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    vehicle_id: Mapped[str] = mapped_column(String, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    dominant_workload: Mapped[str] = mapped_column(String)
    environmental_condition: Mapped[str] = mapped_column(String)
    road_type: Mapped[str] = mapped_column(String)
