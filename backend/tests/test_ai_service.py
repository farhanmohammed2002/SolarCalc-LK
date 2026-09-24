import unittest
from app.services.ai_service import process_chat_message

class TestAIService(unittest.TestCase):
    def test_basic_query(self):
        res = process_chat_message("What is kWp?")
        self.assertIn("kilowatt-peak", res["answer"])
        self.assertEqual(res["source"], "SolarCalc LK Engineering Knowledge Base")

    def test_tariffs_query(self):
        res = process_chat_message("Explain electricity tariffs in Sri Lanka")
        self.assertIn("PUCSL", res["answer"])
        self.assertIn("Fixed", res["answer"])

    def test_schemes_query(self):
        res = process_chat_message("What is the difference between Net Metering and Net Accounting?")
        self.assertIn("Net Metering", res["answer"])
        self.assertIn("Net Accounting", res["answer"])
        self.assertIn("44.14", res["answer"])

    def test_contextual_inverter_query(self):
        context = {
            "page": "/results",
            "calculation": {
                "inverter_model": "GoodWe GW3000-XS",
                "system_capacity_kwp": 2.49
            }
        }
        res = process_chat_message("Why was this inverter selected?", context)
        self.assertIn("GoodWe GW3000-XS", res["answer"])
        self.assertIn("DC-to-AC Ratio", res["answer"])

    def test_contextual_results_explanation(self):
        context = {
            "page": "/results",
            "calculation": {
                "district": "Kandy",
                "system_capacity_kwp": 3.32,
                "panel_quantity": 8,
                "annual_generation_kwh": 4850,
                "annual_savings_lkr": 195000,
                "estimated_system_cost_lkr": 850000,
                "payback_years": 4.36
            }
        }
        res = process_chat_message("Explain my results", context)
        self.assertIn("3.32 kWp", res["answer"])
        self.assertIn("4.36 years", res["answer"])
        self.assertIn("Kandy", res["answer"])

    def test_download_report_query(self):
        res1 = process_chat_message("how to download report")
        self.assertIn("Download PDF Assessment", res1["answer"])
        self.assertIn("Reports", res1["answer"])

        # Test typo handling (user's exact typo: "how to dwload report")
        res2 = process_chat_message("how to dwload report")
        self.assertIn("Download PDF Assessment", res2["answer"])

    def test_gps_and_battery_queries(self):
        res_gps = process_chat_message("how does gps auto location work?")
        self.assertIn("GPS Auto-Location", res_gps["answer"])

        res_bat = process_chat_message("Can I add batteries?")
        self.assertIn("LiFePO4", res_bat["answer"])
        self.assertIn("Deye", res_bat["answer"])

if __name__ == "__main__":
    unittest.main()
