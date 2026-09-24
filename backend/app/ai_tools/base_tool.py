"""
Base AI Tool Definition for SolarCalc LK Agent System.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any

class AITool(ABC):
    """Abstract base class for all SolarCalc LK AI tools."""

    name: str = "base_tool"
    description: str = ""
    parameters: Dict[str, Any] = {}

    @abstractmethod
    def execute(self, **kwargs) -> Dict[str, Any]:
        """Execute the tool and return structured dictionary results."""
        pass

    def to_schema(self) -> Dict[str, Any]:
        """Return OpenAI / Ollama compatible tool definition schema."""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }
