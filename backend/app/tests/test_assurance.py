"""Test assurance state machine."""

from app.algorithms.assurance_state_machine import AssuranceStateMachine

def test_state_machine_normal():
    margins = [{"status": "NORMAL", "marginPercent": 20.0, "metric": "CPU"}]
    state, constraint, margin, reason = AssuranceStateMachine.evaluate_state("NORMAL", margins, {})
    assert state == "NORMAL"
    assert margin == 20.0

def test_state_machine_warning():
    margins = [
        {"status": "NORMAL", "marginPercent": 20.0, "metric": "CPU"},
        {"status": "WARNING", "marginPercent": 10.0, "metric": "Jitter"}
    ]
    state, constraint, margin, reason = AssuranceStateMachine.evaluate_state("NORMAL", margins, {})
    assert state == "WARNING"
    assert constraint == "Jitter"
    assert margin == 10.0

def test_state_machine_degraded():
    margins = [{"status": "DEGRADED", "marginPercent": 2.0, "metric": "CAN"}]
    state, _, _, _ = AssuranceStateMachine.evaluate_state("NORMAL", margins, {})
    assert state == "DEGRADED"

def test_state_machine_unsafe():
    margins = [{"status": "UNSAFE", "marginPercent": -5.0, "metric": "CPU"}]
    state, _, _, _ = AssuranceStateMachine.evaluate_state("DEGRADED", margins, {})
    assert state == "UNSAFE"

def test_state_machine_prediction_override():
    margins = [{"status": "WARNING", "marginPercent": 8.0, "metric": "CPU"}]
    prediction = {"timeToBoundarySeconds": 5}
    state, _, _, reason = AssuranceStateMachine.evaluate_state("WARNING", margins, {}, prediction)
    assert state == "DEGRADED"
    assert "Predicted boundary approach" in reason
