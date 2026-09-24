# Verified Photovoltaic (PV) Module Specifications & Technology

## Document Overview
- **Document ID**: PV-MODULES-CATALOGUE-2025
- **Category**: Hardware Equipment & PV Modules
- **Standard**: IEC 61215:2021 (Design qualification), IEC 61730:2023 (Safety qualification), CE, TÜV Rheinland

---

## 1. Verified PV Modules in SolarCalc LK Database
SolarCalc LK maintains an engineering-verified catalogue of tier-1 solar PV modules widely distributed and installed by certified solar EPC companies in Sri Lanka.

### 1.1 JinkoSolar Tiger Neo N-Type TOPCon Series (Industry Flagship)
- **Cell Technology**: N-Type Monocrystalline TOPCon (Tunnel Oxide Passivated Contact), SMBB (Super Multi-Busbar) Half-Cell.
- **Key Advantage**: Zero LID (Light Induced Degradation), lower temperature coefficient, superior performance under tropical low-light diffuse conditions (monsoon cloud cover).
- **Warranty**: 12 to 25 years product workmanship warranty; 30 years linear power output warranty with $\le 1.0\%$ first-year degradation and $\le 0.40\%/\text{year}$ annual degradation (yielding $\ge 87.4\%$ output at year 30).

| Model Number | Rated Power ($P_{\text{mp}}$) | Module Efficiency | $V_{\text{mp}}$ (V) | $I_{\text{mp}}$ (A) | $V_{\text{oc}}$ (V) | $I_{\text{sc}}$ (A) | Temp. Coeff. $\gamma$ (%/°C) | Dimensions (mm) | Weight (kg) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **JKM470N-60HL4-V** | 470 Wp | 21.78% | 35.05 V | 13.41 A | 42.38 V | 14.15 A | -0.30 %/°C | 1903 × 1134 × 30 | 24.2 kg |
| **JKM475N-60HL4-V** | 475 Wp | 22.01% | 35.21 V | 13.49 A | 42.54 V | 14.23 A | -0.30 %/°C | 1903 × 1134 × 30 | 24.2 kg |
| **JKM545N-72HL4-V** | 545 Wp | 21.13% | 41.80 V | 13.04 A | 50.12 V | 13.81 A | -0.30 %/°C | 2278 × 1134 × 35 | 28.0 kg |
| **JKM630N-78HL4-BDV** | 630 Wp | 22.58% | 46.50 V | 13.55 A | 55.80 V | 14.30 A | -0.29 %/°C | 2465 × 1134 × 35 | 34.0 kg |
| **JKM670N-78HL4-BDV** | 670 Wp | 22.95% | 47.30 V | 14.17 A | 56.60 V | 14.90 A | -0.29 %/°C | 2580 × 1134 × 35 | 36.5 kg |

### 1.2 REC Alpha Pure-RX Series (Ultra-Premium Heterojunction - HJT)
- **Cell Technology**: Heterojunction (HJT) with advanced G12 half-cut bifacial cells with gapless technology.
- **Key Advantage**: Industry-leading temperature coefficient ($-0.24\%/^\circ\text{C}$), generating up to $16\%$ more energy in tropical Colombo/Jaffna midday heat ($65^\circ\text{C}$ roof cell temperature) compared to conventional P-type modules.
- **Specifications**:
  - Rated Power ($P_{\text{mp}}$): **470 Wp**
  - Module Efficiency: **22.6%**
  - Voltage at Max Power ($V_{\text{mp}}$): 54.3 V
  - Current at Max Power ($I_{\text{mp}}$): 8.66 A
  - Open Circuit Voltage ($V_{\text{oc}}$): 65.1 V
  - Short Circuit Current ($I_{\text{sc}}$): 9.12 A
  - Dimensions: 1725 × 1205 × 30 mm | Weight: 22.2 kg
  - Warranty: 25 years REC ProTrust Product, Performance & Labor warranty with $\ge 92\%$ output at year 25.

### 1.3 LONGi Hi-MO X6 Explorer (HPBC Technology)
- **Cell Technology**: Hybrid Passivated Back Contact (HPBC) with zero front-grid busbars, providing sleek all-black aesthetics and reduced micro-crack susceptibility.
- **Specifications**:
  - Model: **LR5-72HTH-550M**
  - Rated Power ($P_{\text{mp}}$): **550 Wp**
  - Module Efficiency: **21.5%**
  - $V_{\text{mp}}$: 43.86 V | $I_{\text{mp}}$: 12.54 A | $V_{\text{oc}}$: 52.36 V | $I_{\text{sc}}$: 13.45 A
  - Temp. Coefficient: -0.29 %/°C
  - Dimensions: 2278 × 1134 × 35 mm | Weight: 27.5 kg

---

## 2. Temperature Derating in Sri Lankan Climate
The actual power output of a solar panel on a Sri Lankan roof decreases as the solar cell heats up above Standard Test Conditions ($25^\circ\text{C}$):
$$P(T_{\text{cell}}) = P_{\text{STC}} \times \left[ 1 + \gamma \times (T_{\text{cell}} - 25^\circ\text{C}) \right]$$
Where:
- Nominal Module Operating Temperature (NMOT) typically reaches $45^\circ\text{C} \pm 2^\circ\text{C}$.
- On a calm, sunny day in Sri Lanka (ambient temperature $33^\circ\text{C}$, irradiance $1,000\text{ W/m}^2$), roof-mounted cells routinely operate between **$55^\circ\text{C}\text{ and }65^\circ\text{C}$**.
- Thermal derating loss:
  $$\Delta P = -0.30\%/^\circ\text{C} \times (60^\circ\text{C} - 25^\circ\text{C}) = -10.5\%$$
- This physical effect is rigorously modeled in SolarCalc LK's 8-stage loss engine.
