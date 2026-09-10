"""
End-to-End Solar PV Sizing & Simulation Pipeline
Orchestrates solar resource retrieval, discrete component sizing, electrical validation, and tariff evaluation.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional

from .solar import get_solar_resource, calculate_orientation_derate
from .tariff import calculate_domestic_bill, estimate_units_from_bill
from .panel_selection import size_panel_array, get_panel_by_id
from .inverter_selection import select_inverter
from .solar_schemes import evaluate_solar_scheme
from .financial import calculate_financials

def calculate_solar_pv_system(
    monthly_units_kwh: Optional[float] = None,
    monthly_bill_lkr: Optional[float] = None,
    target_offset_pct: float = 100.0,
    latitude: float = 6.9271,
    longitude: float = 79.8612,
    district: str = "Colombo",
    roof_type: str = "ASBESTOS",
    roof_area_sqm: Optional[float] = None,
    azimuth_deg: float = 180.0,
    tilt_deg: float = 10.0,
    scheme: str = "NET_ACCOUNTING",
    panel_id: Optional[int] = None,
    custom_system_cost_lkr: Optional[float] = None
) -> Dict[str, Any]:
    """
    Executes the master engineering calculation workflow.
    """
    # 1. Resolve Monthly Load Units
    if monthly_units_kwh is None or monthly_units_kwh <= 0:
        if monthly_bill_lkr and monthly_bill_lkr > 0:
            monthly_units = estimate_units_from_bill(monthly_bill_lkr)
        else:
            monthly_units = 0.0
    else:
        monthly_units = float(monthly_units_kwh)
        
    offset_ratio = max(0.1, min(2.0, target_offset_pct / 100.0))
    target_monthly_gen = monthly_units * offset_ratio
    target_annual_gen = target_monthly_gen * 12.0
    
    # 2. Solar Resource Assessment (Global Solar Atlas)
    solar_res = get_solar_resource(latitude, longitude)
    annual_pvout = solar_res["annual_pvout_kwh_per_kwp"]
    opta = solar_res["optimum_tilt_deg"]
    
    # 3. Orientation & Tilt Derate Factor
    eta_site = calculate_orientation_derate(roof_type, azimuth_deg, tilt_deg, opta)
    effective_annual_yield = annual_pvout * eta_site
    
    # 4. Required DC Capacity
    if effective_annual_yield > 0 and target_annual_gen > 0:
        required_kwp = round(target_annual_gen / effective_annual_yield, 2)
    else:
        required_kwp = 0.0
        
    # 5. Discrete Panel Selection & Array Sizing
    array_sizing = size_panel_array(required_kwp, panel_id, roof_area_sqm)
    actual_kwp = array_sizing["actual_kwp"]
    panel_count = array_sizing["panel_count"]
    panel = array_sizing["panel"]
    
    # 6. Monthly & Annual PV Generation
    # E_month = P_actual * y_month * eta_site
    monthly_generation = []
    for m_yield in solar_res["monthly_pvout"]:
        m_gen = round(actual_kwp * m_yield * eta_site, 1)
        monthly_generation.append(m_gen)
        
    annual_generation = round(sum(monthly_generation), 1)
    avg_monthly_generation = round(annual_generation / 12.0, 1)
    
    # 7. Inverter Selection & Electrical Compatibility Check
    inverter_eval = select_inverter(actual_kwp, panel, panel_count)
    
    # 8. Scheme Energy Balance & PUCSL Jan 2025 Tariff Settlement
    scheme_eval = evaluate_solar_scheme(
        scheme=scheme,
        monthly_load_kwh=monthly_units,
        monthly_generation_kwh=avg_monthly_generation,
        system_capacity_kwp=actual_kwp
    )
    
    # 9. Life-Cycle Financial Analysis & Environmental Offsets
    financial_eval = calculate_financials(
        capacity_kwp=actual_kwp,
        annual_generation_kwh=annual_generation,
        annual_net_benefit_lkr=scheme_eval["annual_net_benefit_lkr"],
        custom_system_cost_lkr=custom_system_cost_lkr
    )
    
    # 10. Compile Master Assessment Package
    return {
        "inputs": {
            "district": district,
            "latitude": latitude,
            "longitude": longitude,
            "monthly_units_kwh": monthly_units,
            "monthly_bill_lkr": monthly_bill_lkr,
            "target_offset_pct": target_offset_pct,
            "roof_type": roof_type,
            "roof_area_sqm": roof_area_sqm,
            "azimuth_deg": azimuth_deg,
            "tilt_deg": tilt_deg,
            "scheme": scheme
        },
        "system": {
            "recommended_capacity_kwp": required_kwp,
            "actual_capacity_kwp": actual_kwp,
            "panel_count": panel_count,
            "panel": panel,
            "inverter": inverter_eval["inverter"],
            "dc_ac_ratio": inverter_eval["dc_ac_ratio"],
            "phase": inverter_eval["phase"],
            "num_strings": inverter_eval["num_strings"],
            "panels_per_string": inverter_eval["panels_per_string"],
            "string_voc_max_v": inverter_eval["string_voc_max_v"],
            "string_vmp_min_v": inverter_eval["string_vmp_min_v"],
            "electrical_check": inverter_eval["electrical_check"],
            "required_roof_area_sqm": array_sizing["required_area_sqm"],
            "fits_roof": array_sizing["fits_roof"],
            "roof_utilization_pct": array_sizing["roof_utilization_pct"]
        },
        "solar_resource": {
            "annual_pvout_kwh_per_kwp": annual_pvout,
            "optimum_tilt_deg": opta,
            "site_derate_factor": eta_site,
            "effective_yield_kwh_per_kwp": round(effective_annual_yield, 1),
            "daily_ghi_kwh_m2": solar_res["daily_ghi_kwh_m2"],
            "source": solar_res["source"]
        },
        "generation": {
            "annual_kwh": annual_generation,
            "monthly_kwh": monthly_generation,
            "average_monthly_kwh": avg_monthly_generation
        },
        "scheme": scheme_eval,
        "financials": financial_eval,
        "traceability": {
            "tariff_document": "PUCSL Final Decision Jan 18, 2025",
            "solar_export_tariff": "CEB RTSPV 44.14 LKR/kWh (<=20 kW)",
            "solar_dataset": "Global Solar Atlas v2.0 (ESMAP / World Bank)",
            "developer": "Farhan Mohammad (Faculty of Engineering, University of Jaffna)",
            "calculation_timestamp": datetime.now(timezone.utc).isoformat()
        }
    }
