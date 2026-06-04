import json
import os
import re
from typing import List, Dict, Any, Set
from collections import defaultdict

class KnowledgeGenerator:
    def __init__(self,
                 data_dir: str = "backend/data",
                 knowledge_dir: str = "backend/knowledge"):
        self.data_dir = data_dir
        self.knowledge_dir = knowledge_dir

        # Load curated seeds
        self.entities_seed = self._load_json(os.path.join(knowledge_dir, "entities.json"), {"characters": [], "locations": [], "events": []})
        self.relations_seed = self._load_json(os.path.join(knowledge_dir, "relations.json"), [])
        self.aliases = self._load_json(os.path.join(knowledge_dir, "aliases.json"), {})

        # Load raw data
        self.shlokas_raw = self._load_json(os.path.join(data_dir, "Valmiki_Ramayan_Shlokas.json"), [])

    def _load_json(self, path: str, default: Any) -> Any:
        if os.path.exists(path):
            with open(path, 'r', encoding="utf-8") as f:
                return json.load(f)
        return default

    def _save_json(self, data: Any, filename: str):
        path = os.path.join(self.knowledge_dir, filename)
        with open(path, 'w', encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Generated: {path}")

    def generate_all(self):
        print("Starting Knowledge Generation Engine...")

        # 1. Map entities to aliases for efficient search
        alias_map = {}
        for canonical, aliases in self.aliases.items():
            canonical_cap = canonical.capitalize()
            for a in aliases:
                alias_map[a.lower()] = canonical_cap

        # Add canonical names themselves to the map
        for cat in ["characters", "locations", "events"]:
            for item in self.entities_seed.get(cat, []):
                alias_map[item["name"].lower()] = item["name"]

        # 2. Process Shlokas and Link Entities
        generated_shlokas = []
        entity_to_shlokas = defaultdict(list)

        themes = {
            "Dharma": ["dharma", "righteous", "duty", "moral", "virtue"],
            "Bhakti": ["devotion", "devotee", "bhakti", "worship", "surrender"],
            "Shakti": ["power", "strength", "energy", "shakti", "force"],
            "Yoga": ["yoga", "meditation", "ascetic", "tapas", "serene"],
            "Vairagya": ["dispassion", "detachment", "renunciation", "vairagya"]
        }
        theme_to_shlokas = defaultdict(list)

        for i, s in enumerate(self.shlokas_raw):
            shloka_id = f"{s.get('kanda', 'Unknown')}_{s.get('sarga', 0)}_{s.get('shloka', 0)}"

            # Text to search for entities
            search_text = f"{s.get('explanation', '')} {s.get('translation', '')} {s.get('comments', '')}".lower()

            # Find entities
            found_entities = set()
            for alias, canonical in alias_map.items():
                if re.search(r'\b' + re.escape(alias) + r'\b', search_text):
                    found_entities.add(canonical)

            # Link shloka to entities
            for ent in found_entities:
                entity_to_shlokas[ent].append(shloka_id)

            # Find themes
            found_themes = []
            for theme, keywords in themes.items():
                for kw in keywords:
                    if kw in search_text:
                        theme_to_shlokas[theme].append(shloka_id)
                        found_themes.append(theme)
                        break

            # Build shloka record
            shloka_record = {
                "id": shloka_id,
                "text": s.get("shloka_text"),
                "transliteration": s.get("transliteration"),
                "translation": s.get("translation"),
                "explanation": s.get("explanation"),
                "metadata": {
                    "kanda": s.get("kanda"),
                    "sarga": s.get("sarga"),
                    "verse": s.get("shloka"),
                    "entities": list(found_entities),
                    "themes": found_themes
                }
            }
            generated_shlokas.append(shloka_record)

        # 3. Enrich Entity Profiles
        enriched_entities = {
            "characters": [],
            "locations": [],
            "events": []
        }

        for cat in ["characters", "locations", "events"]:
            for item in self.entities_seed.get(cat, []):
                name = item["name"]
                item["mentions_count"] = len(entity_to_shlokas.get(name, []))
                item["related_shlokas"] = entity_to_shlokas.get(name, [])[:10] # Top 10 for quick lookups
                enriched_entities[cat].append(item)

        # 4. Save Generated Files
        self._save_json(enriched_entities, "generated_entities.json")
        self._save_json(generated_shlokas, "generated_shlokas.json")

        theme_list = []
        for theme, shloka_ids in theme_to_shlokas.items():
            theme_list.append({
                "name": theme,
                "description": f"The theme of {theme} as explored in the Ramayana.",
                "shlokas": shloka_ids[:20]
            })
        self._save_json(theme_list, "generated_themes.json")

        # 5. Wisdom Engine Seed (Daily Wisdom)
        # Select 365 shlokas (or as many as available) for a rotating cycle
        wisdom_pool = [s for s in generated_shlokas if s["translation"] and s["explanation"]]
        self._save_json(wisdom_pool[:365], "wisdom_pool.json")

        report = {
            "status": "success",
            "shlokas_processed": len(generated_shlokas),
            "entities_enriched": sum(len(v) for v in enriched_entities.values()),
            "themes_discovered": len(theme_list),
            "output_directory": self.knowledge_dir
        }
        self._save_json(report, "knowledge_generation_report.json")
        print("Knowledge Generation Complete.")

if __name__ == "__main__":
    gen = KnowledgeGenerator()
    gen.generate_all()
