"""
Input Validation & Boundary Checking Engine
Ensures all engineering inputs fall within physically realistic and regulatory compliant boundaries.
"""

from typing import Dict, Any, List, Tuple

def validate_inputs(
    monthly_units_kwh: float = None,
    monthly_bill_lkr: float = None,
    latitude: float = 6.9,
    longitude: float = 79.9,
    target_offset_pct: float = 100.0,
    roof_area_sqm: float = None
) -> Tuple[bool, List[str]]:
    """
    Validates user inputs before calculation execution.
    Returns (is_valid, list_of_error_or_warning_messages).
    """
    errors = []
    
    # 1. Geographic bounds (Sri Lanka bounding box: Lat 5.5 to 10.0, Lon 79.5 to 82.2)
    if not (5.5 <= latitude <= 10.0):
        errors.append(f"Latitude {latitude} is outside Sri Lanka territorial boundaries (5.5N - 10.0N).")
    if not (79.5 <= longitude <= 82.2):
        errors.append(f"Longitude {longitude} is outside Sri Lanka territorial boundaries (79.5E - 82.2E).")
        
    # 2. Consumption validation
    if (monthly_units_kwh is None or monthly_units_kwh <= 0) and (monthly_bill_lkr is None or monthly_bill_lkr <= 0):
        errors.append("Please provide either average monthly electricity units (kWh) or average monthly bill (LKR).")
    elif monthly_units_kwh is not None:
        if monthly_units_kwh < 0:
            errors.append("Electricity consumption cannot be negative.")
        elif monthly_units_kwh > 10000:
            errors.append("Monthly residential consumption exceeds 10,000 kWh. Please consult CEB for bulk supply / commercial tariffs.")
            
    # 3. Target offset bounds
    if target_offset_pct < 10 or target_offset_pct > 200:
        errors.append("Solar offset target must be between 10% and 200%.")
        
    # 4. Roof area bounds
    if roof_area_sqm is not None and roof_area_sqm < 0:
        errors.append("Roof area cannot be negative.")
        
    is_valid = len(errors) == 0
    return is_valid, errors
