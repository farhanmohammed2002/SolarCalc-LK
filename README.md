# SolarCalc LK V1.0 ☀️🇱🇰
### Sri Lanka Residential Solar PV Feasibility & Financial Assessment Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![PUCSL Tariffs](https://img.shields.io/badge/PUCSL-Jan_18,_2025_Revision-emerald.svg)](https://www.pucsl.gov.lk)
[![CEB Export](https://img.shields.io/badge/CEB_RTSPV-44.14_LKR/kWh-orange.svg)](https://www.ceb.lk)

**SolarCalc LK** is an engineering-grounded, production-grade web application designed to help Sri Lankan homeowners, engineers, and clean-energy advocates evaluate rooftop solar PV feasibility, electrical stringing configurations, 12-month generation profiles, utility bill offsets, and 20-year financial returns.

Developed by **Farhan Mohammad**, Electrical & Electronic Engineering Undergraduate at the Faculty of Engineering, University of Jaffna (E23 Batch).

---

## 🌟 Key Features

- **PUCSL January 18, 2025 Domestic Tariff Engine:** Fully models multi-tier block billing (lifeline $\le 60\text{ kWh}$ and tiered $> 60\text{ kWh}$) and incorporates **Condition 3 relief**, ensuring prosumer fixed charges are assessed strictly on net imported units.
- **Reverse Bill Solver:** Inverse-calculates exact monthly electricity consumption ($\text{kWh}$) directly from electricity bill amounts ($\text{LKR}$) using an iterative binary search solver.
- **CEB Rooftop Solar Schemes:** Supports **Net Metering** (1:1 unit rollover), **Net Accounting** (cash export payment at **44.14 LKR/kWh** for $\le 20\text{ kW}$), and **Net Plus** (100% gross export).
- **World Bank Global Solar Atlas v2.0 Data:** Integrates 1-km spatial irradiance rasters ($Y_{PV}$, OPTA, GHI) across all **25 Sri Lankan administrative districts**, accounting for regional microclimates.
- **Integer PV Module & Inverter Engineering:** Rounds to practical discrete panel counts ($N = \lceil P_{req}/P_{panel} \rceil$) and performs electrical string checks (DC/AC ratio $0.80 - 1.35$, cold-morning $V_{oc}$ limits, and hot-weather MPPT tracking windows).
- **20-Year Financial Simulation:** Computes turnkey CAPEX, simple payback, 20-year cumulative cash flow with $0.55\%/\text{yr}$ panel degradation, $1.0\%/\text{yr}$ O&M, and a **year-10 inverter replacement reserve fund** ($15\%$ of initial CAPEX).
- **On-the-Fly PDF Proposal Generator:** Assembles a customized, downloadable engineering report directly from calculation results.
- **Offline / Autonomous Client Engine:** If the backend API is unreachable, the client-side engine (`solarEngine.ts`) seamlessly performs all calculations in the browser.

---

## 🏗️ Project Architecture

```text
SolarCalc_LK/
├── backend/                  # FastAPI REST API & calculation engine
│   ├── app/
│   │   ├── calculations/     # Python mathematical & regulatory models
│   │   │   ├── financial.py          # 20-year cash flow & simple payback
│   │   │   ├── inverter_selection.py # MPPT checks & DC/AC sizing
│   │   │   ├── panel_selection.py    # Discrete integer panel configuration
│   │   │   ├── pv_sizing.py          # System sizing orchestrator
│   │   │   ├── solar.py              # GSA yield & tilt/azimuth transposition
│   │   │   ├── solar_schemes.py      # Net Metering, Net Accounting, Net Plus
│   │   │   └── tariff.py             # PUCSL Jan 2025 tiered bill solver
│   │   ├── data/             # Spatial & equipment JSON datasets
│   │   ├── services/         # ReportLab PDF proposal generator
│   │   └── main.py           # FastAPI entrypoint
│   ├── tests/                # Automated pytest unit test suite
│   ├── run.py                # Local server launcher
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React 19 + Vite + TypeScript web app
│   ├── public/               # Reference diagrams, equipment images & favicon
│   ├── src/
│   │   ├── components/       # Wizard stepper, charts, metrics, layout
│   │   ├── pages/            # 10 comprehensive pages
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Client-side solarEngine.ts calculation engine
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                     # 11 engineering registers, datasets & schemas
│   ├── DOCUMENT_INVENTORY.xlsx/.md
│   ├── DATA_SOURCES.xlsx/.md
│   ├── VALIDATION_CASES.xlsx/.md
│   ├── panel_database.xlsx
│   ├── inverter_database.xlsx
│   ├── locations.csv
│   └── CALCULATION_METHODOLOGY.md
│
├── SolarCalc_LK_V1.0_Technical_Report.pdf   # 25-section engineering report
├── SolarCalc_LK_V1.0_Technical_Report.docx  # Editable Word document
├── SolarCalc_LK_V1.0_Data_Package.zip       # Unified release archive
└── README.md
```

---

## 🚀 Quickstart: Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)

### 1. Start Backend Server
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).*

### 2. Start Frontend Server (In a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🚢 How to Upload & Host on GitHub

Follow these steps to publish this repository to your GitHub account:

### Step 1: Create a New GitHub Repository
1. Log into your account at [github.com](https://github.com/).
2. Click **New Repository** (`+` icon at the top right).
3. Name it **`solarcalc-lk`**.
4. Set visibility to **Public**.
5. Do **not** initialize with a README, .gitignore, or license (these are already included in this folder).
6. Click **Create repository**.

### Step 2: Push Your Code
Open your terminal inside this folder (`SolarCalc_LK_GitHub_Repository`) and run:

```bash
git init
git add .
git commit -m "feat: initial commit of SolarCalc LK V1.0"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/solarcalc-lk.git
git push -u origin main
```

---

## 🌐 1-Click Free Hosting Options

### Option A: Vercel (Frontend - Recommended)
1. Go to [vercel.com](https://vercel.com/) and connect your GitHub account.
2. Click **Add New Project** and select your `solarcalc-lk` repository.
3. In **Root Directory**, click edit and select **`frontend`**.
4. Click **Deploy**. Your site is live in 60 seconds with SSL!
   *(Note: The frontend includes client-side fallback `solarEngine.ts`, meaning all calculations and charts work 100% in browser even without a backend!)*

### Option B: Render or Railway (Full-Stack: Frontend + Backend)
1. **Backend:** Deploy the `backend/` directory on [Render](https://render.com/) or [Railway](https://railway.app/) as a Python Web Service with start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
2. **Frontend:** Point `VITE_API_URL` to your live Render backend URL.

---

## 📜 Regulatory Reference & Compliance
- **Tariff Schedule:** Public Utilities Commission of Sri Lanka (PUCSL) Final Decision Document on Electricity Tariff Revision (Effective January 18, 2025).
- **Rooftop Solar Regulations:** Ceylon Electricity Board (CEB) / Lanka Electricity Company (LECO) Net Metering, Net Accounting, and Net Plus Schemes (Revision 1).
- **Spatial Solar Irradiance:** World Bank Group / ESMAP Global Solar Atlas v2.0 (1-km resolution).

---

## 👨‍💻 Author & Academic Attribution
- **Developer:** Farhan Mohammad
- **Degree Program:** B.Sc. (Hons) in Electrical and Electronic Engineering (Undergraduate)
- **Institution:** Faculty of Engineering, University of Jaffna, Sri Lanka (E23 Batch)
- **Email:** [farhanugc@gmail.com](mailto:farhanugc@gmail.com)
- **LinkedIn:** [Farhan Mohammad](https://linkedin.com/in/farhan-mohammad-417a772b9)

---

## ⚖️ License & Disclaimer
This project is licensed under the [MIT License](LICENSE).

**Disclaimer:** SolarCalc LK V1.0 provides preliminary solar PV planning and financial estimates for informational purposes. Results are not a substitute for a site-specific engineering assessment, structural evaluation, certified single-line electrical diagram, utility grid approval, or commercial quotation.
