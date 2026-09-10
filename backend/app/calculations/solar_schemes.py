"""
Sri Lanka Rooftop Solar PV Schemes & Feed-in Settlement Engine
Models Net Metering, Net Accounting, and Net Plus under CEB / PUCSL regulatory frameworks.
"""

from typing import Dict, Any, List
from .tariff import calculate_domestic_bill

EXPORT_TARIFF_LE_20KW = 44.14 # LKR/kWh (CEB official gazette for <= 20 kW RTSPV)
EXPORT_TARIFF_GT_20KW = 43.02 # LKR/kWh (for 20 - 100 kW)

def evaluate_solar_scheme(
    scheme: str,
    monthly_load_kwh: float,
    monthly_generation_kwh: float,
    system_capacity_kwp: float
) -> Dict[str, Any]:
    """
    Computes energy balance and monetary settlement for the chosen scheme.
    """
    # 1. Baseline Pre-Solar Electricity Bill
    pre_solar_bill_details = calculate_domestic_bill(monthly_load_kwh, is_solar_prosumer=False)
    pre_solar_bill = pre_solar_bill_details["total_bill"]
    
    # Export rate determination based on capacity
    export_rate = EXPORT_TARIFF_LE_20KW if system_capacity_kwp <= 20.0 else EXPORT_TARIFF_GT_20KW
    
    post_solar_bill = 0.0
    monthly_bill_savings = 0.0
    cash_export_revenue = 0.0
    net_monthly_benefit = 0.0
    post_solar_bill_details = None
    
    # Energy Flow Metrics
    # In tropical daytime without battery, self-consumption ratio is ~35% of solar generation
    # or capped by daytime portion of load
    daytime_load = monthly_load_kwh * 0.40 # ~40% consumed during daylight
    direct_self_consumed = min(monthly_generation_kwh, daytime_load)
    grid_exported_kwh = max(0.0, monthly_generation_kwh - direct_self_consumed)
    grid_imported_kwh = max(0.0, monthly_load_kwh - direct_self_consumed)
    
    # -------------------------------------------------------------
    # 1. NET METERING
    # -------------------------------------------------------------
    if scheme == "NET_METERING":
        net_units = monthly_load_kwh - monthly_generation_kwh
        if net_units >= 0:
            # Customer has net import; billed under Condition 3 on net units
            post_solar_bill_details = calculate_domestic_bill(net_units, is_solar_prosumer=True, net_units=net_units)
            post_solar_bill = post_solar_bill_details["total_bill"]
            banked_units = 0.0
        else:
            # Generation exceeds consumption; bill is zero, surplus is banked
            post_solar_bill_details = calculate_domestic_bill(0.0, is_solar_prosumer=True, net_units=0.0)
            post_solar_bill = 0.0
            banked_units = round(abs(net_units), 1)
            
        monthly_bill_savings = pre_solar_bill - post_solar_bill
        cash_export_revenue = 0.0 # No cash in net metering
        net_monthly_benefit = monthly_bill_savings
        
        scheme_summary = {
            "scheme_name": "Net Metering",
            "banked_energy_credits_kwh": banked_units,
            "cash_payout_lkr": 0.0,
            "export_rate_applied": 0.0
        }

    # -------------------------------------------------------------
    # 2. NET ACCOUNTING
    # -------------------------------------------------------------
    elif scheme == "NET_ACCOUNTING":
        net_units = monthly_load_kwh - monthly_generation_kwh
        if net_units >= 0:
            # Consumption exceeds generation; pay retail tariff on net units
            post_solar_bill_details = calculate_domestic_bill(net_units, is_solar_prosumer=True, net_units=net_units)
            post_solar_bill = post_solar_bill_details["total_bill"]
            cash_export_revenue = 0.0
            monthly_bill_savings = pre_solar_bill - post_solar_bill
            net_monthly_benefit = monthly_bill_savings
        else:
            # Generation exceeds consumption; bill is zero, net export paid in cash!
            net_export = abs(net_units)
            post_solar_bill_details = calculate_domestic_bill(0.0, is_solar_prosumer=True, net_units=0.0)
            post_solar_bill = 0.0
            cash_export_revenue = round(net_export * export_rate, 2)
            monthly_bill_savings = pre_solar_bill
            net_monthly_benefit = monthly_bill_savings + cash_export_revenue
            
        scheme_summary = {
            "scheme_name": "Net Accounting",
            "net_export_kwh": max(0.0, round(monthly_generation_kwh - monthly_load_kwh, 1)),
            "cash_payout_lkr": cash_export_revenue,
            "export_rate_applied": export_rate
        }

    # -------------------------------------------------------------
    # 3. NET PLUS
    # -------------------------------------------------------------
    elif scheme == "NET_PLUS":
        # 100% of generation is sold to CEB at export rate
        cash_export_revenue = round(monthly_generation_kwh * export_rate, 2)
        # 100% of domestic consumption is imported and paid as regular bill
        post_solar_bill_details = pre_solar_bill_details
        post_solar_bill = pre_solar_bill
        monthly_bill_savings = 0.0 # Bill is not reduced directly
        net_monthly_benefit = cash_export_revenue # Cash income from solar
        
        scheme_summary = {
            "scheme_name": "Net Plus",
            "gross_export_kwh": round(monthly_generation_kwh, 1),
            "cash_payout_lkr": cash_export_revenue,
            "export_rate_applied": export_rate
        }
    else:
        # Default fallback to Net Accounting
        return evaluate_solar_scheme("NET_ACCOUNTING", monthly_load_kwh, monthly_generation_kwh, system_capacity_kwp)

    return {
        "pre_solar_bill_lkr": round(pre_solar_bill, 2),
        "post_solar_bill_lkr": round(post_solar_bill, 2),
        "monthly_bill_savings_lkr": round(monthly_bill_savings, 2),
        "cash_export_revenue_lkr": round(cash_export_revenue, 2),
        "net_monthly_benefit_lkr": round(net_monthly_benefit, 2),
        "annual_net_benefit_lkr": round(net_monthly_benefit * 12.0, 2),
        "pre_solar_breakdown": pre_solar_bill_details,
        "post_solar_breakdown": post_solar_bill_details,
        "energy_flow": {
            "monthly_load_kwh": round(monthly_load_kwh, 1),
            "monthly_generation_kwh": round(monthly_generation_kwh, 1),
            "direct_self_consumed_kwh": round(direct_self_consumed, 1),
            "grid_export_kwh": round(grid_exported_kwh, 1),
            "grid_import_kwh": round(grid_imported_kwh, 1)
        },
        "scheme_details": scheme_summary
    }
