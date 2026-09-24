"""
Document Chunking Service for SolarCalc LK RAG Pipeline.
Implements smart section-aware text splitting with chunk overlap.
"""

import re
from typing import List, Dict, Any

class TextChunk:
    def __init__(self, text: str, metadata: Dict[str, Any], chunk_index: int):
        self.text = text
        self.metadata = metadata
        self.chunk_index = chunk_index

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "metadata": self.metadata,
            "chunk_index": self.chunk_index
        }

class DocumentChunker:
    def __init__(self, chunk_size: int = 700, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(self, text: str, base_metadata: Dict[str, Any]) -> List[TextChunk]:
        """Split document text into overlapping chunks while preserving paragraph boundaries and headers."""
        if not text or not text.strip():
            return []

        # Split on double newlines / markdown headers
        paragraphs = re.split(r'\n\s*\n', text.strip())
        chunks: List[TextChunk] = []
        current_chunk = ""
        current_section = base_metadata.get("section", "General")

        for p in paragraphs:
            p_clean = p.strip()
            if not p_clean:
                continue

            # Detect header
            if p_clean.startswith("#"):
                current_section = p_clean.lstrip("#").strip().split("\n")[0]

            if len(current_chunk) + len(p_clean) < self.chunk_size:
                current_chunk = f"{current_chunk}\n\n{p_clean}" if current_chunk else p_clean
            else:
                if current_chunk:
                    meta = dict(base_metadata)
                    meta["section"] = current_section
                    chunks.append(TextChunk(text=current_chunk.strip(), metadata=meta, chunk_index=len(chunks)))
                    # Carry over overlap
                    overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else ""
                    current_chunk = f"{overlap_text}\n\n{p_clean}".strip()
                else:
                    meta = dict(base_metadata)
                    meta["section"] = current_section
                    chunks.append(TextChunk(text=p_clean, metadata=meta, chunk_index=len(chunks)))
                    current_chunk = ""

        if current_chunk.strip():
            meta = dict(base_metadata)
            meta["section"] = current_section
            chunks.append(TextChunk(text=current_chunk.strip(), metadata=meta, chunk_index=len(chunks)))

        return chunks
