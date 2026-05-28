import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from typing import List, Dict

from .shloka_loader import ShlokaLoader
from .csv_loader import CSVLoader
from .kanda_loader import KandaLoader
from .txt_loader import TXTLoader
from .metadata_builder import MetadataBuilder

class IngestionPipeline:
    def __init__(self, collection_name="ramayana_v1"):
        # Persist storage to disk
        storage_path = os.path.join("backend", "data", "qdrant_storage")
        os.makedirs(storage_path, exist_ok=True)
        self.client = QdrantClient(path=storage_path)
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.metadata_builder = MetadataBuilder()
        self._setup_collection()

    def _setup_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )

    def run_ingestion(self, force=False):
        # Check if collection already has data
        try:
            collection_info = self.client.get_collection(self.collection_name)
            if collection_info.points_count > 0 and not force:
                print(f"Brain already contains {collection_info.points_count} points. Skipping ingestion.")
                return
        except Exception:
            pass

        print("Starting unified ingestion pipeline...")

        loaders = {
            "Valmiki_Ramayan_Shlokas.json": ShlokaLoader(),
            "ramayana_shloka_dataset.csv": CSVLoader(),
            "BalaKanda.json": KandaLoader(),
            "AyodhyaKanda.json": KandaLoader(),
            "AranyaKanda.json": KandaLoader(),
            "KishkindhaKanda.json": KandaLoader(),
            "SundaraKanda.json": KandaLoader(),
            "YuddhaKanda.json": KandaLoader(),
            "ramayan.txt": TXTLoader(),
        }

        all_normalized_data = []
        data_dir = "backend/data"

        for filename, loader in loaders.items():
            filepath = os.path.join(data_dir, filename)
            if not os.path.exists(filepath):
                print(f"Warning: {filename} not found in {data_dir}. Skipping.")
                continue

            print(f"Loading {filename}...")
            data = loader.load(filepath)

            # In Sanctum V1 Whole-Brain Mode, we load everything.
            all_normalized_data.extend(data)
            print(f"Loaded {len(data)} records from {filename}")

        print(f"Processing {len(all_normalized_data)} total records...")

        points = []
        for i, item in enumerate(all_normalized_data):
            unified_obj = self.metadata_builder.build(item)

            if not unified_obj["text"].strip():
                continue

            vector = self.model.encode(unified_obj["text"]).tolist()
            points.append(PointStruct(id=i, vector=vector, payload=unified_obj))

            if len(points) >= 100:
                self.client.upsert(collection_name=self.collection_name, points=points)
                points = []

        if points:
            self.client.upsert(collection_name=self.collection_name, points=points)

        print(f"Ingestion complete. Total points: {len(all_normalized_data)}")

if __name__ == "__main__":
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()
