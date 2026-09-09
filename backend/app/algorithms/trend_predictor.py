"""Prediction engine algorithm."""

import numpy as np

class TrendPredictor:
    """Predicts time to threshold using linear regression on telemetry history."""

    @staticmethod
    def predict(
        history: list[dict], 
        current_value: float, 
        limit: float, 
        metric: str
    ) -> dict | None:
        """
        Expects history as list of dicts: {"timestamp": float_seconds, "value": float}
        Returns prediction dict matching Prediction schema.
        """
        if len(history) < 3:
            return None
            
        timestamps = np.array([h["timestamp"] for h in history])
        values = np.array([h["value"] for h in history])
        
        # Normalize timestamps
        t0 = timestamps[0]
        timestamps_norm = timestamps - t0
        
        # Linear regression: y = mx + c
        A = np.vstack([timestamps_norm, np.ones(len(timestamps_norm))]).T
        m, c = np.linalg.lstsq(A, values, rcond=None)[0]
        
        if m <= 0.01:
            # Not increasing significantly, safe or stable
            return {
                "timeToBoundarySeconds": 999.0,
                "confidence": 0.95,
                "predictedConstraint": metric
            }
            
        # Time to reach limit: mx + c = limit -> x = (limit - c) / m
        time_to_limit_norm = (limit - c) / m
        
        # Calculate time remaining from now (last timestamp)
        current_time_norm = timestamps_norm[-1]
        time_remaining = time_to_limit_norm - current_time_norm
        
        if time_remaining < 0:
            time_remaining = 0.0
            
        # Basic confidence based on R-squared
        y_pred = m * timestamps_norm + c
        ss_res = np.sum((values - y_pred)**2)
        ss_tot = np.sum((values - np.mean(values))**2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
        
        # Ensure r_squared is sensible
        confidence = max(0.5, min(0.99, r_squared))

        return {
            "timeToBoundarySeconds": round(time_remaining, 1),
            "confidence": round(confidence, 3),
            "predictedConstraint": metric
        }
