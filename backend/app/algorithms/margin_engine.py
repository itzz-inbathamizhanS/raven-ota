"""Margin calculation algorithm."""

from typing import Literal

def calculate_margin(observed: float, limit: float) -> float:
    """Calculate the safety margin percentage.
    margin = (limit - observed) / limit
    Result is a percentage, e.g., 0.15 * 100 = 15%
    """
    if limit == 0:
        return 0.0
    return ((limit - observed) / limit) * 100.0

def classify_margin(margin_percent: float) -> Literal["NORMAL", "WARNING", "DEGRADED", "UNSAFE"]:
    """Classify the margin into a safety state.
    > 15% -> NORMAL
    5% - 15% -> WARNING (NEAR_BOUNDARY)
    0% - 5% -> DEGRADED
    < 0% -> UNSAFE (VIOLATION)
    """
    if margin_percent > 15.0:
        return "NORMAL"
    elif margin_percent > 5.0:
        return "WARNING"
    elif margin_percent >= 0.0:
        return "DEGRADED"
    else:
        return "UNSAFE"

class MarginEngine:
    @staticmethod
    def evaluate(telemetry: dict, envelope: dict) -> list[dict]:
        """Evaluate a telemetry sample against a safety envelope."""
        results = []
        
        # CPU
        cpu_val = telemetry.get("cpuUtilization", 0.0)
        cpu_limit = envelope.get("maxCpuUtilization", 100.0)
        cpu_margin = calculate_margin(cpu_val, cpu_limit)
        results.append({
            "metric": "CPU Core Load",
            "value": cpu_val,
            "threshold": cpu_limit,
            "marginPercent": round(cpu_margin, 1),
            "status": classify_margin(cpu_margin)
        })
        
        # CAN
        can_val = telemetry.get("canBusLoad", 0.0)
        can_limit = envelope.get("maxCanBusLoad", 100.0)
        can_margin = calculate_margin(can_val, can_limit)
        results.append({
            "metric": "CAN 1 Bus Load",
            "value": can_val,
            "threshold": can_limit,
            "marginPercent": round(can_margin, 1),
            "status": classify_margin(can_margin)
        })
        
        # Jitter
        jitter_val = telemetry.get("taskJitter", 0.0)
        jitter_limit = envelope.get("maxTaskJitter", 100.0)
        jitter_margin = calculate_margin(jitter_val, jitter_limit)
        results.append({
            "metric": "Task Jitter",
            "value": jitter_val,
            "threshold": jitter_limit,
            "marginPercent": round(jitter_margin, 1),
            "status": classify_margin(jitter_margin)
        })
        
        # Temp
        temp_val = telemetry.get("ecuTemp", 0.0)
        temp_limit = envelope.get("maxEcuTemp", 100.0)
        temp_margin = calculate_margin(temp_val, temp_limit)
        results.append({
            "metric": "SoC Thermal Temp",
            "value": temp_val,
            "threshold": temp_limit,
            "marginPercent": round(temp_margin, 1),
            "status": classify_margin(temp_margin)
        })
        
        return results
