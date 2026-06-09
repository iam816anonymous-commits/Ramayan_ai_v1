import os
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional

class DailyWisdomEngine:
    def __init__(self, generated_dir: str = "backend/generated"):
        self.generated_dir = generated_dir
        self.wisdom_file = os.path.join(self.generated_dir, "generated_daily_wisdom.json")
        self.shlokas_file = os.path.join(self.generated_dir, "generated_shlokas.json")

    def get_daily_wisdom(self) -> Optional[Dict[str, Any]]:
        """
        Returns a deterministic shloka based on the current date.
        """
        shlokas = []
        if os.path.exists(self.wisdom_file):
            with open(self.wisdom_file, "r", encoding="utf-8") as f:
                shlokas = json.load(f)
        elif os.path.exists(self.shlokas_file):
            with open(self.shlokas_file, "r", encoding="utf-8") as f:
                shlokas = json.load(f)

        if not shlokas:
            return None

        # Deterministic selection based on date string
        date_str = datetime.now().strftime("%Y-%m-%d")
        hash_val = int(hashlib.md5(date_str.encode()).hexdigest(), 16)
        index = hash_val % len(shlokas)

        return shlokas[index]
