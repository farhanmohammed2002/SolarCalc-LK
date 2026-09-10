# SolarCalc LK V1.0 — Database Architecture & Schemas

The data architecture is designed for SQLite/PostgreSQL with normalized structures, enabling seamless tariff and equipment updates without code modification.

```sql
-- 1. Administrative Locations & Coordinates
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    latitude NUMERIC(6,4) NOT NULL,
    longitude NUMERIC(6,4) NOT NULL,
    default_pvout NUMERIC(6,1) NOT NULL, -- kWh/kWp/year
    optimum_tilt NUMERIC(4,1) NOT NULL,  -- degrees
    elevation_m INT DEFAULT 0
);

-- 2. Official Electricity Tariffs (PUCSL)
CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    tariff_code VARCHAR(30) NOT NULL,
    consumer_category VARCHAR(50) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    source_document VARCHAR(150) NOT NULL,
    fixed_charge_rules JSONB NOT NULL,
    energy_blocks JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 3. Rooftop Solar Feed-In Schemes (CEB)
CREATE TABLE solar_schemes (
    id SERIAL PRIMARY KEY,
    scheme_code VARCHAR(30) NOT NULL,
    name VARCHAR(80) NOT NULL,
    effective_date DATE NOT NULL,
    export_rate_lkr_per_kwh NUMERIC(6,2),
    capacity_limit_kw NUMERIC(6,2),
    settlement_currency VARCHAR(10) DEFAULT 'LKR',
    source VARCHAR(150) NOT NULL
);

-- 4. PV Modules Catalogue
CREATE TABLE panels (
    id SERIAL PRIMARY KEY,
    manufacturer VARCHAR(60) NOT NULL,
    model VARCHAR(80) NOT NULL,
    p_mp_w INT NOT NULL,
    module_efficiency NUMERIC(5,2) NOT NULL,
    v_oc NUMERIC(5,2) NOT NULL,
    i_sc NUMERIC(5,2) NOT NULL,
    v_mp NUMERIC(5,2) NOT NULL,
    i_mp NUMERIC(5,2) NOT NULL,
    temp_coeff_pmp NUMERIC(6,3) NOT NULL,
    length_mm INT NOT NULL,
    width_mm INT NOT NULL,
    weight_kg NUMERIC(5,2),
    warranty_years INT NOT NULL,
    datasheet_url VARCHAR(255)
);

-- 5. Inverters Catalogue
CREATE TABLE inverters (
    id SERIAL PRIMARY KEY,
    manufacturer VARCHAR(60) NOT NULL,
    model VARCHAR(80) NOT NULL,
    p_ac_kw NUMERIC(5,2) NOT NULL,
    max_pv_kw NUMERIC(5,2) NOT NULL,
    mppt_voltage_min NUMERIC(5,1) NOT NULL,
    mppt_voltage_max NUMERIC(5,1) NOT NULL,
    max_input_current_a NUMERIC(5,1) NOT NULL,
    mppt_count INT NOT NULL,
    phase INT NOT NULL,
    euro_efficiency NUMERIC(5,2) NOT NULL,
    warranty_years INT NOT NULL,
    datasheet_url VARCHAR(255)
);

-- 6. Calculation Execution Records
CREATE TABLE calculation_logs (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_id INT REFERENCES locations(id),
    consumption_kwh NUMERIC(7,2) NOT NULL,
    scheme VARCHAR(30) NOT NULL,
    recommended_pv_kwp NUMERIC(5,2) NOT NULL,
    panel_id INT REFERENCES panels(id),
    panel_count INT NOT NULL,
    inverter_id INT REFERENCES inverters(id),
    annual_generation_kwh NUMERIC(8,2) NOT NULL,
    annual_savings_lkr NUMERIC(10,2) NOT NULL,
    payback_years NUMERIC(4,2) NOT NULL,
    data_version VARCHAR(30) NOT NULL
);
```
