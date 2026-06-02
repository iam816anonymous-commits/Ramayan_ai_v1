import pandas as pd
import os
from typing import List, Dict
from .base_loader import BaseLoader

class CSVLoader(BaseLoader):
    def load(self, filepath: str) -> List[Dict]:
        if not os.path.exists(filepath):
            alt_path = os.path.join("backend", "data", os.path.basename(filepath))
            if os.path.exists(alt_path):
                filepath = alt_path
            else:
                return []

        df = pd.read_csv(filepath)
        normalized_data = []
        for _, row in df.iterrows():
            normalized_data.append({
                "text": str(row.get('translation', '')),
                "translation": str(row.get('translation', '')),
                "kanda": str(row.get('kanda_name', '')),
                "chapter": str(row.get('sarga', '')),
                "verse": str(row.get('verse_ref', '')),
                "shloka_text": str(row.get('shloka', '')),
                "source": os.path.basename(filepath),
                "authority": 0.6 # Tier 3
            })
        return normalized_data
