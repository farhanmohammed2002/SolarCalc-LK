"""
SolarCalc LK V1.0 — Central AI Agent Orchestrator.
Dynamically routes user queries between:
1. Open-source local LLM (Ollama) / Gemini / OpenAI / Built-in Grounded Engine
2. RAG Knowledge Retriever (72 indexed documentation & catalog chunks)
3. Authoritative SolarCalc Engineering Tools (app/ai_tools)
4. Real-time external Web Search (DuckDuckGo provider)
"""

import os
import re
import json
from typing import Dict, Any, List, Optional, Generator

from app.ai_tools.tool_registry import ToolRegistry
from app.rag.retriever import RAGRetriever
from app.services.ai.web_search_service import DuckDuckGoSearchProvider, WebSearchResult
from app.services.ai.context_service import ContextService
from app.services.ai.prompt_service import build_agent_system_prompt
from app.services.ai.ollama_provider import OllamaProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.openai_provider import OpenAIProvider
from app.services.ai.llm_provider import LLMProvider


class AgentService:
    def __init__(self):
        self.retriever = RAGRetriever()
        self.web_search = DuckDuckGoSearchProvider()

    def _get_llm_provider(self, user_api_key: Optional[str] = None) -> Optional[LLMProvider]:
        """Resolve the active LLM provider based on configuration and availability."""
        # 1. User-supplied key
        if user_api_key:
            if user_api_key.startswith("AIza"):
                return GeminiProvider(api_key=user_api_key)
            else:
                return OpenAIProvider(api_key=user_api_key)

        # 2. Server Ollama (if configured and reachable)
        ollama_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
        ollama = OllamaProvider(base_url=ollama_url)
        if ollama.is_available():
            return ollama

        # 3. Server Gemini API key
        gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if gemini_key:
            return GeminiProvider(api_key=gemini_key)

        # 4. Server OpenAI-compatible key
        openai_key = os.environ.get("AI_API_KEY")
        if openai_key:
            return OpenAIProvider(api_key=openai_key)

        # No external LLM reachable -> Return None to trigger grounded engine
        return None

    def _detect_and_execute_tools(self, message: str, tool_registry: ToolRegistry) -> List[Dict[str, Any]]:
        """
        Detect whether authoritative engineering calculation tools should be called,
        and execute them to guarantee mathematical precision from the authoritative engine.
        """
        tools_executed = []
        q = message.lower().strip()

        # Tool 1: Calculate Tariff (e.g. "bill for 210 units", "tariff 150 kwh")
        tariff_match = re.search(r'(?:bill|tariff|charge|cost for|cost of)\s*(?:for\s*)?(\d{1,4})\s*(?:units?|kwh)?', q)
        if tariff_match and ("bill" in q or "tariff" in q or "cost" in q or "charge" in q):
            try:
                units = float(tariff_match.group(1))
                if 0 <= units <= 5000:
                    tool_res = tool_registry.execute_tool("calculate_tariff", {"monthly_units": units})
                    tools_executed.append({
                        "name": "calculate_tariff",
                        "arguments": {"monthly_units": units},
                        "result": tool_res
                    })
            except Exception:
                pass

        # Tool 2: Solar Resource (e.g. "solar irradiance in Jaffna", "pvout in Kandy")
        districts = [
            "colombo", "gampaha", "kalutara", "kandy", "matale", "nuwara eliya",
            "galle", "matara", "hambantota", "jaffna", "kilinochchi", "mannar",
            "vavuniya", "mullaitivu", "batticaloa", "ampara", "trincomalee",
            "kurunegala", "puttalam", "anuradhapura", "polonnaruwa", "badulla",
            "monaragala", "ratnapura", "kegalle"
        ]
        if any(w in q for w in ["irradiance", "pvout", "ghi", "gti", "solar yield", "solar potential", "sunlight", "solar resource"]):
            for d in districts:
                if d in q:
                    tool_res = tool_registry.execute_tool("get_solar_resource", {"district": d.title()})
                    tools_executed.append({
                        "name": "get_solar_resource",
                        "arguments": {"district": d.title()},
                        "result": tool_res
                    })
                    break

        # Tool 3: Size Solar System (e.g. "size a solar system for 300 units in Colombo")
        size_match = re.search(r'(?:size|capacity|recommend|calculate)\s*(?:a\s*)?(?:solar\s*)?(?:system|pv)?\s*(?:for\s*)?(\d{1,4})\s*(?:units|kwh)', q)
        if size_match:
            try:
                units = float(size_match.group(1))
                dist = "Colombo"
                for d in districts:
                    if d in q:
                        dist = d.title()
                        break
                tool_res = tool_registry.execute_tool("calculate_pv_size", {
                    "monthly_units": units,
                    "district": dist
                })
                tools_executed.append({
                    "name": "calculate_pv_size",
                    "arguments": {"monthly_units": units, "district": dist},
                    "result": tool_res
                })
            except Exception:
                pass

        # Tool 4: Inverter Selection (e.g. "select inverter for 5 kwp", "inverter for 3.3 kw")
        inv_match = re.search(r'inverter\s*(?:for\s*)?(\d+(?:\.\d+)?)\s*(?:kwp|kw)', q)
        if inv_match:
            try:
                cap = float(inv_match.group(1))
                p_count = max(1, round(cap * 1000 / 470))
                tool_res = tool_registry.execute_tool("select_inverter", {
                    "actual_dc_kwp": cap,
                    "panel_count": p_count
                })
                tools_executed.append({
                    "name": "select_inverter",
                    "arguments": {"actual_dc_kwp": cap, "panel_count": p_count},
                    "result": tool_res
                })
            except Exception:
                pass

        # Tool 5: Search Equipment (e.g. "jinko panels", "sungrow inverter", "deye battery")
        if any(b in q for b in ["jinko", "rec alpha", "longi", "sungrow", "huawei", "deye", "solis", "fronius", "sma", "goodwe", "byd"]):
            query_str = ""
            for b in ["jinko", "rec", "longi", "sungrow", "huawei", "deye", "solis", "fronius", "sma", "goodwe", "byd"]:
                if b in q:
                    query_str = b
                    break
            cat = None
            if "panel" in q or "module" in q:
                cat = "panel"
            elif "inverter" in q:
                cat = "inverter"
            elif "battery" in q or "ess" in q:
                cat = "battery"

            tool_res = tool_registry.execute_tool("search_equipment", {"category": cat, "query": query_str})
            tools_executed.append({
                "name": "search_equipment",
                "arguments": {"category": cat, "query": query_str},
                "result": tool_res
            })

        # Tool 6: Report information (e.g. "how to download report", "proposal pdf")
        if any(k in q for k in ["download report", "download pdf", "how to download", "get report", "download assessment", "pdf report", "dwload", "dwnload"]):
            tool_res = tool_registry.execute_tool("get_report_information", {"report_type": "all"})
            tools_executed.append({
                "name": "get_report_information",
                "arguments": {"report_type": "all"},
                "result": tool_res
            })

        # Tool 7: Context explanation (e.g. "explain my results", "explain my calculation")
        if any(k in q for k in ["explain my result", "explain my system", "what are my results", "my calculation"]):
            tool_res = tool_registry.execute_tool("get_current_calculation_context", {})
            tools_executed.append({
                "name": "get_current_calculation_context",
                "arguments": {},
                "result": tool_res
            })

        return tools_executed

    def _should_search_web(self, query: str) -> bool:
        """Determine if live external web search is warranted."""
        q = query.lower()
        triggers = [
            "latest news", "current dollar", "current exchange", "today", "yesterday",
            "recently", "ceb news", "recent news", "current weather", "search the web",
            "look up online", "who is the current minister"
        ]
        return any(t in q for t in triggers)

    def process_chat(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        user_api_key: Optional[str] = None,
        enable_web_search: bool = True
    ) -> Dict[str, Any]:
        """
        Process chat query through the complete multi-source agent pipeline.
        Returns dictionary with answer, sources, tools_used, provider, and confidence.
        """
        cleaned_msg = (message or "").strip()
        if not cleaned_msg:
            return {
                "answer": "Please ask a question regarding residential solar PV planning, tariffs, reports, or SolarCalc LK.",
                "source": "SolarCalc LK Engineering Knowledge Base",
                "sources": [],
                "tools_used": [],
                "confidence": 1.0
            }

        tool_registry = ToolRegistry(calculation_context=context)

        # 1. Authoritative Tool Execution
        tools_executed = self._detect_and_execute_tools(cleaned_msg, tool_registry)

        # 2. RAG Semantic Retrieval
        rag_results = self.retriever.retrieve(cleaned_msg)
        rag_context_str = self.retriever.format_for_prompt(rag_results)
        cited_sources = self.retriever.extract_sources(rag_results)

        # 3. Web Search (if requested or triggers present)
        web_context_str = ""
        web_sources = []
        if enable_web_search and self._should_search_web(cleaned_msg):
            w_results = self.web_search.search(cleaned_msg, max_results=3)
            if w_results:
                snippets = [f"[{r.title}] ({r.url}):\n{r.snippet}" for r in w_results]
                web_context_str = "\n\n".join(snippets)
                for r in w_results:
                    web_sources.append({
                        "document_id": "web_search",
                        "title": r.title,
                        "section": "Web Search",
                        "category": "External Web",
                        "url": r.url,
                        "score": 0.8
                    })
                cited_sources.extend(web_sources)

        # 4. Context formatting
        context_str = ContextService.format_calculation_context(context)
        if tools_executed:
            tool_outputs_str = "\n".join([f"- Tool `{t['name']}` returned:\n  {json.dumps(t['result'])}" for t in tools_executed])
            context_str += f"\n\nAuthoritative SolarCalc Calculation Engine Tool Outputs:\n{tool_outputs_str}"

        # 5. Resolve LLM Provider
        provider = self._get_llm_provider(user_api_key)

        if provider:
            system_prompt = build_agent_system_prompt(
                context_str=context_str,
                rag_context=rag_context_str,
                web_context=web_context_str
            )
            try:
                answer = provider.generate(cleaned_msg, system_prompt=system_prompt)
                provider_name = f"SolarCalc Agent ({provider.name})"
                return {
                    "answer": answer,
                    "source": provider_name,
                    "sources": cited_sources,
                    "tools_used": tools_executed,
                    "confidence": 0.95
                }
            except Exception as e:
                print(f"[AgentService] Provider {provider.name} failed: {e}. Falling back to grounded engine.")

        # 6. Fallback to Grounded Engineering Engine
        from app.services.ai_service import _generate_grounded_response
        grounded_answer = _generate_grounded_response(cleaned_msg, context)
        
        # If tools returned results, prepend tool summary if not already present
        if tools_executed and not any(k in grounded_answer for k in ["Assessment Summary", "Inverter", "LKR"]):
            first_tool = tools_executed[0]
            grounded_answer = f"**Calculation Engine Output ({first_tool['name']}):**\n```json\n{json.dumps(first_tool['result'], indent=2)}\n```\n\n" + grounded_answer

        return {
            "answer": grounded_answer,
            "source": "SolarCalc LK Engineering Knowledge Base (Grounded Engine)",
            "sources": cited_sources,
            "tools_used": tools_executed,
            "confidence": 0.90
        }

    def stream_chat(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        user_api_key: Optional[str] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """Stream chat tokens with progress notifications."""
        yield {"type": "status", "message": "Analyzing query and verifying tools..."}
        
        tool_registry = ToolRegistry(calculation_context=context)
        tools_executed = self._detect_and_execute_tools(message, tool_registry)
        if tools_executed:
            tool_names = ", ".join([t["name"] for t in tools_executed])
            yield {"type": "status", "message": f"Executed calculation tools: {tool_names}"}

        yield {"type": "status", "message": "Retrieving engineering documentation..."}
        rag_results = self.retriever.retrieve(message)
        rag_context_str = self.retriever.format_for_prompt(rag_results)
        cited_sources = self.retriever.extract_sources(rag_results)

        context_str = ContextService.format_calculation_context(context)
        if tools_executed:
            tool_outputs_str = "\n".join([f"- Tool `{t['name']}` returned:\n  {json.dumps(t['result'])}" for t in tools_executed])
            context_str += f"\n\nAuthoritative Tool Outputs:\n{tool_outputs_str}"

        provider = self._get_llm_provider(user_api_key)
        system_prompt = build_agent_system_prompt(
            context_str=context_str,
            rag_context=rag_context_str
        )

        if provider:
            yield {"type": "status", "message": f"Synthesizing response with {provider.name}..."}
            full_text = ""
            try:
                for token in provider.stream(message, system_prompt=system_prompt):
                    full_text += token
                    yield {"type": "token", "token": token}
                yield {
                    "type": "final",
                    "answer": full_text,
                    "source": f"SolarCalc Agent ({provider.name})",
                    "sources": cited_sources,
                    "tools_used": tools_executed
                }
                return
            except Exception as e:
                print(f"[AgentService Stream] Provider error: {e}")

        # Non-streaming fallback
        from app.services.ai_service import _generate_grounded_response
        ans = _generate_grounded_response(message, context)
        yield {"type": "token", "token": ans}
        yield {
            "type": "final",
            "answer": ans,
            "source": "SolarCalc LK Engineering Knowledge Base (Grounded Engine)",
            "sources": cited_sources,
            "tools_used": tools_executed
        }


# Singleton instance
agent_service = AgentService()
