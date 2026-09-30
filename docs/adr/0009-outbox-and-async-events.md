# ADR 0009: Transactional Outbox Pattern for Resilient Asynchronous Event Dispatch

## Status

Accepted

## Context

When business actions occur (such as an order being confirmed, payment captured, or inventory reserved), subsequent actions must follow: sending SMS/WhatsApp notifications, invalidating CDN cache tags, generating GST invoices, and updating daily sales rollups. Making synchronous third-party HTTP calls inside a database transaction causes connection pool exhaustion, latency spikes, and partial failures (e.g. database commits but SMS gateway fails, or SMS sends but database rolls back).

## Decision

We implement the **Transactional Outbox Pattern**:

1. During any business mutation, domain events are serialized and inserted into an `outbox_events` table within the same PostgreSQL transaction that modifies core entities.
2. A lightweight background poller (`outbox.dispatch`) queries pending events using `SELECT ... FOR UPDATE SKIP LOCKED` and publishes them to BullMQ queues.
3. BullMQ workers process side effects (notifications, cache revalidations, PDF generation) asynchronously with exponential backoff and dead-letter handling.
4. Consumers are idempotent and utilize deduplication keys.

## Consequences

- Guaranteed at-least-once domain event dispatch.
- Zero network I/O inside database transactions, keeping transaction hold times under 10 ms.
- Resilient recovery: if workers or external providers go down, events accumulate safely in the database outbox and resume upon recovery.
