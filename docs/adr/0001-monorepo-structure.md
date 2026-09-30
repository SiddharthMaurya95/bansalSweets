# ADR 0001: Monorepo Architecture with pnpm Workspaces and Turborepo

## Status

Accepted

## Context

Bansal Foods platform consists of multiple interacting components:

1. Customer storefront (`apps/web`)
2. Store administration portal (`apps/admin`)
3. REST API & business engine (`apps/api`)
4. Shared domain logic, money utilities, error envelopes, and Zod schemas (`packages/shared`)
5. Shared UI tokens, components, and presets (`packages/ui`, `packages/config`)
6. Database client, schemas, and migrations (`packages/db`)

We require fast local development cycles, strictly shared TypeScript types between frontend and backend, atomic commits across contracts, and incremental cached CI pipelines.

## Decision

We adopt a monorepo architecture managed with **pnpm workspaces** and **Turborepo** (`turbo`):

- `pnpm` was chosen for strict dependency resolution (preventing phantom dependencies) and disk/installation speed.
- `turbo` was selected for pipeline orchestration, topological task execution, and intelligent build/test artifact caching.

## Consequences

- Single version of shared utilities across all applications.
- Type errors in API contracts immediately flag downstream compile errors in Next.js apps.
- CI pipeline executes build and test tasks in parallel with dependency-aware caching.
