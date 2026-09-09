"""Assurance service."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.assurance_repository import AssuranceRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.models.assurance import AssuranceDecision as AssuranceDecisionModel
from app.algorithms.assurance_state_machine import AssuranceStateMachine
from app.schemas.assurance import AssuranceEvaluationResponse
from uuid import uuid4

class AssuranceService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = AssuranceRepository(session)
        self.vehicle_repo = VehicleRepository(session)

    async def process_assurance(self, vehicle_id: str) -> AssuranceDecisionModel | None:
        """Runs the state machine and saves the decision."""
        vehicle = await self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle or not vehicle.margins:
            return None

        current_state = vehicle.assurance_state
        context = vehicle.context or {}
        prediction = vehicle.prediction

        new_state, constraint, margin, reason = AssuranceStateMachine.evaluate_state(
            current_state=current_state,
            margins=vehicle.margins,
            context=context,
            prediction=prediction
        )

        decision = AssuranceDecisionModel(
            id=f"DEC-{vehicle_id}-{uuid4()}",
            vehicle_id=vehicle_id,
            previous_state=current_state,
            new_state=new_state,
            dominant_constraint=constraint,
            margin=margin,
            reason=reason,
            context=context,
            prediction_reference=prediction.get("predictedConstraint") if prediction else None
        )

        await self.repo.create(decision)
        
        # Update vehicle
        vehicle.assurance_state = new_state
        vehicle.dominant_constraint = constraint
        vehicle.envelope_margin = margin
        
        return decision
