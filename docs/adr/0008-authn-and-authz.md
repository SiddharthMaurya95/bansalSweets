# ADR 0008: Authentication and Authorization - Argon2id, Rotating Refresh Tokens, and Server-Side RBAC

## Status

Accepted

## Context

E-commerce platforms require seamless guest browsing and checkout while securing registered customer accounts, customer addresses, payment histories, and administrative back-office capabilities. Session hijacking, token theft, credential stuffing, and insecure direct object references (IDOR) are primary security risks.

## Decision

1. **Password Hashing**:
   - Argon2id with OWASP-recommended parameters (memory cost 64 MB, time cost 3 iterations, parallelism 1) generating unique salts per user.
2. **Session Architecture**:
   - Short-lived Access JWTs (15 min for customers, 10 min for admin staff).
   - Opaque Rotating Refresh Tokens stored hashed in `refresh_tokens` with a `family_id`.
   - Stored in `HttpOnly; Secure; SameSite=Lax` cookies.
   - **Reuse Detection**: If an already-rotated refresh token is replayed, the entire token family is immediately revoked, forcing re-authentication.
   - **Instant Revocation**: JWT payload contains `token_version` validated against a short-TTL Redis cache; bumping `token_version` terminates all active sessions instantly.
3. **Role-Based Access Control (RBAC)**:
   - Permissions are structured as `resource:action` (e.g. `order:refund`, `product:write`).
   - Permissions are evaluated server-side on every admin request via `requirePermission(...)` middleware and never embedded in JWTs.
   - Customer endpoints enforce resource ownership in repositories (`WHERE user_id = $actor_id`) to eliminate IDOR vulnerabilities.
   - Administrative and customer sessions use separate cookie names and audience validations.

## Consequences

- Protection against Cross-Site Scripting (XSS) token theft via HttpOnly cookies.
- Real-time session revocation capability.
- Comprehensive authorization guarantees tested at build time.
