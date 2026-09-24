"""
Equipment Catalogue AI Tool for SolarCalc LK.
Searches verified tier-1 panels, string/hybrid inverters, and LiFePO4 batteries.
"""

import os
import json
from typing import Dict, Any, List, Optional
from app.ai_tools.base_tool import AITool

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

class SearchEquipmentTool(AITool):
    name = "search_equipment"
    description = (
        "Search the verified SolarCalc LK hardware catalogue for tier-1 solar PV modules, "
        "grid-tie/hybrid inverters, or LiFePO4 battery energy storage systems (BESS). "
        "Returns verified ratings, dimensions, efficiencies, warranties, and datasheet references."
    )
    parameters = {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": ["all", "panel", "inverter", "battery"],
                "description": "Category of equipment to search."
            },
            "query": {
                "type": "string",
                "description": "Search keyword (e.g., '470W', 'Jinko', 'Hybrid', '5kW', 'LiFePO4', 'Deye', 'Huawei')."
            }
        },
        "required": ["type"]
    }

    def execute(self, type: str = "all", query: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        results: Dict[str, List[Any]] = {}
        q = (query or "").lower().strip()

        # Panels
        if type in ["all", "panel"]:
            p_path = os.path.join(DATA_DIR, "panels.json")
            if os.path.exists(p_path):
                with open(p_path, "r", encoding="utf-8") as f:
                    panels = json.load(f)
                    if q:
                        results["panels"] = [p for p in panels if q in p.get("model", "").lower() or q in p.get("manufacturer", "").lower() or q in str(p.get("rated_power_w", ""))]
                    else:
                        results["panels"] = panels

        # Inverters
        if type in ["all", "inverter"]:
            inv_path = os.path.join(DATA_DIR, "inverters.json")
            if os.path.exists(inv_path):
                with open(inv_path, "r", encoding="utf-8") as f:
                    inverters = json.load(f)
                    if q:
                        results["inverters"] = [i for i in inverters if q in i.get("model", "").lower() or q in i.get("manufacturer", "").lower() or q in str(i.get("rated_ac_power_kw", ""))]
                    else:
                        results["inverters"] = inverters

        # Batteries
        if type in ["all", "battery"]:
            bat_path = os.path.join(DATA_DIR, "batteries.json")
            if os.path.exists(bat_path):
                with open(bat_path, "r", encoding="utf-8") as f:
                    batteries = json.load(f)
                    if q:
                        results["batteries"] = [b for b in batteries if q in b.get("model", "").lower() or q in b.get("manufacturer", "").lower() or q in str(b.get("total_energy_kwh", ""))]
                    else:
                        results["batteries"] = batteries

        return results
