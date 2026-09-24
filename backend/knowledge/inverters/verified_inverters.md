# Verified Solar Inverter Specifications & Sizing Standards

## Document Overview
- **Document ID**: INVERTERS-CATALOGUE-2025
- **Category**: Hardware Equipment & Inverters
- **Standard**: IEC 62109-1/2 (Inverter Safety), IEC 61727 / IEEE 1547 (Grid Interconnection), IEC 62548:2023 (PV Arrays)
- **Grid Compliance**: CEB / LECO Low Voltage Interconnection Standard (230V $\pm 6\%$ Single-Phase / 400V Three-Phase, 50 Hz $\pm 1\%$)

---

## 1. Verified Inverters in SolarCalc LK Database
SolarCalc LK models both grid-tied string inverters and advanced hybrid multi-mode energy storage inverters from leading global manufacturers.

### 1.1 Sungrow Residential Series (String Inverters)
- **SG3.0RS / SG5.0RS (Single-Phase)**:
  - Rated AC Power: 3.0 kW / 5.0 kW (230V, 50Hz)
  - Max DC Input: 4.5 kWp / 7.5 kWp (DC/AC up to 1.5)
  - MPPT Inputs: 2 independent MPPT trackers (1 string per MPPT)
  - MPPT Operating Voltage Range: **40 V to 560 V** (Full load: 160V–480V)
  - Max Inverter Efficiency: 97.9% | Euro Efficiency: 97.4%
  - Protection: Built-in DC disconnect switch, Type II SPD (DC and AC), AFCI (Arc Fault Circuit Interrupter).
- **SG8.0RT / SG10RT (Three-Phase)**:
  - Rated AC Power: 8.0 kW / 10.0 kW (400V 3L+N+PE)
  - MPPT Range: **160 V to 1000 V** | Max DC: 1100 V
  - Max Efficiency: 98.5%

### 1.2 Huawei SUN2000 Smart Energy Center
- **SUN2000-3KTL-L1 to SUN2000-6KTL-L1 (Single-Phase Hybrid-Ready)**:
  - Rated AC Power: 3.0 kW to 6.0 kW
  - Integrated Battery Interface: Direct DC coupling with Huawei LUNA2000 smart ESS.
  - MPPT Range: **90 V to 560 V** (Startup voltage 100V)
  - Max Efficiency: 98.4%
  - AI-Powered AFCI arc protection with 0.5s auto shutdown.
- **SUN2000-8KTL-M1 / SUN2000-10KTL-M1 (Three-Phase)**:
  - Rated AC Power: 8.0 kW / 10.0 kW
  - MPPT Range: **140 V to 980 V** | Max DC: 1100 V

### 1.3 Deye Hybrid & String Inverters
- **SUN-5K-SG04LP1-EU (5 kW Single-Phase Low-Voltage Hybrid)**:
  - Rated AC Power: 5,000 W (Peak 10,000 W for 10 seconds off-grid surge)
  - Battery Compatibility: 48V / 51.2V Low Voltage LiFePO4 batteries (Deye SE-G5.1, Pylontech, BYD)
  - Charge/Discharge Current: Up to 120A continuous
  - Transfer Time to Off-Grid Backup: **$< 4\text{ milliseconds}$** (Seamless UPS grade)
  - Dual MPPT: 125 V to 425 V
- **SUN-10K-SG04LP3-EU (10 kW Three-Phase Hybrid)**:
  - 10 kW continuous, 48V battery architecture, dual MPPT.

### 1.4 SMA Sunny Boy / Fronius Primo / GoodWe
- **SMA Sunny Boy 3.0–5.0**: German engineered, 100V–550V MPPT, SMA ShadeFix shade optimization.
- **Fronius Primo 3.0–8.2**: SnapINverter design, 80V–800V MPPT, Austrian quality.
- **GoodWe DNS / SDT G2 Series**: Cost-effective dual MPPT string inverters, 80V–550V range.

---

## 2. Inverter Sizing Engineering Rules
### Rule 1: Phase Selection
- If Array Capacity ($P_{\text{DC}}$) $\le 5.0\text{ kWp}$ $\rightarrow$ **Single-Phase (230V)**. Matches typical residential single-phase domestic service.
- If Array Capacity ($P_{\text{DC}}$) $> 5.0\text{ kWp}$ $\rightarrow$ **Three-Phase (400V)**. Required by CEB guidelines to prevent line voltage unbalance.

### Rule 2: DC/AC Sizing Ratio (Overclocking)
The DC-to-AC ratio is defined as:
$$\text{Ratio}_{\text{DC/AC}} = \frac{P_{\text{DC, array}}\text{ (kWp)}}{P_{\text{AC, inverter}}\text{ (kW)}}$$
- **Optimal Engineering Window**: **1.10 to 1.35**.
- In Sri Lanka's tropical climate, cell temperatures frequently exceed $55^\circ\text{C}$, causing 10%–12% thermal derating during peak noon. An inverter ratio of 1.15 to 1.25 maximizes energy capture during early morning (07:30–10:00) and late afternoon (14:30–17:00) with minimal clipping loss ($< 0.5\%$).

### Rule 3: Extreme Temperature Voltage Matching (IEC 62548)
1. **Cold Temperature Limit ($15^\circ\text{C}$ minimum record in wet zone/hill country)**:
   $$V_{\text{oc, string, cold}} = N_{\text{series}} \times V_{\text{oc, STC}} \times \left[ 1 + \beta_{V_{\text{oc}}} \times (15^\circ\text{C} - 25^\circ\text{C}) \right]$$
   Condition: $V_{\text{oc, string, cold}} < V_{\text{max, inverter}}$ (typically 560V or 1000V).
2. **Hot Temperature Limit ($65^\circ\text{C}$ maximum roof cell temperature)**:
   $$V_{\text{mp, string, hot}} = N_{\text{series}} \times V_{\text{mp, STC}} \times \left[ 1 + \gamma_{V_{\text{mp}}} \times (65^\circ\text{C} - 25^\circ\text{C}) \right]$$
   Condition: $V_{\text{mp, string, hot}} > V_{\text{min, MPPT}}$ (typically 80V–120V).
