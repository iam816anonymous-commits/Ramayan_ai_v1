from typing import Dict, Any
from .entity_extractor import EntityExtractor

class MetadataBuilder:
    def __init__(self):
        self.extractor = EntityExtractor()

    def build(self, item: Dict[str, Any]) -> Dict[str, Any]:
        text = item.get("text", "")
        extracted = self.extractor.extract_entities(text)

        # Unified schema for Canonical Source Hierarchy
        unified_object = {
            "text": text,
            "translation": item.get("translation", text),
            "explanation": item.get("explanation", ""),
            "comments": item.get("comments", ""),
            "transliteration": item.get("transliteration", ""),
            "kanda": item.get("kanda", ""),
            "chapter": str(item.get("chapter", "")),
            "verse": str(item.get("verse", "")),
            "source": item.get("source", ""),
            "authority": item.get("authority", 0.6),
            "entities": extracted["characters"],
            "locations": extracted["locations"],
            "events": extracted["events"],
            "themes": [] # Placeholder
        }

        # Keep legacy fields for backward compatibility with agents/UI
        unified_object["character"] = ", ".join(extracted["characters"])
        unified_object["location"] = ", ".join(extracted["locations"])
        unified_object["shloka_text"] = item.get("shloka_text", "")

        return unified_object
