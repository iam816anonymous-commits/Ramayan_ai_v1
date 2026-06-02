import os
import json
import time
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict

from backend.app.models import get_sentence_transformer
from .shloka_loader import ShlokaLoader
from .csv_loader import CSVLoader
from .kanda_loader import KandaLoader
from .txt_loader import TXTLoader
from .metadata_builder import MetadataBuilder
from .knowledge_builder import KnowledgeBuilder

class IngestionPipeline:
    def __init__(self, collection_name="ramayana_v1", client=None):
        # Persist storage to disk
        self.data_dir = "backend/data"
        self.storage_path = os.path.join(self.data_dir, "qdrant_storage")
        self.state_file = os.path.join(self.data_dir, "ingestion_state.json")
        os.makedirs(self.storage_path, exist_ok=True)

        self.client = client or QdrantClient(path=self.storage_path)
        self.collection_name = collection_name
        self.model = get_sentence_transformer()
        self.metadata_builder = MetadataBuilder()
        self.knowledge_builder = KnowledgeBuilder()
        self._setup_collection()

    def _setup_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )

    def _get_state(self):
        if os.path.exists(self.state_file):
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return None

    def _save_state(self, points_count: int):
        state = {
            "version": "1.0",
            "points": points_count,
            "completed": True,
            "timestamp": time.ctime(),
            "embedding_model": "all-MiniLM-L6-v2"
        }
        with open(self.state_file, 'w') as f:
            json.dump(state, f, indent=2)

    def run_ingestion(self, force=False):
        # 1. Check if collection exists and verify via state file
        try:
            state = self._get_state()
            if self.client.collection_exists(self.collection_name):
                collection_info = self.client.get_collection(self.collection_name)

                if not force and state and state.get("completed"):
                    if collection_info.points_count > 0:
                        print(f"Existing collection detected: {self.collection_name}")
                        print(f"Points: {collection_info.points_count}")
                        print("Ready (Skipping Ingestion).")
                        return
        except Exception as e:
            print(f"Checking collection state: {e}")

        if force:
            print(f"Deleting existing collection {self.collection_name} for full re-indexing...")
            self.client.delete_collection(self.collection_name)
            self._setup_collection()

        print("Starting initial ingestion..." if not force else "Forcing re-ingestion...")

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

        # Batched processing for performance
        batch_size = 64
        current_id = 0
        for i in range(0, len(all_normalized_data), batch_size):
            batch_data = all_normalized_data[i:i + batch_size]

            # 1. Enrichment and Metadata Building (CPU)
            unified_objects = []
            for item in batch_data:
                enriched_item = self.knowledge_builder.enrich_item(item)
                unified_obj = self.metadata_builder.build(enriched_item)
                if unified_obj["text"].strip():
                    unified_objects.append(unified_obj)

            if not unified_objects:
                # We still need to account for skipped items if we wanted to maintain absolute indices,
                # but since we filter out empty ones, we'll just use a continuous sequence for Qdrant IDs.
                continue

            # 2. Batched Encoding (Vectorization - Parallelized)
            texts = [obj["text"] for obj in unified_objects]
            # Speedup comes from processing multiple sentences in one model call
            vectors = self.model.encode(texts).tolist()

            # 3. Upsert to Qdrant
            points = []
            for j in range(len(unified_objects)):
                points.append(PointStruct(id=current_id, vector=vectors[j], payload=unified_objects[j]))
                current_id += 1

            self.client.upsert(collection_name=self.collection_name, points=points)

        total_points = self.client.get_collection(self.collection_name).points_count
        self._save_state(total_points)
        print(f"Ingestion complete. Total points: {total_points}")

if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv
    pipeline = IngestionPipeline()
    pipeline.run_ingestion(force=force)
