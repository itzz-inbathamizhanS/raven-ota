"""Test margin engine."""

import pytest
from app.algorithms.margin_engine import calculate_margin, classify_margin, MarginEngine

def test_margin_calculation():
    # Observed 80, limit 100 -> margin 20%
    assert calculate_margin(80, 100) == 20.0
    # Observed 85, limit 85 -> margin 0%
    assert calculate_margin(85, 85) == 0.0
    # Limit 0 -> margin 0%
    assert calculate_margin(50, 0) == 0.0
    # Observed 90, limit 80 -> margin -12.5%
    assert calculate_margin(90, 80) == -12.5

def test_margin_classification():
    assert classify_margin(20.0) == "NORMAL"
    assert classify_margin(15.1) == "NORMAL"
    assert classify_margin(15.0) == "WARNING"
    assert classify_margin(10.0) == "WARNING"
    assert classify_margin(5.0) == "DEGRADED"
    assert classify_margin(0.0) == "DEGRADED"
    assert classify_margin(-1.0) == "UNSAFE"
    assert classify_margin(-25.0) == "UNSAFE"

def test_margin_engine_evaluation():
    telemetry = {
        "cpuUtilization": 75.0,
        "canBusLoad": 78.0,
        "taskJitter": 2.6,
        "ecuTemp": 90.0
    }
    envelope = {
        "maxCpuUtilization": 85.0,  # margin: 11.76% (WARNING)
        "maxCanBusLoad": 80.0,      # margin: 2.5% (DEGRADED)
        "maxTaskJitter": 2.5,       # margin: -4.0% (UNSAFE)
        "maxEcuTemp": 92.0          # margin: 2.17% (DEGRADED)
    }
    
    results = MarginEngine.evaluate(telemetry, envelope)
    assert len(results) == 4
    
    # Check CPU
    cpu_res = next(r for r in results if r["metric"] == "CPU Core Load")
    assert cpu_res["status"] == "WARNING"
    
    # Check Jitter
    jitter_res = next(r for r in results if r["metric"] == "Task Jitter")
    assert jitter_res["status"] == "UNSAFE"
