"""
Tariff Calculator AI Tool for SolarCalc LK.
Authoritative calculation of Sri Lankan domestic electricity bills under PUCSL Jan 18, 2025 tariff.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool
from app.calculations.tariff import calculate_domestic_bill, estimate_units_from_bill

class CalculateTariffTool(AITool):
    name = "calculate_electricity_tariff"
    description = (
        "Calculate the exact domestic electricity bill in Sri Lankan Rupees (LKR) under the official "
        "PUCSL January 18, 2025 tariff schedule. Computes energy charges by tiered blocks (0-30, 31-60, 61-90, 91-120, 121-180, >180 kWh), "
        "fixed charges, and applies PUCSL Condition 3 for rooftop solar prosumers."
    )
    parameters = {
        "type": "object",
        "properties": {
            "monthly_consumption_kwh": {
                "type": "number",
                "description": "Total monthly household electricity consumption in kilowatt-hours (kWh)."
            },
            "monthly_bill_lkr": {
                "type": "number",
                "description": "Optional monthly electricity bill amount in LKR to back-calculate units if kWh is unknown."
            },
            "is_solar_prosumer": {
                "type": "boolean",
                "description": "Whether the user has a rooftop solar system (applies PUCSL Condition 3 net fixed charge)."
            },
            "net_units_kwh": {
                "type": "number",
                "description": "Residual net electricity imported from grid after solar offset (for solar prosumers)."
            }
        }
    }

    def execute(self, monthly_consumption_kwh: Optional[float] = None, monthly_bill_lkr: Optional[float] = None, is_solar_prosumer: bool = False, net_units_kwh: Optional[float] = None, monthly_units: Optional[float] = None, **kwargs) -> Dict[str, Any]:
        units = monthly_consumption_kwh if monthly_consumption_kwh is not None else monthly_units
        if units is None and monthly_bill_lkr is not None:
            units = estimate_units_from_bill(monthly_bill_lkr)
        
        if units is None:
            units = 150.0 # Default moderate domestic consumption
            
        bill_data = calculate_domestic_bill(
            units=float(units),
            is_solar_prosumer=is_solar_prosumer,
            net_units=float(net_units_kwh) if net_units_kwh is not None else None
        )
        bill_data["regulatory_baseline"] = "PUCSL Jan 18, 2025 Tariff Schedule (Condition 3 Enforced)"
        return bill_data
