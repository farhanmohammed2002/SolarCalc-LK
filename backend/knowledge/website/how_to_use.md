# How to Use SolarCalc LK V1.0 Platform

## Document Overview
- **Document ID**: SOLARCALC-USER-MANUAL-V1
- **Category**: Website Navigation & User Operations
- **Target Audience**: Residential homeowners, solar installers, consulting engineers, academic researchers

---

## 1. Web Platform Overview & Navigation Tabs
SolarCalc LK features a streamlined, single-page application (SPA) design with top-level tabs:
1. **Calculator**: 5-step interactive sizing, simulation, and engineering dashboard.
2. **Solar Map**: Interactive spatial visualization of solar irradiance (PVOUT, GHI, GTI) across 25 Sri Lankan districts.
3. **Methodology**: Detailed 8-stage mathematical formulation documentation.
4. **Reports**: Repository of downloadable technical white papers, editable DOCX documents, and dataset packages.
5. **Equipment**: Engineering catalog of verified PV panels, inverters, and battery storage modules.
6. **Tariffs**: Full breakdown of PUCSL January 18, 2025 electricity rates and prosumer Condition 3.
7. **Schemes**: Comparison of CEB Net Metering, Net Accounting, and Net Plus.
8. **Sources**: Academic and regulatory citations.
9. **About Developer**: Background on Farhan Mohammad (Faculty of Engineering, University of Jaffna).
10. **AI Assistant**: Intelligent technical agent providing grounded explanations, calculations, and guidance.

---

## 2. Using the 5-Step Solar PV Calculator
The core engineering calculation workflow progresses sequentially:

### Step 1: Location & Irradiance
- Select your administrative district from the 25-district dropdown, OR:
- Click the **`[ 🛰️ GPS Auto-Location ]`** button. The browser prompts for location permission. SolarCalc LK calculates territorial distances to all district centers and automatically selects the closest district, populating its specific PVOUT yield ($kWh/kWp/year$) and optimal tilt angle.

### Step 2: Electricity Consumption
- Option A: Enter average monthly units consumed in kilowatt-hours (kWh).
- Option B: Enter your recent monthly electricity bill in Sri Lankan Rupees (LKR). SolarCalc LK applies the exact inverse PUCSL 2025 tariff formula to back-calculate your exact unit consumption.

### Step 3: Roof Characteristics
- Select your roof type:
  - **Clay Tile (Sinhala / Calicut)**: Requires special stainless steel tile hooks (derating factor 0.85).
  - **Asbestos / Fiber Cement Corrugated**: Uses hanger bolts anchored directly into purlins (derating factor 0.90).
  - **Corrugated Zinc / Metal Trapezoidal**: Klip-lok or self-drilling short rails (derating factor 0.95).
  - **Reinforced Concrete Flat Slab**: Elevated ballasted aluminum A-frames (derating factor 0.90).
- Enter available unobstructed roof area in square meters ($m^2$) or square feet ($ft^2$).
- Specify roof tilt angle and orientation (azimuth) relative to True South.

### Step 4: Solar Scheme & Equipment Selection
- Select your preferred utility agreement:
  - **Net Accounting** (Recommended for highest economic return @ LKR 44.14/kWh).
  - **Net Metering** (1:1 unit rollover banking).
  - **Net Plus** (100% gross export).
- Select PV panel model (e.g. JinkoSolar Tiger Neo 470W or 545W).
- Select preferred inverter brand (Sungrow, Huawei, Deye, SMA, Fronius, GoodWe) or leave on "Auto-Select Optimal".

### Step 5: Engineering Results Dashboard
- Click **"Calculate My Solar System"**.
- View key outputs: Recommended DC capacity ($kWp$), panel count, roof area utilization, matched inverter model, DC/AC ratio, annual generation ($kWh$), 20-year cash flow trajectory, simple payback period, and net present value (NPV).

---

## 3. How to Download Official Engineering Reports

### 3.1 Downloading the Preliminary Proposal PDF (Personalized Client Proposal)
1. Complete your simulation in the **Calculator** tab.
2. At the top right of the **Step 5 Results Dashboard**, locate the **`[ 📥 Download PDF Assessment ]`** button.
3. Click the button to trigger client-side / backend PDF generation.
4. The generated PDF includes:
   - Official **SolarCalc LK Report Logo**.
   - Client name, date, and district microclimatic coordinates.
   - Sized array specifications and PV module count.
   - Single-line electrical matching and inverter safety compliance.
   - Month-by-month generation bar chart ($kWh$).
   - 20-year financial cash flow projection table and PUCSL 2025 tariff comparison.

### 3.2 Downloading White Papers & Data Packages
1. Click the **`Reports`** tab in the main navigation bar.
2. Choose from three downloadable packages:
   - **Technical Report (PDF)**: 25-section comprehensive engineering white paper.
   - **Technical Report (DOCX)**: Editable Microsoft Word document for custom branding or academic submission.
   - **Data Package (ZIP)**: Archive with district irradiance CSVs, tariff lookup tables, and equipment JSON files.
