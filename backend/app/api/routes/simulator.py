"""Simulator API routes."""

from fastapi import APIRouter
from app.services.simulator import SimulatorService

router = APIRouter(prefix="/simulator", tags=["simulator"])

@router.post("/start")
async def start_simulator():
    sim = SimulatorService()
    await sim.start()
    return {"status": "started"}

@router.post("/stop")
async def stop_simulator():
    sim = SimulatorService()
    await sim.stop()
    return {"status": "stopped"}

@router.get("/status")
async def get_simulator_status():
    sim = SimulatorService()
    return {"isRunning": sim.is_running}
