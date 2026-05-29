import json
import os
from typing import List, Dict
from .base_loader import BaseLoader

class ShlokaLoader(BaseLoader):
    def load(self, filepath: str) -> List[Dict]:
        if not os.path.exists(filepath):
            # Try to find it in data directory if relative path fails
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
                "text": f"{item.get('explanation', '')} {item.get('translation', '')}",
                "kanda": item.get("kanda"),
                "chapter": str(item.get("sarga")),
                "verse": str(item.get("shloka")),
                "shloka_text": item.get("shloka_text"),
                "source": "Valmiki_Ramayan_Shlokas.json"
            })
        return normalized_data
