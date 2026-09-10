"""
SolarCalc LK V1.0 — FastAPI REST API Service
Author: Farhan Mohammad (Faculty of Engineering, University of Jaffna)
"""

import os, sys, json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel, Field

from app.calculations.pv_sizing import calculate_solar_pv_system
from app.calculations.solar import get_solar_resource
from app.calculations.tariff import calculate_domestic_bill, estimate_units_from_bill
from app.calculations.validation import validate_inputs
from app.services.report_service import generate_pdf_assessment

app = FastAPI(
    title="SolarCalc LK V1.0 API",
    description="Sri Lankan Residential Rooftop Solar PV Planning, PUCSL January 2025 Tariff & GSA Spatial Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Pydantic Schemas
class CalculationRequest(BaseModel):
    district: Optional[str] = "Colombo"
    latitude: float = Field(default=6.9271, ge=5.5, le=10.0)
    longitude: float = Field(default=79.8612, ge=79.5, le=82.2)
    monthly_units_kwh: Optional[float] = Field(default=None, ge=0.0, le=10000.0)
    monthly_bill_lkr: Optional[float] = Field(default=None, ge=0.0)
    target_offset_pct: float = Field(default=100.0, ge=10.0, le=200.0)
    scheme: str = Field(default="NET_ACCOUNTING")
    roof_type: str = Field(default="ASBESTOS")
    roof_area_sqm: Optional[float] = Field(default=None, ge=0.0)
    azimuth_deg: float = Field(default=180.0, ge=0.0, le=360.0)
    tilt_deg: float = Field(default=10.0, ge=0.0, le=90.0)
    panel_id: Optional[int] = Field(default=1)
    custom_system_cost_lkr: Optional[float] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "SolarCalc LK V1.0 API",
        "version": "1.0.0",
        "author": "Farhan Mohammad (University of Jaffna)"
    }

@app.get("/api/locations")
def get_locations():
    path = os.path.join(DATA_DIR, "locations.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/api/solar-resource")
def query_solar_resource(lat: float, lon: float):
    if not (5.5 <= lat <= 10.0 and 79.5 <= lon <= 82.2):
        raise HTTPException(status_code=400, detail="Coordinates outside Sri Lanka territorial boundaries.")
    return get_solar_resource(lat, lon)

@app.get("/api/equipment")
def get_equipment():
    panels_path = os.path.join(DATA_DIR, "panels.json")
    inverters_path = os.path.join(DATA_DIR, "inverters.json")
    panels = []
    inverters = []
    if os.path.exists(panels_path):
        with open(panels_path, "r", encoding="utf-8") as f:
            panels = json.load(f)
    if os.path.exists(inverters_path):
        with open(inverters_path, "r", encoding="utf-8") as f:
            inverters = json.load(f)
    return {
        "panels": panels,
        "inverters": inverters
    }

@app.get("/api/tariffs")
def get_tariffs():
    path = os.path.join(DATA_DIR, "tariffs.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

@app.get("/api/schemes")
def get_schemes():
    path = os.path.join(DATA_DIR, "schemes.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.post("/api/calculate")
def run_calculation(req: CalculationRequest):
    # Validate
    valid, errors = validate_inputs(
        monthly_units_kwh=req.monthly_units_kwh,
        monthly_bill_lkr=req.monthly_bill_lkr,
        latitude=req.latitude,
        longitude=req.longitude,
        target_offset_pct=req.target_offset_pct,
        roof_area_sqm=req.roof_area_sqm
    )
    if not valid:
        raise HTTPException(status_code=422, detail=errors)
        
    result = calculate_solar_pv_system(
        monthly_units_kwh=req.monthly_units_kwh,
        monthly_bill_lkr=req.monthly_bill_lkr,
        target_offset_pct=req.target_offset_pct,
        latitude=req.latitude,
        longitude=req.longitude,
        district=req.district or "Colombo",
        roof_type=req.roof_type,
        roof_area_sqm=req.roof_area_sqm,
        azimuth_deg=req.azimuth_deg,
        tilt_deg=req.tilt_deg,
        scheme=req.scheme,
        panel_id=req.panel_id,
        custom_system_cost_lkr=req.custom_system_cost_lkr
    )
    return result

@app.post("/api/download-report")
def download_custom_report(req: CalculationRequest):
    # Compute system
    calc_res = calculate_solar_pv_system(
        monthly_units_kwh=req.monthly_units_kwh,
        monthly_bill_lkr=req.monthly_bill_lkr,
        target_offset_pct=req.target_offset_pct,
        latitude=req.latitude,
        longitude=req.longitude,
        district=req.district or "Colombo",
        roof_type=req.roof_type,
        roof_area_sqm=req.roof_area_sqm,
        azimuth_deg=req.azimuth_deg,
        tilt_deg=req.tilt_deg,
        scheme=req.scheme,
        panel_id=req.panel_id,
        custom_system_cost_lkr=req.custom_system_cost_lkr
    )
    pdf_buffer = generate_pdf_assessment(calc_res)
    filename = f"SolarCalc_LK_Assessment_{calc_res['inputs']['district']}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/download-technical-report")
def download_technical_report():
    path = os.path.join(ROOT_DIR, "SolarCalc_LK_V1.0_Technical_Report.pdf")
    if os.path.exists(path):
        return FileResponse(
            path,
            media_type="application/pdf",
            filename="SolarCalc_LK_V1.0_Technical_Report.pdf"
        )
    raise HTTPException(status_code=404, detail="Technical report not found.")

@app.get("/api/download-technical-report-docx")
def download_technical_report_docx():
    path = os.path.join(ROOT_DIR, "SolarCalc_LK_V1.0_Technical_Report.docx")
    if os.path.exists(path):
        return FileResponse(
            path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="SolarCalc_LK_V1.0_Technical_Report.docx"
        )
    raise HTTPException(status_code=404, detail="Technical report docx not found.")

@app.get("/api/download-data-package")
def download_data_package():
    path = os.path.join(ROOT_DIR, "SolarCalc_LK_V1.0_Data_Package.zip")
    if os.path.exists(path):
        return FileResponse(
            path,
            media_type="application/zip",
            filename="SolarCalc_LK_V1.0_Data_Package.zip"
        )
    raise HTTPException(status_code=404, detail="Data package zip not found.")
