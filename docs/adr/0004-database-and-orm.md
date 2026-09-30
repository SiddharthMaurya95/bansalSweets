# ADR 0004: Primary Database and ORM - PostgreSQL with Drizzle ORM

## Status

Accepted

## Context

E-commerce transactional integrity is non-negotiable. Inventory reservations, payment capture, order status transitions, and coupon redemptions require ACID transactions, strict constraints, row-level locking (`FOR UPDATE`, `SKIP LOCKED`), and deterministic arithmetic. We need an ORM or query builder that produces predictable SQL, has zero magic, and provides end-to-end type safety.

## Decision

1. **Database**: PostgreSQL 16+ as the single source of truth.
   - Primary keys use UUIDv7 (time-ordered, avoiding B-tree fragmentation while remaining non-sequential).
   - Strict `CHECK` constraints on all non-negative balances: `on_hand_qty >= 0`, `reserved_qty >= 0`, `reserved_qty <= on_hand_qty`, `price_paise <= mrp_paise`.
   - Extensions: `pg_trgm` (trigram search), `unaccent` (normalization), `citext` (case-insensitive codes/emails).
2. **Data Layer**: **Drizzle ORM** with `drizzle-kit` SQL migrations.
   - Drizzle operates as a TypeScript SQL-first layer without runtime overhead or hidden query generators.
   - Critical concurrency paths (e.g., atomic inventory updates, advisory locks for coupon redemption, gapless invoice sequences) use raw SQL statements reviewed with `EXPLAIN (ANALYZE, BUFFERS)`.
   - Forward-only, versioned migrations applied in an isolated pre-deployment step.

## Consequences

- Impossible to oversell stock at the database layer even under catastrophic application defects.
- Full type-safety from database schema to API DTOs.
- Zero ORM query-generation bloat.
