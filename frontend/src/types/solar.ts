export interface DistrictLocation {
  id: number;
  name: string;
  province: string;
  lat: number;
  lon: number;
  pvout: number;
  opta: number;
  ghi: number;
  monthly_pvout: number[];
}

export interface PanelModel {
  id: number;
  manufacturer: string;
  model: string;
  rated_power_w: number;
  efficiency_pct: number;
  voc_v: number;
  isc_a: number;
  vmp_v: number;
  imp_a: number;
  temp_coeff_pmp: number;
  length_mm: number;
  width_mm: number;
  weight_kg: number;
  warranty_years: number;
  is_bifacial: boolean;
  datasheet_source: string;
}

export interface InverterModel {
  id: number;
  manufacturer: string;
  model: string;
  rated_ac_power_kw: number;
  max_pv_power_kw: number;
  mppt_voltage_min_v: number;
  mppt_voltage_max_v: number;
  max_input_current_a: number;
  mppt_count: number;
  phase: number;
  max_efficiency_pct: number;
  euro_efficiency_pct: number;
  warranty_years: number;
  datasheet_source: string;
}

export interface CalculationRequest {
  district: string;
  latitude: number;
  longitude: number;
  monthly_units_kwh?: number;
  monthly_bill_lkr?: number;
  target_offset_pct: number;
  scheme: 'NET_ACCOUNTING' | 'NET_METERING' | 'NET_PLUS';
  roof_type: 'ASBESTOS' | 'CLAY_TILE' | 'CORRUGATED_ZINC' | 'CONCRETE_SLAB';
  roof_area_sqm?: number;
  azimuth_deg: number;
  tilt_deg: number;
  panel_id?: number;
  custom_system_cost_lkr?: number;
}

export interface CalculationResult {
  inputs: {
    district: string;
    latitude: number;
    longitude: number;
    monthly_units_kwh: number;
    monthly_bill_lkr?: number;
    target_offset_pct: number;
    roof_type: string;
    roof_area_sqm?: number;
    azimuth_deg: number;
    tilt_deg: number;
    scheme: string;
  };
  system: {
    recommended_capacity_kwp: number;
    actual_capacity_kwp: number;
    panel_count: number;
    panel: PanelModel;
    inverter: InverterModel;
    dc_ac_ratio: number;
    phase: number;
    num_strings: number;
    panels_per_string: number;
    string_voc_max_v: number;
    string_vmp_min_v: number;
    electrical_check: {
      status: string;
      is_voc_safe: boolean;
      is_mppt_tracked: boolean;
      details: string;
    };
    required_roof_area_sqm: number;
    fits_roof: boolean;
    roof_utilization_pct: number;
  };
  solar_resource: {
    annual_pvout_kwh_per_kwp: number;
    optimum_tilt_deg: number;
    site_derate_factor: number;
    effective_yield_kwh_per_kwp: number;
    daily_ghi_kwh_m2: number;
    source: string;
  };
  generation: {
    annual_kwh: number;
    monthly_kwh: number[];
    average_monthly_kwh: number;
  };
  scheme: {
    pre_solar_bill_lkr: number;
    post_solar_bill_lkr: number;
    monthly_bill_savings_lkr: number;
    cash_export_revenue_lkr: number;
    net_monthly_benefit_lkr: number;
    annual_net_benefit_lkr: number;
    pre_solar_breakdown: any;
    post_solar_breakdown: any;
    energy_flow: {
      monthly_load_kwh: number;
      monthly_generation_kwh: number;
      direct_self_consumed_kwh: number;
      grid_export_kwh: number;
      grid_import_kwh: number;
    };
    scheme_details: {
      scheme_name: string;
      net_export_kwh?: number;
      gross_export_kwh?: number;
      banked_energy_credits_kwh?: number;
      cash_payout_lkr: number;
      export_rate_applied: number;
    };
  };
  financials: {
    system_cost_lkr: number;
    cost_per_kwp_lkr: number;
    simple_payback_years: number;
    annual_net_benefit_lkr: number;
    twenty_year_savings_lkr: number;
    roi_pct: number;
    co2_avoided_tonnes_per_year: number;
    trees_planted_equivalent: number;
    cash_flow_trajectory: Array<{
      year: number;
      annual_benefit: number;
      om_cost: number;
      net_annual: number;
      cumulative: number;
    }>;
  };
  traceability: {
    tariff_document: string;
    solar_export_tariff: string;
    solar_dataset: string;
    developer: string;
    calculation_timestamp: string;
  };
}
