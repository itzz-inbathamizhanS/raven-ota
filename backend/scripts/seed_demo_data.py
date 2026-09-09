"""Seed demo data for RAVEN-OTA."""

import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session_factory
from app.models.vehicle import Vehicle
from app.models.ota import OTAUpdate
from app.models.verification import VerificationArtifact
from app.models.envelope import SafetyEnvelope

from app.db.base import Base
from app.db.session import engine, async_session_factory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with async_session_factory() as session:
        # Seed Verification
        v_art = VerificationArtifact(
            id="VER-8821",
            ota_id="OTA-2026-041",
            hash_digest="f89d31-4891-a6ce-b892-19bc31a4",
            signature_validity=True,
            asil_level="ASIL-D",
            formal_invariant="Signature Validity & Image Hash Digest Validated against Z3 Specification"
        )
        session.add(v_art)
        
        # Seed Envelope
        env = SafetyEnvelope(
            id="ENV-8821",
            artifact_ref="VER-8821",
            max_cpu_utilization=85.0,
            max_can_bus_load=80.0,
            max_task_jitter=2.5,
            max_ecu_temp=92.0,
            temporal_boundaries={"ADAS_CORE_HPC_8": 38.5}
        )
        session.add(env)
        
        # Seed OTA
        ota = OTAUpdate(
            id="OTA-2026-041",
            version="v4.8.2",
            release_date="2026-08-15T00:00:00Z",
            type="Critical Safety / ADAS Perception",
            status="ROLLING_OUT",
            rollout_percentage=87.2,
            target_vehicles=15420,
            verification_artifact_id="VER-8821"
        )
        session.add(ota)
        
        # Seed Vehicles
        vehicles = [
            Vehicle(
                id="RAVEN-017",
                model="Prototype Sedan Alpha",
                software_version="v4.8.2-rt-patch4",
                assurance_state="WARNING",
                envelope_margin=3.0,
                dominant_constraint="CPU Contention",
                active_mitigation="REDUCE_NON_CRITICAL_WORKLOAD",
                context={
                    "dominantWorkload": "High ADAS Perception Load",
                    "environmentalCondition": "Wet Urban Merge",
                    "roadType": "Urban"
                },
                current_telemetry={
                    "timestamp": "2026-09-09T18:00:00Z",
                    "cpuUtilization": 82.0,
                    "canBusLoad": 61.4,
                    "taskJitter": 1.12,
                    "ecuTemp": 68.5
                },
                margins=[
                    {"metric": "CPU Core Load", "value": 82.0, "threshold": 85.0, "marginPercent": 3.0, "status": "WARNING"},
                    {"metric": "CAN 1 Bus Load", "value": 61.4, "threshold": 80.0, "marginPercent": 18.6, "status": "NORMAL"}
                ],
                prediction={
                    "timeToBoundarySeconds": 42,
                    "confidence": 0.994,
                    "predictedConstraint": "inv_temporal_sched_bound"
                }
            ),
            Vehicle(
                id="RAVEN-021",
                model="Validation SUV Beta",
                software_version="v4.8.2",
                assurance_state="NORMAL",
                envelope_margin=12.4,
                context={
                    "dominantWorkload": "Normal Highway Cruising",
                    "environmentalCondition": "Clear",
                    "roadType": "Highway"
                },
                current_telemetry={
                    "timestamp": "2026-09-09T18:00:00Z",
                    "cpuUtilization": 45.2,
                    "canBusLoad": 32.1,
                    "taskJitter": 0.45,
                    "ecuTemp": 52.1
                },
                margins=[
                    {"metric": "CPU Core Load", "value": 45.2, "threshold": 85.0, "marginPercent": 46.8, "status": "NORMAL"}
                ]
            ),
            Vehicle(
                id="RAVEN-009",
                model="Fleet Mule IV",
                software_version="v4.8.0",
                assurance_state="DEGRADED",
                envelope_margin=1.8,
                dominant_constraint="CAN Bus Bandwidth",
                active_mitigation="ISOLATE_FUNCTION",
                context={
                    "dominantWorkload": "High Bandwidth Logging Active",
                    "environmentalCondition": "Clear",
                    "roadType": "Test Track"
                },
                current_telemetry={
                    "timestamp": "2026-09-09T18:00:00Z",
                    "cpuUtilization": 60.1,
                    "canBusLoad": 78.2,
                    "taskJitter": 1.8,
                    "ecuTemp": 58.0
                },
                margins=[
                    {"metric": "CAN 1 Bus Load", "value": 78.2, "threshold": 80.0, "marginPercent": 1.8, "status": "DEGRADED"}
                ]
            ),
            Vehicle(
                id="RAVEN-034",
                model="Autonomous Cab Gen2",
                software_version="v4.8.2",
                assurance_state="UNSAFE",
                envelope_margin=0.0,
                dominant_constraint="Task Jitter Exceeded",
                active_mitigation="ENTER_DEGRADED_MODE",
                context={
                    "dominantWorkload": "Thermal Soak / Low Speed Urban",
                    "environmentalCondition": "Hot",
                    "roadType": "Urban"
                },
                current_telemetry={
                    "timestamp": "2026-09-09T18:00:00Z",
                    "cpuUtilization": 72.0,
                    "canBusLoad": 55.0,
                    "taskJitter": 2.8,
                    "ecuTemp": 88.5
                },
                margins=[
                    {"metric": "Task Jitter", "value": 2.8, "threshold": 2.5, "marginPercent": -12.0, "status": "UNSAFE"}
                ]
            ),
            Vehicle(
                id="RAVEN-102",
                model="High-Mileage Mule II",
                software_version="v4.7.9",
                assurance_state="NORMAL",
                envelope_margin=18.9,
                context={
                    "dominantWorkload": "Proving Ground Low Dynamics",
                    "environmentalCondition": "Clear",
                    "roadType": "Test Track"
                },
                current_telemetry={
                    "timestamp": "2026-09-09T18:00:00Z",
                    "cpuUtilization": 35.0,
                    "canBusLoad": 25.0,
                    "taskJitter": 0.2,
                    "ecuTemp": 45.0
                },
                margins=[
                    {"metric": "CPU Core Load", "value": 35.0, "threshold": 85.0, "marginPercent": 58.8, "status": "NORMAL"}
                ]
            )
        ]
        
        session.add_all(vehicles)
        await session.commit()
        logger.info("Database seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())
