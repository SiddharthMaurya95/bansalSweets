# ADR 0003: Backend Architecture - Fastify Modular Monolith with Zod and OpenAPI

## Status

Accepted

## Context

The platform requires high performance (p95 < 150 ms for catalog reads, p95 < 300 ms for cart mutations), clear business module boundaries, strict request/response schema validation, and complete OpenAPI 3.1 documentation. While microservices introduce substantial operational overhead for a single-store business, an unstructured monolithic codebase risks severe coupling.

## Decision

We build a **Modular Monolith** using **Fastify** with TypeScript:

1. Fastify was selected for minimal framework overhead, native asynchronous support, low latency, and robust plugin architecture.
2. `fastify-type-provider-zod` ensures request validation schemas in `packages/shared` act as the single source of truth for runtime validation and static TypeScript types.
3. Modules (`catalog`, `cart`, `checkout`, `orders`, `payments`, `inventory`, etc.) interact solely through exported TypeScript service interfaces and domain events. Cross-module database queries are forbidden.
4. OpenAPI 3.1 contracts are automatically compiled from Zod schemas and tested in CI.

## Consequences

- Single deployable backend artifact (`apps/api`) with low operational complexity.
- Testing is rapid and straightforward using Fastify's native `inject()` harness without opening network sockets.
- Clear module boundaries allow any subdomain (e.g. inventory or payments) to be extracted into a standalone service if scaling dictates in the future.
