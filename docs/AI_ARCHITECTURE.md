# SolarCalc LK V1.0 — AI System Architecture

## 1. Architectural Philosophy
The SolarCalc LK AI Technical Assistant is engineered with four core principles:
1. **Engine Authority**: The backend calculation engine (`app.calculations`) is the sole authoritative source of numerical engineering results. The AI never invents or approximates engineering calculations.
2. **Strict Source Hierarchy**:
   - Numerical calculations $\rightarrow$ SolarCalc Calculation Tools.
   - Platform documentation & regulatory rules $\rightarrow$ SolarCalc RAG Vector Database.
   - Current external facts $\rightarrow$ External Web Search.
   - General engineering concepts $\rightarrow$ Foundation LLM.
3. **Zero-Dependency Resilience**: If external AI APIs, internet access, or optional vector libraries (ChromaDB) are offline, the system degrades gracefully without crashing, falling back to a pure-Python cosine-similarity vector store and built-in engineering inference engine.
4. **Non-Disruptive Integration**: The assistant acts as an additive module without modifying the existing calculator, tariffs, reporting, or Android application code.

---

## 2. High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                               USER INTERFACE                                      |
|    +-----------------------------+       +-----------------------------------+    |
|    |  "AI Assistant" Main Tab   |       |  Calculator Step 5 Ask AI Button  |    |
|    +--------------+--------------+       +-----------------+-----------------+    |
+-------------------|----------------------------------------|----------------------+
                    |                                        |
                    | POST /api/ai/chat                      | (Context-Enriched)
                    v                                        v
+-----------------------------------------------------------------------------------+
|                        FASTAPI ROUTER (`routes/ai.py`)                            |
|       - Request validation (AIChatRequest)                                        |
|       - SSE Streaming support (AIChatResponse)                                    |
+-----------------------------------|-----------------------------------------------+
                                    v
+-----------------------------------------------------------------------------------+
|                   AGENT ORCHESTRATOR (`services/ai/agent_service.py`)             |
|                                                                                   |
|  [Query Classification & Tool Routing]                                            |
|       ├── Is numerical calculation? ──> Tool Registry (`ai_tools/`)               |
|       ├── Is domain question?       ──> RAG Retriever (`rag/retriever.py`)        |
|       └── Is current web query?     ──> DuckDuckGo Search Provider                |
|                                                                                   |
|  [Context Aggregation & Prompt Synthesis]                                         |
|       - Combines: System Prompt + Session Context + Tool Output + RAG Chunks     |
|                                                                                   |
|  [Multi-Backend LLM Resolver]                                                     |
|       1. User-Supplied Key (Gemini / OpenAI)                                      |
|       2. Local Ollama Instance (mistral / llama3 @ localhost:11434)               |
|       3. Server Cloud Key (GEMINI_API_KEY / AI_API_KEY)                           |
|       4. Built-in Deterministic Grounded Engine                                   |
+-------------------|-------------------|-------------------|-----------------------+
                    |                   |                   |
                    v                   v                   v
     +--------------------+   +-------------------+   +--------------------+
     |    Tool Registry   |   |   RAG Vector DB   |   |  External Search   |
     |   (9 Backend Tools)|   |    (72 Chunks)    |   | (DuckDuckGo HTML)  |
     +--------------------+   +-------------------+   +--------------------+
               |                        |
               v                        v
     +--------------------+   +-------------------+
     | app.calculations.* |   | backend/knowledge |
     | - pv_sizing        |   | - methodology     |
     | - tariff (PUCSL)   |   | - tariffs (2025)  |
     | - solar (GSA v2.0) |   | - ceb_schemes     |
     | - inverter_match   |   | - solar_resource  |
     | - financial        |   | - verified_hw     |
     +--------------------+   +-------------------+
```

---

## 3. Component Details

### 3.1 Authoritative Tools Layer (`app/ai_tools/`)
All tools inherit from `AITool` and expose OpenAI-standard JSON schemas:
- `calculate_electricity_tariff`: PUCSL Jan 18, 2025 domestic bill with Condition 3 net fixed charge calculation.
- `calculate_pv_size`: Sizing algorithm computing kWp, modules, inverter, and annual yield.
- `get_solar_resource`: Global Solar Atlas v2.0 irradiance, PVOUT, and optimum tilt.
- `select_inverter`: IEC 62548 inverter matching and MPPT voltage bounds.
- `search_equipment`: Query verified panels, inverters, and battery storage units.
- `calculate_financials`: Simple payback period, NPV, and 20-year cash flow.
- `get_location_data`: Administrative district centers, coordinates, and solar yields.
- `get_report_information`: Pathways to download proposal PDF, technical report, and data zip.
- `get_current_calculation_context`: Active browser calculation state reflection.

### 3.2 RAG Knowledge & Vector Architecture (`app/rag/`)
- **Document Store**: 9 structured markdown manuals in `backend/knowledge/` and 3 JSON hardware catalogues.
- **Chunking**: `DocumentChunker` splits on paragraph boundaries while preserving markdown section headings and carrying 100-character overlap.
- **Embedder**:
  - `DeterministicSemanticEmbedder`: 128-dimensional unit vector hashing with TF-IDF token weighting (pure Python, zero dependencies).
  - `OllamaEmbeddingProvider`: Delegates to local Ollama (`/api/embeddings`) when an embedding model is specified.
- **Vector Store**:
  - Automatically activates `chromadb.PersistentClient` if ChromaDB is installed.
  - Gracefully falls back to a high-speed cosine-similarity persistent store (`data/vector_db/solarcalc_rag_records.json`).

### 3.3 Multi-Model Abstraction Layer (`app/services/ai/`)
- `LLMProvider` interface defining `.generate()`, `.stream()`, and `.generate_with_tools()`.
- Implemented providers:
  - `OllamaProvider`: Native local `/api/chat` with tool calling and token streaming.
  - `GeminiProvider`: Google Generative Language REST API (`gemini-1.5-flash`).
  - `OpenAIProvider`: Standard OpenAI v1 completions endpoint (`/v1/chat/completions`).
  - `WebSearchProvider`: Resilient DuckDuckGo HTML parser for zero-token search.
