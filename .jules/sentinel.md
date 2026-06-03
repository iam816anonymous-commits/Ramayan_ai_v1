## 2025-05-15 - [HIGH] Unprotected Admin Endpoints and Verbose Error Handling
**Vulnerability:** The `/api/admin/reindex` endpoint was publicly accessible without any authentication, allowing anyone to trigger expensive re-indexing operations. Additionally, the API was leaking internal Python exception messages to clients.
**Learning:** Development-focused administrative features are often left unprotected during early stages. In a RAG-based system, re-indexing is a high-cost operation that can be abused for DoS.
**Prevention:** Always implement a token-based or session-based authentication gate for administrative routes. Use generic error messages for client-facing responses while maintaining detailed internal logs.
