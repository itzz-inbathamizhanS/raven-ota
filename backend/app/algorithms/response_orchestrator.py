"""Response Orchestrator algorithm."""

from typing import Literal

ResponseAction = Literal[
    "CONTINUE",
    "MONITOR",
    "REDUCE_NON_CRITICAL_WORKLOAD",
    "ISOLATE_FUNCTION",
    "ENTER_DEGRADED_MODE",
    "DELAY_OTA",
    "ROLLBACK",
]

class ResponseOrchestrator:
    """Determines the appropriate active mitigation action."""

    @staticmethod
    def determine_action(
        assurance_state: str,
        dominant_constraint: str,
        margin: float,
        prediction: dict | None
    ) -> ResponseAction:
        """
        Determine the graduated response based on state and prediction.
        """
        # Base mapping from assurance state
        if assurance_state == "NORMAL":
            return "CONTINUE"
            
        elif assurance_state == "WARNING":
            # If warning, and prediction shows quick degradation, preemptively reduce workload
            if prediction and prediction.get("timeToBoundarySeconds", 999) < 15:
                return "REDUCE_NON_CRITICAL_WORKLOAD"
            return "MONITOR"
            
        elif assurance_state == "DEGRADED":
            # If degraded, we need to isolate the function or reduce workload depending on margin
            if margin < 2.0:
                return "ISOLATE_FUNCTION"
            return "REDUCE_NON_CRITICAL_WORKLOAD"
            
        elif assurance_state == "UNSAFE":
            # If unsafe, we enter degraded mode or rollback depending on how bad it is
            if margin <= -10.0:
                return "ROLLBACK"
            return "ENTER_DEGRADED_MODE"
            
        return "MONITOR"
