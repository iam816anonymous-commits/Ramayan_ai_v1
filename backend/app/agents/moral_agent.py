import json
import os
import random
from typing import Dict, List, Any
from .moral_validator import MoralValidator

class MoralAgent:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.lessons = self._load_lessons()
        self.validator = MoralValidator()

    def _load_lessons(self) -> List[Dict]:
        path = os.path.join(self.knowledge_dir, "dharma_lessons.json")
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return []

    def _match_lesson(self, query: str) -> List[Dict]:
        query_lower = query.lower()
        matches = []
        for lesson in self.lessons:
            # Check theme match
            if lesson["theme"].lower() in query_lower:
                matches.append((lesson, 2.0))
            # Check context match
            elif lesson["context"].lower() in query_lower:
                matches.append((lesson, 1.5))
            # Keyword match in teaching
            else:
                keywords = lesson["theme"].lower().split()
                for kw in keywords:
                    if len(kw) > 3 and kw in query_lower:
                        matches.append((lesson, 1.0))
                        break

        # Sort by score
        matches.sort(key=lambda x: x[1], reverse=True)
        return [m[0] for m in matches]

    def synthesize(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        if not context:
             return {
                "reflection": "The path of Dharma is often shrouded in silence when evidence is scarce.",
                "meaning": "I could not find enough evidence in the retrieved verses to support this moral interpretation.",
                "context": "The sacred verses retrieved do not explicitly contain the themes of your moral inquiry.",
                "takeaway": "Approach the query with fresh eyes or seek another passage for guidance.",
                "source_verse": "N/A",
                "meta": {"chunks_used": 0, "entities": {"characters": [], "locations": [], "events": []}, "verses": [], "sources": [], "grounded": False}
            }

        primary = context[0]
        text = primary.get("text", "The path of Dharma is subtle.")
        kanda = primary.get("kanda", "Ramayana")

        # Aggregate all characters from context
        all_chars = set()
        for c in context:
            all_chars.update(c.get("entities", {}).get("characters", []))
        chars = list(all_chars)

        # Try to find a relevant lesson
        matched_lessons = self._match_lesson(query)
        matched_lesson = matched_lessons[0] if matched_lessons else None

        if matched_lesson:
            reflection = f"Regarding {matched_lesson['theme']}, the Ramayana offers deep insight through {matched_lesson['context']}. Each trial is a test of the soul's alignment with truth."
            takeaway = matched_lesson["teaching"]
        elif chars:
            reflection = f"The life of {chars[0]} serves as a beacon of Dharma. Every choice made by the souls in the {kanda} is a lesson in righteousness for all generations."
            takeaway = "Dharma is not merely a set of rules, but the alignment of one's soul with the cosmic order."
        else:
            reflection = "Every action in the cosmic play carries a weight of Dharma. We must look beyond the surface of the event to find the eternal law."
            takeaway = "Dharma is not merely a set of rules, but the alignment of one's soul with the cosmic order."

        # Wisdom Synthesis
        meaning = (
            f"The sacred scriptures reveal: '{text[:300]}...' "
            f"In this passage from the {kanda}, we find the essence of moral conduct. "
        )
        if chars:
            meaning += f"Witness how {chars[0]} navigates this complexity, showing us that righteousness is the only steady ground in a changing world."

        # Ground the takeaway in the specific character context
        grounded_takeaway = takeaway
        if chars:
            if "one's" in grounded_takeaway:
                grounded_takeaway = grounded_takeaway.replace("one's", f"{chars[0]}'s")
            elif "one" in grounded_takeaway:
                grounded_takeaway = grounded_takeaway.replace("one", f"{chars[0]}")

        # Final voice touch
        meaning += " Thus, the first epic teaches us that our duties are our true companions."

        return {
            "reflection": reflection,
            "meaning": meaning,
            "context": f"In the sacred {kanda}, specifically Chapter {primary.get('chapter', 'unknown')}, we observe these divine ripples through time.",
            "takeaway": grounded_takeaway,
            "source_verse": primary.get("shloka_text") or text,
            "meta": {
                "chunks_used": len(context),
                "kanda": kanda,
                "entities": {"characters": chars, "locations": [], "events": []},
                "verses": [str(primary.get("verse", "various"))],
                "sources": [primary.get("source", "Scriptures")]
            }
        }
