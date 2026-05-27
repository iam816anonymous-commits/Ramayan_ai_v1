from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
from backend.app.ingestion.entity_extractor import EntityExtractor
from .moral_agent import MoralAgent
from .personal_agent import PersonalAgent

class BrainAgent:
    def __init__(self, collection_name="ramayana_v1", client=None):
        self.client = client or QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.entity_extractor = EntityExtractor()

        self.moral_agent = MoralAgent()
        self.personal_agent = PersonalAgent()

    def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        entities = self.entity_extractor.extract_entities(query)
        vector = self.model.encode(query).tolist()

        all_results = []

        # 1. Exact Entity Search
        if entities["characters"]:
            for char in entities["characters"]:
                try:
                    search_result = self.client.scroll(
                        collection_name=self.collection_name,
                        scroll_filter=Filter(
                            must=[FieldCondition(key="character", match=MatchValue(value=char))]
                        ),
                        limit=2
                    )[0]
                    all_results.extend([hit.payload for hit in search_result])
                except Exception:
                    pass

        # 2. Semantic Search
        semantic_results = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=top_k
        ).points
        all_results.extend([hit.payload for hit in semantic_results])

        seen = set()
        unique_results = []
        for res in all_results:
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
                "meta": {"chunks_used": 0, "entities": {}, "verses": [], "sources": []}
            }

        if intent == "moral":
            return self.moral_agent.synthesize(query, context)
        elif intent == "personal":
            return self.personal_agent.synthesize(query, context)

        # Factual synthesis (default)
        primary = context[0]
        entities_found = self.entity_extractor.extract_entities(query)

        return {
            "reflection": f"You seek knowledge of {', '.join(entities_found['characters']) or 'the events'} that transpired.",
            "meaning": f"The essence of this moment is: {primary.get('text')}",
            "context": f"This took place in the {primary.get('kanda')}, Chapter {primary.get('chapter')}, Verse {primary.get('verse')}.",
            "takeaway": "Knowledge of the past illuminates the path to the future.",
            "source_verse": primary.get("shloka_text") or primary.get("text"),
            "meta": {
                "chunks_used": len(context),
                "kanda": primary.get("kanda"),
                "entities": primary.get("entities"),
                "verses": [primary.get("verse")],
                "sources": [primary.get("source")]
            }
        }
