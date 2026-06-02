# 21 Security and Privacy: Sanctum Audit

## Environment and Secrets
**Finding:** Sanctum V1 currently has **Zero External Dependencies** that require API keys.
*   No OpenAI/Gemini/Anthropic keys.
*   No Cloud DB credentials (local Qdrant).
*   No hardcoded secrets were found in the codebase map.

## Input Validation
*   **Current State:** The `QueryRequest` pydantic model enforces that the `query` is a string.
*   **Risk:** Extremely long strings (> 10k characters) could cause high CPU load during embedding.
*   **Recommendation:** Implement a character limit (e.g., 500 characters) on the FastAPI endpoint.

## Prompt Injection Exposure
*   **Audit:** Since the system uses deterministic synthesis (hardcoded templates) rather than passing the query into a generative LLM system prompt, **Direct Prompt Injection is impossible**.
*   **Mitigation:** The system never "executes" user input as instructions.

## Data Leakage
*   **Audit:** The system only returns scriptural context. No private user data is stored or retrieved.
*   **Log Risk:** `backend/logs/observability.jsonl` stores raw user queries. If users input private info (PII), it will be logged.
*   **Recommendation:** Implement a PII scrubber in the `log_query` function if deploying for public web use.

## CORS Configuration
*   **Current State:** `allow_origins=["*"]` in `main.py`.
*   **Risk:** High. Allows any website to call the API.
*   **Recommendation:** Restricted to specific domain (e.g., `sanctum.app`) for production.

## Authentication and Authorization
*   **Current State:** None. The API is open.
*   **Risk:** Potential for denial-of-service via query spamming.
*   **Recommendation:** Implement lightweight JWT or API Key authentication for the frontend-to-backend connection.

## Summary of Risks

| Risk | Level | Recommendation |
| :--- | :--- | :--- |
| CORS Origin Wildcard | **Medium** | Restricted to `DOMAIN_NAME` |
| Large String DoS | **Low** | Implement `len(query) < 500` check |
| Logged PII | **Low** | Add query scrubbing logic |
| Unauthorized Access | **Low** | Add API Key or JWT |
