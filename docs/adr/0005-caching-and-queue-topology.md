# ADR 0005: Redis Topology - Separate Cache and Queue Instances

## Status

Accepted

## Context

Redis is utilized for two critically different workloads in the platform:

1. **Ephemeral Cache & Rate Limiting**: Read-through cache for catalog listings, autocomplete suggestions, store settings, and sliding-window rate limit counters. When memory limits are reached, keys must be evicted using Least Recently Used (LRU) semantics (`allkeys-lru`).
2. **Asynchronous Background Jobs & Queues (BullMQ)**: Transactional outbox event publishing, notification delivery, image processing, invoice PDF generation, and payment reconciliation. If keys in BullMQ are evicted due to memory pressure, jobs are lost or corrupted, leading to missed notifications or unreconciled orders.

## Decision

We deploy **two distinct Redis instances**:

1. `redis-cache`: Dedicated to read-through caching and rate limiting.
   - Configured with `maxmemory-policy allkeys-lru`.
   - Ephemeral: an outage or flush degrades API latency temporarily without corrupting business state.
2. `redis-queue`: Dedicated exclusively to BullMQ and distributed synchronization locks.
   - Configured with `maxmemory-policy noeviction` and Append-Only File (`appendonly yes`).
   - Eviction of queue keys is strictly prohibited; memory exhaustion produces an explicit error alerting operators.

## Consequences

- Total operational isolation: cache surges during traffic spikes cannot evict or corrupt asynchronous job queues.
- BullMQ runs safely with guaranteed at-least-once job delivery.
