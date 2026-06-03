from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from typing import List, Dict, Any
import numpy as np
import random
import anyio
from backend.app.models import get_sentence_transformer, get_cross_encoder
from backend.ingest.entity_extractor import EntityExtractor
from backend.ingest.entity_resolver import EntityResolver
from backend.ingest.relationship_formatter import RelationshipFormatter
from backend.app.confidence import ConfidenceScorer
from .moral_agent import MoralAgent
from .personal_reasoner import PersonalReasoner
from .sage import SageAgent

class BrainAgent:
    def __init__(self, collection_name="ramayana_v1", client=None):
        self.client = client or QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = get_sentence_transformer()
        self.reranker = get_cross_encoder()
        self.entity_extractor = EntityExtractor()
        self.entity_resolver = EntityResolver()
        self.relationship_formatter = RelationshipFormatter()
        self.confidence_scorer = ConfidenceScorer()

        self.moral_agent = MoralAgent()
        self.personal_reasoner = PersonalReasoner()
        self.sage = SageAgent() # Needed for persona rejection strings

    async def retrieve_context(self, query: str, top_k: int = 3, intent: str = "factual", entities: Dict = None) -> List[Dict]:
        return await anyio.to_thread.run_sync(self._retrieve_context_sync, query, top_k, intent, entities)

    def _retrieve_context_sync(self, query: str, top_k: int = 3, intent: str = "factual", entities: Dict = None) -> List[Dict]:
        if entities is None:
            entities = self.entity_extractor.extract_entities(query)

        # Phase 1: Gatekeeper Hardening
        if intent == "factual" and ("who is" in query.lower() or "tell me about" in query.lower()):
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

    async def synthesize_response(self, query: str, context: List[Dict], intent: str, entities: Dict = None) -> Dict[str, Any]:
        return await anyio.to_thread.run_sync(self._synthesize_response_sync, query, context, intent, entities)

    def _calculate_character_focus(self, text: str, primary_name: str, other_names: List[str]) -> float:
        """
        Calculates a focus score based on the frequency of the primary character vs others.
        """
        if not primary_name:
            return 1.0

        text_lower = text.lower()
        primary_count = text_lower.count(primary_name.lower())

        other_count = 0
        for other in other_names:
            if other.lower() != primary_name.lower():
                other_count += text_lower.count(other.lower())

        if primary_count == 0 and other_count == 0:
            return 1.0

        # Score = primary frequency / total character frequency
        score = primary_count / (primary_count + other_count + 0.1)
        return score

    def _synthesize_response_sync(self, query: str, context: List[Dict], intent: str, entities: Dict = None) -> Dict[str, Any]:
        # Phase 6: Confidence Thresholding
        entities_found = entities if entities is not None else self.entity_extractor.extract_entities(query)

        # Identity Engine Check (Prioritize for identity queries)
        chars = entities_found["characters"]
        identity_profile = None

        # Determine the primary subject of the query
        primary_subject = None
        if len(chars) > 0:
            # Simple heuristic: first character mentioned or first character in entities_found
            primary_subject = chars[0]

        is_identity_query = ("who is" in query.lower() or "tell me about" in query.lower())
        if is_identity_query and primary_subject:
             identity_profile = self.entity_resolver.get_profile(primary_subject)

        confidence = self.confidence_scorer.calculate(context, intent, entities_found)

        # If it's an identity query and we have a profile, we don't reject even if confidence is low
        if intent not in ["personal", "moral"] and confidence < 0.45 and not identity_profile:
            return {
                "reflection": self.sage.persona["rejection"]["low_confidence"],
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
        if intent == "factual" and ("who is" in query.lower() or "tell me about" in query.lower()):
            entities_in_query = entities_found
            potential_entities = self.entity_resolver.extract_potential_entities(query)

            all_to_check = list(set(entities_in_query["characters"] + potential_entities))

            for char in all_to_check:
                if not self.entity_resolver.entity_exists(char):
                    return {
                        "reflection": self.sage.persona["rejection"]["non_scriptural"],
                        "meaning": f"The character '{char}' does not exist in my Ramayana knowledge base.",
                        "context": "The Sanctum focuses exclusively on the journey of Rama and the figures of the first epic.",
                        "takeaway": "Seek wisdom within the context of Dharma as revealed in the Ramayana.",
                        "source_verse": "N/A",
                        "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": [], "grounded": False}
                    }

        if not context:
            return {
                "reflection": self.sage.persona["rejection"]["low_confidence"],
                "meaning": "Even when the path is not immediately clear, Dharma guides us.",
                "context": "The vastness of the Ramayana contains infinite wisdom.",
                "takeaway": "Patience and faith are the keys to understanding.",
                "source_verse": "N/A",
                "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": [], "grounded": False}
            }

        if intent == "moral":
            res = self.moral_agent.synthesize(query, context)
            if "confidence" not in res["meta"]:
                res["meta"]["confidence"] = confidence
            return res
        elif intent == "personal":
            # Phase 3: Personal Reasoner Hardening
            brain_res = self.personal_reasoner.reason(query, context)
            brain_res["meta"] = {
                "chunks_used": len(context),
                "kanda": context[0].get("kanda") if context else "Universal",
                "entities": {"characters": [], "locations": [], "events": []},
                "verses": [str(context[0].get("verse"))] if context else [],
                "sources": [context[0].get("source")] if context else ["Scriptures"]
            }
            return brain_res

        # Factual synthesis (default)
        primary = context[0]


        # Aggregate all entities from context if query doesn't yield any
        if not entities_found["characters"] and not entities_found["locations"]:
            for c in context:
                ents = c.get("entities", {})
                entities_found["characters"].extend(ents.get("characters", []))
                entities_found["locations"].extend(ents.get("locations", []))

            # Deduplicate
            entities_found["characters"] = list(set(entities_found["characters"]))
            entities_found["locations"] = list(set(entities_found["locations"]))

        # Thread of Fate logic - Improved pathfinding presentation
        if len(chars) >= 2:
            path = self.entity_extractor.find_path(chars[0], chars[1])
            if path:
                # Use RelationshipFormatter for natural language
                steps = []
                for p in path:
                    parts = p.split(" → ")
                    if len(parts) == 3:
                        src, rel, tgt = parts
                        steps.append(self.relationship_formatter.format(src, rel, tgt))
                    else:
                        steps.append(p)

                fate_desc = ", and ".join(steps)
                reflection = f"The Thread of Fate reveals that {fate_desc}. Their destinies are eternally entwined."
            else:
                reflection = f"You seek to understand the roles of {', '.join(chars)}. Each stands as a pillar of the great epic."
        elif identity_profile:
            reflection = f"You inquire about {identity_profile['name']}, {identity_profile['description']}"
        elif chars:
            reflection = f"Your focus rests upon {chars[0]}. The Sage observes the echoes of their journey through the Kandas."
        else:
            reflection = "You inquire about the sacred events that shaped the world's first epic."

        # Sage Voice refinement for reflection
        if len(reflection) < 100: # If it's a short generic reflection, keep it, but SageAgent will wrap it.
             pass

        # Synthesize meaning from multiple context chunks with poetic transitions
        if identity_profile:
            # Character-Centric Synthesis: Identity Profile is the core, verses are supporting evidence
            name = identity_profile['name']
            synthesized_meaning = f"{name} is recognized as {identity_profile['significance']} Among the many virtues of {name}, they are known to be {', '.join(identity_profile['traits'])}. "

            # Filter context chunks to those that actually mention the primary subject to prevent hijacking
            supporting_verses = []
            for c in context:
                c_text = c.get('text', '')
                if name.lower() in c_text.lower():
                    supporting_verses.append(c_text)

            if supporting_verses:
                synthesized_meaning += f"The scriptures record regarding {name}: '{supporting_verses[0]}'"

                # Check for additional supporting verses for the SAME character
                if len(supporting_verses) > 1:
                    synthesized_meaning += f" Furthermore, we find: '{supporting_verses[1][:200]}...'"
            else:
                # Fallback if retrieval is weak/hijacked but profile exists
                synthesized_meaning += f"The presence of {name} in the sacred verses reminds us of the subtle ways Dharma works through all beings."
        else:
            synthesized_meaning = primary.get('text', '')

            # Entity-aware synthesis for non-identity factual queries: find common characters across chunks
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

        # Preliminary Takeaway for focus calculation
        if identity_profile:
            name = identity_profile['name']
            takeaway = f"In contemplating {name}, we see that {random.choice(identity_profile['traits'])} is not just a trait, but a living expression of {name}'s devotion to Truth."
        else:
            takeaway = f"Witnessing {primary.get('event') or 'the events'} teaches us that every moment is a step in the divine plan."

        # Character Focus Validation (Identity Queries)
        focus_score = 1.0
        if identity_profile:
            full_text = f"{reflection} {synthesized_meaning} {takeaway}"
            all_known_chars = [c['name'] for c in self.entity_resolver.entities['characters']]
            focus_score = self._calculate_character_focus(full_text, identity_profile['name'], all_known_chars)

            # Penalize and adjust if hijacked (score < 0.4)
            if focus_score < 0.4:
                 # Re-synthesis to force focus
                 synthesized_meaning = f"Focusing strictly on {identity_profile['name']}: {identity_profile['description']} {identity_profile['significance']}"

        # Context refinement
        if identity_profile:
            name = identity_profile['name']
            context_desc = f"The journey of {name} is a pivotal part of the Ramayana, particularly in the {primary.get('kanda', 'sacred kandas')}. "
            context_desc += f"Specific details regarding {name} can be found in {primary.get('kanda')}, Chapter {primary.get('chapter')}, Verse {primary.get('verse')}."
        else:
            context_desc = f"This wisdom is preserved across {', '.join(list(kandas) or ['the Kandas'])}. "
            context_desc += f"Specifically in {primary.get('kanda')}, Chapter {primary.get('chapter')}, Verse {primary.get('verse')}."


        return {
            "reflection": reflection,
            "meaning": synthesized_meaning,
            "context": context_desc,
            "takeaway": takeaway,
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
                "confidence": confidence,
                "character_focus": focus_score
            }
        }
