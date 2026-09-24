"""
OpenAI-Compatible Model Provider for SolarCalc LK.
Supports OpenAI, Groq, OpenRouter, DeepSeek, and local vLLM.
"""

import os
import json
import urllib.request
from typing import Dict, Any, List, Optional, Generator
from app.services.ai.llm_provider import LLMProvider, LLMResponse

class OpenAIProvider(LLMProvider):
    name: str = "openai"

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.environ.get("AI_API_KEY") or os.environ.get("OPENAI_API_KEY")
        self.base_url = (base_url or os.environ.get("AI_BASE_URL", "https://api.openai.com/v1")).rstrip("/")
        self.model = model or os.environ.get("AI_MODEL", "gpt-4o-mini")

    def is_available(self) -> bool:
        return bool(self.api_key)

    def _prepare_messages(self, messages: List[Dict[str, str]], system_prompt: Optional[str] = None) -> List[Dict[str, str]]:
        msgs = []
        if system_prompt:
            msgs.append({"role": "system", "content": system_prompt})
        for m in messages:
            msgs.append({"role": m.get("role", "user"), "content": m.get("content", "")})
        return msgs

    def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> LLMResponse:
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": self.model,
            "messages": self._prepare_messages(messages, system_prompt),
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        data = json.dumps(payload).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")

        with urllib.request.urlopen(req, timeout=20) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            content = res_json["choices"][0]["message"]["content"].strip()
            return LLMResponse(content=content, raw=res_json)

    def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> Generator[str, None, None]:
        res = self.generate(messages, system_prompt, temperature, max_tokens)
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
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": self.model,
            "messages": self._prepare_messages(messages, system_prompt),
            "tools": tools,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        data = json.dumps(payload).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")

        with urllib.request.urlopen(req, timeout=20) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            msg = res_json["choices"][0]["message"]
            content = (msg.get("content") or "").strip()
            tool_calls = msg.get("tool_calls", [])
            return LLMResponse(content=content, tool_calls=tool_calls, raw=res_json)
