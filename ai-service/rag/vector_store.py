import os
from typing import List, Dict, Any, Optional
from rag.siliana_knowledge import SILIANA_KNOWLEDGE_DOCS

class SilianaRAGStore:
    def __init__(self):
        self.chroma_client = None
        self.collection = None
        self._initialize_store()

    def _initialize_store(self):
        try:
            import chromadb
            # Use persistent or in-memory lightweight client
            self.chroma_client = chromadb.Client()
            self.collection = self.chroma_client.get_or_create_collection(
                name="siliana_knowledge",
                metadata={"description": "Siliana heritage, trails and travel guides"}
            )

            # Check if collection is empty, then populate
            if self.collection.count() == 0:
                docs = [d["content"] for d in SILIANA_KNOWLEDGE_DOCS]
                ids = [d["id"] for d in SILIANA_KNOWLEDGE_DOCS]
                metadatas = [
                    {
                        "title": d["title"],
                        "region": d["region"],
                        "category": d["category"]
                    }
                    for d in SILIANA_KNOWLEDGE_DOCS
                ]
                self.collection.add(
                    documents=docs,
                    ids=ids,
                    metadatas=metadatas
                )
        except Exception as e:
            # Fallback in-memory keyword / semantic search if ChromaDB has any issue
            self.collection = None
            self._fallback_docs = SILIANA_KNOWLEDGE_DOCS

    def search(self, query: str, top_k: int = 3, region_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieves top_k relevant context snippets from the knowledge base.
        Supports metadata filtering by region.
        """
        results = []
        if self.collection:
            try:
                where_clause = None
                if region_filter:
                    where_clause = {"region": region_filter}
                
                query_args = {
                    "query_texts": [query],
                    "n_results": min(top_k, len(SILIANA_KNOWLEDGE_DOCS))
                }
                if where_clause:
                    query_args["where"] = where_clause

                chroma_res = self.collection.query(**query_args)
                
                docs = chroma_res.get("documents", [[]])[0]
                metas = chroma_res.get("metadatas", [[]])[0]
                ids = chroma_res.get("ids", [[]])[0]

                for i, doc in enumerate(docs):
                    results.append({
                        "id": ids[i] if i < len(ids) else "doc",
                        "title": metas[i].get("title", "") if i < len(metas) else "",
                        "region": metas[i].get("region", "") if i < len(metas) else "",
                        "category": metas[i].get("category", "") if i < len(metas) else "",
                        "content": doc
                    })
                return results
            except Exception:
                pass

        # Fallback text matcher
        q_lower = query.lower()
        scored = []
        for d in SILIANA_KNOWLEDGE_DOCS:
            score = 0
            text = (d["title"] + " " + d["content"] + " " + d["region"]).lower()
            for word in q_lower.split():
                if len(word) > 2 and word in text:
                    score += 1
            if score > 0:
                scored.append((score, d))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]] or SILIANA_KNOWLEDGE_DOCS[:top_k]

# Global Singleton instance
rag_store = SilianaRAGStore()

def retrieve_heritage_context(query: str, top_k: int = 3, region: Optional[str] = None) -> str:
    """
    Returns a clean, cited string block ready for injection into LLM prompts.
    """
    matches = rag_store.search(query=query, top_k=top_k, region_filter=region)
    if not matches:
        return "Aucune documentation spécifique trouvée dans la base RAG."

    formatted = []
    for i, m in enumerate(matches, 1):
        formatted.append(f"[{i}] {m['title']} ({m.get('region', 'Siliana')}):\n{m['content']}")
    return "\n\n".join(formatted)
