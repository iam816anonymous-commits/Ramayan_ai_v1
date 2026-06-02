import json
import os
from typing import List, Dict
from .base_loader import BaseLoader

class KandaLoader(BaseLoader):
    def load(self, filepath: str) -> List[Dict]:
        if not os.path.exists(filepath):
            alt_path = os.path.join("backend", "data", os.path.basename(filepath))
            if os.path.exists(alt_path):
                filepath = alt_path
            else:
                return []

        with open(filepath, 'r') as f:
            data = json.load(f)

        normalized_data = []
        for item in data:
            normalized_data.append({
                "text": item.get("translation", ""),
                "translation": item.get("translation", ""),
                "kanda": item.get("book", ""),
                "chapter": item.get("chapter", ""),
                "verse": item.get("verse", ""),
                "word_dictionary": item.get("wordDictionary", ""),
                "source": os.path.basename(filepath),
                "authority": 0.8 # Tier 2
            })
        return normalized_data
