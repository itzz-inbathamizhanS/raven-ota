"""Deterministic Simulator Service."""

import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session_factory
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.telemetry_repository import TelemetryRepository
from app.services.assurance_service import AssuranceService
from app.models.telemetry import TelemetrySample
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class SimulatorService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimulatorService, cls).__new__(cls)
            cls._instance.is_running = False
            cls._instance.task = None
            cls._instance.scenario_id = "SCEN-01"
        return cls._instance

    async def start(self, scenario_id: str = "SCEN-01"):
        if self.is_running:
            return
        self.scenario_id = scenario_id
        self.is_running = True
        self.task = asyncio.create_task(self._simulation_loop())
        logger.info("Simulator started.")

    async def stop(self):
        if not self.is_running:
            return
        self.is_running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        logger.info("Simulator stopped.")

    async def _simulation_loop(self):
        while self.is_running:
            try:
                await self._tick()
                await asyncio.sleep(2.0)  # Tick every 2 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Simulator error: {e}")
                await asyncio.sleep(2.0)

    async def _tick(self):
        async with async_session_factory() as session:
            v_repo = VehicleRepository(session)
            t_repo = TelemetryRepository(session)
            a_service = AssuranceService(session)
            
            vehicles = await v_repo.get_all()
            for v in vehicles:
                # Deterministic scenario profiles make each run reproducible.
                old_cpu = v.current_telemetry.get("cpuUtilization", 50.0)
                deltas = {
                    "SCEN-01": 0.0,
                    "SCEN-02": 4.0,
                    "SCEN-03": 2.0,
                    "SCEN-04": 1.5,
                    "SCEN-05": 2.5,
                    "SCEN-06": 5.0,
                    "SCEN-07": 6.0,
                    "SCEN-08": -1.0,
                    "SCEN-09": 8.0,
                    "SCEN-10": 3.0,
                }
                delta = deltas.get(self.scenario_id, 0.0)
                if v.active_mitigation in ["REDUCE_NON_CRITICAL_WORKLOAD", "ISOLATE_FUNCTION"]:
                    delta = min(delta, -2.0)
                new_cpu = max(20.0, min(100.0, old_cpu + delta))
                
                # Update current telemetry
                current_telemetry = dict(v.current_telemetry)
                current_telemetry["cpuUtilization"] = round(new_cpu, 1)
                current_telemetry["timestamp"] = datetime.now(timezone.utc).isoformat()
                v.current_telemetry = current_telemetry
                
                # Save to history
                sample = TelemetrySample(
                    id=f"TEL-{v.id}-{datetime.now().timestamp()}",
                    vehicle_id=v.id,
                    cpu_utilization=new_cpu,
                    can_bus_load=current_telemetry.get("canBusLoad", 50.0),
                    task_jitter=current_telemetry.get("taskJitter", 1.0),
                    ecu_temp=current_telemetry.get("ecuTemp", 50.0)
                )
                await t_repo.create(sample)
                
                # Run the same assurance workflow used by the public API.
                from app.api.routes.assurance import evaluate_margins
                await evaluate_margins(v.id, session)
            
            await session.commit()
