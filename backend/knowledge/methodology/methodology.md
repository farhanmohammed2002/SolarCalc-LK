# SolarCalc LK V1.0 — Peer-Reviewed Engineering Calculation Methodology

## 1. System Overview and Objective
SolarCalc LK V1.0 is an engineering-grounded preliminary assessment platform engineered specifically for the Sri Lankan residential rooftop solar sector. It models microclimatic solar resource data, authentic manufacturer datasheets, and official PUCSL electricity tariffs to determine system capacity, generation, and economic returns.

## 2. Global Solar Atlas Spatial Data Pipeline
Solar potential is computed using the World Bank / ESMAP Global Solar Atlas (GSA v2.0) 30-arc-second (~1 km) spatial rasters:
- **PVOUT (Photovoltaic Power Potential)**: Expressed in kWh/kWp/year, representing specific energy yield for a standard grid-tied system.
- **GHI (Global Horizontal Irradiance)**: Daily solar radiation in kWh/m²/day.
- **OPTA (Optimum Tilt Angle)**: Mathematical angle maximizing annual energy harvest, ranging from 7° to 10° facing True South (180° Azimuth).

## 3. Physical Array Sizing & Roof Allocation
Target DC capacity is determined from the user's historical monthly consumption:
$$P_{\text{target, kWp}} = \frac{E_{\text{monthly, kWh}} \times (\text{Target Offset \%} / 100)}{(\text{PVOUT} \times \text{Derate Factor}) / 12}$$

Panel quantity is calculated using discrete module wattages:
$$N_{\text{panels}} = \left\lceil \frac{P_{\text{target, kWp}} \times 1000}{P_{\text{module, W}}} \right\rceil$$

Actual installed capacity:
$$P_{\text{actual, kWp}} = \frac{N_{\text{panels}} \times P_{\text{module, W}}}{1000}$$

Physical roof area requirement includes a 15% structural spacing allowance for module clamps, walkways, and inverter airflow:
$$A_{\text{required, m}^2} = N_{\text{panels}} \times (L_{\text{module}} \times W_{\text{module}}) \times 1.15$$

## 4. Inverter Matching and Electrical String Safety
Inverters are selected to maintain an optimal DC/AC ratio between **1.10 and 1.35**:
$$\text{DC/AC Ratio} = \frac{P_{\text{DC, kWp}}}{P_{\text{AC, kW}}}$$

Electrical string safety checks verify operating voltages across extreme Sri Lankan temperatures:
- **Maximum Open-Circuit Voltage ($V_{oc, \text{max}}$) at 15°C**:
  $$V_{oc, \text{cold}} = V_{oc, \text{STC}} \times [1 + \beta_{Voc} \times (15^\circ\text{C} - 25^\circ\text{C})]$$
  String $V_{oc, \text{cold}} \le V_{\text{max, inverter DC}}$ (Safe from overvoltage breakdown).
- **Minimum MPP Voltage ($V_{mp, \text{min}}$) at 65°C Roof Temperature**:
  $$V_{mp, \text{hot}} = V_{mp, \text{STC}} \times [1 + \gamma_{Pmp} \times (65^\circ\text{C} - 25^\circ\text{C})]$$
  String $V_{mp, \text{hot}} \ge V_{\text{min, inverter MPPT}}$ (Guarantees uninterrupted MPP tracking).

## 5. Grid Service Rules
In accordance with CEB Interconnection Standards:
- Single Phase connections: Permitted for PV systems up to 5.0 kWp.
- Three Phase connections: Required for systems exceeding 5.0 kWp.
