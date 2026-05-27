import re
from typing import List, Dict
from .base_loader import BaseLoader

class TXTLoader(BaseLoader):
    def load(self, filepath: str) -> List[Dict]:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Split by Canto
        cantos = re.split(r'(Canto [IVXLC0-9]+\..*)', content)

        normalized_data = []
        current_canto = "Intro"

        for i in range(len(cantos)):
            chunk = cantos[i].strip()
            if not chunk:
                continue

            if re.match(r'Canto [IVXLC0-9]+\..*', chunk):
                current_canto = chunk
                continue

            # Sub-chunk the canto if it's too long (e.g. by double newline)
            sub_chunks = chunk.split('\n\n')
            for sc in sub_chunks:
                text = sc.strip()
                if len(text) < 100:
                    continue

                normalized_data.append({
                    "text": text,
                    "kanda": self._infer_kanda(current_canto),
                    "chapter": current_canto,
                    "verse": "Various",
                    "source": "Griffith Translation (ramayan.txt)"
                })

        return normalized_data

    def _infer_kanda(self, canto_title: str) -> str:
        # Very basic heuristic or just return Universal
        return "Universal"
