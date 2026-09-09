"""Assurance State Machine algorithm."""

from typing import Literal

AssuranceState = Literal["NORMAL", "WARNING", "DEGRADED", "UNSAFE"]

class AssuranceStateMachine:
    """
    Deterministic FSM for vehicle assurance states.
    Prioritizes margins over context, and handles state degradation systematically.
    """

    @staticmethod
    def evaluate_state(
        current_state: AssuranceState,
        margins: list[dict],
        context: dict,
        prediction: dict | None = None
    ) -> tuple[AssuranceState, str, float, str]:
        """
        Evaluate the next state based on margins.
        Returns: (new_state, dominant_constraint, lowest_margin, reason)
        """
        if not margins:
            return current_state, "Unknown", 100.0, "No telemetry to evaluate"

        # Determine the worst margin
        status_priority = {"NORMAL": 0, "WARNING": 1, "DEGRADED": 2, "UNSAFE": 3}
        worst_margin = min(margins, key=lambda m: m["marginPercent"])
        
        dominant_status = "NORMAL"
        for m in margins:
            if status_priority[m["status"]] > status_priority[dominant_status]:
                dominant_status = m["status"]

        new_state = dominant_status
        reason = f"Margin for {worst_margin['metric']} reached {worst_margin['marginPercent']}%"

        # Apply Context-based adjustments
        if new_state == "WARNING" and context.get("dominantWorkload") == "High ADAS Perception Load":
            # If we are near boundary and under high load, be more conservative
            pass

        # Apply Prediction-based adjustments (Phase 5)
        if prediction and prediction.get("timeToBoundarySeconds", 999) < 10:
            if new_state in ["NORMAL", "WARNING"]:
                new_state = "DEGRADED"
                reason = f"Predicted boundary approach in {prediction['timeToBoundarySeconds']}s"

        # Prevent state flapping (only degrade if unsafe, otherwise stick to current if worse)
        # e.g., if we were DEGRADED and now NORMAL, we might want to stay DEGRADED until explicitly cleared.
        # But for this prototype, we'll allow immediate recovery if margin recovers.
        
        return new_state, worst_margin["metric"], worst_margin["marginPercent"], reason
