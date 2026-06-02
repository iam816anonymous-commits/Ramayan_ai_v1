# 42 Top Bugs and Weaknesses: Sanctum V1

## Identified Vulnerabilities and UX Flaws

### 1. The "Total Recall" Grounding Bug (Critical)
*   **Problem:** The system treats every Qdrant result as high-quality scripture.
*   **Impact:** Batman is described as a "Tiger among men" because the system ignores retrieval scores.
*   **Fix:** Implement `if best_score < 0.45: return SacredSilence()`.
*   **Effort:** 10 mins.

### 2. The "Cross-Epic" Contamination (High)
*   **Problem:** Krishna and Arjuna queries return Ramayana verses about royal lineage or trees.
*   **Impact:** Confuses the user about the scope of the system.
*   **Fix:** Add `CROSS_EPIC_BLOCKLIST` to `BrainAgent`.
*   **Effort:** 30 mins.

### 3. Missing Auto-scroll in Timeline (Medium)
*   **Problem:** Timeline highlights the active Kanda, but the user must scroll manually to find it if it's off-screen.
*   **Impact:** High friction for the "Journey tracking" feature.
*   **Fix:** Use `element.scrollIntoView()` in `Timeline.tsx`'s `useEffect`.
*   **Effort:** 1 hour.

### 4. Hardcoded Reveal Durations (Medium)
*   **Problem:** Sequential reveal timings are hardcoded. If the Sage's answer is extremely long, it might overlap or be cut off by the UI.
*   **Impact:** UX glitches on long verses.
*   **Fix:** Calculate timings based on word count.
*   **Effort:** 2 hours.

### 5. Sparse Relationship Registry (Low)
*   **Problem:** Only 13 relations exist in `relations.json`.
*   **Impact:** Most "Thread of Fate" queries fail to find a path.
*   **Fix:** Data entry or ingestion-time extraction.
*   **Effort:** 5 hours.

## Ranked Weakness List

| Rank | Issue | Impact | Difficulty |
| :--- | :--- | :--- | :--- |
| 1 | No Score Threshold | **Critical** | Easy |
| 2 | Cross-Epic Leakage | **High** | Easy |
| 3 | Memoryless Session | **High** | Medium |
| 4 | Entity NER Incompleteness | **High** | Medium |
| 5 | Static UI Scrolling | **Medium** | Easy |
| 6 | Intent Drift (Personal) | **Medium** | Medium |
| 7 | Hardcoded Poetics | **Low** | Easy |
| 8 | Generic 500 Errors | **Low** | Easy |
