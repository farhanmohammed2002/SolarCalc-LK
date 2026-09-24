"""
SolarCalc LK V1.0 — AI Technical Assistant Service
Engineering-grounded assistant for Sri Lankan residential rooftop solar PV planning.
Supports Google Gemini, OpenAI-compatible LLMs, and intelligent built-in engineering engine.
"""

import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

# Load local .env if available
def _load_env_file():
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip("'\"")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass

_load_env_file()

AI_SYSTEM_PROMPT = """You are SolarCalc AI, the technical assistant for SolarCalc LK, a Sri Lanka-specific residential rooftop solar PV planning and economic assessment platform.

Your role is to explain the SolarCalc LK platform, its calculations, solar PV engineering concepts, system results, economic analysis, electricity tariff concepts, rooftop solar schemes, equipment information, and technical documentation.

Always prioritize verified SolarCalc LK data and calculation results:
- PUCSL January 18, 2025 domestic electricity tariffs and Condition 3 (net fixed charge for solar prosumers).
- CEB Feed-in Schemes: Net Metering (1:1 kWh rolling banking), Net Accounting (surplus paid in cash at LKR 44.14/kWh for <=20 kW), and Net Plus (gross export at LKR 44.14/kWh).
- World Bank / ESMAP Global Solar Atlas v2.0 microclimatic solar resource data (1,350 to 1,650 kWh/kWp/year across 25 Sri Lankan districts).
- Verified equipment: JinkoSolar Tiger Neo N-Type (470W/475W/545W/630W/670W), REC Alpha Pure-RX (470W HJT), LONGi Hi-MO X6 (550W), Sungrow, Huawei SUN2000, Deye, SMA, Fronius, GoodWe inverters, and LiFePO4 batteries (Deye SE-G5.1, Huawei LUNA2000, Sungrow SBR, GoodWe Lynx, BYD).

When answering questions about the website, explain how to navigate the 5-step Calculator, download PDF assessment proposals, explore the Solar Map, review the Methodology, download reports, or inspect equipment.

Response style:
- Friendly, professional, and engineering-grounded.
- Clear formatting with bullet points and bold highlights.
- Keep answers concise and direct.
"""

def _call_gemini_api(api_key: str, message: str, context_str: str) -> Optional[str]:
    """Call Google Gemini REST API (gemini-1.5-flash / gemini-2.0-flash)."""
    model = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "system_instruction": {
            "parts": [{"text": f"{AI_SYSTEM_PROMPT}\n\nCURRENT SOLARCALC LK CONTEXT:\n{context_str}"}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.25,
            "maxOutputTokens": 1000
        }
    }
    
    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
    except Exception as e:
        print(f"[AI Service] Gemini API call error: {e}")
    return None


def _call_openai_api(api_key: str, message: str, context_str: str) -> Optional[str]:
    """Call OpenAI-compatible REST API (OpenAI, Groq, OpenRouter, DeepSeek)."""
    base_url = os.environ.get("AI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("AI_MODEL", "gpt-4o-mini")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": f"{AI_SYSTEM_PROMPT}\n\nCURRENT CONTEXT:\n{context_str}"},
            {"role": "user", "content": message}
        ],
        "max_tokens": 1000,
        "temperature": 0.25
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
        print(f"[AI Service] OpenAI-compatible LLM error: {e}")
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
    Covers all aspects of SolarCalc LK: reports, calculation, tariffs, schemes, equipment, GPS, etc.
    """
    q = message.lower().strip()
    # Normalize common typos
    q_norm = q.replace("dwload", "download").replace("dwnload", "download").replace("donwload", "download")
    
    calc = (context or {}).get("calculation") or {}
    page = (context or {}).get("page") or ""

    # 1. DOWNLOAD / REPORT / PDF / EXPORT
    if any(k in q_norm for k in ["download report", "download pdf", "how to download", "get report", "download assessment", "technical report", "data package", "export pdf", "proposal", "pdf report", "download"]):
        district = calc.get("district", "your location") if calc else "your property"
        return f"""### 📄 How to Download Reports on SolarCalc LK

You can download **two types of official engineering reports** directly from the website:

---

#### 1. 📋 Preliminary Solar PV Proposal (Personalized Client PDF)
* **Where to get it**: In the **Calculator** tab (Step 5: Results Dashboard).
* **How to download**:
  1. Complete Steps 1 through 4 of the Calculator (or click *Calculate My Solar System*).
  2. On the **Results Dashboard**, look at the top-right corner of the summary header.
  3. Click the green **`[ 📥 Download PDF Assessment ]`** button.
  4. Your customized PDF report will generate instantly with:
     - The official **SolarCalc LK Report Logo**
     - Sized capacity ({calc.get('system_capacity_kwp', '3.3')} kWp DC) and string layout
     - Selected PV panels & inverter matching verification
     - Monthly generation table & 20-year cash-flow projection
     - PUCSL Jan 2025 tariff and CEB RTSPV economic settlement breakdown

---

#### 2. 📚 25-Section Technical Validation Report & Data Package
* **Where to get it**: Click the **`Reports`** tab in the top navigation bar.
* **Available downloads**:
  - **`Technical Report (PDF)`**: Comprehensive 25-section engineering white paper covering PUCSL 2025 tariffs, Global Solar Atlas spatial models, and 12 validation cases.
  - **`Technical Report (DOCX)`**: Fully editable Microsoft Word version with equations and tables.
  - **`Data Package (ZIP)`**: Complete dataset archive containing raw CSVs, district irradiance tables, PUCSL tariff documents, and equipment catalogues.

> [!TIP]
> Both reports are free to download and ready for client proposals or academic reference!"""

    # 2. CALCULATION RESULTS EXPLANATION
    if any(k in q_norm for k in ["explain my result", "explain my system", "explain results", "what are my results", "explain my solar", "explain calculation"]):
        if calc:
            capacity = calc.get("system_capacity_kwp") or calc.get("actual_capacity_kwp") or "N/A"
            panels = calc.get("panel_quantity") or calc.get("panel_count") or "N/A"
            panel_model = calc.get("panel_model") or "Tier-1 470W Bifacial TOPCon"
            inverter = calc.get("inverter_model") or calc.get("inverter") or "Single-Phase Grid-Tied Inverter"
            gen = calc.get("annual_generation_kwh") or "N/A"
            savings = calc.get("annual_savings_lkr") or calc.get("annual_net_benefit_lkr") or "N/A"
            cost = calc.get("estimated_system_cost_lkr") or calc.get("system_cost_lkr") or "N/A"
            payback = calc.get("payback_years") or calc.get("simple_payback_years") or "N/A"
            district = calc.get("district") or calc.get("location") or "Selected District"
            scheme = calc.get("scheme") or "Net Accounting"

            return f"""### 📊 Your SolarCalc LK Assessment Summary ({district})

Here is the engineering breakdown of your calculated system:

1. **Recommended Capacity**: **{capacity} kWp DC**
2. **PV Modules**: **{panels} × {panel_model}**
3. **Matched Inverter**: **{inverter}**
4. **Estimated Annual Generation**: **{gen:,} kWh/year** (Global Solar Atlas model)
5. **Solar Scheme**: **{scheme}**
6. **Estimated Annual Net Benefit**: **LKR {savings:,} / year**
7. **Estimated Turnkey System Cost**: **LKR {cost:,}**
8. **Simple Payback Period**: **{payback} years**

> [!NOTE]
> Net fixed charge savings are calculated under **PUCSL January 18, 2025 Condition 3** (fixed charge billed solely on residual net consumption). Excess units under Net Accounting receive LKR 44.14/kWh in cash credits from CEB/LECO."""
        else:
            return """To explain your specific results, please run a simulation in the **Solar Calculator** first!

1. Open the **Calculator** tab.
2. Enter your district and monthly electricity consumption (kWh or LKR).
3. Click **Calculate My Solar System**.
4. Then return here or click *"Ask SolarCalc AI about these results"*, and I will provide an itemized engineering breakdown of your numbers!"""

    # 3. GPS AUTO LOCATION
    if any(k in q_norm for k in ["gps", "auto location", "auto-location", "coordinate", "pinpoint", "my location"]):
        return """### 🛰️ GPS Auto-Location in SolarCalc LK

SolarCalc LK features built-in **GPS Auto-Location**:

1. In **Step 1 (Location & Solar Irradiance)** of the Calculator, click the **`[ 🛰️ GPS Auto-Location ]`** button.
2. When prompted by your browser, tap **"Allow"** to grant location access.
3. The app reads your precise latitude & longitude coordinates.
4. Using the Euclidean territorial distance engine, it automatically maps your location to the nearest of **25 Sri Lankan districts** (e.g. Colombo, Jaffna, Kandy, Galle, Trincomalee).
5. It then pulls the exact **Global Solar Atlas v2.0 microclimatic yield (PVOUT)** and optimum tilt angle for your rooftop!"""

    # 4. HOW TO USE / CALCULATOR STEPS
    if any(k in q_norm for k in ["how to use", "how calculate", "how to calculate", "how do i use", "steps", "calculator", "start"]):
        return """### 🚀 How to Use SolarCalc LK in 5 Simple Steps

1. **Step 1 — Location**: Select your district from the dropdown or tap **🛰️ GPS Auto-Location** to fetch local solar irradiance (PVOUT).
2. **Step 2 — Electricity Consumption**: Enter your average monthly units (kWh) from your CEB/LECO bill, or enter your monthly bill amount in LKR.
3. **Step 3 — Roof & Physical Orientation**: Select your roofing material (Clay Tile, Asbestos, Corrugated Zinc, Concrete Slab), enter available area ($m^2$), and specify tilt & azimuth.
4. **Step 4 — Rooftop Scheme & Equipment**: Choose your CEB scheme (**Net Accounting** recommended for highest cash return) and select a tier-1 PV panel (e.g. JinkoSolar Tiger Neo 470W).
5. **Step 5 — Results & Proposal**: Review system capacity, string sizing, inverter matching, 20-year savings trajectory, and click **📥 Download PDF Assessment** to save your client proposal!"""

    # 5. BATTERIES / ENERGY STORAGE
    if any(k in q_norm for k in ["battery", "batteries", "storage", "ess", "lifepo4", "backup", "deye", "huawei luna", "sungrow", "byd"]):
        return r"""### 🔋 Battery Storage (BESS) for Sri Lankan Solar Systems

SolarCalc LK supports verified residential lithium iron phosphate (**LiFePO4**) battery energy storage systems:

#### Supported Verified Battery Models:
- **Deye SE-G5.1 Pro-B (Spring Series)**: 5.12 kWh nominal (4.61 kWh usable @ 90% DoD), 51.2V 100Ah, $\ge 6,000$ cycles, modular up to 64 units (327.68 kWh), 10-year warranty.
- **Huawei LUNA2000-7-S1 (Smart String ESS)**: 6.9 kWh module (100% usable DoD), high-voltage (350V–560V), IP66 outdoor rated, 10-year warranty.
- **GoodWe Lynx Home U Series LX U5.4-L**: 5.4 kWh nominal (4.86 kWh usable), 51.2V 105Ah, IP65.
- **Sungrow SBR096 High-Voltage LFP**: 9.6 kWh nominal (100% DoD), 192V, 30A continuous, modular up to 25.6 kWh.
- **BYD Battery-Box Premium HVM 11.0**: 11.04 kWh usable, 204.8V high-voltage, modular scalable up to 66.2 kWh.

#### How to Add Batteries:
To add battery storage, pair the system with a **Hybrid Inverter** (such as the Deye SUN-5K-SG04LP1, Sungrow SH5.0RS, Huawei SUN2000-5KTL-L1, or Solis S6-EH1P5K). This ensures uninterrupted power during CEB grid outages."""

    # 6. INVERTER SELECTION & SIZING
    if any(k in q_norm for k in ["inverter", "why inverter", "mppt", "dc/ac", "clipping", "string"]):
        inverter = calc.get("inverter_model", "Grid-Tied String Inverter") if calc else "a matched tier-1 inverter"
        return f"""### ⚡ Inverter Sizing Engineering Methodology

In SolarCalc LK, {inverter} was matched following international IEC 62548 standards:

1. **DC/AC Sizing Ratio (DC-to-AC Ratio Overclocking)**:
   - Target ratio: **1.10 to 1.35**.
   - Ensures the inverter operates near maximum efficiency during morning/afternoon low irradiance without excessive clipping at noon.
2. **Phase Determination**:
   - $\\le 5\\text{{ kWp}}$ DC: **Single Phase** (230V, standard CEB domestic service).
   - $> 5\\text{{ kWp}}$ DC: **Three Phase** (400V, required by CEB for larger arrays).
3. **MPPT Temperature Voltage Window**:
   - **Extreme Cold (15°C)**: Maximum open-circuit voltage ($V_{{oc}}$) must not exceed the inverter upper DC limit (e.g. 560V or 600V).
   - **Extreme Hot (65°C Roof Noon)**: Minimum maximum-power voltage ($V_{{mp}}$) must stay above the lower MPPT tracking boundary (e.g. 80V–90V)."""

    # 7. TARIFFS / PUCSL JAN 2025
    if any(k in q_norm for k in ["tariff", "pucsl", "bill", "rate", "cost", "charge", "fixed charge", "january 2025", "tier", "block", "lifeline"]):
        return r"""### 🇱🇰 Sri Lanka Domestic Electricity Tariffs (PUCSL Jan 18, 2025)

The Public Utilities Commission of Sri Lanka (PUCSL) implemented the following domestic tariff schedule:

#### 1. Lifeline Tier ($\le 60$ kWh/month):
| Block | Energy Rate (LKR/kWh) | Fixed Charge (LKR/mo) |
| :--- | :--- | :--- |
| **0 – 30 kWh** | LKR 4.00 | LKR 75.00 |
| **31 – 60 kWh** | LKR 6.00 | LKR 200.00 |

#### 2. General Domestic Tier ($> 60$ kWh/month):
| Consumption Block | Energy Charge Rate | Monthly Fixed Charge |
| :--- | :--- | :--- |
| **Block 1 (0 – 60 kWh)** | LKR 11.00 / kWh | $\le 60\text{ kWh}$: LKR 200.00 |
| **Block 2 (61 – 90 kWh)** | LKR 14.00 / kWh | $61 - 90\text{ kWh}$: LKR 400.00 |
| **Block 3 (91 – 120 kWh)** | LKR 20.00 / kWh | $91 - 120\text{ kWh}$: LKR 1,000.00 |
| **Block 4 (121 – 180 kWh)** | LKR 33.00 / kWh | $121 - 180\text{ kWh}$: LKR 1,500.00 |
| **Block 5 (Above 180 kWh)** | LKR 52.00 / kWh | $> 180\text{ kWh}$: LKR 2,000.00 |

> [!IMPORTANT]
> **Condition 3 for Solar Prosumers:** Fixed charges for rooftop solar consumers are levied **strictly on net imported units**, not total gross consumption! If your solar system zeroes out your net units, your fixed charge drops to LKR 0."""

    # 8. CEB SCHEMES (NET METERING / NET ACCOUNTING / NET PLUS)
    if any(k in q_norm for k in ["scheme", "net metering", "net accounting", "net plus", "feed-in", "feed in", "ceb", "leco", "export rate", "44.14"]):
        return r"""### 🇱🇰 Sri Lankan CEB Rooftop Solar Schemes

Sri Lanka provides three statutory schemes under the CEB/LECO *Battle for Solar Energy* framework:

| Scheme | Offset Type | Compensation for Excess | Best For |
| :--- | :--- | :--- | :--- |
| **Net Accounting** *(Recommended)* | Direct daytime offset | Cash payout at **44.14 LKR/kWh** ($\le 20\text{ kW}$) | Homes with moderate-to-high bills seeking cash revenue |
| **Net Metering** | 1:1 unit (kWh) offset | Banking of energy credits (no cash payout) | High consumption users who wish to accumulate credits |
| **Net Plus** | Gross Export | 100% exported at **44.14 LKR/kWh**; consumption billed separately | Low domestic bill properties with large roof space |

*All contracts are established for a 20-year term with CEB or LECO.*"""

    # 9. PAYBACK / ROI / FINANCIALS
    if any(k in q_norm for k in ["payback", "roi", "savings", "financial", "return", "investment", "cost per kwp"]):
        if calc and calc.get("payback_years"):
            return f"""### 💰 Financial Return Analysis for Your System
- **Estimated Turnkey System Cost**: LKR {calc.get('estimated_system_cost_lkr', 0):,}
- **Annual Net Economic Benefit**: LKR {calc.get('annual_savings_lkr', 0):,} / year
- **Simple Payback Period**: **{calc.get('payback_years')} Years**
- **20-Year Cumulative Savings**: LKR {calc.get('annual_savings_lkr', 0)*20:,} (nominal)

The payback is computed as:
$$\\text{{Simple Payback}} = \\frac{{\\text{{System Cost (LKR)}}}}{{\\text{{Annual Bill Savings (LKR)}} + \\text{{Annual Export Revenue (LKR)}}}}$$"""
        return """### 💰 Solar Payback Period in Sri Lanka

In Sri Lanka, residential rooftop solar systems typically achieve a payback period of **3.5 to 5.2 years**, depending on your pre-solar tariff bracket.

Consumers using above 180 units/month pay **LKR 52.00/kWh** to the utility, yielding the fastest payback under Net Accounting (often under 4 years)."""

    # 10. DEVELOPER / UNIVERSITY OF JAFFNA
    if any(k in q_norm for k in ["developer", "author", "farhan", "jaffna", "who built", "about developer", "university"]):
        return """### 👨‍💻 About the Developer

**SolarCalc LK V1.0** was conceived, engineered, and developed by:

- **Farhan Mohammad**
- Undergraduate, Department of Electrical & Electronic Engineering (EEE), **Faculty of Engineering, University of Jaffna** (E23 Batch).
- Engineering Focus: Renewable energy integration, power system simulation, and spatial resource modeling.

For academic or technical inquiries, check the **`About Developer`** tab in the navigation bar!"""

    # 11. SOLAR MAP & RESOURCE
    if any(k in q_norm for k in ["solar map", "solar resource", "ghi", "pvout", "irradiance", "atlas"]):
        return """### 🗺️ Solar Map & Solar Resource Engine

The **Solar Map** tab allows you to visualize solar irradiance across all 25 districts of Sri Lanka:
- **PVOUT (Photovoltaic Power Potential)**: 1,350 to 1,650 kWh/kWp/year.
- **Top Districts for Solar Yield**: Mannar (1,650), Hambantota (1,620), Batticaloa (1,610), Jaffna (1,580), and Puttalam (1,580).
- **Optimum Tilt Angle**: 7° to 10° facing True South (180° Azimuth).
- **Primary Spatial Dataset**: World Bank / ESMAP Global Solar Atlas (GSA v2.0) 30-arc-second (~1 km) microclimatic rasters."""

    # 12. SOLAR TERMINOLOGY (kWp, kWh, PVOUT)
    if any(k in q_norm for k in ["kwp", "kwh", "what is kwp", "what is kwh"]):
        return """### ⚡ Solar PV Terminology: kWp vs kWh

- **kWp (Kilowatt-Peak / kilowatt-peak)**: The nominal maximum electrical power output an array produces under standard test conditions (STC: 1,000 W/m² irradiance, 25°C cell temperature, AM 1.5 spectrum). It represents system **capacity** or size.
- **kWh (Kilowatt-Hour)**: The actual amount of energy generated or consumed over time (1 kWh = 1 unit on your CEB/LECO bill).
- **Specific Yield (kWh/kWp/year)**: In Sri Lanka, 1 kWp of solar produces approximately **1,350 to 1,650 kWh** of usable electricity each year depending on the district."""

    # Default technical fallback
    return """Hello! I am **SolarCalc AI**, the technical engineering assistant for SolarCalc LK.

I can help you with:
- 📥 **How to download reports** (Preliminary Proposal PDF or 25-section Technical Report)
- 📊 **Explaining your calculation results** (System size, modules, inverter, payback)
- 🛰️ **Using GPS Auto-Location** to fetch district solar yields
- 🇱🇰 **PUCSL January 2025 tariffs** and Condition 3 net fixed charge rules
- ⚡ **CEB Net Metering vs Net Accounting vs Net Plus**
- 🔋 **Battery storage (ESS)** and hybrid inverters (Deye, Huawei, Sungrow)
- ⚙️ **Inverter sizing**, DC/AC ratio, and MPPT temperature safety limits

What would you like to know?"""


def process_chat_message(
    message: str,
    context: Optional[Dict[str, Any]] = None,
    user_api_key: Optional[str] = None,
    provider: Optional[str] = "auto"
) -> Dict[str, str]:
    """
    Main entry point for processing AI Assistant queries.
    Priority order:
    1. User-supplied Gemini or OpenAI API key (from frontend modal)
    2. Server environment GEMINI_API_KEY / GOOGLE_API_KEY
    3. Server environment AI_API_KEY (OpenAI / Groq / OpenRouter)
    4. Intelligent grounded engineering knowledge base
    """
    cleaned_message = (message or "").strip()
    if not cleaned_message:
        return {
            "answer": "Please ask a question regarding residential solar PV planning, tariffs, reports, or SolarCalc LK.",
            "source": "SolarCalc LK Engineering Knowledge Base"
        }

    if len(cleaned_message) > 1000:
        cleaned_message = cleaned_message[:1000]

    context_str = _format_context(context)

    # 1. Check user-supplied key or server Gemini key
    gemini_key = user_api_key if (user_api_key and user_api_key.startswith("AIza")) else (os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    if gemini_key:
        ans = _call_gemini_api(gemini_key, cleaned_message, context_str)
        if ans:
            return {
                "answer": ans,
                "source": "Google Gemini 1.5 Flash (Grounded on SolarCalc LK)"
            }

    # 2. Check OpenAI-compatible key
    openai_key = user_api_key if (user_api_key and not user_api_key.startswith("AIza")) else os.environ.get("AI_API_KEY")
    if openai_key:
        ans = _call_openai_api(openai_key, cleaned_message, context_str)
        if ans:
            return {
                "answer": ans,
                "source": "SolarCalc AI (External LLM)"
            }

    # 3. Built-in grounded engineering inference engine
    grounded_answer = _generate_grounded_response(cleaned_message, context)
    return {
        "answer": grounded_answer,
        "source": "SolarCalc LK Engineering Knowledge Base"
    }
