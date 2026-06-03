import json
import os
import random
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
        return {}

    def detect_theme(self, query: str) -> str:
        q = query.lower()
        # Rank themes by keyword matches
        scores = {theme: 0 for theme in self.themes}

        for theme in self.themes:
            # Check if theme name is in query or query has theme start
            if theme in q or (len(theme) > 4 and theme[:4] in q):
                scores[theme] += 2

        # Fallbacks for synonyms and specific keywords
        if any(w in q for w in ["lost", "where to go", "confused", "confusion"]):
            scores["confusion"] = scores.get("confusion", 0) + 1.5
        if any(w in q for w in ["sad", "pain", "heart", "grief", "mourn"]):
            scores["grief"] = scores.get("grief", 0) + 1.5
        if any(w in q for w in ["fear", "scared", "afraid", "anxious"]):
            scores["fear"] = scores.get("fear", 0) + 1.5
        if any(w in q for w in ["fail", "mistake", "defeat"]):
            scores["failure"] = scores.get("failure", 0) + 1.5
        if any(w in q for w in ["betray", "lied", "cheated", "traitor"]):
            scores["betrayal"] = scores.get("betrayal", 0) + 1.5
        if any(w in q for w in ["lonely", "alone", "abandoned", "loneliness"]):
            scores["loneliness"] = scores.get("loneliness", 0) + 1.5
        if any(w in q for w in ["angry", "wrath", "rage", "anger"]):
            scores["anger"] = scores.get("anger", 0) + 1.5

        sorted_themes = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        if sorted_themes and sorted_themes[0][1] > 0:
            return sorted_themes[0][0]

        return "purpose" # Default theme

    def reason(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        theme_key = self.detect_theme(query)
        theme_data = self.themes.get(theme_key, self.themes.get("purpose"))

        primary_verse = context[0] if context else {"text": "Dharma is subtle and eternal.", "kanda": "Universal", "verse": "N/A"}

        # Wisdom Synthesis: Transform retrieved fragment into a Sage's guidance
        reflection = f"In the quiet sanctuary of the heart, the echoes of {theme_key} often resonate. You are not alone in this pilgrimage."

        meaning = (
            f"The scriptures speak of a time when {theme_data['episode']}. "
            f"From this sacred moment, we understand that {theme_data['lesson']} "
            f"Just as the characters of the epic navigated their trials, your own path is illuminated by this truth: '{primary_verse.get('text', '')[:200]}...'"
        )

        context_msg = f"This guidance emerges from the {primary_verse.get('kanda', 'Ramayana')}, reminding us that the human condition is eternal."

        takeaway = theme_data['application']
        if "scriptural insight" in takeaway:
            takeaway = f"When you face {theme_key}, remember {theme_data['lesson'].split('.')[0]}. Let this be your anchor."

        return {
            "reflection": reflection,
            "meaning": meaning,
            "context": context_msg,
            "takeaway": takeaway,
            "source_verse": primary_verse.get("text", "")
        }
