"""
LLM Provider Abstraction Layer for SolarCalc LK.
Enables pluggable model serving (Ollama, Gemini, OpenAI, Groq, Anthropic).
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Generator

class LLMResponse:
    def __init__(self, content: str, tool_calls: Optional[List[Dict[str, Any]]] = None, raw: Optional[Any] = None):
        self.content = content
        self.tool_calls = tool_calls or []
        self.raw = raw

class LLMProvider(ABC):
    """Abstract interface for LLM backends."""

    name: str = "base_provider"

    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider is configured and accessible."""
        pass

    @abstractmethod
    def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> LLMResponse:
        """Generate complete text response."""
        pass

    @abstractmethod
    def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1000
    ) -> Generator[str, None, None]:
        """Stream response tokens progressively."""
        pass

    @abstractmethod
    def generate_with_tools(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> LLMResponse:
        """Generate response with tool calling capability."""
        pass
