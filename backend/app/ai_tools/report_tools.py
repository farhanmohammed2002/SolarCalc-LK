"""
Report AI Tool for SolarCalc LK.
Explains technical validation reports, client proposals, section definitions, and download pathways.
"""

from typing import Dict, Any, Optional
from app.ai_tools.base_tool import AITool

class GetReportInformationTool(AITool):
    name = "get_report_information"
    description = (
        "Explain what is contained in the official SolarCalc LK engineering reports, "
        "how to download them, and what specific sections mean."
    )
    parameters = {
        "type": "object",
        "properties": {
            "query_type": {
                "type": "string",
                "enum": ["how_to_download", "client_proposal", "technical_report", "data_package", "all"],
                "description": "The specific report or download information requested."
            }
        },
        "required": ["query_type"]
    }

    def execute(self, query_type: str = "all", **kwargs) -> Dict[str, Any]:
        return {
            "reports_available": [
                {
                    "title": "Preliminary Solar PV Proposal (Client PDF)",
                    "type": "Dynamic Calculation Proposal",
                    "location": "Calculator Tab -> Step 5 (Results Dashboard) -> Green [Download PDF Assessment] Button",
                    "contents": [
                        "Official SolarCalc LK Report Logo Header",
                        "Executive Summary Table (Capacity, Turnkey Cost, Payback, Annual Yield)",
                        "Section 1: Array Sizing & Electrical Design (DC/AC Ratio, String Voc max 15°C, Vmp min 65°C)",
                        "Section 2: PUCSL Jan 2025 Tariff & Monthly Settlement Analysis (Condition 3 net billing)",
                        "Section 3: Monthly Solar Generation Breakdown Table (Jan to Dec)",
                        "Engineering Disclaimers and Traceability Baseline"
                    ]
                },
                {
                    "title": "SolarCalc LK V1.0 Technical & Data Validation Report",
                    "formats": ["PDF", "DOCX"],
                    "location": "Reports Tab -> Download Technical Report Button",
                    "contents": [
                        "25 comprehensive engineering sections",
                        "PUCSL January 18, 2025 Tariff Analysis and billing algorithms",
                        "Global Solar Atlas 30-arc-sec (~1km) microclimatic spatial modeling",
                        "Array string layout, DC/AC inverter matching, and thermal derating",
                        "12 peer-reviewed test validation cases with ground-truth verification"
                    ]
                },
                {
                    "title": "SolarCalc LK V1.0 Data Package",
                    "format": "ZIP Archive",
                    "location": "Reports Tab -> Download Data Package Button",
                    "contents": [
                        "Raw district solar irradiance dataset (locations.csv)",
                        "Equipment catalogues (panels.json, inverters.json, batteries.json)",
                        "PUCSL 2025 tariff matrix and CEB feed-in gazette documentation"
                    ]
                }
            ],
            "download_instructions": {
                "proposal_pdf": "Navigate to the Calculator, run your calculation, and on Step 5 click the green 'Download PDF Assessment' button.",
                "technical_report": "Click the 'Reports' tab in the navigation bar to download either the PDF whitepaper, Word document, or data ZIP."
            }
        }
