"""
Ollama Local Model Provider for SolarCalc LK.
Integrates local LLMs served via Ollama (e.g. Llama 3.2, Mistral, Qwen, DeepSeek).
"""

import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional, Generator
from app.services.ai.llm_provider import LLMProvider, LLMResponse

class OllamaProvider(LLMProvider):
    name: str = "ollama"

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: int = 45
    ):
        self.base_url = (base_url or os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.model = model or os.environ.get("OLLAMA_MODEL", "llama3.2")
        self.timeout = timeout

    def is_available(self) -> bool:
        """Check if local Ollama daemon is running."""
        try:
            req = urllib.request.Request(f"{self.base_url}/api/tags", method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            pass
        return False

    def get_installed_models(self) -> List[str]:
        """List models installed in the local Ollama instance."""
        try:
            req = urllib.request.Request(f"{self.base_url}/api/tags", method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return [m.get("name") for m in data.get("models", [])]
        except Exception:
            return []

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
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": self._prepare_messages(messages, system_prompt),
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")

        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            msg = res_json.get("message", {})
            return LLMResponse(content=msg.get("content", "").strip(), raw=res_json)

    def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> Generator[str, None, None]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": self._prepare_messages(messages, system_prompt),
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")

        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            for line in resp:
                if line:
                    chunk = json.loads(line.decode("utf-8"))
                    text = chunk.get("message", {}).get("content", "")
                    if text:
                        yield text

    def generate_with_tools(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> LLMResponse:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": self._prepare_messages(messages, system_prompt),
            "tools": tools,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")

        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            msg = res_json.get("message", {})
            content = msg.get("content", "").strip()
            tool_calls = msg.get("tool_calls", [])
            return LLMResponse(content=content, tool_calls=tool_calls, raw=res_json)
