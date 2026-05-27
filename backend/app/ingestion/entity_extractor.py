import json
import os
from typing import List, Dict, Set

class EntityExtractor:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.entities = self._load_json("entities.json", {"characters": [], "locations": [], "events": []})
        self.relations = self._load_json("relations.json", [])
        self.aliases = self._load_json("aliases.json", {})

        # Flatten entities for easier lookup
        self.canonical_names = {
            "characters": [c["name"] for c in self.entities.get("characters", [])],
            "locations": [l["name"] for l in self.entities.get("locations", [])],
            "events": [e["name"] for e in self.entities.get("events", [])]
        }

    def _load_json(self, filename: str, default: any) -> any:
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return default

    def resolve_entity(self, name: str) -> str:
        name_lower = name.lower()
        # Direct match
        for category in self.canonical_names:
            for canonical in self.canonical_names[category]:
                if name_lower == canonical.lower():
                    return canonical

        # Alias match
        for canonical, aliases in self.aliases.items():
            if name_lower in aliases:
                return canonical.capitalize()
        return name

    def get_relations(self, entity_name: str) -> List[Dict]:
        canonical = self.resolve_entity(entity_name)
        return [r for r in self.relations if r["source"] == canonical or r["target"] == canonical]

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        found = {
            "characters": [],
            "locations": [],
            "events": []
        }
        text_lower = text.lower()

        for category, names in self.canonical_names.items():
            for name in names:
                # Check canonical
                if name.lower() in text_lower:
                    found[category].append(name)
                else:
                    # Check aliases
                    canonical_key = name.lower()
                    if canonical_key in self.aliases:
                        for alias in self.aliases[canonical_key]:
                            if alias in text_lower:
                                found[category].append(name)
                                break

        # Remove duplicates
        for cat in found:
            found[cat] = list(set(found[cat]))

        return found
