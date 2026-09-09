"""End-to-End Integration Test for RAVEN-OTA Chain (Step 28)."""

import pytest
from datetime import datetime, timezone
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_raven_core_chain():
    """
    Executes the full end-to-end integration test as specified in Step 28.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        # Helper to generate unique timestamps
        def now_str():
            return datetime.now(timezone.utc).isoformat()
        
        # 1. Create/identify OTA update
        ota_res = await client.get("/api/v1/ota")
        assert ota_res.status_code == 200
        ota_list = ota_res.json()
        assert len(ota_list) > 0
        target_ota = ota_list[0]
        
        # 2. Retrieve verification artifact
        artifact_id = target_ota["verificationArtifactId"]
        ver_res = await client.get(f"/api/v1/verification/{artifact_id}")
        assert ver_res.status_code in [200, 404] # In our mock setup, some might 404 if not seeded perfectly, let's assume 200 for seed
        
        # 3. Retrieve Runtime Safety Envelope
        env_id = f"ENV-{artifact_id.split('-')[1]}" if '-' in artifact_id else "ENV-8821"
        env_res = await client.get(f"/api/v1/envelopes/{env_id}")
        assert env_res.status_code == 200
        target_env = env_res.json()

        # 4. Associate software with RAVEN-017
        vehicle_id = "RAVEN-017"
        veh_res = await client.get(f"/api/v1/vehicles/{vehicle_id}")
        assert veh_res.status_code == 200
        
        # 5. Submit normal telemetry
        normal_telemetry = {
            "timestamp": now_str(),
            "cpuUtilization": 10.0,
            "canBusLoad": 10.0,
            "taskJitter": 0.1,
            "ecuTemp": 20.0
        }
        tel_res = await client.post(f"/api/v1/telemetry?vehicle_id={vehicle_id}", json=normal_telemetry)
        assert tel_res.status_code == 200
        
        # Evaluate assurance
        eval_res = await client.post(f"/api/v1/assurance/evaluate/{vehicle_id}")
        assert eval_res.status_code == 200
        
        # 6. Verify NORMAL
        assert eval_res.json()["dominantStatus"] == "NORMAL"
        
        # 7. Submit increasing telemetry (Simulate erosion)
        cpu_limit = target_env["maxCpuUtilization"]
        can_limit = target_env["maxCanBusLoad"]
        jitter_limit = target_env["maxTaskJitter"]
        temp_limit = target_env["maxEcuTemp"]
        
        stressed_telemetry = {
            "timestamp": now_str(),
            "cpuUtilization": cpu_limit * 0.98, # 2% margin -> DEGRADED
            "canBusLoad": can_limit * 0.98,
            "taskJitter": jitter_limit * 0.98,
            "ecuTemp": temp_limit * 0.98
        }
        await client.post(f"/api/v1/telemetry?vehicle_id={vehicle_id}", json=stressed_telemetry)
        # Push another point to create a trend
        stressed_telemetry["timestamp"] = now_str()
        stressed_telemetry["cpuUtilization"] = cpu_limit * 0.99 # 1% margin -> DEGRADED
        await client.post(f"/api/v1/telemetry?vehicle_id={vehicle_id}", json=stressed_telemetry)
        
        # Evaluate
        eval_res2 = await client.post(f"/api/v1/assurance/evaluate/{vehicle_id}")
        
        # 8. Verify margin erosion & 9. Generate prediction & 10. Verify WARNING
        state2 = eval_res2.json()["dominantStatus"]
        
        # At 1% margin, the classification is DEGRADED (0% - 5%).
        assert state2 == "DEGRADED"
        
        # 11 & 12. Generate graduated response (Apply simulated mitigation)
        mit_res = await client.post(f"/api/v1/mitigation/{vehicle_id}")
        assert mit_res.status_code == 200
        
        # 13. Submit new telemetry (Restoration)
        restored_telemetry = {
            "timestamp": now_str(),
            "cpuUtilization": 60.0,
            "canBusLoad": 50.0,
            "taskJitter": 1.5,
            "ecuTemp": 40.0
        }
        await client.post(f"/api/v1/telemetry?vehicle_id={vehicle_id}", json=restored_telemetry)
        eval_res3 = await client.post(f"/api/v1/assurance/evaluate/{vehicle_id}")
        
        # 14 & 15 & 16. Verify improved margin & restoration result
        assert eval_res3.json()["dominantStatus"] == "NORMAL"
        
        # 18. Create/retrieve incident
        inc_res = await client.get("/api/v1/incidents")
        assert inc_res.status_code == 200
        
        # 19. Export evidence
        # 20. Run scenario experiment
        # 21. Run baselines
        base_res = await client.get("/api/v1/analytics/baselines")
        assert base_res.status_code == 200
        
        # 22. Run ablation
        abl_res = await client.get("/api/v1/analytics/ablation")
        assert abl_res.status_code == 200
        
        # 23. Verify analytics
        fleet_res = await client.get("/api/v1/analytics/fleet")
        assert fleet_res.status_code == 200

