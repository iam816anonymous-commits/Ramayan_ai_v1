import os
import json
import hashlib
import time
from typing import List, Dict, Any

class KnowledgeGenerator:
    def __init__(self, data_dir: str = "backend/data", knowledge_dir: str = "backend/knowledge", generated_dir: str = "backend/generated"):
        self.data_dir = data_dir
        self.knowledge_dir = knowledge_dir
        self.generated_dir = generated_dir
        self.hash_file = os.path.join(self.generated_dir, "source_hashes.json")
        self.report_file = os.path.join(self.generated_dir, "knowledge_generation_report.json")

        os.makedirs(self.generated_dir, exist_ok=True)
        self.current_hashes = self._load_hashes()
        self.stats = {
            "start_time": time.time(),
            "files_processed": 0,
            "generated_artifacts": []
        }

    def _calculate_file_hash(self, filepath: str) -> str:
        sha256_hash = hashlib.sha256()
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def _load_hashes(self) -> Dict[str, str]:
        if os.path.exists(self.hash_file):
            try:
                with open(self.hash_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _save_hashes(self, hashes: Dict[str, str]):
        with open(self.hash_file, "w", encoding="utf-8") as f:
            json.dump(hashes, f, indent=2)

    def should_regenerate(self) -> bool:
        """
        Detects if any source data has changed by comparing file hashes.
        Returns True if regeneration is needed.
        """
        source_files = []
        # Check backend/data
        if os.path.exists(self.data_dir):
            for f in os.listdir(self.data_dir):
                if f.endswith(('.json', '.csv', '.txt')) and f != "ingestion_state.json":
                    source_files.append(os.path.join(self.data_dir, f))

        # Check backend/knowledge
        if os.path.exists(self.knowledge_dir):
            for f in os.listdir(self.knowledge_dir):
                if f.endswith('.json'):
                    source_files.append(os.path.join(self.knowledge_dir, f))

        new_hashes = {}
        changed = False

        for filepath in source_files:
            file_hash = self._calculate_file_hash(filepath)
            new_hashes[filepath] = file_hash
            self.stats["files_processed"] += 1
            if self.current_hashes.get(filepath) != file_hash:
                changed = True

        # Also check if any file was deleted
        if len(new_hashes) != len(self.current_hashes):
             # But only if it was a file we previously tracked
             for tracked_file in self.current_hashes:
                 if tracked_file not in new_hashes:
                     changed = True
                     break

        self.pending_hashes = new_hashes
        return changed or not os.path.exists(self.report_file)

    def generate(self, force: bool = False):
        regenerate_needed = self.should_regenerate()
        if not force and not regenerate_needed:
            print("Knowledge sources unchanged. Skipping generation.")
            return

        print("Generating knowledge artifacts...")

        self.generate_entities()
        self.generate_locations()
        self.generate_events()
        self.generate_relations()
        self.generate_themes()
        self.generate_shlokas()
        self.generate_daily_wisdom()

        self.write_report()
        self._save_hashes(self.pending_hashes)
        print("Knowledge generation complete.")

    def _load_knowledge_json(self, filename: str, default: Any) -> Any:
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return default

    def generate_entities(self):
        entities_data = self._load_knowledge_json("entities.json", {"characters": []})
        characters = entities_data.get("characters", [])

        output_path = os.path.join(self.generated_dir, "generated_entities.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(characters, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_entities.json")
        self.stats["total_characters"] = len(characters)

    def generate_locations(self):
        entities_data = self._load_knowledge_json("entities.json", {"locations": []})
        locations = entities_data.get("locations", [])

        output_path = os.path.join(self.generated_dir, "generated_locations.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(locations, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_locations.json")
        self.stats["total_locations"] = len(locations)

    def generate_events(self):
        entities_data = self._load_knowledge_json("entities.json", {"events": []})
        events = entities_data.get("events", [])

        output_path = os.path.join(self.generated_dir, "generated_events.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(events, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_events.json")
        self.stats["total_events"] = len(events)

    def generate_relations(self):
        relations = self._load_knowledge_json("relations.json", [])

        output_path = os.path.join(self.generated_dir, "generated_relations.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(relations, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_relations.json")
        self.stats["total_relations"] = len(relations)

    def generate_themes(self):
        personal_themes = self._load_knowledge_json("personal_themes.json", {})
        dharma_lessons = self._load_knowledge_json("dharma_lessons.json", [])

        themes = {
            "personal": personal_themes,
            "dharma": dharma_lessons
        }

        output_path = os.path.join(self.generated_dir, "generated_themes.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(themes, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_themes.json")
        self.stats["total_themes"] = len(personal_themes) + len(dharma_lessons)

    def generate_shlokas(self):
        # We need to use existing loaders to aggregate shlokas
        from .shloka_loader import ShlokaLoader
        from .csv_loader import CSVLoader
        from .kanda_loader import KandaLoader

        loaders = {
            "Valmiki_Ramayan_Shlokas.json": ShlokaLoader(),
            "ramayana_shloka_dataset.csv": CSVLoader(),
            "BalaKanda.json": KandaLoader(),
            "AyodhyaKanda.json": KandaLoader(),
            "AranyaKanda.json": KandaLoader(),
            "KishkindhaKanda.json": KandaLoader(),
            "SundaraKanda.json": KandaLoader(),
            "YuddhaKanda.json": KandaLoader(),
        }

        all_shlokas = []
        for filename, loader in loaders.items():
            filepath = os.path.join(self.data_dir, filename)
            if os.path.exists(filepath):
                data = loader.load(filepath)
                all_shlokas.extend(data)

        output_path = os.path.join(self.generated_dir, "generated_shlokas.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(all_shlokas, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_shlokas.json")
        self.stats["total_shlokas"] = len(all_shlokas)
        self.all_shlokas = all_shlokas # Keep for daily wisdom

    def generate_daily_wisdom(self):
        if not hasattr(self, 'all_shlokas'):
            self.generate_shlokas()

        daily_wisdom = self.all_shlokas[:100]

        output_path = os.path.join(self.generated_dir, "generated_daily_wisdom.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(daily_wisdom, f, indent=2, ensure_ascii=False)

        self.stats["generated_artifacts"].append("generated_daily_wisdom.json")

    def write_report(self):
        self.stats["end_time"] = time.time()
        self.stats["duration"] = self.stats["end_time"] - self.stats["start_time"]
        self.stats["timestamp"] = time.ctime()

        with open(self.report_file, "w", encoding="utf-8") as f:
            json.dump(self.stats, f, indent=2)
        print(f"Report written to {self.report_file}")
