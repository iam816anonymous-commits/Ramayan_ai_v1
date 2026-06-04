import json
import os
import random
from typing import Dict, List, Any

class SageAgent:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.persona = self._load_persona()

    def _load_persona(self) -> Dict[str, Any]:
        path = os.path.join(self.knowledge_dir, "persona.json")
        if os.path.exists(path):
            with open(path, 'r', encoding="utf-8") as f:
                return json.load(f)
        return {
            "transitions": ["..."],
            "sage_voice": {"factual": "...", "moral": "...", "personal": "...", "unknown": "..."}
        }

    def format_response(self, raw_data: Dict[str, Any], intent: str) -> Dict[str, Any]:
        """
        Formats the output into the structured 'Revelation' format with Sage Voice.
        """
        reflection = raw_data.get("reflection", "")

        # Inject Sage Voice if reflection is too short or generic
        # or if it's a standard factual/moral response that needs more 'presence'
        if len(reflection) < 150:
            voice_intro = self.persona["sage_voice"].get(intent, self.persona["sage_voice"]["unknown"])
            transition = random.choice(self.persona["transitions"])
            reflection = f"{voice_intro} {transition} {reflection}"

        return {
            "reflection": reflection,
            "meaning": raw_data.get("meaning", ""),
            "context": raw_data.get("context", ""),
            "takeaway": raw_data.get("takeaway", "")
        }

    def get_full_response(self, query: str, brain_response: Dict[str, Any], intent: str) -> Dict[str, Any]:
        revelation = self.format_response(brain_response, intent)

        return {
            "answer": brain_response.get("meaning", ""),
            "agent": "The Sage",
            "intent": intent,
            "meta": brain_response.get("meta", {}),
            "revelation": revelation,
            "source_verse": brain_response.get("source_verse", "")
        }
