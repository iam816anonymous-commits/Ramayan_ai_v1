from sentence_transformers import SentenceTransformer, CrossEncoder
import threading

_model_cache = {}
_lock = threading.Lock()

def get_sentence_transformer(model_name: str = 'all-MiniLM-L6-v2'):
    with _lock:
        if model_name not in _model_cache:
            print(f"Loading SentenceTransformer: {model_name}")
            _model_cache[model_name] = SentenceTransformer(model_name)
        return _model_cache[model_name]

def get_cross_encoder(model_name: str = 'cross-encoder/ms-marco-MiniLM-L-6-v2'):
    with _lock:
        if model_name not in _model_cache:
            print(f"Loading CrossEncoder: {model_name}")
            _model_cache[model_name] = CrossEncoder(model_name)
        return _model_cache[model_name]
