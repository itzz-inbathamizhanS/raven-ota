"""Incident SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    vehicle_id: Mapped[str] = mapped_column(String, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    severity: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    mitigation_applied: Mapped[str | None] = mapped_column(String, nullable=True)
    evidence_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
