"""
Financial Analysis & 20-Year Economic Life-Cycle Engine
Calculates turnkey CAPEX, simple payback, 20-year cumulative cash flow, ROI, and environmental offsets.
"""

from typing import Dict, Any, List

GRID_EMISSION_FACTOR_KG_CO2_PER_KWH = 0.62 # CEB Grid Emission Factor for Sri Lanka

def get_turnkey_cost_per_kwp(capacity_kwp: float) -> float:
    """
    Sourced from verified Sri Lankan solar EPC vendor benchmarks (Q1 2025):
    - Capacity <= 3.0 kWp: 320,000 LKR/kWp
    - Capacity 3.0 - 5.0 kWp: 285,000 LKR/kWp
    - Capacity 5.0 - 10.0 kWp: 260,000 LKR/kWp
    - Capacity > 10.0 kWp: 245,000 LKR/kWp
    """
    if capacity_kwp <= 3.0:
        return 320000.0
    elif capacity_kwp <= 5.0:
        return 285000.0
    elif capacity_kwp <= 10.0:
        return 260000.0
    else:
        return 245000.0

def calculate_financials(
    capacity_kwp: float,
    annual_generation_kwh: float,
    annual_net_benefit_lkr: float,
    custom_system_cost_lkr: float = None
) -> Dict[str, Any]:
    """
    Computes system cost, simple payback period, and 20-year cumulative cash flow trajectory.
    """
    if capacity_kwp <= 0 or annual_net_benefit_lkr <= 0:
        return {
            "system_cost_lkr": 0.0,
            "cost_per_kwp_lkr": 0.0,
            "simple_payback_years": 0.0,
            "annual_net_benefit_lkr": 0.0,
            "twenty_year_savings_lkr": 0.0,
            "roi_pct": 0.0,
            "co2_avoided_tonnes_per_year": 0.0,
            "trees_planted_equivalent": 0,
            "cash_flow_trajectory": []
        }
        
    rate_per_kwp = get_turnkey_cost_per_kwp(capacity_kwp)
    system_cost = custom_system_cost_lkr if (custom_system_cost_lkr and custom_system_cost_lkr > 0) else (capacity_kwp * rate_per_kwp)
    system_cost = round(system_cost, 0)
    
    # Simple Payback
    payback_years = round(system_cost / annual_net_benefit_lkr, 1) if annual_net_benefit_lkr > 0 else 99.0
    
    # 20-Year Cash Flow Trajectory
    # Parameters:
    # - Annual PV degradation: 0.55% per year
    # - Annual O&M: 1% of initial system cost
    # - Inverter replacement reserve at Year 10: 20% of initial CAPEX
    cash_flow: List[Dict[str, Any]] = []
    cumulative_cash = -system_cost
    total_benefits = 0.0
    
    cash_flow.append({
        "year": 0,
        "annual_benefit": 0.0,
        "om_cost": 0.0,
        "net_annual": round(-system_cost, 0),
        "cumulative": round(cumulative_cash, 0)
    })
    
    annual_om = system_cost * 0.01
    
    for y in range(1, 21):
        degradation_factor = (1.0 - 0.0055) ** (y - 1)
        annual_benefit_y = annual_net_benefit_lkr * degradation_factor
        om_cost_y = annual_om
        
        # Year 10 inverter replacement reserve
        if y == 10:
            om_cost_y += (system_cost * 0.20)
            
        net_year = annual_benefit_y - om_cost_y
        cumulative_cash += net_year
        total_benefits += annual_benefit_y
        
        cash_flow.append({
            "year": y,
            "annual_benefit": round(annual_benefit_y, 0),
            "om_cost": round(om_cost_y, 0),
            "net_annual": round(net_year, 0),
            "cumulative": round(cumulative_cash, 0)
        })
        
    twenty_year_net = round(cumulative_cash, 0)
    roi_pct = round(((total_benefits - system_cost) / system_cost) * 100.0, 1) if system_cost > 0 else 0.0
    
    # Environmental metrics
    co2_tonnes = round((annual_generation_kwh * GRID_EMISSION_FACTOR_KG_CO2_PER_KWH) / 1000.0, 2)
    trees = int(round(co2_tonnes * 1000.0 / 21.8)) # ~21.8 kg CO2 absorbed per urban tree/yr
    
    return {
        "system_cost_lkr": system_cost,
        "cost_per_kwp_lkr": rate_per_kwp,
        "simple_payback_years": payback_years,
        "annual_net_benefit_lkr": round(annual_net_benefit_lkr, 0),
        "twenty_year_savings_lkr": twenty_year_net,
        "roi_pct": roi_pct,
        "co2_avoided_tonnes_per_year": co2_tonnes,
        "trees_planted_equivalent": trees,
        "cash_flow_trajectory": cash_flow
    }
