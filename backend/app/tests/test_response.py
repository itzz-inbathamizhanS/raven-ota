"""Test response orchestrator."""

from app.algorithms.response_orchestrator import ResponseOrchestrator

def test_normal():
    action = ResponseOrchestrator.determine_action("NORMAL", "CPU", 20.0, None)
    assert action == "CONTINUE"

def test_warning_stable():
    action = ResponseOrchestrator.determine_action("WARNING", "CPU", 10.0, {"timeToBoundarySeconds": 50})
    assert action == "MONITOR"

def test_warning_degrading():
    action = ResponseOrchestrator.determine_action("WARNING", "CPU", 10.0, {"timeToBoundarySeconds": 10})
    assert action == "REDUCE_NON_CRITICAL_WORKLOAD"

def test_degraded_low_margin():
    action = ResponseOrchestrator.determine_action("DEGRADED", "CPU", 1.5, None)
    assert action == "ISOLATE_FUNCTION"

def test_degraded_high_margin():
    action = ResponseOrchestrator.determine_action("DEGRADED", "CPU", 4.0, None)
    assert action == "REDUCE_NON_CRITICAL_WORKLOAD"

def test_unsafe():
    action = ResponseOrchestrator.determine_action("UNSAFE", "Jitter", -2.0, None)
    assert action == "ENTER_DEGRADED_MODE"

def test_unsafe_severe():
    action = ResponseOrchestrator.determine_action("UNSAFE", "Jitter", -15.0, None)
    assert action == "ROLLBACK"
