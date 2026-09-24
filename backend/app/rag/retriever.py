"""
RAG Retriever for SolarCalc LK.
Performs semantic retrieval and formats cited documents for the AI agent.
"""

import os
from typing import List, Dict, Any, Optional
from app.rag.embeddings import get_embedding_provider, EmbeddingProvider
from app.rag.vector_store import PersistentVectorStore, SearchResult

class RAGRetriever:
    def __init__(
        self,
        vector_store: Optional[PersistentVectorStore] = None,
        embedder: Optional[EmbeddingProvider] = None,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None
    ):
        self.vector_store = vector_store or PersistentVectorStore()
        self.embedder = embedder or get_embedding_provider()
        self.top_k = top_k or int(os.environ.get("RAG_TOP_K", "5"))
        self.similarity_threshold = similarity_threshold or float(os.environ.get("RAG_SIMILARITY_THRESHOLD", "0.20"))

    def retrieve(self, query: str, category_filter: Optional[str] = None) -> List[SearchResult]:
        """Retrieve most relevant chunks for a user query."""
        if not query or not query.strip():
            return []

        q_emb = self.embedder.embed_query(query.strip())
        results = self.vector_store.similarity_search(
            query_embedding=q_emb,
            top_k=self.top_k,
            similarity_threshold=self.similarity_threshold,
            category_filter=category_filter
        )
        return results

    def format_for_prompt(self, results: List[SearchResult]) -> str:
        """Format retrieved chunks into structured context for the LLM prompt."""
        if not results:
            return ""

        formatted_chunks = []
        for i, r in enumerate(results, 1):
            meta = r.metadata
            doc_name = meta.get("document_name", "SolarCalc LK Document")
            sec = meta.get("section", "General")
            page = meta.get("page", "")
            page_str = f" (Page {page})" if page else ""
            source_url = meta.get("source_url", "")
            url_str = f" [Source: {source_url}]" if source_url else ""

            formatted_chunks.append(
                f"[{i}] {doc_name}{page_str} — Section: {sec}{url_str}\n{r.text}"
            )

        return "\n\n---\n\n".join(formatted_chunks)

    def extract_sources(self, results: List[SearchResult]) -> List[Dict[str, Any]]:
        """Extract unique source citations for frontend display."""
        seen = set()
        sources = []
        for r in results:
            meta = r.metadata
            doc_name = meta.get("document_name", "SolarCalc LK Reference")
            key = (doc_name, meta.get("section"))
            if key not in seen:
                seen.add(key)
                sources.append({
                    "document_id": meta.get("document_id"),
                    "title": doc_name,
                    "section": meta.get("section"),
                    "category": meta.get("category"),
                    "page": meta.get("page"),
                    "url": meta.get("source_url"),
                    "score": round(r.score, 3)
                })
        return sources
