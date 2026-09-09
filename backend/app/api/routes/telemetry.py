"""Telemetry API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.telemetry_repository import TelemetryRepository
from app.schemas.vehicle import TelemetrySample

router = APIRouter(prefix="/telemetry", tags=["telemetry"])

# We define the POST body to accept the telemetry fields
class TelemetryCreate(TelemetrySample):
    pass

@router.post("")
async def create_telemetry(vehicle_id: str, payload: TelemetryCreate, db: AsyncSession = Depends(get_db)):
    """In a real system, the vehicle_id would be part of the auth token or payload."""
    from app.models.telemetry import TelemetrySample as TelemetryModel
    
    repo = TelemetryRepository(db)
    new_sample = TelemetryModel(
        id=f"TEL-{payload.timestamp}",
        vehicle_id=vehicle_id,
        cpu_utilization=payload.cpuUtilization,
        can_bus_load=payload.canBusLoad,
        task_jitter=payload.taskJitter,
        ecu_temp=payload.ecuTemp
    )
    await repo.create(new_sample)
    
    # Also update the vehicle's current_telemetry
    from app.repositories.vehicle_repository import VehicleRepository
    v_repo = VehicleRepository(db)
    vehicle = await v_repo.get_by_id(vehicle_id)
    if vehicle:
        vehicle.current_telemetry = payload.model_dump()
        await db.commit()
    
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
