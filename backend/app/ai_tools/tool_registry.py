"""
Central Tool Registry for SolarCalc LK AI Agent.
Manages all available backend tools and executes tool calls.
"""

from typing import Dict, Any, List, Optional
from app.ai_tools.base_tool import AITool
from app.ai_tools.solar_tools import GetSolarResourceTool
from app.ai_tools.tariff_tools import CalculateTariffTool
from app.ai_tools.pv_tools import CalculatePVSizeTool
from app.ai_tools.inverter_tools import SelectInverterTool
from app.ai_tools.equipment_tools import SearchEquipmentTool
from app.ai_tools.financial_tools import CalculateFinancialsTool
from app.ai_tools.location_tools import GetLocationDataTool
from app.ai_tools.report_tools import GetReportInformationTool
from app.ai_tools.context_tools import GetCurrentCalculationContextTool

class ToolRegistry:
    """Registry holding all SolarCalc LK AI tools."""

    def __init__(self, calculation_context: Optional[Dict[str, Any]] = None):
        self._tools: Dict[str, AITool] = {}
        self._context_tool = GetCurrentCalculationContextTool(calculation_context)
        
        # Register all official engineering tools
        self.register(GetSolarResourceTool())
        self.register(CalculateTariffTool())
        self.register(CalculatePVSizeTool())
        self.register(SelectInverterTool())
        self.register(SearchEquipmentTool())
        self.register(CalculateFinancialsTool())
        self.register(GetLocationDataTool())
        self.register(GetReportInformationTool())
        self.register(self._context_tool)

        # Aliases for flexible routing
        self._aliases = {
            "calculate_tariff": "calculate_electricity_tariff",
            "calculate_bill": "calculate_electricity_tariff",
            "get_solar": "get_solar_resource",
            "solar_resource": "get_solar_resource",
            "size_pv": "calculate_pv_size",
            "pv_sizing": "calculate_pv_size",
            "inverter_selection": "select_inverter",
            "search_catalog": "search_equipment"
        }

    def register(self, tool: AITool):
        self._tools[tool.name] = tool

    def update_context(self, calculation_context: Optional[Dict[str, Any]]):
        self._context_tool.set_context(calculation_context)

    def get_tool(self, name: str) -> Optional[AITool]:
        resolved_name = self._aliases.get(name, name)
        return self._tools.get(resolved_name)

    def get_all_schemas(self) -> List[Dict[str, Any]]:
        """Return list of JSON schemas for all registered tools."""
        return [tool.to_schema() for tool in self._tools.values()]

    def execute_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool by name with provided arguments."""
        tool = self.get_tool(name)
        if not tool:
            return {"error": f"Tool '{name}' not found in SolarCalc LK registry."}
        try:
            return tool.execute(**arguments)
        except Exception as e:
            return {"error": f"Error executing tool '{name}': {str(e)}"}
