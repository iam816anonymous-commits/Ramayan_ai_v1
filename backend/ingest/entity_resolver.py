import json
import os
from typing import Optional, Dict, List

class EntityResolver:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.entities = self._load_json("entities.json", {"characters": [], "locations": [], "events": []})
        self.aliases = self._load_json("aliases.json", {})

        self.canonical_names = set()
        for category in self.entities:
            for item in self.entities[category]:
                self.canonical_names.add(item["name"].lower())

        self.alias_map = {}
        for canonical, aliases in self.aliases.items():
            for alias in aliases:
                self.alias_map[alias.lower()] = canonical.capitalize()

    def _load_json(self, filename: str, default: any) -> any:
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return default

    def entity_exists(self, entity_name: str) -> bool:
        name_lower = entity_name.lower()
        if name_lower in self.canonical_names:
            return True
        if name_lower in self.alias_map:
            return True
        return False

    def normalize_entity(self, entity_name: str) -> str:
        name_lower = entity_name.lower()
        # Direct match
        for category in self.entities:
            for item in self.entities[category]:
                if name_lower == item["name"].lower():
                    return item["name"]

        # Alias match
        if name_lower in self.alias_map:
            return self.alias_map[name_lower]

        return entity_name

    def validate_entity(self, entity_name: str) -> Dict[str, any]:
        if self.entity_exists(entity_name):
            return {
                "valid": True,
                "normalized": self.normalize_entity(entity_name)
            }
        else:
            return {
                "valid": False,
                "error": "This entity does not exist in my Ramayana knowledge base."
            }

    def extract_potential_entities(self, query: str) -> List[str]:
        """
        Heuristic to find potential entities that might not be in our database.
        Looks for capitalized words or subjects of 'Who is' / 'Tell me about'.
        """
        import re
        potentials = []

        # Pattern 1: Who is [Name]
        match = re.search(r"who is ([A-Z][a-z]+)", query)
        if match:
            potentials.append(match.group(1))

        # Pattern 2: Tell me about [Name]
        match = re.search(r"tell me about ([A-Z][a-z]+)", query)
        if match:
            potentials.append(match.group(1))

        # Pattern 3: capitalized words that aren't at the start (simple proxy for names)
        words = query.split()
        for i, word in enumerate(words):
            if i > 0 and word[0].isupper() and word.lower() not in ["the", "a", "an", "in", "on", "at", "to"]:
                # Clean punctuation
                clean_word = re.sub(r'[^\w]', '', word)
                if clean_word:
                    potentials.append(clean_word)

        return list(set(potentials))
