import json
import os
import re
from typing import Optional, Dict, List

class EntityResolver:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.entities = self._load_json("entities.json", {"characters": [], "locations": [], "events": []})
        self.aliases = self._load_json("aliases.json", {})

        self.canonical_names = set()
        self.char_profiles = {}
        for category in self.entities:
            for item in self.entities[category]:
                name_lower = item["name"].lower()
                self.canonical_names.add(name_lower)
                if category == "characters":
                    self.char_profiles[name_lower] = item

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

        # Basic fuzzy matching (substring)
        for name in self.canonical_names:
            if name in name_lower or name_lower in name:
                return True

        return False

    def normalize_entity(self, entity_name: str) -> str:
        name_lower = entity_name.lower()

        # Direct match
        if name_lower in self.canonical_names:
            for category in self.entities:
                for item in self.entities[category]:
                    if name_lower == item["name"].lower():
                        return item["name"]

        # Alias match
        if name_lower in self.alias_map:
            return self.alias_map[name_lower]

        # Fuzzy match
        for name in self.canonical_names:
            if name in name_lower or name_lower in name:
                # Return the canonical name
                for category in self.entities:
                    for item in self.entities[category]:
                        if name == item["name"].lower():
                            return item["name"]

        return entity_name

    def get_profile(self, entity_name: str) -> Optional[Dict]:
        normalized = self.normalize_entity(entity_name).lower()
        return self.char_profiles.get(normalized)

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
        import re
        potentials = []

        # Patterns
        patterns = [
            r"who is ([A-Z][a-z]+)",
            r"tell me about ([A-Z][a-z]+)",
            r"where is ([A-Z][a-z]+)",
            r"what is ([A-Z][a-z]+)"
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, query, re.IGNORECASE)
            for match in matches:
                potentials.append(match.group(1))

        # Capitalized words logic
        words = query.split()
        for i, word in enumerate(words):
            clean_word = re.sub(r'[^\w]', '', word)
            if not clean_word: continue

            if i > 0 and clean_word[0].isupper() and clean_word.lower() not in ["the", "a", "an", "in", "on", "at", "to", "of", "and"]:
                potentials.append(clean_word)

        return list(set(potentials))
