"""
Unit and Integration Tests for SolarCalc LK AI Agent Architecture.
Covers tool execution, RAG semantic retrieval, web search fallback, and end-to-end agent orchestration.
"""

import unittest
from app.ai_tools.tool_registry import ToolRegistry
from app.rag.retriever import RAGRetriever
from app.rag.vector_store import PersistentVectorStore
from app.services.ai.agent_service import AgentService
from app.services.ai.web_search_service import DuckDuckGoSearchProvider


class TestAITools(unittest.TestCase):
    def setUp(self):
        self.registry = ToolRegistry()

    def test_tool_registry_schemas(self):
        schemas = self.registry.get_all_schemas()
        self.assertGreaterEqual(len(schemas), 9)
        names = [s.get("function", {}).get("name", s.get("name")) for s in schemas]
        self.assertIn("calculate_electricity_tariff", names)
        self.assertIn("get_solar_resource", names)
        self.assertIn("calculate_pv_size", names)
        self.assertIn("select_inverter", names)
        self.assertIn("get_report_information", names)

    def test_calculate_tariff_tool(self):
        res = self.registry.execute_tool("calculate_electricity_tariff", {"monthly_consumption_kwh": 210.0})
        self.assertIn("total_bill", res)
        self.assertEqual(res["total_bill"], 7220.0)
        self.assertIn("PUCSL Jan 18, 2025", res["regulatory_baseline"])

    def test_calculate_tariff_with_alias(self):
        res = self.registry.execute_tool("calculate_tariff", {"monthly_units": 210.0})
        self.assertIn("total_bill", res)
        self.assertEqual(res["total_bill"], 7220.0)

    def test_solar_resource_tool(self):
        res = self.registry.execute_tool("get_solar_resource", {"district": "Jaffna"})
        self.assertIn("annual_pvout_kwh_per_kwp", res)
        self.assertGreaterEqual(res["annual_pvout_kwh_per_kwp"], 1500.0)
        self.assertEqual(res["optimum_tilt_deg"], 9.0)

    def test_pv_sizing_tool(self):
        res = self.registry.execute_tool("calculate_pv_size", {"monthly_consumption_kwh": 300.0, "district": "Colombo"})
        self.assertIn("system", res)
        self.assertGreater(res["system"]["recommended_capacity_kwp"], 2.0)
        self.assertIn("panel_count", res["system"])

    def test_inverter_selection_tool(self):
        res = self.registry.execute_tool("select_inverter", {"actual_dc_kwp": 5.0, "panel_count": 11})
        self.assertIn("inverter", res)
        self.assertEqual(res.get("phase"), 1)

    def test_report_information_tool(self):
        res = self.registry.execute_tool("get_report_information", {"report_type": "all"})
        self.assertIn("reports_available", res)
        self.assertIn("download_instructions", res)


class TestRAGRetriever(unittest.TestCase):
    def setUp(self):
        self.retriever = RAGRetriever()

    def test_vector_store_populated(self):
        self.assertGreaterEqual(self.retriever.vector_store.count(), 50)

    def test_semantic_retrieval(self):
        results = self.retriever.retrieve("PUCSL January 2025 Condition 3 fixed charge")
        self.assertGreater(len(results), 0)
        sources = self.retriever.extract_sources(results)
        self.assertGreater(len(sources), 0)
        formatted = self.retriever.format_for_prompt(results)
        self.assertIn("Condition 3", formatted)


class TestAgentService(unittest.TestCase):
    def setUp(self):
        self.agent = AgentService()

    def test_download_report_intent(self):
        res = self.agent.process_chat("how to download report")
        self.assertIn("Download PDF Assessment", res["answer"])
        self.assertGreaterEqual(len(res["sources"]), 1)
        # Verify tool was used
        tool_names = [t["name"] for t in res["tools_used"]]
        self.assertIn("get_report_information", tool_names)

    def test_user_typo_dwload_report(self):
        res = self.agent.process_chat("how to dwload report")
        self.assertIn("Download PDF Assessment", res["answer"])
        self.assertGreaterEqual(len(res["sources"]), 1)

    def test_calculation_intent_bill(self):
        res = self.agent.process_chat("calculate domestic bill for 210 units")
        self.assertIn("calculate_tariff", [t["name"] for t in res["tools_used"]])
        first_tool = res["tools_used"][0]
        self.assertEqual(first_tool["result"]["total_bill"], 7220.0)

    def test_solar_yield_intent_jaffna(self):
        res = self.agent.process_chat("what is the solar irradiance in Jaffna?")
        self.assertIn("get_solar_resource", [t["name"] for t in res["tools_used"]])
        self.assertGreaterEqual(res["tools_used"][0]["result"]["annual_pvout_kwh_per_kwp"], 1500.0)

    def test_context_results_explanation(self):
        context = {
            "page": "Calculator",
            "calculation": {
                "district": "Mannar",
                "system_capacity_kwp": 5.17,
                "panel_quantity": 11,
                "inverter_model": "Sungrow SG5.0RS",
                "annual_generation_kwh": 8530,
                "annual_savings_lkr": 376000,
                "estimated_system_cost_lkr": 1250000,
                "payback_years": 3.32
            }
        }
        res = self.agent.process_chat("Explain my results", context=context)
        self.assertIn("Mannar", res["answer"])
        self.assertIn("5.17 kWp", res["answer"])
        self.assertIn("3.32 years", res["answer"])


if __name__ == "__main__":
    unittest.main()
