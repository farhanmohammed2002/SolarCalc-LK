"""
RAG Ingestion Pipeline for SolarCalc LK.
Reads knowledge documents, chunks them, embeds them, and populates the persistent vector store.
"""

import os
import re
import json
import glob
from typing import List, Dict, Any, Optional

from app.rag.chunking import DocumentChunker, TextChunk
from app.rag.embeddings import get_embedding_provider, EmbeddingProvider
from app.rag.vector_store import PersistentVectorStore


def extract_metadata_from_markdown(content: str, file_path: str) -> Dict[str, Any]:
    """Extract document ID, title, and category from markdown headers or frontmatter."""
    meta = {
        "file_path": file_path,
        "filename": os.path.basename(file_path),
        "document_name": os.path.basename(file_path).replace(".md", "").replace("_", " ").title(),
        "document_id": os.path.splitext(os.path.basename(file_path))[0],
        "category": "Documentation",
        "section": "General",
        "source_url": ""
    }

    # Extract Title from first # heading
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if title_match:
        meta["document_name"] = title_match.group(1).strip()

    # Extract Document ID, Category, Source from lines
    for line in content.splitlines()[:25]:
        if "Document ID:" in line:
            meta["document_id"] = line.split("Document ID:")[1].strip().strip("*` ")
        elif "Category:" in line:
            meta["category"] = line.split("Category:")[1].strip().strip("*` ")
        elif "Source:" in line or "Primary Source:" in line:
            meta["source_url"] = line.split("Source:")[1].strip().strip("*` ")

    return meta


class RAGIngestionPipeline:
    def __init__(
        self,
        knowledge_dir: Optional[str] = None,
        vector_store: Optional[PersistentVectorStore] = None,
        embedder: Optional[EmbeddingProvider] = None,
        chunk_size: int = 700,
        chunk_overlap: int = 100
    ):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.knowledge_dir = knowledge_dir or os.path.join(base_dir, "knowledge")
        self.vector_store = vector_store or PersistentVectorStore()
        self.embedder = embedder or get_embedding_provider()
        self.chunker = DocumentChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    def run(self, clear_existing: bool = True) -> Dict[str, Any]:
        """Run complete document ingestion workflow."""
        if clear_existing:
            print("[RAG Ingestion] Clearing existing vector store...")
            self.vector_store.clear()

        # Find all markdown files in knowledge directory
        md_files = glob.glob(os.path.join(self.knowledge_dir, "**", "*.md"), recursive=True)
        print(f"[RAG Ingestion] Found {len(md_files)} knowledge markdown files in {self.knowledge_dir}")

        total_chunks: List[TextChunk] = []

        for fpath in md_files:
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()

                meta = extract_metadata_from_markdown(content, fpath)
                chunks = self.chunker.chunk_document(content, meta)
                total_chunks.extend(chunks)
                print(f"  • Processed: {os.path.basename(fpath)} -> {len(chunks)} chunks")
            except Exception as e:
                print(f"  ⚠️ Error processing {fpath}: {e}")

        # Index hardware catalogs if present
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        data_dir = os.path.join(base_dir, "app", "data")
        if not os.path.exists(data_dir):
            data_dir = os.path.join(base_dir, "data")

        json_files = glob.glob(os.path.join(data_dir, "*.json"))
        for jpath in json_files:
            bname = os.path.basename(jpath)
            if bname in ["panels.json", "inverters.json", "batteries.json"]:
                try:
                    with open(jpath, "r", encoding="utf-8") as jf:
                        jdata = json.load(jf)
                    summary_text = f"# Hardware Catalog: {bname}\n\n"
                    if isinstance(jdata, list):
                        for item in jdata:
                            summary_text += f"- **{item.get('brand', '')} {item.get('model', '')}**: {json.dumps(item)}\n"
                    meta = {
                        "file_path": jpath,
                        "filename": bname,
                        "document_name": f"Hardware Catalog ({bname})",
                        "document_id": f"catalog-{bname.split('.')[0]}",
                        "category": "Hardware Equipment",
                        "section": "Catalog Data",
                        "source_url": ""
                    }
                    jchunks = self.chunker.chunk_document(summary_text, meta)
                    total_chunks.extend(jchunks)
                    print(f"  • Processed Hardware JSON: {bname} -> {len(jchunks)} chunks")
                except Exception as e:
                    print(f"  ⚠️ Error processing JSON {jpath}: {e}")

        print(f"[RAG Ingestion] Generating embeddings for {len(total_chunks)} chunks...")
        texts = [c.text for c in total_chunks]
        embeddings = self.embedder.embed_documents(texts)

        print("[RAG Ingestion] Storing chunks into vector database...")
        self.vector_store.add_chunks(total_chunks, embeddings)

        result = {
            "status": "success",
            "files_processed": len(md_files) + len(json_files),
            "chunks_indexed": len(total_chunks),
            "vector_store_count": self.vector_store.count()
        }
        print(f"[RAG Ingestion] Completed successfully! Vector store count: {result['vector_store_count']}")
        return result


if __name__ == "__main__":
    pipeline = RAGIngestionPipeline()
    pipeline.run(clear_existing=True)
