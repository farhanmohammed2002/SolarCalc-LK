"""
Inverter Selection & Electrical String Compatibility
Selects optimal single-phase or three-phase string inverter and performs electrical safety & MPPT compliance checks.
"""

import os, json
from typing import Dict, Any, List, Optional

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "inverters.json")

def load_inverters() -> List[Dict[str, Any]]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def select_inverter(actual_dc_kwp: float, panel: Dict[str, Any], panel_count: int) -> Dict[str, Any]:
    """
    Selects inverter based on:
    1. Phase: Single phase for <= 5 kWp (standard CEB residential connection), three phase for > 5 kWp.
    2. AC Power: Chooses inverter with DC/AC ratio closest to 1.15 - 1.25.
    3. MPPT stringing check: Validates series string voltage against inverter MPPT limits.
    """
    if actual_dc_kwp <= 0 or panel_count <= 0:
        return {
            "inverter": None,
            "dc_ac_ratio": 0.0,
            "phase": 1,
            "string_configuration": "N/A",
            "electrical_check": {"status": "PASSED", "message": "No inverter required for zero capacity."}
        }
        
    inverters = load_inverters()
    # Desired phase
    desired_phase = 1 if actual_dc_kwp <= 5.2 else 3
    
    # Filter candidates by phase
    candidates = [inv for inv in inverters if inv["phase"] == desired_phase]
    if not candidates:
        candidates = inverters
        
    # Find best inverter matching DC capacity (target DC/AC between 1.0 and 1.35)
    best_inv = None
    min_diff = 999.0
    
    for inv in candidates:
        p_ac = inv["rated_ac_power_kw"]
        ratio = actual_dc_kwp / p_ac
        # Score distance from optimal 1.20 DC/AC ratio
        diff = abs(ratio - 1.20)
        if ratio <= 1.50 and ratio >= 0.50: # Valid operational bounds
            if diff < min_diff:
                min_diff = diff
                best_inv = inv
                
    if not best_inv:
        # Fallback to candidate with closest AC power
        best_inv = min(candidates, key=lambda x: abs(x["rated_ac_power_kw"] - actual_dc_kwp))
        
    p_ac = best_inv["rated_ac_power_kw"]
    dc_ac_ratio = round(actual_dc_kwp / p_ac, 2)
    
    # String design check
    # Typical Sri Lanka temperatures: T_min = 15C (Hill country/night), T_max_cell = 65C (Roof noon)
    voc_stc = panel.get("voc_v", 37.5)
    vmp_stc = panel.get("vmp_v", 31.5)
    temp_coeff = panel.get("temp_coeff_pmp", -0.35) / 100.0 # /C
    
    # Determine string division (1 string or 2 strings based on panel count & MPPT count)
    mppt_count = best_inv.get("mppt_count", 2)
    if panel_count <= 10:
        num_strings = 1
        panels_per_string = panel_count
    else:
        num_strings = 2
        panels_per_string = (panel_count + 1) // 2
        
    # Voc max at 15 deg C (10 deg below STC 25C)
    voc_cold = voc_stc * (1.0 + abs(temp_coeff) * (25.0 - 15.0))
    string_voc_max = round(panels_per_string * voc_cold, 1)
    
    # Vmp min at 65 deg C (40 deg above STC 25C)
    vmp_hot = vmp_stc * (1.0 + temp_coeff * (65.0 - 25.0))
    string_vmp_min = round(panels_per_string * vmp_hot, 1)
    
    mppt_min = best_inv.get("mppt_voltage_min_v", 90)
    mppt_max = best_inv.get("mppt_voltage_max_v", 560)
    
    is_voc_safe = string_voc_max <= mppt_max
    is_mppt_tracked = string_vmp_min >= mppt_min
    
    status = "VERIFIED" if (is_voc_safe and is_mppt_tracked) else "WARNING"
    notes = []
    if not is_voc_safe:
        notes.append(f"Max cold string Voc ({string_voc_max}V) exceeds inverter MPPT upper limit ({mppt_max}V).")
    if not is_mppt_tracked:
        notes.append(f"Min hot string Vmp ({string_vmp_min}V) is below inverter MPPT minimum ({mppt_min}V).")
    if not notes:
        notes.append(f"Optimal DC/AC ratio of {dc_ac_ratio}. Operating voltage ({string_vmp_min}V - {string_voc_max}V) conforms to MPPT window ({mppt_min}V - {mppt_max}V).")
        
    return {
        "inverter": best_inv,
        "dc_ac_ratio": dc_ac_ratio,
        "phase": best_inv["phase"],
        "num_strings": num_strings,
        "panels_per_string": panels_per_string,
        "string_voc_max_v": string_voc_max,
        "string_vmp_min_v": string_vmp_min,
        "electrical_check": {
            "status": status,
            "is_voc_safe": is_voc_safe,
            "is_mppt_tracked": is_mppt_tracked,
            "details": " ".join(notes)
        }
    }
