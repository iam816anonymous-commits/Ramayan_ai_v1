# 23 Release Checklist: Sanctum V1 Ready

## 1. Data Integrity
- [ ] `IngestionPipeline` successfully processed 80k+ points.
- [ ] `backend/data/qdrant_storage` populated and size > 1GB.
- [ ] No unhandled "Various" kanda tags in structured analytical files.
- [ ] `aliases.json` handles Bali/Vali, Angada, and Vasistha.

## 2. Agent Intelligence
- [ ] `Orchestrator` correctly routes "I feel lost" to Personal Agent.
- [ ] `MoralAgent` grounded takeaway logic replaces "one's" with character names.
- [ ] `BrainAgent` returns "Thread of Fate" when two characters are present.
- [ ] `grounded` flag is correctly set to False for out-of-scope queries.

## 3. Frontend Experience
- [ ] `REVELATION_TIMINGS` verified for sequential reveal (0.5s to 8.5s).
- [ ] Sage Aura background reacts to `thinking` vs `idle` states.
- [ ] Whisper Particles moving fluidly without layout shift.
- [ ] `Timeline` highlights Aranya Kanda for Sita's abduction query.
- [ ] `KnowledgeExplorer` modal opens on entity click.

## 4. Stability and Performance
- [ ] API responds to `/api/sanctum` within < 350ms (backend latency).
- [ ] No race conditions during `IngestionPipeline.run_ingestion(force=False)`.
- [ ] Static asset 404s (Geist font) mitigated via `display: swap`.
- [ ] Logging working in `backend/logs/observability.jsonl`.

## 5. Security & Deployment
- [ ] `.gitignore` includes `qdrant_storage/`.
- [ ] CORS limited to production domain (or ready for env-var config).
- [ ] `requirements.txt` includes `pandas`, `qdrant-client`, and `sentence-transformers`.
- [ ] Production build (`npm run build`) successful for frontend.

## Final Approval
- [ ] Retrieval score > 90%
- [ ] Hallucination guards verified
- [ ] All 27 documents in `docs/` complete and accurate.
