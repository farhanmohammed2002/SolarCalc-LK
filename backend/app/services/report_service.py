"""
PDF Assessment Report Generation Service using ReportLab
Produces client-ready technical engineering proposals tailored to Sri Lankan conditions.
"""

import io, os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_assessment(calc_result: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1,
        spaceAfter=4
    )
    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#4B5563'),
        alignment=1,
        spaceAfter=12
    )
    sec_style = ParagraphStyle(
        'DocSec',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=10,
        spaceAfter=5
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1F2937')
    )
    bold_style = ParagraphStyle(
        'DocBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    story = []
    
    # Title & Header
    story.append(Paragraph("SolarCalc LK V1.0 — Preliminary Solar PV Assessment", title_style))
    story.append(Paragraph(
        f"Prepared for property in <b>{calc_result['inputs']['district']}</b> | "
        f"Regulatory Baseline: <b>PUCSL Jan 18, 2025 Tariff</b> & <b>CEB Feed-in Schemes</b>",
        sub_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=10))
    
    # Executive Highlights Table
    system = calc_result.get("system", {})
    gen = calc_result.get("generation", {})
    fin = calc_result.get("financials", {})
    scheme = calc_result.get("scheme", {})
    
    highlights = [
        [
            Paragraph("<b>Recommended PV Capacity:</b>", body_style),
            Paragraph(f"{system.get('actual_capacity_kwp', 0.0)} kWp DC", bold_style),
            Paragraph("<b>Turnkey Estimated Cost:</b>", body_style),
            Paragraph(f"LKR {fin.get('system_cost_lkr', 0):,.0f}", bold_style)
        ],
        [
            Paragraph("<b>PV Module Configuration:</b>", body_style),
            Paragraph(f"{system.get('panel_count', 0)} × {system.get('panel', {}).get('rated_power_w', 0)}W ({system.get('panel', {}).get('model', 'N/A')})", body_style),
            Paragraph("<b>Annual Net Benefit:</b>", body_style),
            Paragraph(f"LKR {fin.get('annual_net_benefit_lkr', 0):,.0f} / year", bold_style)
        ],
        [
            Paragraph("<b>Matched Inverter:</b>", body_style),
            Paragraph(f"{system.get('inverter', {}).get('manufacturer', '')} {system.get('inverter', {}).get('model', '')} ({system.get('inverter', {}).get('rated_ac_power_kw', 0)} kW AC)", body_style),
            Paragraph("<b>Simple Payback Period:</b>", body_style),
            Paragraph(f"{fin.get('simple_payback_years', 0)} Years", bold_style)
        ],
        [
            Paragraph("<b>Estimated Annual Yield:</b>", body_style),
            Paragraph(f"{gen.get('annual_kwh', 0):,.0f} kWh/year", body_style),
            Paragraph("<b>20-Year Cumulative Savings:</b>", body_style),
            Paragraph(f"LKR {fin.get('twenty_year_savings_lkr', 0):,.0f}", bold_style)
        ],
        [
            Paragraph("<b>Selected Solar Scheme:</b>", body_style),
            Paragraph(f"{scheme.get('scheme_details', {}).get('scheme_name', 'Net Accounting')}", body_style),
            Paragraph("<b>Annual CO2 Avoided:</b>", body_style),
            Paragraph(f"{fin.get('co2_avoided_tonnes_per_year', 0)} tonnes / yr ({fin.get('trees_planted_equivalent', 0)} trees)", body_style)
        ]
    ]
    
    t_hl = Table(highlights, colWidths=[130, 150, 130, 130])
    t_hl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_hl)
    story.append(Spacer(1, 10))
    
    # Section 1: Electrical & Array Engineering
    story.append(Paragraph("1. Array Sizing & Electrical Design", sec_style))
    array_specs = [
        [Paragraph("<b>DC/AC Sizing Ratio:</b>", body_style), Paragraph(f"{system.get('dc_ac_ratio', 0)} (Optimal target: 1.10 - 1.35)", body_style)],
        [Paragraph("<b>String Layout:</b>", body_style), Paragraph(f"{system.get('num_strings', 1)} string(s) of {system.get('panels_per_string', 0)} series panels", body_style)],
        [Paragraph("<b>Max String Voc (Cold 15°C):</b>", body_style), Paragraph(f"{system.get('string_voc_max_v', 0)} V (Safe limit: <= {system.get('inverter', {}).get('mppt_voltage_max_v', 560)} V)", body_style)],
        [Paragraph("<b>Min String Vmp (Hot 65°C):</b>", body_style), Paragraph(f"{system.get('string_vmp_min_v', 0)} V (Tracking limit: >= {system.get('inverter', {}).get('mppt_voltage_min_v', 90)} V)", body_style)],
        [Paragraph("<b>Estimated Roof Area Required:</b>", body_style), Paragraph(f"{system.get('required_roof_area_sqm', 0)} m² (includes 15% access & structural allowance)", body_style)],
        [Paragraph("<b>Electrical Verification Status:</b>", body_style), Paragraph(f"<b>{system.get('electrical_check', {}).get('status', 'VERIFIED')}</b> - {system.get('electrical_check', {}).get('details', '')}", body_style)]
    ]
    t_arr = Table(array_specs, colWidths=[180, 360])
    t_arr.setStyle(TableStyle([
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
        ('PADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_arr)
    story.append(Spacer(1, 8))
    
    # Section 2: PUCSL Jan 2025 Tariff & Scheme Settlement
    story.append(Paragraph("2. Electricity Tariff & Monthly Settlement Analysis", sec_style))
    tariff_specs = [
        [Paragraph("<b>Average Monthly Consumption:</b>", body_style), Paragraph(f"{calc_result['inputs']['monthly_units_kwh']} kWh / month", body_style)],
        [Paragraph("<b>Pre-Solar Monthly CEB Bill:</b>", body_style), Paragraph(f"LKR {scheme.get('pre_solar_bill_lkr', 0):,.2f}", body_style)],
        [Paragraph("<b>Post-Solar Monthly CEB Bill:</b>", body_style), Paragraph(f"LKR {scheme.get('post_solar_bill_lkr', 0):,.2f} (Under PUCSL Jan 2025 Condition 3 net fixed charge)", body_style)],
        [Paragraph("<b>Monthly Cash Export Earnings:</b>", body_style), Paragraph(f"LKR {scheme.get('cash_export_revenue_lkr', 0):,.2f} (CEB RTSPV rate: LKR 44.14/kWh)", body_style)],
        [Paragraph("<b>Net Monthly Economic Benefit:</b>", body_style), Paragraph(f"<b>LKR {scheme.get('net_monthly_benefit_lkr', 0):,.2f} / month</b>", bold_style)]
    ]
    t_tar = Table(tariff_specs, colWidths=[180, 360])
    t_tar.setStyle(TableStyle([
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
        ('PADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_tar)
    story.append(Spacer(1, 8))
    
    # Section 3: Monthly Solar Generation Breakdown
    story.append(Paragraph("3. Expected Monthly Generation (Global Solar Atlas Model)", sec_style))
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_vals = gen.get("monthly_kwh", [0]*12)
    m_row1 = [Paragraph(f"<b>{m}</b>", body_style) for m in months]
    m_row2 = [Paragraph(f"{val:.0f}", body_style) for val in monthly_vals]
    t_mon = Table([m_row1, m_row2], colWidths=[45]*12)
    t_mon.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_mon)
    story.append(Spacer(1, 10))
    
    # Disclaimer & Traceability Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceAfter=6))
    story.append(Paragraph(
        "<b>Engineering Disclaimer:</b> SolarCalc LK V1.0 provides preliminary planning estimates for informational purposes only. "
        "Results do not substitute for an on-site structural audit, electrical design, quotation, or official utility connection approval by CEB/LECO.",
        ParagraphStyle('Disc', parent=body_style, fontSize=7, leading=9, textColor=colors.HexColor('#64748B'))
    ))
    story.append(Paragraph(
        "<b>Designed & Developed by:</b> Farhan Mohammad, B.Sc. (Hons) Electrical & Electronic Engineering Undergraduate, University of Jaffna (E23 Batch). "
        "Data Sources: PUCSL (Jan 18, 2025 Tariff Decision), CEB (Oct 2023 Solar Gazette), World Bank Global Solar Atlas v2.0.",
        ParagraphStyle('Auth', parent=body_style, fontSize=7, leading=9, textColor=colors.HexColor('#64748B'))
    ))
    
    doc.build(story)
    buffer.seek(0)
    return buffer
