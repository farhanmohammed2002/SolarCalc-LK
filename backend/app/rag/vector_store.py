"""
Persistent Vector Store for SolarCalc LK RAG System.
Supports ChromaDB when installed, with built-in persistent cosine-similarity store fallback.
"""

import os
import json
import math
from typing import List, Dict, Any, Optional
from app.rag.chunking import TextChunk

class SearchResult:
    def __init__(self, text: str, metadata: Dict[str, Any], score: float):
        self.text = text
        self.metadata = metadata
        self.score = score

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "metadata": self.metadata,
            "score": round(self.score, 4)
        }

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Calculate cosine similarity between two unit vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    return float(dot)

class PersistentVectorStore:
    """Vector database implementation with ChromaDB and built-in persistent store."""

    def __init__(self, db_path: Optional[str] = None):
        default_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "data", "vector_db"
        )
        self.db_path = db_path or os.environ.get("VECTOR_DB_PATH", default_dir)
        os.makedirs(self.db_path, exist_ok=True)

        self._chroma_client = None
        self._chroma_collection = None
        self._fallback_records_file = os.path.join(self.db_path, "solarcalc_rag_records.json")
        self._records: List[Dict[str, Any]] = []

        self._init_backend()

    def _init_backend(self):
        """Try initializing ChromaDB; fall back to JSON/SQLite persistent store if unavailable."""
        try:
            import chromadb
            self._chroma_client = chromadb.PersistentClient(path=self.db_path)
            self._chroma_collection = self._chroma_client.get_or_create_collection(
                name="solarcalc_knowledge",
                metadata={"description": "SolarCalc LK Engineering Documentation"}
            )
            print("[VectorStore] Initialized ChromaDB persistent vector database.")
            return
        except Exception:
            pass

        # Built-in persistent vector store
        if os.path.exists(self._fallback_records_file):
            try:
                with open(self._fallback_records_file, "r", encoding="utf-8") as f:
                    self._records = json.load(f)
            except Exception:
                self._records = []
        print(f"[VectorStore] Initialized built-in vector database ({len(self._records)} chunks indexed).")

    def count(self) -> int:
        if self._chroma_collection:
            try:
                return self._chroma_collection.count()
            except Exception:
                pass
        return len(self._records)

    def add_chunks(self, chunks: List[TextChunk], embeddings: List[List[float]]):
        """Add text chunks with their dense vector embeddings to the vector database."""
        if not chunks or len(chunks) != len(embeddings):
            return

        if self._chroma_collection:
            try:
                ids = [f"chunk_{meta.get('document_id', 'doc')}_{idx}_{i}" for i, (meta, idx) in enumerate([(c.metadata, c.chunk_index) for c in chunks])]
                documents = [c.text for c in chunks]
                metadatas = [c.metadata for c in chunks]

                self._chroma_collection.add(
                    ids=ids,
                    documents=documents,
                    embeddings=embeddings,
                    metadatas=metadatas
                )
                return
            except Exception as e:
                print(f"[VectorStore] ChromaDB add error: {e}, using built-in persistent storage.")

        # Built-in store addition
        for chunk, emb in zip(chunks, embeddings):
            self._records.append({
                "text": chunk.text,
                "metadata": chunk.metadata,
                "embedding": emb,
                "chunk_index": chunk.chunk_index
            })

        # Persist to disk
        with open(self._fallback_records_file, "w", encoding="utf-8") as f:
            json.dump(self._records, f, indent=2)

    def similarity_search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        similarity_threshold: float = 0.25,
        category_filter: Optional[str] = None
    ) -> List[SearchResult]:
        """Search the vector database for most semantically similar chunks."""
        if self._chroma_collection:
            try:
                where_clause = {"category": category_filter} if category_filter else None
                chroma_res = self._chroma_collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where=where_clause
                )
                results: List[SearchResult] = []
                docs = chroma_res.get("documents", [[]])[0]
                metas = chroma_res.get("metadatas", [[]])[0]
                distances = chroma_res.get("distances", [[]])[0]

                for doc, meta, dist in zip(docs, metas, distances):
                    # Chroma distance to similarity (approx 1 - dist)
                    score = max(0.0, 1.0 - (dist if dist is not None else 0.5))
                    if score >= similarity_threshold:
                        results.append(SearchResult(text=doc, metadata=meta, score=score))
                if results:
                    return results
            except Exception as e:
                print(f"[VectorStore] ChromaDB query error: {e}, falling back to built-in store.")

        # Built-in cosine similarity search
        scored_records = []
        for rec in self._records:
            if category_filter and rec.get("metadata", {}).get("category") != category_filter:
                continue

            sim = cosine_similarity(query_embedding, rec.get("embedding", []))
            if sim >= similarity_threshold:
                scored_records.append(SearchResult(
                    text=rec["text"],
                    metadata=rec.get("metadata", {}),
                    score=sim
                ))

        scored_records.sort(key=lambda x: x.score, reverse=True)
        return scored_records[:top_k]

    def clear(self):
        """Reset vector store."""
        if self._chroma_collection:
            try:
                self._chroma_client.delete_collection("solarcalc_knowledge")
                self._chroma_collection = self._chroma_client.create_collection("solarcalc_knowledge")
            except Exception:
                pass
        self._records = []
        if os.path.exists(self._fallback_records_file):
            try:
                os.remove(self._fallback_records_file)
            except Exception:
                pass
