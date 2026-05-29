from abc import ABC, abstractmethod
from typing import List, Dict

class BaseLoader(ABC):
    @abstractmethod
    def load(self, filepath: str) -> List[Dict]:
        """Load data from a file and return a list of raw dictionaries."""
        pass
