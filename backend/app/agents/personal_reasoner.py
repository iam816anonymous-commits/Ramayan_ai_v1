import json
import os
from typing import List, Dict, Any

class PersonalReasoner:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.themes = self._load_themes()

    def _load_themes(self) -> Dict[str, Any]:
        path = os.path.join(self.knowledge_dir, "personal_themes.json")
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return {
            "purpose": {
                "episode": "Rama's Journey",
                "lesson": "Dharma guides the way.",
                "application": "Stay steadfast in your duty."
            }
        }

    def detect_theme(self, query: str) -> str:
        q = query.lower()
        for theme in self.themes:
            if theme in q:
                return theme

        # Fallbacks for synonyms
        if "sad" in q or "pain" in q or "hurt" in q: return "grief"
        if "worry" in q or "anxious" in q or "scared" in q: return "fear"
        if "where" in q or "what" in q and "do" in q: return "confusion"

        return "purpose" # Default theme

    def reason(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        theme_key = self.detect_theme(query)
        theme_data = self.themes.get(theme_key, self.themes.get("purpose"))

        primary_verse = context[0] if context else {"text": "Dharma is subtle and eternal.", "kanda": "Universal", "verse": "N/A"}

        return {
            "reflection": f"In the forest of life, we often encounter echoes of the {theme_key} that the great souls once faced.",
            "meaning": f"The episode of {theme_data['episode']} teaches us that {theme_data['lesson']}",
            "context": f"This wisdom is rooted in the {primary_verse.get('kanda', 'Ramayana')}. {theme_data['episode']} illustrates the path through {theme_key}.",
            "takeaway": theme_data['application'],
            "source_verse": primary_verse.get("text", "")
        }
