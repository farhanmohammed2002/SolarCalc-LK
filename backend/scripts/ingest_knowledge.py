#!/usr/bin/env python3
"""
CLI script to trigger RAG document ingestion for SolarCalc LK.
Usage: python scripts/ingest_knowledge.py
"""

import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.rag.ingestion import RAGIngestionPipeline

def main():
    print("==================================================")
    print(" SolarCalc LK V1.0 — Knowledge Ingestion Pipeline")
    print("==================================================")
    pipeline = RAGIngestionPipeline()
    res = pipeline.run(clear_existing=True)
    print("--------------------------------------------------")
    print(f"Ingestion Finished: {res}")
    print("==================================================")

if __name__ == "__main__":
    main()
