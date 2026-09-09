"""AssuranceDecision SQLAlchemy model."""

from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class AssuranceDecision(Base):
    __tablename__ = "assurance_decisions"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    vehicle_id: Mapped[str] = mapped_column(String, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    previous_state: Mapped[str] = mapped_column(String)
    new_state: Mapped[str] = mapped_column(String)
    dominant_constraint: Mapped[str] = mapped_column(String)
    margin: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(String)
    context: Mapped[dict] = mapped_column(JSON)
    prediction_reference: Mapped[str | None] = mapped_column(String, nullable=True)
