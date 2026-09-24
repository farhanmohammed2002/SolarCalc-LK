"""
PV System Sizing AI Tool for SolarCalc LK.
Executes the master engineering sizing pipeline for rooftop solar PV installations.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool
from app.calculations.pv_sizing import calculate_solar_pv_system

class CalculatePVSizeTool(AITool):
    name = "calculate_pv_size"
    description = (
        "Execute the authoritative SolarCalc LK sizing pipeline for a residential rooftop solar PV system in Sri Lanka. "
        "Calculates recommended DC capacity (kWp), required module quantity, matched inverter, expected annual generation, "
        "roof area footprint, and financial payback."
    )
    parameters = {
        "type": "object",
        "properties": {
            "monthly_consumption_kwh": {
                "type": "number",
                "description": "Monthly electricity consumption in kWh."
            },
            "monthly_bill_lkr": {
                "type": "number",
                "description": "Optional monthly bill in LKR if units are unknown."
            },
            "district": {
                "type": "string",
                "description": "Sri Lankan district name (e.g. 'Colombo', 'Kandy', 'Jaffna', 'Galle')."
            },
            "target_offset_pct": {
                "type": "number",
                "description": "Target electricity offset percentage (default: 100% to neutralize bill)."
            },
            "scheme": {
                "type": "string",
                "enum": ["NET_ACCOUNTING", "NET_METERING", "NET_PLUS"],
                "description": "CEB rooftop solar scheme (default: NET_ACCOUNTING)."
            },
            "roof_area_sqm": {
                "type": "number",
                "description": "Available usable roof area in square meters."
            },
            "roof_type": {
                "type": "string",
                "description": "Roof material ('ASBESTOS', 'CLAY_TILE', 'CORRUGATED_ZINC', 'CONCRETE_SLAB')."
            },
            "panel_id": {
                "type": "integer",
                "description": "Specific panel model ID from catalogue (optional)."
            }
        }
    }

    def execute(
        self,
        monthly_consumption_kwh: Optional[float] = None,
        monthly_bill_lkr: Optional[float] = None,
        district: str = "Colombo",
        target_offset_pct: float = 100.0,
        scheme: str = "NET_ACCOUNTING",
        roof_area_sqm: Optional[float] = None,
        roof_type: str = "ASBESTOS",
        panel_id: Optional[int] = None,
        monthly_units: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        units = monthly_consumption_kwh if monthly_consumption_kwh is not None else monthly_units
        return calculate_solar_pv_system(
            monthly_units_kwh=units,
            monthly_bill_lkr=monthly_bill_lkr,
            target_offset_pct=target_offset_pct,
            district=district,
            scheme=scheme,
            roof_area_sqm=roof_area_sqm,
            roof_type=roof_type,
            panel_id=panel_id
        )
