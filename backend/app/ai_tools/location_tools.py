"""
Location Data AI Tool for SolarCalc LK.
Queries territorial district coordinates, provinces, and GSA solar resource benchmarks.
"""

import os
import json
from typing import Dict, Any, List, Optional
from app.ai_tools.base_tool import AITool

LOCATIONS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "locations.json")

class GetLocationDataTool(AITool):
    name = "get_location_data"
    description = (
        "Retrieve verified geographical and microclimatic data for any of the 25 administrative districts of Sri Lanka, "
        "including latitude, longitude, province, optimum tilt angle, and annual solar potential (PVOUT)."
    )
    parameters = {
        "type": "object",
        "properties": {
            "district": {
                "type": "string",
                "description": "Specific district name (e.g. 'Colombo', 'Jaffna', 'Kandy', 'Mannar', 'Hambantota'). If omitted, lists all districts."
            }
        }
    }

    def execute(self, district: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        if not os.path.exists(LOCATIONS_PATH):
            return {"error": "Locations database not found"}

        with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
            locations = json.load(f)

        if district:
            q = district.strip().lower()
            for loc in locations:
                if loc.get("district", "").strip().lower() == q or loc.get("name", "").strip().lower() == q:
                    return {"location": loc}
            return {
                "error": f"District '{district}' not found. Available districts: {', '.join([l.get('district', l.get('name', '')) for l in locations])}"
            }

        return {
            "total_districts": len(locations),
            "districts": [l.get("district", l.get("name", "")) for l in locations],
            "locations_summary": locations
        }
