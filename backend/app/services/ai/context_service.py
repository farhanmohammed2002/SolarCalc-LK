"""
Context Management Service for SolarCalc LK AI Agent.
Handles page session, active calculation numbers, and conversation state.
"""

import json
from typing import Dict, Any, Optional

class ContextService:
    @staticmethod
    def format_calculation_context(context: Optional[Dict[str, Any]]) -> str:
        if not context:
            return "No active calculation in session."

        lines = []
        page = context.get("page")
        if page:
            lines.append(f"Active Web Page: {page}")

        calc = context.get("calculation")
        if calc and isinstance(calc, dict):
            lines.append("Active Engineering Calculation Parameters:")
            for k, v in calc.items():
                if isinstance(v, (int, float, str, bool)):
                    lines.append(f"  • {k}: {v}")
                elif isinstance(v, dict):
                    lines.append(f"  • {k}: {json.dumps(v)}")
        return "\n".join(lines)
