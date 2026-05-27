from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import numpy as np
from backend.app.ingestion.entity_extractor import EntityExtractor

class BrainAgent:
    def __init__(self, collection_name="ramayana_v1", client=None):
        self.client = client or QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.entity_extractor = EntityExtractor()

    def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Multi-stage retrieval following Sanctum V1 priority:
        1. Exact Entity Match
        2. Metadata Filters
        3. Semantic Search
        """
        entities = self.entity_extractor.extract_entities(query)
        vector = self.model.encode(query).tolist()

        all_results = []

        # 1. Exact Entity Search (Filtering)
        if entities["characters"]:
            for char in entities["characters"]:
                search_result = self.client.scroll(
                    collection_name=self.collection_name,
                    scroll_filter=Filter(
                        must=[FieldCondition(key="character", match=MatchValue(value=char))]
                    ),
                    limit=2
                )[0]
                all_results.extend([hit.payload for hit in search_result])

        # 2. Semantic Search (fallback/augmentation)
        semantic_results = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=top_k
        ).points
        all_results.extend([hit.payload for hit in semantic_results])

        # 3. Reranking / Deduplication
        seen = set()
        unique_results = []
        for res in all_results:
            # Using text + verse as a simple key for deduplication
            key = f"{res.get('text')[:50]}_{res.get('verse')}"
            if key not in seen:
                unique_results.append(res)
                seen.add(key)

        return unique_results[:top_k]

    def synthesize_response(self, query: str, context: List[Dict], intent: str) -> Dict[str, Any]:
        if not context:
            return {
                "reflection": "The sacred silence holds all answers.",
                "meaning": "Even when the path is not immediately clear, Dharma guides us.",
                "context": "The vastness of the Ramayana contains infinite wisdom.",
                "takeaway": "Patience and faith are the keys to understanding.",
                "source_verse": "N/A",
                "meta": {"chunks_used": 0, "entities": []}
            }

        primary = context[0]
        entities_found = self.entity_extractor.extract_entities(query)

        if intent == "factual":
            reflection = f"You seek knowledge of {', '.join(entities_found['characters']) or 'the events'} that transpired."
            meaning = f"The essence of this moment is: {primary.get('text')}"
            context_str = f"This took place in the {primary.get('kanda')}, Chapter {primary.get('chapter')}, Verse {primary.get('verse')}."
            takeaway = "Knowledge of the past illuminates the path to the future."
        elif intent == "moral":
            reflection = "Every action in the cosmic play carries a weight of Dharma."
            meaning = f"The moral teaching revealed here is: {primary.get('text')}"
            ctx_str = f"In this chapter of {primary.get('kanda')}, we observe the choices of the great souls."
            takeaway = "Choose the path of righteousness even when it is the narrowest one."
        else: # personal
            reflection = "Your heart seeks resonance with the divine journey."
            meaning = f"Consider how this teaching speaks to your soul: {primary.get('text')}"
            ctx_str = f"The Ramayana is a mirror to the human condition, reflected in {primary.get('kanda')}."
            takeaway = "Walk with the grace of Sita and the strength of Rama in your daily life."

        return {
            "reflection": reflection,
            "meaning": meaning,
            "context": ctx_str if intent != "factual" else context_str,
            "takeaway": takeaway,
            "source_verse": primary.get("shloka_text") or primary.get("text"),
            "meta": {
                "chunks_used": len(context),
                "kanda": primary.get("kanda"),
                "entities": primary.get("entities"),
                "verses": [primary.get("verse")],
                "sources": [primary.get("source")]
            }
        }
