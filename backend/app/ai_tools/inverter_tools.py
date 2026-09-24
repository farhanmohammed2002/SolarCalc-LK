"""
Inverter Selection AI Tool for SolarCalc LK.
Performs discrete inverter matching and electrical string compatibility checks.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool
from app.calculations.inverter_selection import select_inverter
from app.calculations.panel_selection import get_panel_by_id

class SelectInverterTool(AITool):
    name = "select_inverter"
    description = (
        "Select the optimal grid-tie or hybrid inverter for a solar PV system and perform IEC string compatibility checks. "
        "Evaluates single-phase vs three-phase service, DC/AC sizing ratio, and MPPT temperature voltage windows."
    )
    parameters = {
        "type": "object",
        "properties": {
            "actual_dc_kwp": {
                "type": "number",
                "description": "Total DC solar peak capacity in kWp."
            },
            "panel_count": {
                "type": "integer",
                "description": "Total number of PV panels."
            },
            "panel_id": {
                "type": "integer",
                "description": "Optional panel model ID from catalogue to look up electrical parameters."
            },
            "panel_voc_v": {
                "type": "number",
                "description": "Panel open-circuit voltage at STC (optional, defaults to panel model)."
            },
            "panel_vmp_v": {
                "type": "number",
                "description": "Panel maximum power voltage at STC (optional)."
            }
        },
        "required": ["actual_dc_kwp", "panel_count"]
    }

    def execute(
        self,
        actual_dc_kwp: float,
        panel_count: int,
        panel_id: Optional[int] = None,
        panel_voc_v: Optional[float] = None,
        panel_vmp_v: Optional[float] = None,
        **kwargs
    ) -> Dict[str, Any]:
        panel = get_panel_by_id(panel_id or 1)
        if panel_voc_v:
            panel["voc_v"] = panel_voc_v
        if panel_vmp_v:
            panel["vmp_v"] = panel_vmp_v
            
        return select_inverter(actual_dc_kwp=actual_dc_kwp, panel=panel, panel_count=panel_count)
