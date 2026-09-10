# SolarCalc LK V1.0 — API Specification

The SolarCalc LK REST API is served by Python FastAPI with automated OpenAPI / Swagger documentation accessible at `/docs`.

## Endpoints

### 1. `POST /api/calculate`
Executes complete PV sizing, yield simulation, PUCSL January 2025 tariff billing, and 20-year cash flow evaluation.

### 2. `GET /api/locations`
Returns all 25 Sri Lankan districts with pre-extracted GSA solar yield, optimum tilt, and coordinates.

### 3. `GET /api/equipment`
Returns the verified catalogue of solar PV modules and inverters.

### 4. `POST /api/download-report`
Generates a downloadable ReportLab PDF assessment report based on calculated parameters.
