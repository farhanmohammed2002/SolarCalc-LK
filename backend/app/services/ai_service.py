"""
SolarCalc LK V1.0 — AI Technical Assistant Service
Engineering-grounded assistant for Sri Lankan residential rooftop solar PV planning.
"""

import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

AI_SYSTEM_PROMPT = """You are SolarCalc AI, the technical assistant for SolarCalc LK, a Sri Lanka-specific residential rooftop solar PV planning and economic assessment platform.

Your role is to explain the SolarCalc LK platform, its calculations, solar PV engineering concepts, system results, economic analysis, electricity tariff concepts, rooftop solar schemes, equipment information, and technical documentation.

Always prioritize verified SolarCalc LK data and calculation results.
Never invent tariff values, equipment specifications, solar-resource values, regulatory requirements, or financial results.

When a question relates to a user's calculated system, use the supplied calculation context.

Clearly distinguish between:
- calculated SolarCalc LK results,
- project documentation,
- general educational information,
- information requiring external verification.

If information is unavailable, clearly state that it is not available in the SolarCalc LK knowledge base.

Explain technical concepts clearly and progressively.
Do not claim to replace a qualified electrical engineer, utility authority, or professional site inspection.

For installation, electrical safety, structural suitability, grid connection, or regulatory approval questions, provide educational guidance and direct the user to the appropriate official source or qualified professional where necessary.

Keep answers concise but technically meaningful.
Use equations when useful.
Use bullet points and short sections for complex explanations.

Response style:
- Short paragraphs
- Bullet points
- Numbered steps
- Small tables or equations where useful
- Simple technical explanations without excessive fluff
- Never modify the actual SolarCalc LK calculation results through conversation."""

# Grounded Knowledge Base Constants
KNOWLEDGE_BASE = {
    "tariffs": {
        "revision": "January 18, 2025 (PUCSL)",
        "document": "Final-Decision-Document-Electricity-Tariff-Revision-January-2025.pdf",
        "lifeline": [
            {"units": "0-30", "energy_rate": 4.0, "fixed_charge": 75.0},
            {"units": "31-60", "energy_rate": 6.0, "fixed_charge": 200.0}
        ],
        "above_60": [
            {"block": "0-60", "rate": 11.0},
            {"block": "61-90", "rate": 14.0},
            {"block": "91-120", "rate": 20.0},
            {"block": "121-180", "rate": 33.0},
            {"block": ">180", "rate": 52.0}
        ],
        "above_60_fixed": [
            {"range": "61-90", "charge": 400.0},
            {"range": "91-120", "charge": 1000.0},
            {"range": "121-180", "charge": 1500.0},
            {"range": ">180", "charge": 2000.0}
        ],
        "condition_3": "Fixed charges for solar prosumers shall be based on net consumption."
    },
    "schemes": {
        "NET_METERING": {
            "name": "Net Metering",
            "desc": "1:1 kWh offset against grid consumption. Excess generation is banked as energy credits with no cash payout.",
            "export_rate": "0.00 LKR/kWh (energy credit banking)",
            "contract": "20 years"
        },
        "NET_ACCOUNTING": {
            "name": "Net Accounting",
            "desc": "Generated energy offsets monthly consumption. Net export is paid by CEB at LKR 44.14/kWh (<=20 kW). Net import is billed under PUCSL domestic tariffs.",
            "export_rate": "44.14 LKR/kWh (<=20 kW)",
            "contract": "20 years"
        },
        "NET_PLUS": {
            "name": "Net Plus",
            "desc": "All PV generation is exported to the grid at LKR 44.14/kWh. Entire household consumption is imported and billed separately.",
            "export_rate": "44.14 LKR/kWh (<=20 kW)",
            "contract": "20 years"
        }
    },
    "solar_resource": {
        "source": "World Bank / ESMAP Global Solar Atlas (GSA) v2.0",
        "yield_range": "1,350 to 1,650 kWh/kWp/year",
        "optimum_tilt": "7° to 10° True South (180° azimuth)",
        "daily_ghi": "4.5 to 5.8 kWh/m²/day"
    }
}


def _call_external_llm(message: str, context_str: str) -> Optional[str]:
    """Call external OpenAI-compatible or Google Gemini LLM API if configured."""
    api_key = os.environ.get("AI_API_KEY")
    if not api_key:
        return None

    base_url = os.environ.get("AI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("AI_MODEL", "gpt-4o-mini")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": f"{AI_SYSTEM_PROMPT}\n\nCURRENT CONTEXT:\n{context_str}"},
            {"role": "user", "content": message}
        ],
        "max_tokens": 800,
        "temperature": 0.2
    }

    url = f"{base_url}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[AI Service] External LLM error: {e}, falling back to built-in engineering engine.")
        return None


def _format_context(context: Optional[Dict[str, Any]]) -> str:
    """Format the context object into a structured string for grounding."""
    if not context:
        return "No specific page or calculation context provided."

    lines = []
    page = context.get("page")
    if page:
        lines.append(f"- Active Page: {page}")

    calc = context.get("calculation")
    if calc and isinstance(calc, dict):
        lines.append("- Active Calculation Results:")
        for k, v in calc.items():
            if isinstance(v, (int, float, str, bool)):
                lines.append(f"  • {k}: {v}")
            elif isinstance(v, dict):
                lines.append(f"  • {k}: {json.dumps(v)}")
    return "\n".join(lines)


def _generate_grounded_response(message: str, context: Optional[Dict[str, Any]]) -> str:
    """
    Intelligent built-in engineering inference engine.
    Produces accurate, educational, and contextual answers grounded in SolarCalc LK methodology.
    """
    q = message.lower().strip()
    calc = (context or {}).get("calculation") or {}
    page = (context or {}).get("page") or ""

    # 1. Calculation Results Explanation ("Explain my results", "Explain my solar system", etc.)
    if any(k in q for k in ["explain my result", "explain my system", "explain results", "what are my results", "explain my solar"]):
        if calc:
            capacity = calc.get("system_capacity_kwp") or calc.get("actual_capacity_kwp") or "N/A"
            panels = calc.get("panel_quantity") or calc.get("panel_count") or "N/A"
            panel_model = calc.get("panel_model") or "Tier-1 415W Mono PERC"
            inverter = calc.get("inverter_model") or calc.get("inverter") or "Grid-Tied String Inverter"
            gen = calc.get("annual_generation_kwh") or "N/A"
            savings = calc.get("annual_savings_lkr") or calc.get("annual_net_benefit_lkr") or "N/A"
            cost = calc.get("estimated_system_cost_lkr") or calc.get("system_cost_lkr") or "N/A"
            payback = calc.get("payback_years") or calc.get("simple_payback_years") or "N/A"
            district = calc.get("district") or calc.get("location") or "your selected area"
            scheme = calc.get("scheme") or "Net Accounting"

            return f"""### 📊 Your SolarCalc LK Assessment Summary ({district})

Here is the technical breakdown of your simulated solar PV system:

1. **Recommended System Size**: **{capacity} kWp**
2. **PV Modules**: **{panels} × {panel_model}**
3. **Selected Inverter**: **{inverter}**
4. **Estimated Annual Generation**: **{gen:,} kWh/year** (based on Global Solar Atlas microclimatic solar resource)
5. **Solar Scheme**: **{scheme}**
6. **Estimated Annual Net Benefit**: **LKR {savings:,}**
7. **Estimated Turnkey System Cost**: **LKR {cost:,}**
8. **Simple Payback Period**: **{payback} years**

> [!NOTE]
> All figures are computed using the verified PUCSL January 18, 2025 domestic tariff blocks and CEB RTSPV Feed-in Tariff gazette rates."""
        else:
            return """To explain your specific results, please run a simulation in the **Solar Calculator** first!

Once you complete the 5-step calculation, I will automatically read your system size, module quantity, inverter selection, annual yield, and payback period to give you an itemized technical evaluation."""

    # 2. "Why was this inverter selected?"
    if "why" in q and "inverter" in q:
        if calc:
            inv = calc.get("inverter_model") or calc.get("inverter") or "the selected inverter"
            cap = calc.get("system_capacity_kwp") or calc.get("actual_capacity_kwp") or "your system"
            return f"""### ⚡ Inverter Selection Rationale for {cap} kWp

SolarCalc LK matched **{inv}** based on strict engineering rules:

1. **DC-to-AC Ratio (1.10 - 1.35)**:
   The inverter capacity is sized slightly lower than the peak DC module capacity to maximize operating efficiency during early morning and late afternoon without clipping peak midday energy.
2. **MPPT Voltage Window**:
   The string's maximum voltage at minimum temperature (15°C cold morning limit) remains comfortably below the inverter's maximum input rating, and minimum operating voltage (65°C hot roof limit) stays above the MPPT startup threshold.
3. **Grid Phase Compatibility**:
   Single-phase inverters are mandated for systems ≤ 5 kWp, whereas three-phase units are selected for systems > 5 kWp in compliance with CEB grid connection guidelines."""
        else:
            return """SolarCalc LK matches inverters automatically using three engineering criteria:
- **DC/AC Oversizing Ratio**: Maintained strictly between **1.10 and 1.35**.
- **MPPT Voltage Range**: Validates string $V_{oc}$ at 15°C and $V_{mp}$ at 65°C.
- **Phase Balance**: Single-phase (230V) for systems ≤ 5 kWp; three-phase (400V) for larger capacities."""

    # 3. "Why did the system recommend X panels?" or panel sizing
    if ("why" in q and "panel" in q) or "system size" in q or "calculate my solar system size" in q:
        if calc:
            panels = calc.get("panel_quantity") or calc.get("panel_count") or 6
            cap = calc.get("system_capacity_kwp") or calc.get("actual_capacity_kwp") or "2.49"
            units = calc.get("monthly_consumption_kwh") or calc.get("monthly_units_kwh") or 250
            return f"""### 📐 System Sizing Logic ({panels} Panels / {cap} kWp)

Your system was sized to offset your consumption of **{units} kWh/month** using this formula:

$$P_{{req}} = \\frac{{E_{{annual}} \\times f_{{offset}}}}{{Y_{{PV}} \\times \\eta_{{site}}}}$$

1. **Annual Demand**: {units} kWh/mo × 12 = **{int(units)*12} kWh/year**.
2. **Local Specific Yield ($Y_{{PV}}$)**: Evaluated from the Global Solar Atlas for your district.
3. **Integer Module Rounding**:
   $$N_{{panels}} = \\left\\lceil \\frac{{P_{{req}} \\times 1000}}{{P_{{STC}}}} \\right\\rceil = \\mathbf{{{panels}\\text{{ panels}}}}$$
   $$\\text{{Installed Capacity}} = \\frac{{{panels} \\times 415\\text{{ W}}}}{{1000}} = \\mathbf{{{cap}\\text{{ kWp}}}}$$"""
        else:
            return """SolarCalc LK calculates system size by matching your target annual energy consumption against your district's specific solar yield:

$$P_{req} = \\frac{E_{load} \\times 12 \\times f_{offset}}{Y_{PV} \\times \\eta_{site}} \\text{ [kWp]}$$

Where:
- $E_{load}$: Average monthly consumption in kWh
- $f_{offset}$: Desired offset percentage (default 100%)
- $Y_{PV}$: Specific annual PV yield from Global Solar Atlas (1,350 - 1,650 kWh/kWp/yr)
- $\\eta_{site}$: Tilt and azimuth derating factor

The result is rounded up to the nearest whole number of commercial tier-1 panels."""

    # 4. "What is kWp?" or kW vs kWp
    if "kwp" in q or "kw vs kwp" in q or "kilowatt-peak" in q:
        return """**kWp** stands for **kilowatt-peak**.

It measures the nominal DC power output of a solar PV module under Standard Test Conditions (STC):
- Irradiance: **1,000 W/m²**
- Cell Temperature: **25°C**
- Air Mass: **AM 1.5**

### Practical Example:
A standard residential panel is rated at **415 W** (= 0.415 kWp).
If you install 6 panels:
$$6 \\times 0.415\\text{ kWp} = \\mathbf{2.49\\text{ kWp}}$$

*Contrast with kW*:
- **kWp (DC)** is the peak laboratory rating of the panels.
- **kW (AC)** is the actual continuous electrical power produced by the inverter in real operating conditions."""

    # 5. Payback period & economic analysis
    if "payback" in q or "roi" in q or "economic" in q:
        if calc and ("payback_years" in calc or "simple_payback_years" in calc):
            pb = calc.get("payback_years") or calc.get("simple_payback_years")
            cost = calc.get("estimated_system_cost_lkr") or calc.get("system_cost_lkr") or "N/A"
            sav = calc.get("annual_savings_lkr") or calc.get("annual_net_benefit_lkr") or "N/A"
            return f"""### 💰 Your Payback Period: {pb} Years

The **Simple Payback Period** is calculated as:

$$\\text{{Simple Payback}} = \\frac{{\\text{{Turnkey System Cost}}}}{{\\text{{Annual Net Benefit}}}} = \\frac{{\\text{{LKR }}{cost:,}}}{{\\text{{LKR }}{sav:,}}} = \\mathbf{{{pb}\\text{{ years}}}}$$

- **20-Year Cash Flow**: Takes into account 0.5%/year panel degradation, 1.5% escalated O&M costs, and an inverter replacement allowance at year 10.
- With current PUCSL tariffs, typical domestic payback in Sri Lanka ranges between **3.5 to 5.5 years**."""
        else:
            return """The **Simple Payback Period** measures the time in years required for accumulated electricity bill savings and export revenues to equal the initial turnkey system investment:

$$\\text{Simple Payback (years)} = \\frac{\\text{Total Installed System Cost (LKR)}}{\\text{Annual Net Benefit (LKR/year)}}$$

In Sri Lanka under the PUCSL January 2025 tariffs, residential payback periods typically range between **3.5 to 5.5 years** depending on consumption tier and CEB export scheme."""

    # 6. Solar Schemes (Net Metering vs Net Accounting vs Net Plus)
    if "scheme" in q or "net metering" in q or "net accounting" in q or "net plus" in q:
        return """### 🇱🇰 Sri Lankan CEB Rooftop Solar Schemes

Sri Lanka offers three statutory schemes under the CEB/LECO *Battle for Solar Energy* program:

| Scheme | Electricity Offset | Compensation for Excess | Best Suited For |
| :--- | :--- | :--- | :--- |
| **Net Metering** | 1:1 kWh credit offset against monthly bill | No cash payout; excess banked indefinitely as energy units | High daytime users who want to zero out bills |
| **Net Accounting** | Offsets monthly bill; surplus energy is exported | Paid in cash at **LKR 44.14/kWh** (≤20 kW) | Average homes aiming to wipe bill and earn revenue |
| **Net Plus** | Total gross generation exported directly | 100% exported at **LKR 44.14/kWh**; consumption billed separately | Homes with small consumption but large roofs |

*Rates based on CEB RTSPV Flat Feed-in Tariff (Cabinet decision Ref 02-05-2023).*"""

    # 7. Electricity Tariffs & Bill Calculation
    if "tariff" in q or "bill" in q or "pucsl" in q or "fixed charge" in q or "energy rate" in q:
        return """### ⚡ PUCSL Domestic Electricity Tariff (Effective Jan 18, 2025)

Sri Lanka uses a tiered block structure:

**Lifeline Tier (≤ 60 kWh/month)**:
- 0 – 30 units: **LKR 4.00/kWh** (Fixed: LKR 75.00)
- 31 – 60 units: **LKR 6.00/kWh** (Fixed: LKR 200.00)

**Standard Domestic Tier (> 60 kWh/month)**:
- 0 – 60 units: **LKR 11.00/kWh**
- 61 – 90 units: **LKR 14.00/kWh** (Fixed: LKR 400.00)
- 91 – 120 units: **LKR 20.00/kWh** (Fixed: LKR 1,000.00)
- 121 – 180 units: **LKR 33.00/kWh** (Fixed: LKR 1,500.00)
- > 180 units: **LKR 52.00/kWh** (Fixed: LKR 2,000.00)

> [!IMPORTANT]
> **Condition 3 for Solar Prosumers**: The fixed charge is determined by your **net imported units**, not gross consumption!"""

    # 8. Annual Generation / Yield calculation
    if "generation" in q or "annual generation" in q or "how is solar calculated" in q or "yield" in q:
        return """### ☀️ Annual Solar PV Generation Formula

Annual solar generation is calculated as:

$$E_{annual} = P_{actual} \\times Y_{PV} \\times \\eta_{site} \\text{ [kWh/year]}$$

Where:
- **$P_{actual}$**: Total installed peak capacity in kWp.
- **$Y_{PV}$**: Specific yield in kWh/kWp/year from Global Solar Atlas v2.0 (accounting for local GHI, temperature, and microclimate).
- **$\\eta_{site}$**: Site tilt and azimuth correction factor.

For example, a **2.49 kWp** system in Colombo (~1,520 kWh/kWp/yr) produces approximately **3,780 kWh annually** (~315 kWh/month)."""

    # 9. Technical Terms (MPPT, DC/AC, GHI, Losses, Inverter)
    if "mppt" in q:
        return """### 🔄 What is MPPT?

**MPPT** stands for **Maximum Power Point Tracking**.

A solar PV module's output voltage and current curve varies continuously with sunlight intensity and ambient temperature.
- The MPPT algorithm inside the inverter continuously adjusts electrical impedance to locate the point on the $I\\text{-}V$ curve where **$P = V \\times I$ is maximized**.
- Quality inverters in SolarCalc LK feature dual MPPT trackers, allowing independent optimization for multiple roof orientations."""

    if "loss" in q or "derate" in q:
        return """### 📉 Solar PV System Losses Modeled by SolarCalc LK

SolarCalc LK applies a realistic aggregate system performance ratio of **75% – 80%**, accounting for:

- **Temperature Losses (8% – 12%)**: High ambient tropical temperatures lower module voltage.
- **Soiling & Dust (3% – 5%)**: Dust, pollen, and salt deposition on glass.
- **Inverter Conversion (2.5% – 3.5%)**: DC-to-AC conversion loss.
- **DC/AC Cabling Losses (2% – 3%)**: Resistance drop in DC solar cables.
- **Module Mismatch (1.5%)**: Manufacturing variance between connected modules."""

    if "energy balance" in q:
        return """### ⚖️ Interpreting the Energy Balance

The Energy Balance breaks down your monthly electricity flows:
1. **Direct Self-Consumption**: Daytime solar energy consumed immediately by household appliances.
2. **Grid Export**: Surplus daytime generation sent to the CEB grid.
3. **Grid Import**: Nighttime and rainy day electricity drawn from the grid.

Under Net Accounting, your grid export earns cash credits at LKR 44.14/kWh to offset grid import costs."""

    if "report" in q or "download" in q:
        return """### 📄 Downloading Your Technical Report

You can generate and download two types of documentation from SolarCalc LK:
1. **Client Proposal (PDF)**:
   On the **Results Dashboard** (Step 5 of the Calculator), click the yellow **"Download PDF Proposal"** button. This produces a customized, printable multi-page proposal with electrical specs, 20-year cash flow, and environmental metrics.
2. **Comprehensive Research Report**:
   Navigate to the **Reports** tab to download the complete 38-page *SolarCalc LK V1.0 Engineering Technical Report* (PDF and Word formats) and Excel data package."""

    # 10. General Page Explanations
    if "methodology" in q or page == "/methodology":
        return """### 📘 About the Methodology Page

The **Methodology** page provides complete peer-review transparency into the 8 core engineering stages of SolarCalc LK:
1. Global Solar Atlas v2.0 spatial raster querying
2. Target photovoltaic sizing formulas
3. Commercial module selection & roof area footprint
4. Inverter matching and MPPT temperature window verification
5. PUCSL January 2025 block tariff and Condition 3 logic
6. CEB Net Metering, Net Accounting, and Net Plus simulations
7. 20-year cash-flow and simple payback calculations
8. Avoided carbon emissions and environmental offsets."""

    if "sources" in q or page == "/sources":
        return """### 📚 About the Sources Page

The **Sources** page documents all primary references used in SolarCalc LK:
- **PUCSL January 18, 2025 Tariff Document**: Domestic electricity schedules.
- **CEB RTSPV Gazette (Oct 2023 / Cabinet 02-05-2023)**: 44.14 LKR/kWh feed-in tariff.
- **World Bank / ESMAP Global Solar Atlas v2.0**: High-resolution PVOUT, GHI, and OPTA rasters.
- **Manufacturer Engineering Datasheets**: EGing, SunPower, Jinko, Sungrow, GoodWe.
- **PUCSL Rooftop Solar Installation Guidelines Rev 1**: Technical wiring, protection, and safety."""

    if "how to use" in q or "how does solarcalc work" in q or "calculator" in q:
        return """### 🚀 How to Use SolarCalc LK in 5 Simple Steps

1. **Step 1 - Location**: Select your Sri Lankan district (or tap GPS) to load local solar irradiance.
2. **Step 2 - Consumption**: Enter your average monthly units (kWh) or recent CEB/LECO electricity bill.
3. **Step 3 - Property**: Specify roof type, usable area, tilt angle, and azimuth direction.
4. **Step 4 - System**: Choose your rooftop scheme (Net Accounting recommended) and panel model.
5. **Step 5 - Results Dashboard**: View your custom system capacity, recommended inverter, generation charts, 20-year financial returns, and export a client PDF proposal."""

    # Default technical fallback
    return """Hello! I am **SolarCalc AI**, the engineering technical assistant for SolarCalc LK.

I can assist you with:
- Explaining your **calculation results** and system sizing (kWp, modules, inverter)
- **PUCSL January 2025 tariffs** and electricity bill savings
- CEB **Net Metering vs Net Accounting vs Net Plus**
- Technical terms like **kWp, MPPT, DC/AC ratio, and system losses**
- Guidance on the **Methodology**, **Sources**, and downloading your technical report

If you have completed a calculation, ask me *"Explain my results"* or *"Why was this inverter selected?"*!"""


def process_chat_message(message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    """
    Main entry point for processing AI Assistant queries.
    Validates input, checks for external LLM, and falls back to grounded engine.
    """
    cleaned_message = (message or "").strip()
    if not cleaned_message:
        return {
            "answer": "Please ask a question regarding residential solar PV planning, tariffs, or SolarCalc LK.",
            "source": "SolarCalc LK Engineering Knowledge Base"
        }

    # Input length protection
    if len(cleaned_message) > 1000:
        cleaned_message = cleaned_message[:1000]

    context_str = _format_context(context)

    # 1. Try external LLM if configured
    llm_response = _call_external_llm(cleaned_message, context_str)
    if llm_response:
        return {
            "answer": llm_response,
            "source": "SolarCalc AI (Grounded Model)"
        }

    # 2. Use built-in engineering inference engine
    grounded_answer = _generate_grounded_response(cleaned_message, context)
    return {
        "answer": grounded_answer,
        "source": "SolarCalc LK Engineering Knowledge Base"
    }
