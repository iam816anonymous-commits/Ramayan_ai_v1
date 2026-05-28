import os
import sys
from unittest.mock import MagicMock

# Mock heavy deps
sys.modules['sentence_transformers'] = MagicMock()

from backend.app.ingestion.pipeline import IngestionPipeline

def test_storage_path():
    pipeline = IngestionPipeline(collection_name="test_collection")
    storage_path = os.path.join("backend", "data", "qdrant_storage")
    assert os.path.exists(storage_path)
    print("Persistence path test passed")

if __name__ == "__main__":
    test_storage_path()
