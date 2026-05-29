from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer, CrossEncoder
from typing import List, Dict, Any
import numpy as np
from backend.ingest.entity_extractor import EntityExtractor
from backend.ingest.entity_resolver import EntityResolver
from backend.ingest.relationship_formatter import RelationshipFormatter
from backend.app.confidence import ConfidenceScorer
from .moral_agent import MoralAgent
from .personal_reasoner import PersonalReasoner

class BrainAgent:
    def __init__(self, collection_name="ramayana_v1", client=None):
        self.client = client or QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
        self.entity_extractor = EntityExtractor()
        self.entity_resolver = EntityResolver()
        self.relationship_formatter = RelationshipFormatter()
        self.confidence_scorer = ConfidenceScorer()

        self.moral_agent = MoralAgent()
        self.personal_reasoner = PersonalReasoner()

    def retrieve_context(self, query: str, top_k: int = 3, intent: str = "factual") -> List[Dict]:
        entities = self.entity_extractor.extract_entities(query)

        # Phase 1: Gatekeeper Hardening
        if intent == "factual":
            # Check known entities
            for char in entities["characters"]:
                if not self.entity_resolver.entity_exists(char):
                    return []

            # Check potential entities (names we might not know)
            potential_entities = self.entity_resolver.extract_potential_entities(query)
            for pe in potential_entities:
                if not self.entity_resolver.entity_exists(pe):
                    # Trigger rejection by returning empty context
                    return []

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
            limit=10 # Retrieval pool for reranking
        ).points

        for hit in semantic_results:
            hit.payload['score'] = hit.score
            all_results.append(hit.payload)

        seen = set()
        unique_results = []
        for res in all_results:
            key = f"{res.get('text')[:50]}_{res.get('verse')}"
            if key not in seen:
                unique_results.append(res)
                seen.add(key)

        # Phase 2: Reranking
        if unique_results:
            pairs = [[query, res['text']] for res in unique_results]
            rerank_scores = self.reranker.predict(pairs)

            for i, score in enumerate(rerank_scores):
                unique_results[i]['rerank_score'] = float(score)

            # Sort by rerank score
            unique_results.sort(key=lambda x: x['rerank_score'], reverse=True)

        return unique_results[:top_k]

    def synthesize_response(self, query: str, context: List[Dict], intent: str) -> Dict[str, Any]:
        # Phase 6: Confidence Thresholding
        entities_found = self.entity_extractor.extract_entities(query)
        confidence = self.confidence_scorer.calculate(context, intent, entities_found)

        if intent != "personal" and confidence < 0.45:
            return {
                "reflection": "The sacred silence holds all answers.",
                "meaning": "I am not sufficiently confident in this answer to provide guidance.",
                "context": "The retrieved verses do not provide a strong enough match for your inquiry.",
                "takeaway": "Seek clarity through a more specific query or different phrasing.",
                "source_verse": "N/A",
                "meta": {
                    "chunks_used": len(context),
                    "entities": entities_found,
                    "verses": [],
                    "sources": [],
                    "grounded": False,
                    "confidence": confidence
                }
            }

        # Phase 1 Rejection Check
        if intent == "factual":
            entities_in_query = self.entity_extractor.extract_entities(query)
            potential_entities = self.entity_resolver.extract_potential_entities(query)

            all_to_check = list(set(entities_in_query["characters"] + potential_entities))

            for char in all_to_check:
                if not self.entity_resolver.entity_exists(char):
                    return {
                        "reflection": "The Sage remains silent on figures beyond the sacred epic.",
                        "meaning": f"The character '{char}' does not exist in my Ramayana knowledge base.",
                        "context": "The Sanctum focuses exclusively on the journey of Rama and the figures of the first epic.",
                        "takeaway": "Seek wisdom within the context of Dharma as revealed in the Ramayana.",
                        "source_verse": "N/A",
                        "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": [], "grounded": False}
                    }

        if not context:
            return {
                "reflection": "The sacred silence holds all answers.",
                "meaning": "Even when the path is not immediately clear, Dharma guides us.",
                "context": "The vastness of the Ramayana contains infinite wisdom.",
                "takeaway": "Patience and faith are the keys to understanding.",
                "source_verse": "N/A",
                "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": [], "grounded": False}
            }

        if intent == "moral":
            return self.moral_agent.synthesize(query, context)
        elif intent == "personal":
            # Phase 3: Personal Reasoner Hardening
            return self.personal_reasoner.reason(query, context)

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
                # Use RelationshipFormatter for natural language
                steps = []
                for p in path:
                    src, rel, tgt = p.split(" → ")
                    steps.append(self.relationship_formatter.format(src, rel, tgt))

                fate_desc = ", and ".join(steps)
                reflection = f"The Thread of Fate reveals that {fate_desc}. Their destinies are eternally entwined."
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
                "grounded": not hallucination_flag,
                "confidence": confidence
            }
        }
