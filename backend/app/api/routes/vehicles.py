"""Vehicles API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.vehicle_service import VehicleService
from app.schemas.vehicle import VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get("", response_model=list[VehicleResponse])
async def get_vehicles(db: AsyncSession = Depends(get_db)):
    service = VehicleService(db)
    return await service.get_all_vehicles()

@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    service = VehicleService(db)
    return await service.get_vehicle(vehicle_id)
