import json
import pandas as pd
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import os

class IngestionPipeline:
    def __init__(self, collection_name="ramayana_v1"):
        self.client = QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self._setup_collection()

    def _setup_collection(self):
        self.client.recreate_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    def load_json_data(self, filepath):
        if not os.path.exists(filepath):
            # Try alternative path
            alt_path = os.path.join("backend", "data", os.path.basename(filepath))
            if os.path.exists(alt_path):
                filepath = alt_path
            else:
                raise FileNotFoundError(f"Data file not found: {filepath}")

        with open(filepath, 'r') as f:
            return json.load(f)

    def process_valmiki_shlokas(self, data):
        points = []
        for i, item in enumerate(data):
            text_to_embed = f"{item.get('explanation', '')} {item.get('translation', '')}"
            if not text_to_embed.strip():
                continue

            vector = self.model.encode(text_to_embed).tolist()
            payload = {
                "kanda": item.get("kanda"),
                "sarga": item.get("sarga"),
                "shloka": item.get("shloka"),
                "text": item.get("shloka_text"),
                "explanation": item.get("explanation"),
                "translation": item.get("translation"),
                "comments": item.get("comments")
            }
            points.append(PointStruct(id=i, vector=vector, payload=payload))

            if len(points) >= 100:
                self.client.upsert(collection_name=self.collection_name, points=points)
                points = []

        if points:
            self.client.upsert(collection_name=self.collection_name, points=points)

    def run_ingestion(self):
        print("Starting ingestion...")
        data = self.load_json_data("Valmiki_Ramayan_Shlokas.json")
        self.process_valmiki_shlokas(data[:1000])
        print(f"Ingested 1000 records into {self.collection_name}")

if __name__ == "__main__":
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()

    count = pipeline.client.get_collection(collection_name="ramayana_v1").points_count
    print(f"Total points in collection: {count}")
