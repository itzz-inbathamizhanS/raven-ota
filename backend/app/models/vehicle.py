"""Vehicle SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    model: Mapped[str] = mapped_column(String)
    software_version: Mapped[str] = mapped_column(String)
    assurance_state: Mapped[str] = mapped_column(String, default="NORMAL")
    envelope_margin: Mapped[float] = mapped_column(Float, default=100.0)
    dominant_constraint: Mapped[str | None] = mapped_column(String, nullable=True)
    active_mitigation: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # Store complex JSON objects for simplicity in this prototype
    context: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    current_telemetry: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    margins: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    prediction: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
