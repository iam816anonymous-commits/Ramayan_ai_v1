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
                "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": []}
            }

        if intent == "moral":
            return self.moral_agent.synthesize(query, context)
        elif intent == "personal":
            return self.personal_agent.synthesize(query, context)

        # Factual synthesis (default)
        primary = context[0]

        # Aggregate all entities from context if query doesn't yield any
        entities_found = self.entity_extractor.extract_entities(query)
        if not entities_found["characters"] and not entities_found["locations"]:
            for c in context:
                ents = c.get("entities", {})
                entities_found["characters"].extend(ents.get("characters", []))
                entities_found["locations"].extend(ents.get("locations", []))

            # Deduplicate
            entities_found["characters"] = list(set(entities_found["characters"]))
            entities_found["locations"] = list(set(entities_found["locations"]))

        # Thread of Fate logic - Improved pathfinding presentation
        chars = entities_found["characters"]
        if len(chars) >= 2:
            path = self.entity_extractor.find_path(chars[0], chars[1])
            if path:
                # Format: "being the [type] of [target]"
                steps = []
                for p in path:
                    _, rel, target = p.split(" → ")
                    rel_clean = rel.lower().replace("_of", "").replace("_", " ")
                    steps.append(f"the {rel_clean} of {target}")

                fate_desc = " and ".join(steps)
                reflection = f"The Thread of Fate reveals how {chars[0]} is connected to {chars[1]} by being {fate_desc}. Their destinies are eternally entwined."
            else:
                reflection = f"You seek to understand the roles of {', '.join(chars)}. Each stands as a pillar of the great epic."
        elif chars:
            reflection = f"Your focus rests upon {chars[0]}. The Sage observes the echoes of their journey through the Kandas."
        else:
            reflection = "You inquire about the sacred events that shaped the world's first epic."

        # Synthesize meaning from multiple context chunks with poetic transitions
        synthesized_meaning = primary.get('text', '')

        # Entity-aware synthesis: find common characters across chunks
        common_chars = []
        if chars:
            for other in context[1:]:
                other_chars = other.get("entities", {}).get("characters", [])
                for c in chars:
                    if c in other_chars and c not in common_chars:
                        common_chars.append(c)

        if common_chars:
            synthesized_meaning += f" The role of {', '.join(common_chars)} is further illuminated in the following verses: "
        elif len(context) > 1:
            synthesized_meaning += " In the depths of the sacred verses, we find further truth: "

        if len(context) > 1:
            additional_context = context[1].get('text', '')
            if additional_context and additional_context != primary.get('text'):
                synthesized_meaning += additional_context

        # Collect all entities and sources
        all_chars = set()
        all_locs = set()
        all_events = set()
        all_verses = []
        all_sources = []
        kandas = set()

        for c in context:
            ents = c.get("entities", {})
            all_chars.update(ents.get("characters", []))
            all_locs.update(ents.get("locations", []))
            all_events.update(ents.get("events", []))
            if c.get("verse"): all_verses.append(str(c.get("verse")))
            if c.get("source"): all_sources.append(c.get("source"))
            if c.get("kanda"): kandas.add(c.get("kanda"))

        # Grounding check
        hallucination_flag = False
        if not context or len(context) < 1:
            hallucination_flag = True

        return {
            "reflection": reflection,
            "meaning": synthesized_meaning,
            "context": f"This wisdom is preserved across {', '.join(list(kandas) or ['the Kandas'])}. Specifically in {primary.get('kanda')}, Chapter {primary.get('chapter')}, Verse {primary.get('verse')}.",
            "takeaway": f"Witnessing {primary.get('event') or 'the events'} teaches us that every moment is a step in the divine plan.",
            "source_verse": primary.get("shloka_text") or primary.get("text"),
            "meta": {
                "chunks_used": len(context),
                "kanda": primary.get("kanda"),
                "entities": {
                    "characters": list(all_chars),
                    "locations": list(all_locs),
                    "events": list(all_events)
                },
                "verses": list(set(all_verses)),
                "sources": list(set(all_sources)),
                "grounded": not hallucination_flag
            }
        }
