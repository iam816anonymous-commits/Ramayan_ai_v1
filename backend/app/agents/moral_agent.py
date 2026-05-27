import json
import os
from typing import Dict, List, Any

class MoralAgent:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.lessons = self._load_lessons()

    def _load_lessons(self) -> List[Dict]:
        path = os.path.join(self.knowledge_dir, "dharma_lessons.json")
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return []

    def synthesize(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        primary = context[0] if context else {}
        text = primary.get("text", "The path of Dharma is subtle.")
        kanda = primary.get("kanda", "Ramayana")

        # Try to find a relevant lesson
        matched_lesson = None
        query_lower = query.lower()
        for lesson in self.lessons:
            if lesson["theme"].lower() in query_lower or lesson["context"].lower() in query_lower:
                matched_lesson = lesson
                break

        if not matched_lesson:
            # Simple fallback search in lesson text
            for lesson in self.lessons:
                if any(word in lesson["teaching"].lower() for word in query_lower.split() if len(word) > 4):
                    matched_lesson = lesson
                    break

        reflection = "Every action in the cosmic play carries a weight of Dharma. We must look beyond the surface of the event to find the eternal law."
        takeaway = "Dharma is not merely a set of rules, but the alignment of one's soul with the cosmic order."

        if matched_lesson:
            reflection = f"Regarding {matched_lesson['theme']}, the Ramayana offers deep insight through {matched_lesson['context']}."
            takeaway = matched_lesson["teaching"]

        return {
            "reflection": reflection,
            "meaning": f"The moral teaching revealed here is: {text[:300]}...",
            "context": f"In the sacred {kanda}, we observe the choices of the great souls and the consequences that ripple through time.",
            "takeaway": takeaway,
            "source_verse": primary.get("shloka_text") or text,
            "meta": {
                "chunks_used": len(context),
                "kanda": kanda,
                "entities": primary.get("entities", {}),
                "verses": [primary.get("verse")],
                "sources": [primary.get("source")]
            }
        }
