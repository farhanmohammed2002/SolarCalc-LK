# SolarCalc LK V1.0 — Engineering Assumptions Register

This document records every engineering, physical, regulatory, and financial assumption implemented in SolarCalc LK V1.0, adhering to PUCSL Guidelines Revision 1 and IEC 61724 standards.

---

## 1. Solar Resource & Climatic Assumptions
1. **Specific PV Yield (Y_PV)**:
   - Primary Source: Global Solar Atlas (GSA v2.8), 30-arc-second (~1 km) raster ASCII grids.
   - Basis: Ground-validated satellite model incorporating 1999-2018 multi-year solar irradiance data.
   - Standard Operating Conditions: Cell temperature under local ambient temperature and irradiance, standard module temperature coefficient of Pmax (typically -0.35%/C to -0.38%/C).
   - Monthly Variability: Modeled using the 12-month Global Solar Atlas monthly ASCII grids (PVOUT_01.asc through PVOUT_12.asc).
2. **Optimum Tilt & Orientation**:
   - Optimal Azimuth: True South (180 deg or 0 deg South deviation) for Sri Lanka (latitude 5.9N to 9.8N).
   - Optimal Tilt: Derived per coordinate from GSA OPTA.asc (8 to 10 deg inclination).
   - Roof Orientation Derate: If a user specifies an East/West orientation, a geometrical cosine derate of 8-12% is applied based on standard transposition modeling.

---

## 2. Electrical & Balance of System (BOS) Losses
The calculation models the following distinct loss mechanisms:
1. **Inverter Conversion Efficiency**:
   - Assumption: 97.2% to 98.4% Euro-efficiency (sourced directly from inverter datasheets: Sungrow SG-D, GoodWe DNS/MS, SOFAR TL-G2).
2. **DC Cable Ohmics**:
   - Assumption: 1.5% loss based on standard 4 mm2 or 6 mm2 solar DC cable sizing under PUCSL guidelines (maximum allowable voltage drop < 3%).
3. **AC Wiring Losses**:
   - Assumption: 1.0% loss between inverter AC output and the utility distribution meter board.
4. **Module Mismatch & Manufacturing Tolerance**:
   - Assumption: 1.5% loss across connected series strings of tier-1 monocrystalline half-cell modules.
5. **Soiling, Dust & Monsoon Wash Factor**:
   - Assumption: 2.5% annual average soiling loss for typical Sri Lankan suburban/urban environments (higher in dry season Jan-March, self-cleaning during South-West & North-East monsoons).
6. **Auxiliary / Availability Loss**:
   - Assumption: 0.5% unavailability due to grid outages or maintenance.
7. **Total Combined Derate Factor**:
   - Overall derate factor: Performance Ratio ~82% - 85% for tropical grid-tied rooftop PV. Note that GSA PVOUT already embeds standard temperature and baseline inverter losses; our model avoids double-counting by applying only specific site mismatch, orientation, and cable variances.

---

## 3. Electricity Consumption & Load Profile Assumptions
1. **Load Distribution Profile**:
   - Without battery energy storage, residential self-consumption is limited by daytime occupancy.
   - Typical Daytime Self-Consumption Ratio (f_self):
     - Standard working household: 35% direct self-consumption during sunshine hours (08:00 - 17:00); 65% exported to grid.
     - Work-from-home / Daytime air conditioning: 55% self-consumption; 45% exported.
   - For **Net Metering**, daytime export rolls over 1:1 against evening import credits.
   - For **Net Accounting**, excess daytime generation is sold to CEB at 44.14 LKR/kWh and evening load is purchased at normal PUCSL retail rates.
   - For **Net Plus**, 100% of generation is exported to the grid at 44.14 LKR/kWh while 100% of domestic load is imported at retail rates.

---

## 4. Financial & Economic Assumptions
1. **Turnkey Capital Expenditure (CAPEX)**:
   - Sourced from current verified Sri Lankan solar EPC vendor market benchmarks (Q1 2025):
     - Systems <= 3 kWp: ~320,000 LKR/kWp installed.
     - Systems 3 - 5 kWp: ~285,000 LKR/kWp installed.
     - Systems 5 - 10 kWp: ~260,000 LKR/kWp installed.
     - Includes tier-1 panels, on-grid inverter, aluminum roof mounting structures, DC/AC switchgear (SPDs, MCBs, isolators), bidirectional meter fees, and CEB grid connection charges.
2. **Annual PV Degradation Rate**:
   - Assumption: 0.55% linear annual degradation as guaranteed by tier-1 manufacturers (EGing, Qcells, SunPower, BiMAX: 84.8% - 87.4% retained capacity at Year 25).
3. **Inverter Replacement**:
   - Inverter warranty is typically 5-10 years. A capital replacement allowance is modeled at Year 10 (evaluated at 25% of initial turnkey CAPEX).
4. **Operations & Maintenance (O&M)**:
   - Assumption: 1.0% of initial system cost per annum for bi-annual panel washing and inspection.
5. **Electricity Tariff Inflation**:
   - Baseline assumption: 0% real escalation (conservative evaluation under current PUCSL Jan 2025 revision).
6. **Simple Payback Period**:
   - Payback = Net Turnkey Initial Investment (LKR) / Year 1 Net Economic Benefit (LKR/year).
