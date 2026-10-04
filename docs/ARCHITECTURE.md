# Architecture Specification: Bansal Foods Platform

## 1. System Overview

Bansal Foods is an e-commerce platform modernising an established retail and wholesale dry-fruit business located in Khari Baoli, Delhi (110006).

### Priority Order (Section 0.1)

1. **Security**
2. **Correctness**
3. **Reliability**
4. **Performance**
5. **Maintainability**
6. **Scalability**
7. **User Experience**
8. **SEO**
9. **Visual Polish**

---

## 2. Runtime Topology

```
                ┌────────────── CDN + WAF (Cloudflare or CloudFront) ───────────────┐
 Browser  ─────►│ static assets, optimised images, cacheable HTML/JSON, bot rules   │
                └───────┬──────────────────────────────────────┬────────────────────┘
                        │                                      │
               ┌────────▼────────┐                    ┌────────▼────────┐
               │ web (Next.js)   │                    │ admin (Next.js) │  admin.<domain>
               │ SSR / ISR       │                    └────────┬────────┘
               └────────┬────────┘                             │
                        └───────────────┬──────────────────────┘
                                        ▼   REST  /api/v1  (JSON)
                             ┌────────────────────┐
                             │ api (Fastify)      │  stateless, ≥ 2 instances in prod
                             │ modular monolith   │
                             └──┬──────┬───────┬──┘
                ┌───────────────┘      │       └────────────────┐
                ▼                      ▼                        ▼
        PostgreSQL primary      Redis (cache, rate      Redis (queues, BullMQ,
        (+ read replica later)   limits, locks)          noeviction)
                ▲                                                │
                │                                        ┌───────▼────────┐
                └────────────────────────────────────────┤ worker(s) +    ├──► Razorpay, Email/SMS/WhatsApp, S3
                                                         │ scheduler      │
                                                         └────────────────┘
```

### Components

1. **Storefront (`apps/web`)**: Next.js App Router providing Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR) with tag-based on-demand revalidation.
2. **Admin Portal (`apps/admin`)**: Dedicated Next.js application on a distinct subdomain with role-gated interfaces, noindex directives, and strict session lifetimes.
3. **Backend API (`apps/api`)**: Modular monolith REST API built on Fastify with Zod type validation and OpenAPI 3.1 contract generation.
4. **Background Worker & Scheduler**: BullMQ consumers processing asynchronous tasks: outbox dispatch, image optimization, invoice PDF generation, payment reconciliation, inventory expiration, and daily analytics rollups.
5. **Primary Datastore**: PostgreSQL 16+ utilizing `pg_trgm`, `unaccent`, and `citext`.
6. **Cache & Rate Limiting**: Redis instance configured with `maxmemory-policy allkeys-lru`.
7. **Queues & Distributed Locks**: Dedicated Redis instance configured with `maxmemory-policy noeviction`.
8. **Media Storage**: S3-compatible object storage with CDN distribution and server-side Sharp pipeline.

---

## 3. Consistency Model & Data Invariants

1. **Single Source of Truth**: PostgreSQL is the authoritative datastore. Redis functions strictly as an ephemeral cache and queue mechanism; losing Redis must never corrupt business records.
2. **Transaction Boundaries**:
   - Stock reservation, coupon redemption, order creation, and payment ledger updates occur strictly inside database transactions.
   - External network calls (Payment Gateway, SMS, Email, S3) are **strictly forbidden** inside open database transactions.
3. **Transactional Outbox**: Cross-module domain events are inserted into `outbox_events` in the same database transaction as the business operation, then polled and dispatched asynchronously.
4. **Authoritative Backend Pricing**: Frontends never compute final money values. All pricing, discounts, tax splits, and delivery rates are purely deterministic evaluations from `PricingService.quote()`.
5. **Exact Integer Arithmetic**:
   - All money is stored as integer paise (`bigint` or integer).
   - Taxes are computed using statutory integer basis points (`taxRateBps`, e.g., 500 = 5.00%).
   - Discount allocations across line items enforce the **largest-remainder method** ensuring `sum(allocated) === total_discount`.

---

## 4. Modular Monolith Boundaries

Modules interact exclusively through public service interfaces (`index.ts`) or via domain events:

- `identity`: User authentication, session management, rotating refresh tokens, RBAC.
- `catalog`: Categories, brands, products, variants, attributes, collections.
- `search`: PostgreSQL FTS + Trigram typo-tolerance + transliteration synonyms.
- `pricing`: Pure deterministic calculation engine for line items, taxes, discounts, delivery.
- `cart`: Server-side guest/user carts with optimistic concurrency (`version`).
- `checkout`: Orchestration of idempotency, stock reservation, and gateway order creation.
- `orders`: Immutable order state machine, timeline, invoices, and sequence locks.
- `payments`: Payment gateway abstraction (Razorpay), cryptographic verification, reconciliation.
- `inventory`: Variant and gram-pool inventory, atomic conditional updates preventing overselling, immutable ledger.
- `coupons`: Validation, scope filtering, and concurrency-safe redemption counters.
- `delivery`: Pincode/area/distance zone resolution, cutoff times, serviceability.
- `customers`: Profiles, DPDP consent tracking, addresses, GDPR/DPDP export/erasure.
- `notifications`: Multi-channel provider abstraction (Email, DLT SMS, WhatsApp).
- `analytics`: Pre-aggregated daily rollup tables updated asynchronously.
- `audit`: Append-only audit trail with actor, before/after diffs, and request tracking.
- `settings`: Centralized store settings validated by Zod schemas.

---

## 5. Security Posture

- OWASP ASVS Level 2 baseline.
- Passwords hashed using Argon2id with unique salts.
- Refresh tokens rotated with family reuse detection (revoking compromised sessions immediately).
- Cryptographic verification of all Razorpay webhook signatures using raw request buffers and constant-time comparison.
- Strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and partitioned HttpOnly SameSite=Lax cookies.
- Comprehensive PII and credential redaction across all JSON application logs.
