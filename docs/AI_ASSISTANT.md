# SolarCalc LK V1.0 — AI Technical Assistant Guide

## 1. Overview
The SolarCalc LK AI Technical Assistant is a context-aware, domain-grounded engineering copilot designed specifically for Sri Lankan residential rooftop solar photovoltaic (PV) planning.

Unlike hardcoded FAQ bots, the assistant combines:
1. **Authoritative Calculation Tools**: Direct execution of the authoritative SolarCalc LK Python engineering engine (`app.calculations`) for PUCSL January 2025 tariffs, PV array sizing, inverter matching, and microclimatic solar resource lookups.
2. **Retrieval-Augmented Generation (RAG)**: Semantic vector retrieval over 72 curated documentation chunks covering methodology, CEB feed-in schemes, hardware datasheets, standards, and FAQs.
3. **Pluggable Open-Source & Cloud LLM Backends**: Seamless support for local open-source models via Ollama (`mistral`, `llama3`), Google Gemini (`gemini-1.5-flash`), OpenAI-compatible APIs (`gpt-4o-mini`, DeepSeek, Groq), and a pure-Python zero-dependency grounded fallback engine.
4. **Live External Web Search**: Real-time DuckDuckGo provider for current utility news, exchange rates, and policy updates.

---

## 2. Capabilities & Example Queries

### 2.1 Authoritative Numerical Calculations
The AI agent invokes exact backend formulas and never hallucinates numbers:
- *"Calculate domestic electricity bill for 210 units"*
- *"What is my electricity charge for 45 kWh under the lifeline block?"*
- *"Size a solar PV system for 350 kWh monthly consumption in Jaffna"*
- *"Recommend an inverter for a 5.5 kWp solar array"*

### 2.2 Sri Lankan Electricity Tariffs & Regulations
- *"Explain PUCSL Condition 3 for rooftop solar prosumers"*
- *"What are the energy charges and fixed charge tiers effective January 18, 2025?"*
- *"Why does my fixed charge become LKR 0 under Net Accounting?"*

### 2.3 CEB Rooftop Solar Schemes
- *"Compare CEB Net Metering, Net Accounting, and Net Plus"*
- *"What is the feed-in tariff paid for surplus solar units in Sri Lanka? (LKR 44.14/kWh)"*
- *"Which scheme gives the best return for a household with LKR 35,000 monthly bill?"*

### 2.4 Website Navigation & Report Downloads
- *"How do I download the PDF assessment proposal?"*
- *"Where can I download the 25-section Technical Report and Data Package?"*
- *"How does the GPS Auto-Location feature work?"*
- *"Explain the engineering results on my dashboard"*

### 2.5 Hardware & Technical Specifications
- *"What are the specifications of JinkoSolar Tiger Neo 470W panels?"*
- *"Can I connect a Deye SE-G5.1 battery to a Sungrow inverter?"*
- *"What is DC/AC sizing ratio and why is it between 1.10 and 1.35?"*
- *"Why does a grid-tied inverter trip during a power cut?"*

---

## 3. API Endpoints

### 3.1 Send Message (`POST /api/ai/chat`)
**Request Body**:
```json
{
  "message": "How do I download the proposal report?",
  "context": {
    "page": "Calculator",
    "calculation": {
      "district": "Colombo",
      "system_capacity_kwp": 3.3,
      "panel_quantity": 7,
      "inverter_model": "Sungrow SG3.0RS"
    }
  },
  "api_key": null,
  "enable_web_search": true
}
```

**Response Body**:
```json
{
  "answer": "### How to Download Reports on SolarCalc LK...",
  "source": "SolarCalc Agent (Ollama mistral + RAG + SolarCalc Tools)",
  "sources": [
    {
      "title": "How to Use SolarCalc LK Platform",
      "section": "Downloading Official Engineering Reports",
      "category": "Website Navigation",
      "score": 0.89
    }
  ],
  "tools_used": [
    {
      "name": "get_report_information",
      "arguments": { "report_type": "all" },
      "result": { ... }
    }
  ],
  "confidence": 0.95
}
```

### 3.2 SSE Streaming (`POST /api/ai/chat/stream`)
Server-Sent Events endpoint streaming real-time tokens and status updates (`type: status`, `type: token`, `type: final`).

### 3.3 System Health (`GET /api/ai/health`)
Returns live diagnostic information:
```json
{
  "status": "ONLINE",
  "rag_vectors_indexed": 72,
  "tools_registered": 9,
  "retriever_model": "DeterministicSemanticEmbedder",
  "web_search_available": true
}
```

### 3.4 Knowledge Sources (`GET /api/ai/sources`)
Returns a list of all indexed engineering manuals, standards, and equipment catalogues.
