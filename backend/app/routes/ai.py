"""
SolarCalc LK V1.0 — AI Assistant Route
API endpoint for context-aware engineering chatbot.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.ai_service import process_chat_message

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's query")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Current page and calculation state context")


class AIChatResponse(BaseModel):
    answer: str
    source: str = "SolarCalc LK Engineering Knowledge Base"


@router.post("/chat", response_model=AIChatResponse)
def handle_ai_chat(req: AIChatRequest):
    try:
        res = process_chat_message(req.message, req.context)
        return AIChatResponse(
            answer=res["answer"],
            source=res.get("source", "SolarCalc LK Engineering Knowledge Base")
        )
    except Exception as e:
        # Graceful error handling without leaking internal details
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SolarCalc AI is temporarily unavailable. Please try again shortly."
        )
