"""Vehicle service layer."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.vehicle_repository import VehicleRepository
from app.models.vehicle import Vehicle as VehicleModel
from app.schemas.vehicle import VehicleResponse
from app.core.exceptions import NotFoundError

class VehicleService:
    def __init__(self, session: AsyncSession):
        self.repo = VehicleRepository(session)

    async def get_all_vehicles(self) -> list[VehicleResponse]:
        vehicles = await self.repo.get_all()
        return [self._to_schema(v) for v in vehicles]

    async def get_vehicle(self, vehicle_id: str) -> VehicleResponse:
        vehicle = await self.repo.get_by_id(vehicle_id)
        if not vehicle:
            raise NotFoundError("Vehicle", vehicle_id)
        return self._to_schema(vehicle)

    def _to_schema(self, vehicle: VehicleModel) -> VehicleResponse:
        return VehicleResponse(
            id=vehicle.id,
            model=vehicle.model,
            softwareVersion=vehicle.software_version,
            assuranceState=vehicle.assurance_state,
            envelopeMargin=vehicle.envelope_margin,
            dominantConstraint=vehicle.dominant_constraint,
            context=vehicle.context or {},
            currentTelemetry=vehicle.current_telemetry or {},
            margins=vehicle.margins or [],
            prediction=vehicle.prediction,
            activeMitigation=vehicle.active_mitigation
        )
