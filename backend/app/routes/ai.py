"""
SolarCalc LK V1.0 — AI Assistant Route
API endpoints for context-aware multi-source engineering agent.
"""

import json
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.services.ai.agent_service import agent_service
from app.ai_tools.tool_registry import ToolRegistry


router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User's engineering or technical query")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Active page and calculation state context")
    api_key: Optional[str] = Field(default=None, description="Optional user-supplied Gemini or OpenAI API key")
    enable_web_search: bool = Field(default=True, description="Allow DuckDuckGo external web search if warranted")


class SourceCitation(BaseModel):
    document_id: Optional[str] = None
    title: str
    section: Optional[str] = None
    category: Optional[str] = None
    page: Optional[str] = None
    url: Optional[str] = None
    score: Optional[float] = None


class ToolExecutionTrace(BaseModel):
    name: str
    arguments: Dict[str, Any]
    result: Any


class AIChatResponse(BaseModel):
    answer: str
    source: str
    sources: List[Dict[str, Any]] = []
    tools_used: List[Dict[str, Any]] = []
    confidence: float = 0.95


@router.post("/chat", response_model=AIChatResponse)
def handle_ai_chat(req: AIChatRequest):
    """
    Main chat endpoint.
    Orchestrates calculation tools, RAG semantic retrieval, web search, and LLM synthesis.
    """
    try:
        res = agent_service.process_chat(
            message=req.message,
            context=req.context,
            user_api_key=req.api_key,
            enable_web_search=req.enable_web_search
        )
        return AIChatResponse(
            answer=res["answer"],
            source=res.get("source", "SolarCalc LK Engineering Knowledge Base"),
            sources=res.get("sources", []),
            tools_used=res.get("tools_used", []),
            confidence=res.get("confidence", 0.95)
        )
    except Exception as e:
        print(f"[AI Route Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SolarCalc AI encountered an unexpected error processing your request."
        )


@router.post("/chat/stream")
def handle_ai_chat_stream(req: AIChatRequest):
    """
    Server-Sent Events (SSE) streaming endpoint for live responses.
    """
    def event_generator():
        try:
            for chunk in agent_service.stream_chat(
                message=req.message,
                context=req.context,
                user_api_key=req.api_key
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
        except Exception as e:
            err_chunk = {"type": "error", "message": str(e)}
            yield f"data: {json.dumps(err_chunk)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/health")
def ai_health_status():
    """
    Diagnostic status endpoint reporting RAG vector database count and tool availability.
    """
    tools = ToolRegistry()
    return {
        "status": "ONLINE",
        "rag_vectors_indexed": agent_service.retriever.vector_store.count(),
        "tools_registered": len(tools.get_all_schemas()),
        "retriever_model": agent_service.retriever.embedder.__class__.__name__,
        "web_search_available": agent_service.web_search.is_available()
    }


@router.get("/sources")
def get_indexed_sources():
    """
    Returns list of indexed knowledge documents.
    """
    records = getattr(agent_service.retriever.vector_store, "_records", [])
    unique_docs = {}
    for r in records:
        meta = r.get("metadata", {})
        doc_id = meta.get("document_id") or meta.get("document_name")
        if doc_id and doc_id not in unique_docs:
            unique_docs[doc_id] = {
                "document_id": doc_id,
                "name": meta.get("document_name"),
                "category": meta.get("category"),
                "section": meta.get("section"),
                "source_url": meta.get("source_url")
            }
    return list(unique_docs.values())
