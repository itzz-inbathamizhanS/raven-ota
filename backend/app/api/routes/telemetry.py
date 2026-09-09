"""Telemetry API routes."""

from fastapi import APIRouter, Depends
from pydantic import Field
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.telemetry_repository import TelemetryRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import TelemetrySample
from app.core.exceptions import NotFoundError, ValidationError

router = APIRouter(prefix="/telemetry", tags=["telemetry"])

# We define the POST body to accept the telemetry fields
class TelemetryCreate(TelemetrySample):
    vehicleId: str | None = Field(default=None)

@router.post("")
async def create_telemetry(
    payload: TelemetryCreate,
    vehicle_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Persist a sample and make it the vehicle's latest evaluable telemetry."""
    resolved_vehicle_id = vehicle_id or payload.vehicleId
    if not resolved_vehicle_id:
        raise ValidationError("vehicle_id query parameter or vehicleId payload field is required")

    vehicle = await VehicleRepository(db).get_by_id(resolved_vehicle_id)
    if not vehicle:
        raise NotFoundError("Vehicle", resolved_vehicle_id)

    from app.models.telemetry import TelemetrySample as TelemetryModel
    
    repo = TelemetryRepository(db)
    new_sample = TelemetryModel(
        id=f"TEL-{uuid4()}",
        vehicle_id=resolved_vehicle_id,
        cpu_utilization=payload.cpuUtilization,
        can_bus_load=payload.canBusLoad,
        task_jitter=payload.taskJitter,
        ecu_temp=payload.ecuTemp
    )
    await repo.create(new_sample)
    vehicle.current_telemetry = {
        "timestamp": payload.timestamp,
        "cpuUtilization": payload.cpuUtilization,
        "canBusLoad": payload.canBusLoad,
        "taskJitter": payload.taskJitter,
        "ecuTemp": payload.ecuTemp,
    }
    
    return {"status": "success", "id": new_sample.id}

@router.get("/{vehicle_id}", response_model=list[TelemetrySample])
async def get_telemetry(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    repo = TelemetryRepository(db)
    samples = await repo.get_by_vehicle_id(vehicle_id)
    return [
        TelemetrySample(
            timestamp=s.timestamp.isoformat(),
            cpuUtilization=s.cpu_utilization,
            canBusLoad=s.can_bus_load,
            taskJitter=s.task_jitter,
            ecuTemp=s.ecu_temp
        ) for s in samples
    ]
