"""
Solar Resource AI Tool for SolarCalc LK.
Authoritative source for Global Solar Atlas (GSA v2.0) irradiance and yield metrics.
"""

import os
import json
from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool
from app.calculations.solar import get_solar_resource

LOCATIONS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "locations.json")

class GetSolarResourceTool(AITool):
    name = "get_solar_resource"
    description = (
        "Retrieve authoritative World Bank / ESMAP Global Solar Atlas (GSA v2.0) solar resource data "
        "for a given Sri Lankan district or GPS coordinates (latitude, longitude). "
        "Returns annual PV yield (kWh/kWp/year), optimum tilt angle, daily GHI, and monthly generation breakdown."
    )
    parameters = {
        "type": "object",
        "properties": {
            "district": {
                "type": "string",
                "description": "Name of the Sri Lankan district (e.g., 'Colombo', 'Jaffna', 'Kandy', 'Galle', 'Mannar')."
            },
            "latitude": {
                "type": "number",
                "description": "Latitude coordinate within Sri Lanka (5.5 to 10.0)."
            },
            "longitude": {
                "type": "number",
                "description": "Longitude coordinate within Sri Lanka (79.5 to 82.2)."
            },
            "tilt_deg": {
                "type": "number",
                "description": "Roof tilt angle in degrees (default: 10°)."
            },
            "azimuth_deg": {
                "type": "number",
                "description": "Roof azimuth in degrees (180° = True South, default: 180°)."
            }
        }
    }

    def execute(self, district: Optional[str] = None, latitude: Optional[float] = None, longitude: Optional[float] = None, tilt_deg: float = 10.0, azimuth_deg: float = 180.0, **kwargs) -> Dict[str, Any]:
        lat = latitude
        lon = longitude
        resolved_district = district or "Colombo"

        # Resolve district coordinates if lat/lon not provided
        if (lat is None or lon is None) and os.path.exists(LOCATIONS_PATH):
            try:
                with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
                    locs = json.load(f)
                    for item in locs:
                        if district and item.get("district", "").strip().lower() == district.strip().lower():
                            lat = item["latitude"]
                            lon = item["longitude"]
                            resolved_district = item["district"]
                            break
            except Exception:
                pass

        if lat is None or lon is None:
            lat, lon = 6.9271, 79.8612 # Colombo default

        res = get_solar_resource(lat, lon)
        res["district"] = resolved_district
        res["coordinates"] = {"latitude": lat, "longitude": lon}
        res["tilt_deg"] = tilt_deg
        res["azimuth_deg"] = azimuth_deg
        return res
