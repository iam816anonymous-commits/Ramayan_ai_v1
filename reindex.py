import sys
import os

# Ensure backend is in path
sys.path.append(os.getcwd())

from backend.ingest.pipeline import IngestionPipeline

def main():
    force = "--force" in sys.argv
    print(f"Manual Reindex Triggered (Force={force})")

    pipeline = IngestionPipeline()
    pipeline.run_ingestion(force=force)

if __name__ == "__main__":
    main()
