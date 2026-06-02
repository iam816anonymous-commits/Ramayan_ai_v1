import re
from typing import List, Dict
from .base_loader import BaseLoader

class TXTLoader(BaseLoader):
    def __init__(self):
        self.kanda_map = {
            "BOOK I.": "Bala Kanda",
            "BOOK II.": "Ayodhya Kanda",
            "BOOK III.": "Aranya Kanda",
            "BOOK IV.": "Kishkindha Kanda",
            "BOOK V.": "Sundara Kanda",
            "BOOK VI.": "Yuddha Kanda",
        }

    def load(self, filepath: str) -> List[Dict]:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Split by Book first to track Kanda
        books = re.split(r'(BOOK [IVXLC]+\.)', content)

        normalized_data = []
        current_kanda = "Universal"

        for b_idx in range(len(books)):
            b_chunk = books[b_idx].strip()
            if not b_chunk:
                continue

            if b_chunk in self.kanda_map:
                current_kanda = self.kanda_map[b_chunk]
                continue

            # Split by Canto
            cantos = re.split(r'(Canto [IVXLC0-9]+\..*)', b_chunk)
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
                        "kanda": current_kanda,
                        "chapter": current_canto,
                        "verse": "Various",
                        "source": "Griffith Translation (ramayan.txt)"
                    })

        return normalized_data
