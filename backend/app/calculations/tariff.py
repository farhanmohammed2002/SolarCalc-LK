"""
PUCSL Sri Lanka Domestic Electricity Tariff Calculation Engine
Effective Date: January 18, 2025
Source: PUCSL Final Decision Document on Electricity Tariff Revision January 2025
"""

from typing import Dict, Any, List

def calculate_domestic_bill(units: float, is_solar_prosumer: bool = False, net_units: float = None) -> Dict[str, Any]:
    """
    Computes monthly electricity bill for a 30-day billing cycle under PUCSL Jan 18, 2025 rates.
    
    If is_solar_prosumer is True, Condition 3 of PUCSL Annex 2 applies:
    'Fixed charges for solar prosumers shall be based on the net consumption.'
    """
    if units <= 0:
        return {
            "units": 0.0,
            "energy_charge": 0.0,
            "fixed_charge": 0.0,
            "total_bill": 0.0,
            "tier": "Zero Consumption",
            "blocks_breakdown": []
        }
    
    # Check effective units for fixed charge (prosumer condition 3)
    fixed_charge_units = net_units if (is_solar_prosumer and net_units is not None) else units
    fixed_charge_units = max(0.0, fixed_charge_units)
    
    energy_charge = 0.0
    fixed_charge = 0.0
    tier_name = ""
    breakdown: List[Dict[str, Any]] = []
    
    # 1. Lifeline Tier: Consumption <= 60 kWh/month
    if units <= 60.0:
        tier_name = "Lifeline Tier (<= 60 kWh)"
        
        if units <= 30.0:
            b1_units = units
            b1_charge = b1_units * 4.00
            energy_charge += b1_charge
            breakdown.append({
                "block": "Block 1 (0 - 30 kWh)",
                "units": round(b1_units, 2),
                "rate": 4.00,
                "amount": round(b1_charge, 2)
            })
        else:
            b1_units = 30.0
            b1_charge = b1_units * 4.00
            b2_units = units - 30.0
            b2_charge = b2_units * 6.00
            energy_charge += (b1_charge + b2_charge)
            breakdown.append({
                "block": "Block 1 (0 - 30 kWh)",
                "units": 30.0,
                "rate": 4.00,
                "amount": round(b1_charge, 2)
            })
            breakdown.append({
                "block": "Block 2 (31 - 60 kWh)",
                "units": round(b2_units, 2),
                "rate": 6.00,
                "amount": round(b2_charge, 2)
            })
            
        # Fixed charge for lifeline tier (Condition 3 applies to prosumers)
        if fixed_charge_units == 0:
            fixed_charge = 0.0
        elif fixed_charge_units <= 30.0:
            fixed_charge = 75.00
        else:
            fixed_charge = 200.00

    # 2. General Domestic Tier: Consumption > 60 kWh/month
    else:
        tier_name = "General Domestic Tier (> 60 kWh)"
        
        # Block 1: 0 - 60 kWh @ 11.00
        b1_units = min(units, 60.0)
        b1_charge = b1_units * 11.00
        energy_charge += b1_charge
        breakdown.append({
            "block": "Block 1 (0 - 60 kWh)",
            "units": round(b1_units, 2),
            "rate": 11.00,
            "amount": round(b1_charge, 2)
        })
        
        # Block 2: 61 - 90 kWh @ 14.00
        if units > 60.0:
            b2_units = min(units - 60.0, 30.0)
            b2_charge = b2_units * 14.00
            energy_charge += b2_charge
            breakdown.append({
                "block": "Block 2 (61 - 90 kWh)",
                "units": round(b2_units, 2),
                "rate": 14.00,
                "amount": round(b2_charge, 2)
            })
            
        # Block 3: 91 - 120 kWh @ 20.00
        if units > 90.0:
            b3_units = min(units - 90.0, 30.0)
            b3_charge = b3_units * 20.00
            energy_charge += b3_charge
            breakdown.append({
                "block": "Block 3 (91 - 120 kWh)",
                "units": round(b3_units, 2),
                "rate": 20.00,
                "amount": round(b3_charge, 2)
            })
            
        # Block 4: 121 - 180 kWh @ 33.00
        if units > 120.0:
            b4_units = min(units - 120.0, 60.0)
            b4_charge = b4_units * 33.00
            energy_charge += b4_charge
            breakdown.append({
                "block": "Block 4 (121 - 180 kWh)",
                "units": round(b4_units, 2),
                "rate": 33.00,
                "amount": round(b4_charge, 2)
            })
            
        # Block 5: Above 180 kWh @ 52.00
        if units > 180.0:
            b5_units = units - 180.0
            b5_charge = b5_units * 52.00
            energy_charge += b5_charge
            breakdown.append({
                "block": "Block 5 (Above 180 kWh)",
                "units": round(b5_units, 2),
                "rate": 52.00,
                "amount": round(b5_charge, 2)
            })
            
        # Fixed charge according to consumption bracket (Condition 3 applies to prosumers)
        if fixed_charge_units == 0:
            fixed_charge = 0.0
        elif fixed_charge_units <= 30.0:
            fixed_charge = 75.00
        elif fixed_charge_units <= 60.0:
            fixed_charge = 200.00
        elif fixed_charge_units <= 90.0:
            fixed_charge = 400.00
        elif fixed_charge_units <= 120.0:
            fixed_charge = 1000.00
        elif fixed_charge_units <= 180.0:
            fixed_charge = 1500.00
        else:
            fixed_charge = 2000.00

    total_bill = energy_charge + fixed_charge
    return {
        "units": round(units, 2),
        "energy_charge": round(energy_charge, 2),
        "fixed_charge": round(fixed_charge, 2),
        "total_bill": round(total_bill, 2),
        "tier": tier_name,
        "blocks_breakdown": breakdown
    }

def estimate_units_from_bill(bill_amount: float) -> float:
    """
    Inverse tariff function: given an average monthly bill in LKR,
    accurately solves for the corresponding monthly units (kWh) using bisection.
    """
    if bill_amount <= 0:
        return 0.0
    
    # Quick boundaries
    low, high = 0.0, 5000.0
    for _ in range(50):
        mid = (low + high) / 2.0
        b = calculate_domestic_bill(mid)["total_bill"]
        if abs(b - bill_amount) < 0.5:
            return round(mid, 1)
        if b < bill_amount:
            low = mid
        else:
            high = mid
    return round((low + high) / 2.0, 1)
