"""
Global Solar Atlas (GSA v2) Resource Engine & Spatial Yield Modeling
Handles 1-km GIS raster ASCII queries, monthly distribution, and orientation derating.
"""

import os
from typing import Dict, Any, List, Optional, Tuple

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
PVOUT_ASC = os.path.join(BASE_DIR, "location", "Sri-Lanka_GISdata_LTAym_YearlyMonthlyTotals_GlobalSolarAtlas-v2_AAIGRID", "Sri-Lanka_GISdata_LTAy_YearlyMonthlyTotals_GlobalSolarAtlas-v2_AAIGRID", "PVOUT.asc")
OPTA_ASC = os.path.join(BASE_DIR, "location", "Sri-Lanka_GISdata_LTAy_DailySum_GlobalSolarAtlas_AAIGRID", "Sri-Lanka_GISdata_LTAy_DailySum_GlobalSolarAtlas_AAIGRID", "OPTA.asc")
GHI_ASC = os.path.join(BASE_DIR, "location", "Sri-Lanka_GISdata_LTAy_DailySum_GlobalSolarAtlas_AAIGRID", "Sri-Lanka_GISdata_LTAy_DailySum_GlobalSolarAtlas_AAIGRID", "GHI.asc")
MONTHLY_DIR = os.path.join(BASE_DIR, "location", "Sri-Lanka_GISdata_LTAym_YearlyMonthlyTotals_GlobalSolarAtlas-v2_AAIGRID", "Sri-Lanka_GISdata_LTAy_YearlyMonthlyTotals_GlobalSolarAtlas-v2_AAIGRID", "monthly")

_HEADER_CACHE = {}

def _read_header(path: str) -> Dict[str, float]:
    if path in _HEADER_CACHE:
        return _HEADER_CACHE[path]
    header = {}
    with open(path, "r", encoding="utf-8") as f:
        for _ in range(6):
            parts = f.readline().split()
            header[parts[0].lower()] = float(parts[1])
    _HEADER_CACHE[path] = header
    return header

def query_asc_grid(path: str, lat: float, lon: float) -> Optional[float]:
    """Queries an ESRI ASCII raster grid at given latitude and longitude."""
    if not os.path.exists(path):
        return None
    try:
        header = _read_header(path)
        ncols = int(header["ncols"])
        nrows = int(header["nrows"])
        xll = header["xllcorner"]
        yll = header["yllcorner"]
        cellsize = header["cellsize"]
        nodata = header["nodata_value"]
        
        col = int((lon - xll) / cellsize)
        row = int((yll + nrows * cellsize - lat) / cellsize)
        
        if not (0 <= col < ncols and 0 <= row < nrows):
            return None
            
        with open(path, "r", encoding="utf-8") as f:
            for _ in range(6):
                f.readline()
            for _ in range(row):
                f.readline()
            vals = f.readline().split()
            val = float(vals[col])
            return val if abs(val - nodata) > 1e-4 and val > -9000 else None
    except Exception:
        return None

def get_solar_resource(lat: float, lon: float, default_pvout: float = 1550.0, default_opta: float = 9.0) -> Dict[str, Any]:
    """
    Returns annual PVOUT (kWh/kWp/yr), optimum tilt angle (deg), daily GHI, and monthly specific yield profile.
    """
    pvout = query_asc_grid(PVOUT_ASC, lat, lon) or default_pvout
    opta = query_asc_grid(OPTA_ASC, lat, lon) or default_opta
    ghi = query_asc_grid(GHI_ASC, lat, lon) or 5.2
    
    # Query monthly rasters
    monthly_pvout: List[float] = []
    for m in range(1, 13):
        m_path = os.path.join(MONTHLY_DIR, f"PVOUT_{m:02d}.asc")
        mv = query_asc_grid(m_path, lat, lon)
        if mv is not None:
            monthly_pvout.append(round(mv, 1))
        else:
            # Fallback based on typical tropical seasonal weights
            # High in Feb-April & Aug-Oct, slightly lower in monsoon (Nov-Dec, May-June)
            seasonal_weights = [0.088, 0.089, 0.096, 0.087, 0.080, 0.075, 0.078, 0.084, 0.085, 0.084, 0.086, 0.088]
            monthly_pvout.append(round(pvout * seasonal_weights[m - 1], 1))
            
    return {
        "annual_pvout_kwh_per_kwp": round(pvout, 1),
        "optimum_tilt_deg": round(opta, 1),
        "daily_ghi_kwh_m2": round(ghi, 2),
        "monthly_pvout": monthly_pvout,
        "source": "Global Solar Atlas v2.0 (ESMAP / World Bank)"
    }

def calculate_orientation_derate(roof_type: str, azimuth_deg: float = 180.0, tilt_deg: float = 10.0, optimal_tilt: float = 9.0) -> float:
    """
    Calculates transposition and orientation derating factor (eta_site).
    Azimuth 180 = South (Optimal in Sri Lanka).
    Azimuth 90 = East, 270 = West, 0 = North.
    """
    # Deviation from South (180 deg)
    azimuth_dev = abs(azimuth_deg - 180.0)
    if azimuth_dev > 180.0:
        azimuth_dev = 360.0 - azimuth_dev
        
    # In Sri Lanka (low latitude 6-9 deg N), orientation impact is mild (~3-8%)
    # but still measurable
    azimuth_factor = 1.0 - (azimuth_dev / 180.0) * 0.08
    
    # Tilt deviation from optimal
    tilt_dev = abs(tilt_deg - optimal_tilt)
    tilt_factor = 1.0 - (tilt_dev / 45.0) * 0.04
    
    combined = azimuth_factor * tilt_factor
    return max(0.85, min(1.0, round(combined, 3)))
