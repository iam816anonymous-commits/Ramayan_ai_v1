# 08 API Reference: Sanctum V1

## Base URL
`http://localhost:8000/api`

## Endpoints

### 1. Unified Query (`POST /sanctum`)
Main entry point for all user inquiries.

**Request Schema:**
```json
{
  "query": "string"
}
```

**Response Schema:**
```json
{
  "answer": "string",
  "agent": "string",
  "intent": "string",
  "meta": {
    "chunks_used": "number",
    "kanda": "string | null",
    "entities": {
      "characters": ["string"],
      "locations": ["string"],
      "events": ["string"]
    },
    "verses": ["string"],
    "sources": ["string"],
    "grounded": "boolean"
  },
  "revelation": {
    "reflection": "string",
    "meaning": "string",
    "context": "string",
    "takeaway": "string"
  },
  "source_verse": "string | null"
}
```

---

### 2. Timeline Explorer (`GET /timeline`)
Retrieves the chronicle of the seven Kandas with their themes and key events.

**Response Schema:**
```json
[
  {
    "id": "string",
    "kanda": "string",
    "title": "string",
    "summary": "string",
    "theme": "string",
    "events": ["string"],
    "journey": "string"
  }
]
```

---

### 3. Knowledge Explorer (`GET /knowledge/{entity_name}`)
Retrieves deep-dive data on a specific entity.

**Response Schema:**
```json
{
  "entity": "string",
  "description": "string",
  "relations": [
    {
      "source": "string",
      "type": "string",
      "target": "string"
    }
  ]
]
```

## Error Codes
| Code | Meaning |
| :--- | :--- |
| **200** | Success |
| **500** | Internal Wisdom Error (API failed to synthesize) |
| **503** | Brain Initializing (Vector store still loading) |
