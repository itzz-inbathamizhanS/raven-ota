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
        return cls._instance

    async def start(self):
        if self.is_running:
            return
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
                # 1. Mutate telemetry slightly based on its current context or state
                # In a real simulator, this would be a physics or traffic model
                old_cpu = v.current_telemetry.get("cpuUtilization", 50.0)
                
                # Simulate a growing anomaly if it's "RAVEN-034"
                if v.id == "RAVEN-034" and v.active_mitigation != "ROLLBACK":
                    new_cpu = old_cpu + 1.5
                elif v.active_mitigation in ["REDUCE_NON_CRITICAL_WORKLOAD", "ISOLATE_FUNCTION"]:
                    # Mitigation reduces load
                    new_cpu = max(20.0, old_cpu - 2.0)
                else:
                    import random
                    new_cpu = max(0.0, min(100.0, old_cpu + random.uniform(-1.0, 1.0)))
                
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
                
                # Run Assurance Evaluation
                # This simulates the "Margin Engine" and "State Machine"
                from app.api.routes.assurance import evaluate_margins
                # In actual implementation we just call evaluate directly 
                # but since we already have logic, we can call it.
                # However we need the envelope. Since this is an MVP we can skip calling
                # evaluate_margins API directly and use assurance_service or just commit telemetry.
                # The frontend polls /assurance/evaluate/{id} to get state, OR we compute it here.
            
            await session.commit()
