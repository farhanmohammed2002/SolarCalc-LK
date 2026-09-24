"""
Google Gemini Model Provider for SolarCalc LK.
Integrates Google Gemini 1.5 Flash / 2.0 Flash via standard REST API.
"""

import os
import json
import urllib.request
from typing import Dict, Any, List, Optional, Generator
from app.services.ai.llm_provider import LLMProvider, LLMResponse

class GeminiProvider(LLMProvider):
    name: str = "gemini"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.model = model or os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

    def is_available(self) -> bool:
        return bool(self.api_key)

    def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> LLMResponse:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        contents = []
        for m in messages:
            role = "user" if m.get("role") in ["user", "system"] else "model"
            contents.append({"role": role, "parts": [{"text": m.get("content", "")}]})

        payload: Dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        if system_prompt:
            payload["system_instruction"] = {
                "parts": [{"text": system_prompt}]
            }

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")

        with urllib.request.urlopen(req, timeout=15) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            content = ""
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    content = parts[0].get("text", "").strip()
            return LLMResponse(content=content, raw=res_json)

    def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> Generator[str, None, None]:
        res = self.generate(messages, system_prompt, temperature, max_tokens)
        # Yield words in chunks
        words = res.content.split(" ")
        for i in range(0, len(words), 3):
            yield " ".join(words[i:i+3]) + " "

    def generate_with_tools(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> LLMResponse:
        # Translate OpenAI tools to Gemini declarations if needed, or prompt-based tool execution
        return self.generate(messages, system_prompt, temperature, max_tokens)
