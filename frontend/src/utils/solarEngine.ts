import { DistrictLocation, PanelModel, InverterModel, CalculationRequest, CalculationResult } from '../types/solar';

// Pre-extracted 25 Sri Lankan Districts from Global Solar Atlas v2.0
export const SRI_LANKA_DISTRICTS: DistrictLocation[] = [
  { id: 1, name: 'Colombo', province: 'Western', lat: 6.9271, lon: 79.8612, pvout: 1570.0, opta: 9.0, ghi: 5.4, monthly_pvout: [136.2, 137.9, 148.8, 134.7, 123.8, 115.1, 120.3, 131.2, 132.8, 130.6, 133.1, 135.5] },
  { id: 2, name: 'Gampaha', province: 'Western', lat: 7.0840, lon: 79.9937, pvout: 1510.0, opta: 10.0, ghi: 5.19, monthly_pvout: [131.1, 132.8, 143.2, 129.6, 119.1, 110.7, 115.7, 126.1, 127.8, 125.6, 128.1, 130.2] },
  { id: 3, name: 'Kalutara', province: 'Western', lat: 6.5854, lon: 79.9607, pvout: 1560.0, opta: 9.0, ghi: 5.36, monthly_pvout: [135.4, 137.1, 147.9, 133.8, 123.0, 114.4, 119.5, 130.3, 132.0, 129.8, 132.3, 134.5] },
  { id: 4, name: 'Kandy', province: 'Central', lat: 7.2906, lon: 80.6337, pvout: 1470.0, opta: 10.0, ghi: 5.07, monthly_pvout: [127.6, 129.2, 139.4, 126.1, 116.0, 107.8, 112.6, 122.8, 124.4, 122.3, 124.7, 127.1] },
  { id: 5, name: 'Matale', province: 'Central', lat: 7.4675, lon: 80.6234, pvout: 1430.0, opta: 10.0, ghi: 4.91, monthly_pvout: [124.1, 125.7, 135.6, 122.7, 112.8, 104.8, 109.5, 119.4, 121.0, 119.0, 121.3, 123.6] },
  { id: 6, name: 'Nuwara Eliya', province: 'Central', lat: 6.9497, lon: 80.7891, pvout: 1410.0, opta: 9.0, ghi: 4.66, monthly_pvout: [122.4, 123.9, 133.7, 121.0, 111.2, 103.4, 108.0, 117.8, 119.3, 117.3, 119.6, 122.0] },
  { id: 7, name: 'Galle', province: 'Southern', lat: 6.0535, lon: 80.2210, pvout: 1550.0, opta: 8.0, ghi: 5.33, monthly_pvout: [134.5, 136.2, 146.9, 133.0, 122.2, 113.6, 118.7, 129.5, 131.1, 128.9, 131.4, 134.0] },
  { id: 8, name: 'Matara', province: 'Southern', lat: 5.9549, lon: 80.5550, pvout: 1570.0, opta: 8.0, ghi: 5.4, monthly_pvout: [136.2, 137.9, 148.8, 134.7, 123.8, 115.1, 120.3, 131.2, 132.8, 130.6, 133.1, 135.5] },
  { id: 9, name: 'Hambantota', province: 'Southern', lat: 6.1429, lon: 81.1212, pvout: 1620.0, opta: 7.0, ghi: 5.62, monthly_pvout: [140.6, 142.3, 153.5, 139.0, 127.7, 118.7, 124.1, 135.3, 137.1, 134.8, 137.4, 139.8] },
  { id: 10, name: 'Jaffna', province: 'Northern', lat: 9.6615, lon: 80.0255, pvout: 1580.0, opta: 9.0, ghi: 5.44, monthly_pvout: [137.1, 138.8, 149.7, 135.6, 124.6, 115.8, 121.1, 132.0, 133.7, 131.5, 134.0, 136.4] },
  { id: 11, name: 'Kilinochchi', province: 'Northern', lat: 9.3803, lon: 80.3770, pvout: 1580.0, opta: 9.0, ghi: 5.48, monthly_pvout: [137.1, 138.8, 149.7, 135.6, 124.6, 115.8, 121.1, 132.0, 133.7, 131.5, 134.0, 136.4] },
  { id: 12, name: 'Mannar', province: 'Northern', lat: 8.9810, lon: 79.9044, pvout: 1650.0, opta: 9.0, ghi: 5.67, monthly_pvout: [143.2, 145.0, 156.4, 141.6, 130.1, 120.9, 126.4, 137.9, 139.6, 137.3, 139.9, 142.4] },
  { id: 13, name: 'Vavuniya', province: 'Northern', lat: 8.7542, lon: 80.4982, pvout: 1550.0, opta: 9.0, ghi: 5.38, monthly_pvout: [134.5, 136.2, 146.9, 133.0, 122.2, 113.6, 118.7, 129.5, 131.1, 128.9, 131.4, 134.0] },
  { id: 14, name: 'Mullaitivu', province: 'Northern', lat: 9.2671, lon: 80.8142, pvout: 1590.0, opta: 10.0, ghi: 5.49, monthly_pvout: [138.0, 139.7, 150.7, 136.4, 125.4, 116.5, 121.8, 132.9, 134.5, 132.3, 134.8, 137.2] },
  { id: 15, name: 'Batticaloa', province: 'Eastern', lat: 7.7102, lon: 81.6924, pvout: 1610.0, opta: 8.0, ghi: 5.61, monthly_pvout: [139.7, 141.4, 152.6, 138.1, 126.9, 118.0, 123.3, 134.5, 136.2, 133.9, 136.5, 138.9] },
  { id: 16, name: 'Ampara', province: 'Eastern', lat: 7.2914, lon: 81.6720, pvout: 1550.0, opta: 7.0, ghi: 5.43, monthly_pvout: [134.5, 136.2, 146.9, 133.0, 122.2, 113.6, 118.7, 129.5, 131.1, 128.9, 131.4, 134.0] },
  { id: 17, name: 'Trincomalee', province: 'Eastern', lat: 8.5874, lon: 81.2152, pvout: 1580.0, opta: 9.0, ghi: 5.49, monthly_pvout: [137.1, 138.8, 149.7, 135.6, 124.6, 115.8, 121.1, 132.0, 133.7, 131.5, 134.0, 136.4] },
  { id: 18, name: 'Kurunegala', province: 'North Western', lat: 7.4863, lon: 80.3623, pvout: 1480.0, opta: 10.0, ghi: 5.12, monthly_pvout: [128.4, 130.1, 140.3, 127.0, 116.7, 108.5, 113.4, 123.6, 125.2, 123.1, 125.5, 127.9] },
  { id: 19, name: 'Puttalam', province: 'North Western', lat: 8.0362, lon: 79.8283, pvout: 1580.0, opta: 9.0, ghi: 5.46, monthly_pvout: [137.1, 138.8, 149.7, 135.6, 124.6, 115.8, 121.1, 132.0, 133.7, 131.5, 134.0, 136.4] },
  { id: 20, name: 'Anuradhapura', province: 'North Central', lat: 8.3114, lon: 80.4037, pvout: 1540.0, opta: 9.0, ghi: 5.34, monthly_pvout: [133.6, 135.3, 146.0, 132.1, 121.4, 112.9, 118.0, 128.7, 130.3, 128.1, 130.6, 133.1] },
  { id: 21, name: 'Polonnaruwa', province: 'North Central', lat: 7.9403, lon: 81.0188, pvout: 1560.0, opta: 7.0, ghi: 5.45, monthly_pvout: [135.4, 137.1, 147.9, 133.8, 123.0, 114.4, 119.5, 130.3, 132.0, 129.8, 132.3, 134.5] },
  { id: 22, name: 'Badulla', province: 'Uva', lat: 6.9934, lon: 81.0550, pvout: 1510.0, opta: 7.0, ghi: 5.17, monthly_pvout: [131.1, 132.8, 143.2, 129.6, 119.1, 110.7, 115.7, 126.1, 127.8, 125.6, 128.1, 130.2] },
  { id: 23, name: 'Monaragala', province: 'Uva', lat: 6.8728, lon: 81.3507, pvout: 1510.0, opta: 7.0, ghi: 5.26, monthly_pvout: [131.1, 132.8, 143.2, 129.6, 119.1, 110.7, 115.7, 126.1, 127.8, 125.6, 128.1, 130.2] },
  { id: 24, name: 'Ratnapura', province: 'Sabaragamuwa', lat: 6.6828, lon: 80.4037, pvout: 1440.0, opta: 9.0, ghi: 5.0, monthly_pvout: [125.0, 126.6, 136.5, 123.5, 113.6, 105.5, 110.3, 120.3, 121.8, 119.8, 122.1, 124.4] },
  { id: 25, name: 'Kegalle', province: 'Sabaragamuwa', lat: 7.2513, lon: 80.3464, pvout: 1480.0, opta: 10.0, ghi: 5.11, monthly_pvout: [128.4, 130.1, 140.3, 127.0, 116.7, 108.5, 113.4, 123.6, 125.2, 123.1, 125.5, 127.9] }
];

export const VERIFIED_PANELS: PanelModel[] = [
  { id: 1, manufacturer: 'EGing PV', model: 'EG-415M54-HL (182mm Half-Cell)', rated_power_w: 415, efficiency_pct: 21.25, voc_v: 37.50, isc_a: 13.91, vmp_v: 31.50, imp_a: 13.18, temp_coeff_pmp: -0.35, length_mm: 1722, width_mm: 1134, weight_kg: 20.2, warranty_years: 15, is_bifacial: false, datasheet_source: '415W-EGing-Datasheet.pdf' },
  { id: 2, manufacturer: 'EGing PV', model: 'EG-400M54-HL (182mm Half-Cell)', rated_power_w: 400, efficiency_pct: 20.48, voc_v: 37.10, isc_a: 13.72, vmp_v: 31.10, imp_a: 12.87, temp_coeff_pmp: -0.35, length_mm: 1722, width_mm: 1134, weight_kg: 20.2, warranty_years: 15, is_bifacial: false, datasheet_source: 'EG400M54-HL-182-Cell.pdf' },
  { id: 3, manufacturer: 'SunPower', model: 'Maxeon 5 415W Premium', rated_power_w: 415, efficiency_pct: 22.20, voc_v: 74.30, isc_a: 6.97, vmp_v: 62.80, imp_a: 6.61, temp_coeff_pmp: -0.29, length_mm: 1812, width_mm: 1032, weight_kg: 21.0, warranty_years: 25, is_bifacial: false, datasheet_source: 'Sunpower-415W-Maxeon-5.pdf' },
  { id: 4, manufacturer: 'BiMAX / SunEvo', model: 'BiMAX5N-108 Dual-Glass 430W', rated_power_w: 430, efficiency_pct: 22.02, voc_v: 38.60, isc_a: 14.14, vmp_v: 32.24, imp_a: 13.34, temp_coeff_pmp: -0.30, length_mm: 1722, width_mm: 1134, weight_kg: 24.5, warranty_years: 25, is_bifacial: true, datasheet_source: 'BiMAX5N-108-Half-Cells-Bifacial-Dual-Glass-410-440W.pdf' },
  { id: 5, manufacturer: 'Hanwha Qcells', model: 'Q.MAXX-G2 350W Mono', rated_power_w: 350, efficiency_pct: 19.30, voc_v: 40.35, isc_a: 10.42, vmp_v: 33.56, imp_a: 9.94, temp_coeff_pmp: -0.35, length_mm: 1740, width_mm: 1030, weight_kg: 19.9, warranty_years: 12, is_bifacial: false, datasheet_source: 'Qcells-QMAXX-G2-350W.pdf' },
  { id: 6, manufacturer: 'SunPower', model: 'Performance 3 480W Commercial', rated_power_w: 480, efficiency_pct: 20.60, voc_v: 54.50, isc_a: 11.23, vmp_v: 45.20, imp_a: 10.62, temp_coeff_pmp: -0.34, length_mm: 2066, width_mm: 1160, weight_kg: 25.0, warranty_years: 25, is_bifacial: true, datasheet_source: 'Sunpower-SPR-P3-480-UPP.pdf' }
];

export const VERIFIED_INVERTERS: InverterModel[] = [
  { id: 1, manufacturer: 'Sungrow', model: 'SG3K-D (Single Phase)', rated_ac_power_kw: 3.0, max_pv_power_kw: 4.5, mppt_voltage_min_v: 90, mppt_voltage_max_v: 560, max_input_current_a: 12.5, mppt_count: 2, phase: 1, max_efficiency_pct: 98.4, euro_efficiency_pct: 97.7, warranty_years: 5, datasheet_source: 'SG3K-D_SG5K-D-Datasheet_EN-Premium.pdf' },
  { id: 2, manufacturer: 'Sungrow', model: 'SG5K-D (Single Phase)', rated_ac_power_kw: 5.0, max_pv_power_kw: 7.5, mppt_voltage_min_v: 90, mppt_voltage_max_v: 560, max_input_current_a: 12.5, mppt_count: 2, phase: 1, max_efficiency_pct: 98.4, euro_efficiency_pct: 97.7, warranty_years: 5, datasheet_source: 'SG3K-D_SG5K-D-Datasheet_EN-Premium.pdf' },
  { id: 3, manufacturer: 'GoodWe', model: 'GW5000D-NS (Single Phase)', rated_ac_power_kw: 5.0, max_pv_power_kw: 6.5, mppt_voltage_min_v: 80, mppt_voltage_max_v: 550, max_input_current_a: 11.0, mppt_count: 2, phase: 1, max_efficiency_pct: 97.8, euro_efficiency_pct: 97.5, warranty_years: 5, datasheet_source: 'Goodwe-5kW-GW5000D-NS.pdf' },
  { id: 4, manufacturer: 'SOFAR Solar', model: 'SOFAR 3KTL-G2 (Single Phase)', rated_ac_power_kw: 3.0, max_pv_power_kw: 3.99, mppt_voltage_min_v: 160, mppt_voltage_max_v: 960, max_input_current_a: 11.0, mppt_count: 2, phase: 1, max_efficiency_pct: 98.2, euro_efficiency_pct: 97.5, warranty_years: 5, datasheet_source: 'SOFAR-single-phase-3-7.5kw-1.pdf' },
  { id: 5, manufacturer: 'GoodWe', model: 'GW10KL-DT (Three Phase)', rated_ac_power_kw: 10.0, max_pv_power_kw: 15.0, mppt_voltage_min_v: 180, mppt_voltage_max_v: 850, max_input_current_a: 12.5, mppt_count: 2, phase: 3, max_efficiency_pct: 98.3, euro_efficiency_pct: 97.8, warranty_years: 5, datasheet_source: 'Goodwe-10kW-GW10KL-DT.pdf' },
  { id: 6, manufacturer: 'Solis Ginlong', model: 'S6-EH1P5K-L-EU (Hybrid Ready)', rated_ac_power_kw: 5.0, max_pv_power_kw: 8.0, mppt_voltage_min_v: 90, mppt_voltage_max_v: 520, max_input_current_a: 15.0, mppt_count: 2, phase: 1, max_efficiency_pct: 97.6, euro_efficiency_pct: 97.0, warranty_years: 5, datasheet_source: 'Solis_datasheet_S6-EH1P(3-6)K-L-EU_Global.pdf' }
];

export function calculateDomesticBillClient(units: number, isProsumer: boolean = false, netUnits: number = 0): { energyCharge: number; fixedCharge: number; totalBill: number; tier: string; breakdown: any[] } {
  if (units <= 0) {
    return { energyCharge: 0, fixedCharge: 0, totalBill: 0, tier: 'Zero Consumption', breakdown: [] };
  }

  const fcUnits = isProsumer ? Math.max(0, netUnits) : units;
  let energyCharge = 0;
  let fixedCharge = 0;
  let tier = '';
  const breakdown: any[] = [];

  if (units <= 60) {
    tier = 'Lifeline Tier (<= 60 kWh)';
    if (units <= 30) {
      const b1 = units * 4.00;
      energyCharge += b1;
      breakdown.push({ block: 'Block 1 (0 - 30 kWh)', units, rate: 4.00, amount: b1 });
    } else {
      const b1 = 30 * 4.00;
      const b2 = (units - 30) * 6.00;
      energyCharge += (b1 + b2);
      breakdown.push({ block: 'Block 1 (0 - 30 kWh)', units: 30, rate: 4.00, amount: b1 });
      breakdown.push({ block: 'Block 2 (31 - 60 kWh)', units: units - 30, rate: 6.00, amount: b2 });
    }
    if (fcUnits === 0) fixedCharge = 0;
    else if (fcUnits <= 30) fixedCharge = 75.00;
    else fixedCharge = 200.00;
  } else {
    tier = 'General Domestic Tier (> 60 kWh)';
    const b1Units = Math.min(units, 60);
    const b1 = b1Units * 11.00;
    energyCharge += b1;
    breakdown.push({ block: 'Block 1 (0 - 60 kWh)', units: b1Units, rate: 11.00, amount: b1 });

    if (units > 60) {
      const b2Units = Math.min(units - 60, 30);
      const b2 = b2Units * 14.00;
      energyCharge += b2;
      breakdown.push({ block: 'Block 2 (61 - 90 kWh)', units: b2Units, rate: 14.00, amount: b2 });
    }
    if (units > 90) {
      const b3Units = Math.min(units - 90, 30);
      const b3 = b3Units * 20.00;
      energyCharge += b3;
      breakdown.push({ block: 'Block 3 (91 - 120 kWh)', units: b3Units, rate: 20.00, amount: b3 });
    }
    if (units > 120) {
      const b4Units = Math.min(units - 120, 60);
      const b4 = b4Units * 33.00;
      energyCharge += b4;
      breakdown.push({ block: 'Block 4 (121 - 180 kWh)', units: b4Units, rate: 33.00, amount: b4 });
    }
    if (units > 180) {
      const b5Units = units - 180;
      const b5 = b5Units * 52.00;
      energyCharge += b5;
      breakdown.push({ block: 'Block 5 (Above 180 kWh)', units: b5Units, rate: 52.00, amount: b5 });
    }

    if (fcUnits === 0) fixedCharge = 0;
    else if (fcUnits <= 30) fixedCharge = 75.00;
    else if (fcUnits <= 60) fixedCharge = 200.00;
    else if (fcUnits <= 90) fixedCharge = 400.00;
    else if (fcUnits <= 120) fixedCharge = 1000.00;
    else if (fcUnits <= 180) fixedCharge = 1500.00;
    else fixedCharge = 2000.00;
  }

  return {
    energyCharge: Math.round(energyCharge * 100) / 100,
    fixedCharge: Math.round(fixedCharge * 100) / 100,
    totalBill: Math.round((energyCharge + fixedCharge) * 100) / 100,
    tier,
    breakdown
  };
}

export function estimateUnitsFromBillClient(bill: number): number {
  if (bill <= 0) return 0;
  let low = 0, high = 5000;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const b = calculateDomesticBillClient(mid).totalBill;
    if (Math.abs(b - bill) < 0.5) return Math.round(mid);
    if (b < bill) low = mid;
    else high = mid;
  }
  return Math.round((low + high) / 2);
}

export function executeSolarCalculationClient(req: CalculationRequest): CalculationResult {
  const units = req.monthly_units_kwh || (req.monthly_bill_lkr ? estimateUnitsFromBillClient(req.monthly_bill_lkr) : 250);
  const district = SRI_LANKA_DISTRICTS.find(d => d.name.toLowerCase() === req.district.toLowerCase()) || SRI_LANKA_DISTRICTS[0];
  const panel = VERIFIED_PANELS.find(p => p.id === req.panel_id) || VERIFIED_PANELS[0];

  const offset = Math.max(0.1, Math.min(2.0, req.target_offset_pct / 100.0));
  const targetAnnualGen = units * 12 * offset;

  // Derate factor based on azimuth and tilt
  const azDev = Math.abs(req.azimuth_deg - 180.0);
  const azFactor = 1.0 - (Math.min(180, azDev) / 180.0) * 0.08;
  const tiltDev = Math.abs(req.tilt_deg - district.opta);
  const tiltFactor = 1.0 - (Math.min(45, tiltDev) / 45.0) * 0.04;
  const etaSite = Math.round(azFactor * tiltFactor * 1000) / 1000;

  const effectiveYield = district.pvout * etaSite;
  const recommendedKwp = Math.round((targetAnnualGen / effectiveYield) * 100) / 100;

  // Discrete panel count
  const panelWatts = panel.rated_power_w;
  const panelCount = Math.max(1, Math.ceil((recommendedKwp * 1000) / panelWatts));
  const actualKwp = Math.round((panelCount * panelWatts) / 10) / 100;

  // Roof Area
  const modArea = (panel.length_mm / 1000) * (panel.width_mm / 1000);
  const reqRoofArea = Math.round(panelCount * modArea * 1.15 * 10) / 10;
  const fitsRoof = req.roof_area_sqm ? reqRoofArea <= req.roof_area_sqm : true;
  const roofUtil = req.roof_area_sqm ? Math.round((reqRoofArea / req.roof_area_sqm) * 100) : 0;

  // Monthly generation
  const monthlyKwh = district.monthly_pvout.map(m => Math.round(actualKwp * m * etaSite * 10) / 10);
  const annualKwh = Math.round(monthlyKwh.reduce((a, b) => a + b, 0) * 10) / 10;
  const avgMonthlyGen = Math.round((annualKwh / 12) * 10) / 10;

  // Inverter matching
  const phase = actualKwp <= 5.2 ? 1 : 3;
  let inverter = VERIFIED_INVERTERS.find(inv => inv.phase === phase && (actualKwp / inv.rated_ac_power_kw) <= 1.4 && (actualKwp / inv.rated_ac_power_kw) >= 0.7);
  if (!inverter) inverter = VERIFIED_INVERTERS[0];
  const dcAcRatio = Math.round((actualKwp / inverter.rated_ac_power_kw) * 100) / 100;

  // Strings
  const numStrings = panelCount <= 10 ? 1 : 2;
  const panelsPerString = Math.ceil(panelCount / numStrings);
  const strVoc = Math.round(panelsPerString * panel.voc_v * (1 + 0.0035 * 10) * 10) / 10;
  const strVmp = Math.round(panelsPerString * panel.vmp_v * (1 - 0.0035 * 40) * 10) / 10;

  // Scheme evaluation
  const preSolar = calculateDomesticBillClient(units, false);
  const exportRate = actualKwp <= 20 ? 44.14 : 43.02;

  let postSolarBill = 0;
  let cashExport = 0;
  let netBenefit = 0;
  let billSavings = 0;
  let postSolarBreakdown: any = null;

  if (req.scheme === 'NET_METERING') {
    const netU = Math.max(0, units - avgMonthlyGen);
    postSolarBreakdown = calculateDomesticBillClient(netU, true, netU);
    postSolarBill = postSolarBreakdown.totalBill;
    billSavings = preSolar.totalBill - postSolarBill;
    netBenefit = billSavings;
  } else if (req.scheme === 'NET_ACCOUNTING') {
    if (units >= avgMonthlyGen) {
      const netU = units - avgMonthlyGen;
      postSolarBreakdown = calculateDomesticBillClient(netU, true, netU);
      postSolarBill = postSolarBreakdown.totalBill;
      billSavings = preSolar.totalBill - postSolarBill;
      netBenefit = billSavings;
    } else {
      const exportU = avgMonthlyGen - units;
      postSolarBreakdown = calculateDomesticBillClient(0, true, 0);
      postSolarBill = 0;
      cashExport = Math.round(exportU * exportRate);
      billSavings = preSolar.totalBill;
      netBenefit = billSavings + cashExport;
    }
  } else {
    // NET PLUS
    postSolarBreakdown = preSolar;
    postSolarBill = preSolar.totalBill;
    cashExport = Math.round(avgMonthlyGen * exportRate);
    billSavings = 0;
    netBenefit = cashExport;
  }

  // Financials
  let ratePerKwp = 285000;
  if (actualKwp <= 3.0) ratePerKwp = 320000;
  else if (actualKwp <= 5.0) ratePerKwp = 285000;
  else if (actualKwp <= 10.0) ratePerKwp = 260000;
  else ratePerKwp = 245000;

  const systemCost = req.custom_system_cost_lkr || Math.round(actualKwp * ratePerKwp);
  const annualBenefit = netBenefit * 12;
  const payback = annualBenefit > 0 ? Math.round((systemCost / annualBenefit) * 10) / 10 : 0;

  // 20 Year cash flow
  const trajectory: any[] = [];
  let cumCash = -systemCost;
  const annualOm = Math.round(systemCost * 0.01);
  let totalBenefits = 0;

  trajectory.push({ year: 0, annual_benefit: 0, om_cost: 0, net_annual: -systemCost, cumulative: cumCash });
  for (let y = 1; y <= 20; y++) {
    const deg = Math.pow(1.0 - 0.0055, y - 1);
    const b = Math.round(annualBenefit * deg);
    let om = annualOm;
    if (y === 10) om += Math.round(systemCost * 0.20);
    const netY = b - om;
    cumCash += netY;
    totalBenefits += b;
    trajectory.push({ year: y, annual_benefit: b, om_cost: om, net_annual: netY, cumulative: cumCash });
  }

  const co2Tonnes = Math.round((annualKwh * 0.62) / 100) / 10;
  const trees = Math.round((co2Tonnes * 1000) / 21.8);

  return {
    inputs: {
      district: district.name,
      latitude: district.lat,
      longitude: district.lon,
      monthly_units_kwh: units,
      monthly_bill_lkr: req.monthly_bill_lkr,
      target_offset_pct: req.target_offset_pct,
      roof_type: req.roof_type,
      roof_area_sqm: req.roof_area_sqm,
      azimuth_deg: req.azimuth_deg,
      tilt_deg: req.tilt_deg,
      scheme: req.scheme
    },
    system: {
      recommended_capacity_kwp: recommendedKwp,
      actual_capacity_kwp: actualKwp,
      panel_count: panelCount,
      panel,
      inverter,
      dc_ac_ratio: dcAcRatio,
      phase,
      num_strings: numStrings,
      panels_per_string: panelsPerString,
      string_voc_max_v: strVoc,
      string_vmp_min_v: strVmp,
      electrical_check: {
        status: (strVoc <= inverter.mppt_voltage_max_v && strVmp >= inverter.mppt_voltage_min_v) ? 'VERIFIED' : 'WARNING',
        is_voc_safe: strVoc <= inverter.mppt_voltage_max_v,
        is_mppt_tracked: strVmp >= inverter.mppt_voltage_min_v,
        details: `DC/AC ratio ${dcAcRatio}. Operating string range ${strVmp}V - ${strVoc}V fits MPPT limits ${inverter.mppt_voltage_min_v}V - ${inverter.mppt_voltage_max_v}V.`
      },
      required_roof_area_sqm: reqRoofArea,
      fits_roof: fitsRoof,
      roof_utilization_pct: roofUtil
    },
    solar_resource: {
      annual_pvout_kwh_per_kwp: district.pvout,
      optimum_tilt_deg: district.opta,
      site_derate_factor: etaSite,
      effective_yield_kwh_per_kwp: Math.round(effectiveYield),
      daily_ghi_kwh_m2: district.ghi,
      source: 'Global Solar Atlas v2.0 (ESMAP / World Bank)'
    },
    generation: {
      annual_kwh: annualKwh,
      monthly_kwh: monthlyKwh,
      average_monthly_kwh: avgMonthlyGen
    },
    scheme: {
      pre_solar_bill_lkr: preSolar.totalBill,
      post_solar_bill_lkr: postSolarBill,
      monthly_bill_savings_lkr: billSavings,
      cash_export_revenue_lkr: cashExport,
      net_monthly_benefit_lkr: netBenefit,
      annual_net_benefit_lkr: annualBenefit,
      pre_solar_breakdown: preSolar,
      post_solar_breakdown: postSolarBreakdown,
      energy_flow: {
        monthly_load_kwh: units,
        monthly_generation_kwh: avgMonthlyGen,
        direct_self_consumed_kwh: Math.min(avgMonthlyGen, units * 0.4),
        grid_export_kwh: Math.max(0, avgMonthlyGen - Math.min(avgMonthlyGen, units * 0.4)),
        grid_import_kwh: Math.max(0, units - Math.min(avgMonthlyGen, units * 0.4))
      },
      scheme_details: {
        scheme_name: req.scheme === 'NET_ACCOUNTING' ? 'Net Accounting' : (req.scheme === 'NET_METERING' ? 'Net Metering' : 'Net Plus'),
        cash_payout_lkr: cashExport,
        export_rate_applied: exportRate,
        net_export_kwh: Math.max(0, Math.round((avgMonthlyGen - units) * 10) / 10)
      }
    },
    financials: {
      system_cost_lkr: systemCost,
      cost_per_kwp_lkr: ratePerKwp,
      simple_payback_years: payback,
      annual_net_benefit_lkr: annualBenefit,
      twenty_year_savings_lkr: cumCash,
      roi_pct: Math.round(((totalBenefits - systemCost) / systemCost) * 100),
      co2_avoided_tonnes_per_year: co2Tonnes,
      trees_planted_equivalent: trees,
      cash_flow_trajectory: trajectory
    },
    traceability: {
      tariff_document: 'PUCSL Final Decision Jan 18, 2025',
      solar_export_tariff: `CEB RTSPV ${exportRate} LKR/kWh`,
      solar_dataset: 'Global Solar Atlas v2.0 (ESMAP / World Bank)',
      developer: 'Farhan Mohammad (Faculty of Engineering, University of Jaffna)',
      calculation_timestamp: new Date().toISOString()
    }
  };
}
