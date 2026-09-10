# SolarCalc LK V1.0 — Requirements Specification

## 1. System Objectives
SolarCalc LK V1.0 is an engineering web platform engineered to provide residential consumers in Sri Lanka with accurate, transparent, and verified preliminary assessments for grid-tied rooftop solar PV installations.

## 2. Functional Requirements (FR)
- **FR-01: Coordinate & Location Resolution**: User can select any of Sri Lanka\'s 25 administrative districts or click on an interactive map to resolve latitude/longitude.
- **FR-02: Authoritative Solar Resource Retrieval**: System queries the World Bank Global Solar Atlas v2 30-arc-sec ASCII grid to retrieve specific annual yield, 12-month profile, and optimum tilt.
- **FR-03: Flexible Consumption Entry**: User can input monthly electricity units (kWh) or average monthly bill (LKR). When bill is entered, the engine executes inverse tariff iteration to determine exact units.
- **FR-04: Rooftop Physical Verification**: System accepts roof type, tilt, azimuth, and optional roof area (sqm / sqft) to verify physical feasibility against required module footprint.
- **FR-05: Discrete Equipment Sizing**: System selects integer quantities of verified commercial PV modules and matches an electrically compatible single- or three-phase string inverter.
- **FR-06: PUCSL Jan 2025 Tariff Billing**: System computes pre-solar and post-solar utility bills using the exact gazetted block structure and Condition 3 net-consumption fixed charge rules.
- **FR-07: Tri-Scheme Economic Analysis**: System models Net Metering, Net Accounting (44.14 LKR/kWh), and Net Plus arrangements.
- **FR-08: 20-Year Financial Life-Cycle**: Computes simple payback period, cumulative net cash flow, and return on investment with 0.55%/year module degradation and year-10 inverter maintenance.
- **FR-09: Environmental Impact**: Calculates annual metric tons of CO2 avoided using the CEB Grid Emission Factor (0.62 kg CO2/kWh).
- **FR-10: Professional PDF Report Generation**: Provides client-ready downloadable assessment reports generated on the fly via ReportLab.
- **FR-11: Attribution & Traceability**: Clearly displays author credentials (Farhan Mohammad, University of Jaffna) and versioned citations for all tariffs and datasets.

## 3. Non-Functional Requirements (NFR)
- **NFR-01: Performance**: Calculation API response time < 150 ms.
- **NFR-02: Transparency**: All figures must carry explicit engineering labels (calculated, estimated, assumed, user-provided).
- **NFR-03: Responsive UI**: 100% responsive across mobile, tablet, and widescreen desktop devices.
- **NFR-04: Robust Error Handling**: Zero unhandled NaN or divide-by-zero errors; graceful fallback and intuitive validation prompts.
