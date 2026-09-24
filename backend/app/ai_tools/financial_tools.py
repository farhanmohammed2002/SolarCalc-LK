"""
Financial Analysis AI Tool for SolarCalc LK.
Calculates system cost, simple payback period, ROI, and 20-year cash flow.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool
from app.calculations.financial import calculate_financials

class CalculateFinancialsTool(AITool):
    name = "calculate_financials"
    description = (
        "Calculate the 20-year financial feasibility, turnkey CAPEX, simple payback period in years, "
        "and environmental carbon offset (tonnes CO2 avoided, trees planted) for a solar PV system in Sri Lanka."
    )
    parameters = {
        "type": "object",
        "properties": {
            "capacity_kwp": {
                "type": "number",
                "description": "DC solar system peak capacity in kWp."
            },
            "annual_generation_kwh": {
                "type": "number",
                "description": "Estimated annual generation in kWh."
            },
            "annual_net_benefit_lkr": {
                "type": "number",
                "description": "Total annual net economic benefit (bill savings + cash export revenue) in LKR."
            },
            "custom_system_cost_lkr": {
                "type": "number",
                "description": "Optional contractor quoted system price in LKR. If omitted, uses current Sri Lankan EPC benchmark rates."
            }
        },
        "required": ["capacity_kwp", "annual_generation_kwh", "annual_net_benefit_lkr"]
    }

    def execute(
        self,
        capacity_kwp: float,
        annual_generation_kwh: float,
        annual_net_benefit_lkr: float,
        custom_system_cost_lkr: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        return calculate_financials(
            capacity_kwp=capacity_kwp,
            annual_generation_kwh=annual_generation_kwh,
            annual_net_benefit_lkr=annual_net_benefit_lkr,
            custom_system_cost_lkr=custom_system_cost_lkr
        )
