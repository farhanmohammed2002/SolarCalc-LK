import json, csv, os, openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

ROOT = r"c:\Users\Dell\Desktop\SOLARCALC LK"
DATA_DIR = os.path.join(ROOT, "backend", "app", "data")
DOCS_DIR = os.path.join(ROOT, "docs")

# 1. Locations CSV
with open(os.path.join(DATA_DIR, "locations.json"), "r", encoding="utf-8") as f:
    locations = json.load(f)

csv_path = os.path.join(DOCS_DIR, "locations.csv")
backend_csv_path = os.path.join(DATA_DIR, "locations.csv")
fieldnames = ["id", "city", "district", "province", "latitude", "longitude", "annual_pvout_kwh_kwp", "opta_deg", "ghi_kwh_m2_day", "elevation_m", "data_source"]

for p in [csv_path, backend_csv_path]:
    with open(p, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for idx, loc in enumerate(locations, start=1):
            writer.writerow({
                "id": idx,
                "city": loc["name"],
                "district": loc["name"],
                "province": loc["province"],
                "latitude": loc["lat"],
                "longitude": loc["lon"],
                "annual_pvout_kwh_kwp": loc["pvout"],
                "opta_deg": loc["opta"],
                "ghi_kwh_m2_day": loc["ghi"],
                "elevation_m": 15,
                "data_source": "World Bank Global Solar Atlas v2.0"
            })
print("Generated locations.csv successfully")

# 2. Panel Database XLSX
with open(os.path.join(DATA_DIR, "panels.json"), "r", encoding="utf-8") as f:
    panels = json.load(f)

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Solar Panels"

headers = ["ID", "Manufacturer", "Model", "Rated Power (Wp)", "Efficiency (%)", "Voc (V)", "Isc (A)", "Vmp (V)", "Imp (A)", "Temp Coeff Pmp (%/C)", "Dimensions (mm)", "Weight (kg)", "Product Warranty (yr)", "Performance Warranty (yr)", "Bifacial", "Datasheet Source"]
ws.append(headers)

hdr_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
hdr_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")

for col_num, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col_num)
    cell.fill = hdr_fill
    cell.font = hdr_font
    cell.alignment = Alignment(horizontal="center", vertical="center")

for p in panels:
    dims = f"{p['length_mm']} x {p['width_mm']} x {p['thickness_mm']}"
    ws.append([
        p["id"], p["manufacturer"], p["model"], p["rated_power_w"], p["efficiency_pct"],
        p["voc_v"], p["isc_a"], p["vmp_v"], p["imp_a"], p["temp_coeff_pmp"],
        dims, p["weight_kg"], p["warranty_years"], p["performance_warranty_years"],
        "Yes" if p["is_bifacial"] else "No", p["datasheet_source"]
    ])

for col in ws.columns:
    max_len = max(len(str(cell.value or "")) for cell in col)
    ws.column_dimensions[col[0].column_letter].width = max(max_len + 3, 12)

panel_xlsx_path = os.path.join(DOCS_DIR, "panel_database.xlsx")
wb.save(panel_xlsx_path)
print("Generated panel_database.xlsx")

# 3. Inverter Database XLSX
with open(os.path.join(DATA_DIR, "inverters.json"), "r", encoding="utf-8") as f:
    inverters = json.load(f)

wb_inv = openpyxl.Workbook()
ws_inv = wb_inv.active
ws_inv.title = "Inverters"

inv_headers = ["ID", "Manufacturer", "Model", "Rated AC Power (kW)", "Max PV Power (kW)", "MPPT Min (V)", "MPPT Max (V)", "Max Input Current (A)", "MPPT Count", "Phase", "Max Efficiency (%)", "Euro Efficiency (%)", "Warranty (yr)", "Datasheet Source"]
ws_inv.append(inv_headers)

for col_num, header in enumerate(inv_headers, 1):
    cell = ws_inv.cell(row=1, column=col_num)
    cell.fill = hdr_fill
    cell.font = hdr_font
    cell.alignment = Alignment(horizontal="center", vertical="center")

for inv in inverters:
    ws_inv.append([
        inv["id"], inv["manufacturer"], inv["model"], inv["rated_ac_power_kw"], inv["max_pv_power_kw"],
        inv["mppt_voltage_min_v"], inv["mppt_voltage_max_v"], inv["max_input_current_a"], inv["mppt_count"],
        inv["phase"], inv["max_efficiency_pct"], inv["euro_efficiency_pct"], inv["warranty_years"],
        inv["datasheet_source"]
    ])

for col in ws_inv.columns:
    max_len = max(len(str(cell.value or "")) for cell in col)
    ws_inv.column_dimensions[col[0].column_letter].width = max(max_len + 3, 12)

inv_xlsx_path = os.path.join(DOCS_DIR, "inverter_database.xlsx")
wb_inv.save(inv_xlsx_path)
print("Generated inverter_database.xlsx")
