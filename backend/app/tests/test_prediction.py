"""Test prediction engine."""

from app.algorithms.trend_predictor import TrendPredictor

def test_prediction_stable():
    history = [
        {"timestamp": 0, "value": 50},
        {"timestamp": 1, "value": 50},
        {"timestamp": 2, "value": 50},
        {"timestamp": 3, "value": 50},
    ]
    pred = TrendPredictor.predict(history, 50, 100, "CPU")
    assert pred["timeToBoundarySeconds"] == 999.0

def test_prediction_increasing():
    # Value increases by 5 every second.
    # At t=3, value=65. Limit=100.
    # Needs (100 - 65) / 5 = 35 / 5 = 7 seconds to reach limit.
    history = [
        {"timestamp": 0, "value": 50},
        {"timestamp": 1, "value": 55},
        {"timestamp": 2, "value": 60},
        {"timestamp": 3, "value": 65},
    ]
    pred = TrendPredictor.predict(history, 65, 100, "CPU")
    assert round(pred["timeToBoundarySeconds"], 1) == 7.0
    assert pred["confidence"] > 0.9

def test_prediction_insufficient_data():
    history = [{"timestamp": 0, "value": 50}]
    pred = TrendPredictor.predict(history, 50, 100, "CPU")
    assert pred is None
