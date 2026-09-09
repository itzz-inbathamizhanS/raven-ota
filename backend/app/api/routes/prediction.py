"""Prediction API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.telemetry_repository import TelemetryRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.envelope_repository import EnvelopeRepository
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
    
    env_repo = EnvelopeRepository(db)
    # Hardcode ENV-8821 for demonstration, or retrieve from vehicle mapping
    envelope = await env_repo.get_by_id("ENV-8821")
    limit = envelope.max_cpu_utilization if envelope else 85.0
    
    pred_dict = TrendPredictor.predict(history, samples[-1].cpu_utilization, limit, "CPU")
    
    if not pred_dict:
        if vehicle.prediction:
            return vehicle.prediction
        raise NotFoundError("Prediction", vehicle_id)
        
    # Update vehicle with latest prediction
    vehicle.prediction = pred_dict
    
    return pred_dict
