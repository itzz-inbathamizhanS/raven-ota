"""Prediction API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.telemetry_repository import TelemetryRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.envelope_repository import EnvelopeRepository
from app.repositories.ota_repository import OTARepository
from app.algorithms.trend_predictor import TrendPredictor
from app.schemas.vehicle import Prediction
from app.core.exceptions import NotFoundError
import time

router = APIRouter(prefix="/prediction", tags=["prediction"])

@router.get("/{vehicle_id}", response_model=Prediction)
async def get_prediction(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    v_repo = VehicleRepository(db)
    vehicle = await v_repo.get_by_id(vehicle_id)
    if not vehicle:
        raise NotFoundError("Vehicle", vehicle_id)
        
    t_repo = TelemetryRepository(db)
    # Get last 10 samples
    samples = await t_repo.get_by_vehicle_id(vehicle_id, limit=10)
    
    # Sort chronological
    samples.sort(key=lambda s: s.timestamp)
    
    if len(samples) < 3:
        # Not enough data for real prediction, return whatever is in vehicle or None
        if vehicle.prediction:
            return vehicle.prediction
        raise NotFoundError("Prediction", vehicle_id)
        
    history = [
        {"timestamp": s.timestamp.timestamp(), "value": s.cpu_utilization}
        for s in samples
    ]
    
    ota = await OTARepository(db).get_for_software_version(vehicle.software_version)
    envelope = await EnvelopeRepository(db).get_by_artifact_ref(ota.verification_artifact_id) if ota else None
    if not envelope:
        raise NotFoundError("SafetyEnvelope for vehicle", vehicle_id)
    limit = envelope.max_cpu_utilization
    
    pred_dict = TrendPredictor.predict(history, samples[-1].cpu_utilization, limit, "CPU")
    
    if not pred_dict:
        if vehicle.prediction:
            return vehicle.prediction
        raise NotFoundError("Prediction", vehicle_id)
        
    # Update vehicle with latest prediction
    vehicle.prediction = pred_dict
    
    return pred_dict
