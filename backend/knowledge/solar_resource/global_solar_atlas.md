# Global Solar Atlas & Sri Lanka Solar Resource Modeling

## Document Overview
- **Document ID**: GSA-SOLAR-RESOURCE-LK
- **Category**: Solar Resource & Spatial Modeling
- **Primary Source**: World Bank Group, Energy Sector Management Assistance Program (ESMAP), Solargis Global Solar Atlas v2.0
- **Validation**: Sri Lanka Sustainable Energy Authority (SLSEA), Department of Meteorology Sri Lanka

---

## 1. Solar Resource Data Foundations
SolarCalc LK integrates microclimatic spatial resource data derived from the **Global Solar Atlas (GSA v2.0)**, developed by Solargis under contract to ESMAP and the World Bank. The dataset combines:
- Long-term satellite-derived atmospheric irradiance observations (1999–2022).
- Microclimatic terrain and aerosol optical depth (AOD) modeling at 30 arc-second (~1 km) spatial resolution.
- Specific localized temperature and wind speed profiles for thermal derating.

---

## 2. Key Solar Radiation Metrics
1. **Global Horizontal Irradiation (GHI)**: Total solar energy received on a horizontal surface ($kWh/m^2/year$). Ranges from 1,750 to 2,150 $kWh/m^2/year$ across Sri Lanka.
2. **Global Tilted Irradiation (GTI)**: Radiation incident on a surface tilted at optimum fixed angle towards True South ($kWh/m^2/year$).
3. **Photovoltaic Power Potential (PVOUT)**: Specific system yield measured in **$kWh/kWp/year$** for a standardized ground-mounted or fixed rooftop crystalline silicon installation, incorporating atmospheric transmission, spectral mismatch, and thermal losses.

---

## 3. District-by-District Solar Potential (25 Sri Lankan Administrative Districts)
Sri Lanka experiences tropical solar irradiance with significant geographic variation between the **Dry Zone** (North, North-Central, East, South-East) and the **Wet Zone** (South-West, Western Province, Central Highlands):

| District | Province | Climate Zone | Spec. Yield PVOUT ($kWh/kWp/year$) | Daily Yield ($kWh/kWp/day$) | Optimum Tilt Angle |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mannar** | Northern | Dry | **1,650** | 4.52 | 8° |
| **Hambantota** | Southern | Dry / Semi-Arid | **1,620** | 4.44 | 7° |
| **Batticaloa** | Eastern | Dry | **1,610** | 4.41 | 8° |
| **Jaffna** | Northern | Dry | **1,580** | 4.33 | 9° |
| **Puttalam** | North Western | Dry | **1,580** | 4.33 | 8° |
| **Trincomalee** | Eastern | Dry | **1,570** | 4.30 | 8° |
| **Kilinochchi** | Northern | Dry | **1,560** | 4.27 | 9° |
| **Ampara** | Eastern | Dry | **1,560** | 4.27 | 7° |
| **Vavuniya** | Northern | Dry | **1,550** | 4.25 | 8° |
| **Anuradhapura** | North Central | Dry | **1,540** | 4.22 | 8° |
| **Mullaitivu** | Northern | Dry | **1,540** | 4.22 | 9° |
| **Polonnaruwa** | North Central | Dry | **1,530** | 4.19 | 8° |
| **Monaragala** | Uva | Intermediate/Dry | **1,500** | 4.11 | 7° |
| **Kurunegala** | North Western | Intermediate | **1,480** | 4.05 | 7° |
| **Matara** | Southern | Wet / Maritime | **1,470** | 4.03 | 6° |
| **Galle** | Southern | Wet / Maritime | **1,460** | 4.00 | 6° |
| **Colombo** | Western | Wet | **1,450** | 3.97 | 7° |
| **Gampaha** | Western | Wet | **1,450** | 3.97 | 7° |
| **Kalutara** | Western | Wet | **1,440** | 3.95 | 7° |
| **Matale** | Central | Intermediate | **1,440** | 3.95 | 7° |
| **Badulla** | Uva | Intermediate / Hill | **1,420** | 3.89 | 7° |
| **Ratnapura** | Sabaragamuwa | Wet (High Rain) | **1,390** | 3.81 | 7° |
| **Kegalle** | Sabaragamuwa | Wet | **1,380** | 3.78 | 7° |
| **Kandy** | Central | Wet / Highland | **1,380** | 3.78 | 7° |
| **Nuwara Eliya** | Central | Wet / Montane Cloud | **1,350** | 3.70 | 7° |

---

## 4. Geometric & Mounting Optimization
1. **Optimum Tilt Angle ($\beta_{\text{opt}}$)**:
   - Sri Lanka lies between latitudes $5.9^\circ\text{ N}$ and $9.9^\circ\text{ N}$.
   - The theoretical annual energy maximizing tilt angle corresponds closely to local latitude: **$7^\circ\text{ to }10^\circ$**.
   - A minimum tilt of **$10^\circ$** is highly recommended by engineering practice for self-cleaning (rainwater dust and bird dropping removal), avoiding water pooling on module glass frames.
2. **Azimuth Angle ($\gamma$)**:
   - Optimal orientation is **True South ($\gamma = 180^\circ$ or $0^\circ$ South reference)**.
   - East-facing roofs exhibit slight morning generation advantages; West-facing roofs produce higher late afternoon generation, perfectly coinciding with domestic peak tariff hours (18:30–22:30).
3. **Transposition Factor ($TF$)**:
   - The ratio of annual solar radiation on the actual tilted/oriented roof surface compared to an optimal plane ($10^\circ\text{ South}$).
   - Flat concrete roofs with ballasted tilt racking achieve $TF = 1.00$. Typical pitch roofs ($15^\circ–22^\circ$) facing East or West maintain $TF = 0.92–0.96$.
