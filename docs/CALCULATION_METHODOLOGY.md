# SolarCalc LK V1.0 — Engineering Calculation Methodology

This document outlines the mathematical models, formulas, algorithms, and regulatory rules implemented in the SolarCalc LK V1.0 engineering calculation engine.

---

## 1. Solar PV Sizing Formulation
Given a user monthly electricity consumption E_load (in kWh) and a target energy offset ratio f_offset (default 1.0 = 100%):

1. **Target Annual Energy**:
   E_target = E_load * 12 * f_offset

2. **Required DC Peak Capacity (P_req)**:
   P_req = E_target / (Y_PV * eta_site)
   where:
   - Y_PV: Coordinate-specific annual PV yield from Global Solar Atlas in kWh/kWp/year.
   - eta_site: Site-specific correction factor accounting for tilt, orientation, and shading (nominal 0.98 for optimal south tilt).

3. **Discrete Module Selection & Practical Sizing**:
   Let P_panel be the rated STC power of the selected module in Watts (e.g., 415 Wp).
   N_panels = ceil(P_req * 1000 / P_panel)
   P_actual = N_panels * P_panel / 1000  [kWp]

---

## 2. Monthly Energy Generation Profile
Using the GSA 12-month specific yield rasters (y_m for m=1..12 in kWh/kWp):
E_PV_m = P_actual * y_m * eta_site
Sum(E_PV_m) = E_PV_annual

---

## 3. Inverter Sizing & Compatibility Logic
1. **DC-to-AC Sizing Ratio (R_DC/AC)**:
   R_DC/AC = P_actual / P_inv_AC
   Optimal design criteria: 1.10 <= R_DC/AC <= 1.35.
2. **Phase Determination**:
   - If P_actual <= 5.0 kWp -> Single-Phase (230V) grid interconnection.
   - If P_actual > 5.0 kWp -> Three-Phase (400V) grid interconnection.
3. **String Voltage Limits**:
   For ambient temperature extremes in Sri Lanka (T_min = 15C, T_max = 40C):
   Voc_max = N_series * Voc_STC * [1 + beta_Voc * (T_min - 25)] < V_max_inv
   Vmp_min = N_series * Vmp_STC * [1 + gamma_Pmp * (T_cell_max - 25)] > V_mppt_min

---

## 4. Sri Lankan Domestic Electricity Tariff Model (PUCSL Jan 18, 2025)
The billing algorithm strictly implements the January 2025 gazetted decision:

### Sub-Category A: Consumption <= 60 kWh/month (Lifeline Tier)
If total billing units U <= 60:
- If U <= 30: Energy Charge = U * 4.00 LKR; Fixed Charge = 75.00 LKR
- If 30 < U <= 60: Energy Charge = (30 * 4.00) + (U - 30) * 6.00 LKR; Fixed Charge = 200.00 LKR

### Sub-Category B: Consumption > 60 kWh/month (General Domestic Tier)
If total billing units U > 60, charges are calculated across cumulative brackets:
- Block 1 (0 - 60 kWh): min(U, 60) * 11.00 LKR
- Block 2 (61 - 90 kWh): max(0, min(U - 60, 30)) * 14.00 LKR
- Block 3 (91 - 120 kWh): max(0, min(U - 90, 30)) * 20.00 LKR
- Block 4 (121 - 180 kWh): max(0, min(U - 120, 60)) * 33.00 LKR
- Block 5 (> 180 kWh): max(0, U - 180) * 52.00 LKR

Fixed Charge based on total consumption tier:
- 60 < U <= 90: 400.00 LKR
- 90 < U <= 120: 1000.00 LKR
- 120 < U <= 180: 1500.00 LKR
- U > 180: 2000.00 LKR

### Condition 3 Compliance for Prosumers
As explicitly ordered by the PUCSL (Annex 2, Condition 3):
"Fixed charges for solar prosumers shall be based on the net consumption."

---

## 5. Solar Scheme Financial Balance
Let U_load be monthly consumption, U_gen be monthly solar generation, and T_export = 44.14 LKR/kWh:

1. **Net Metering**:
   - U_net = max(0, U_load - U_gen)
   - Net Bill = Tariff(U_net)
   - Monthly Savings = Tariff(U_load) - Net Bill
   - Banked Units = max(0, U_gen - U_load) (stored for future rolling offset)
2. **Net Accounting**:
   - If U_load >= U_gen:
     - Customer pays Tariff(U_load - U_gen)
     - Net Benefit = Tariff(U_load) - Tariff(U_load - U_gen)
   - If U_gen > U_load:
     - Customer electricity bill = 0.00 LKR
     - Cash Export Payout = (U_gen - U_load) * 44.14 LKR
     - Net Benefit = Tariff(U_load) + Cash Export Payout
3. **Net Plus**:
   - 100% Gross Export Revenue = U_gen * 44.14 LKR
   - 100% Retail Electricity Bill = Tariff(U_load)
   - Net Cash Flow = Export Revenue - Retail Bill
