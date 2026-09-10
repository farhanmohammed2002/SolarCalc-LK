"""
Solar PV Module Selection & Stringing Architecture
Selects discrete panels from verified manufacturer catalogue and computes physical & electrical layouts.
"""

import math, json, os
from typing import Dict, Any, List, Optional

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "panels.json")

def load_panels() -> List[Dict[str, Any]]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_panel_by_id(panel_id: int) -> Dict[str, Any]:
    panels = load_panels()
    for p in panels:
        if p["id"] == panel_id:
            return p
    return panels[0] if panels else {
        "id": 1,
        "manufacturer": "EGing PV",
        "model": "EG-415M54-HL",
        "rated_power_w": 415,
        "efficiency_pct": 21.25,
        "voc_v": 37.50,
        "isc_a": 13.91,
        "vmp_v": 31.50,
        "imp_a": 13.18,
        "temp_coeff_pmp": -0.35,
        "length_mm": 1722,
        "width_mm": 1134,
        "weight_kg": 20.2
    }

def size_panel_array(target_kwp: float, panel_id: Optional[int] = None, roof_area_sqm: Optional[float] = None) -> Dict[str, Any]:
    """
    Given a target DC peak capacity (kWp), selects the panel model and calculates:
    - Discrete panel count (ceiling)
    - Actual installed kWp
    - Required roof area with spacing allowance
    - Physical fit verification
    """
    if target_kwp <= 0:
        return {
            "panel": None,
            "panel_count": 0,
            "actual_kwp": 0.0,
            "required_area_sqm": 0.0,
            "fits_roof": True,
            "roof_utilization_pct": 0.0
        }
        
    panel = get_panel_by_id(panel_id) if panel_id else load_panels()[0]
    p_rated_w = float(panel["rated_power_w"])
    
    # Sizing
    required_watts = target_kwp * 1000.0
    panel_count = int(math.ceil(required_watts / p_rated_w))
    actual_kwp = round((panel_count * p_rated_w) / 1000.0, 2)
    
    # Physical Area Calculation
    # Module area in m2
    len_m = panel.get("length_mm", 1722) / 1000.0
    wid_m = panel.get("width_mm", 1134) / 1000.0
    single_module_area = len_m * wid_m
    raw_panel_area = panel_count * single_module_area
    # Add 15% structural spacing for clamps, walkways, and ventilation
    required_area = round(raw_panel_area * 1.15, 1)
    
    fits = True
    utilization = 0.0
    if roof_area_sqm is not None and roof_area_sqm > 0:
        fits = required_area <= roof_area_sqm
        utilization = round((required_area / roof_area_sqm) * 100.0, 1)
        
    return {
        "panel": panel,
        "panel_count": panel_count,
        "actual_kwp": actual_kwp,
        "single_module_area_sqm": round(single_module_area, 2),
        "required_area_sqm": required_area,
        "fits_roof": fits,
        "roof_utilization_pct": utilization
    }
