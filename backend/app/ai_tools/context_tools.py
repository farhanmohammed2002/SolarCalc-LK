"""
Calculation Context AI Tool for SolarCalc LK.
Provides the AI agent with direct access to the user's active calculation state.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool

class GetCurrentCalculationContextTool(AITool):
    name = "get_current_calculation_context"
    description = (
        "Retrieve the active solar calculation results for the user's current session. "
        "Returns exact system sizing (kWp, panel count, panel model, inverter model), "
        "energy balance, monthly/annual yield, PUCSL bill savings, and payback period."
    )
    parameters = {
        "type": "object",
        "properties": {
            "aspect": {
                "type": "string",
                "enum": ["all", "system", "financials", "energy_balance", "equipment"],
                "description": "Specific aspect of calculation results to inspect (default: 'all')."
            }
        }
    }

    def __init__(self, current_context: Optional[Dict[str, Any]] = None):
        self._current_context = current_context or {}

    def set_context(self, context: Optional[Dict[str, Any]]):
        self._current_context = context or {}

    def execute(self, aspect: str = "all", **kwargs) -> Dict[str, Any]:
        calc = self._current_context.get("calculation") if isinstance(self._current_context, dict) else None
        if not calc:
            return {
                "status": "NO_ACTIVE_CALCULATION",
                "message": (
                    "No active calculation was found in the session. "
                    "The user has not run a calculation yet, or needs to calculate on the Calculator page first."
                )
            }

        if aspect == "system":
            return {
                "district": calc.get("district"),
                "system_capacity_kwp": calc.get("system_capacity_kwp") or calc.get("actual_capacity_kwp"),
                "panel_count": calc.get("panel_quantity") or calc.get("panel_count"),
                "panel_model": calc.get("panel_model"),
                "inverter_model": calc.get("inverter_model")
            }
        elif aspect == "financials":
            return {
                "system_cost_lkr": calc.get("estimated_system_cost_lkr") or calc.get("system_cost_lkr"),
                "annual_savings_lkr": calc.get("annual_savings_lkr") or calc.get("annual_net_benefit_lkr"),
                "payback_years": calc.get("payback_years") or calc.get("simple_payback_years")
            }
        elif aspect == "energy_balance":
            return {
                "annual_generation_kwh": calc.get("annual_generation_kwh"),
                "monthly_consumption_kwh": calc.get("monthly_consumption_kwh") or calc.get("monthly_units_kwh"),
                "grid_export_kwh": calc.get("grid_export_kwh"),
                "grid_import_kwh": calc.get("grid_import_kwh"),
                "scheme": calc.get("scheme")
            }

        return {"calculation": calc}
