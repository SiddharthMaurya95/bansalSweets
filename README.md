# 🥜 Bansal Foods — Enterprise Mandi E-Commerce Platform

> Production-grade, multi-tier e-commerce and wholesale operations platform engineered for **Bansal Foods**, operating from Fatehpuri, Khari Baoli, Delhi — Asia's largest dry fruit spice mandi.

---

## 🏛️ System Architecture & Monorepo Overview

This repository is structured as a high-performance **pnpm monorepo** managed via **Turborepo**:

```
Bansal_Foods/
├── apps/
│   ├── api/          # Fastify 5 REST API + Transactional Outbox + Redis Cache
│   ├── web/          # Next.js 15 App Router Customer Storefront (Retail & Wholesale)
│   └── admin/        # Next.js 15 Merchant Backoffice (Fulfillment & Batch Desk)
├── packages/
│   ├── db/           # Drizzle ORM Schema (74 tables, migrations & audit trails)
│   ├── shared/       # Domain logic, money math, UUIDv7 & DPDP validators
│   ├── ui/           # React 19 component library (PriceTag, Badges, Modals)
│   └── config/       # Shared TypeScript, ESLint, and Tailwind presets
├── docs/
│   ├── adr/          # Architectural Decision Records (ADRs 001 - 005)
│   └── reports/      # Phase verification reports (Phases 1 through 12)
├── infra/            # Docker configurations and PostgreSQL initialization scripts
└── docker-compose.yml# Production container orchestration stack
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v22.x LTS or higher
- **pnpm**: v9.x or v10.x (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker & Docker Compose**: Optional for containerized deployment

### 1. Installation

```bash
git clone <repository_url>
cd Bansal_Foods
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` into `.env`:

```bash
cp .env.example .env
```

### 3. Local Development Mode

Start all services (Fastify API on `:4000`, Web Storefront on `:3000`, Admin Portal on `:3001`):

```bash
pnpm dev
```

### 4. Running Automated Tests

Run the comprehensive Vitest test suite across all packages:

```bash
pnpm test
```

_Current test metrics: 96 unit, integration, and security tests passing across 18 test suites._

### 5. Production Build

Execute Turborepo parallel compilation:

```bash
pnpm turbo build
```

---

## 🐳 Docker Deployment

To launch the complete production stack (PostgreSQL 16, Redis 7, Fastify API, Outbox Worker, Next.js Web Storefront, and Next.js Admin Portal):

```bash
docker compose up -d --build
```

### Service Map:

| Service                | Endpoint                        | Description                                                       |
| ---------------------- | ------------------------------- | ----------------------------------------------------------------- |
| **Storefront Web**     | `http://localhost:3000`         | Customer shop, checkout, account, and wholesale portal.           |
| **Admin Operations**   | `http://localhost:3001`         | Merchant fulfillment, harvest lot receipt, and review moderation. |
| **Fastify API**        | `http://localhost:4000`         | Core backend REST API, OpenAPI docs, and authentication.          |
| **Health Liveness**    | `http://localhost:4000/healthz` | Process uptime and memory diagnostics.                            |
| **Health Readiness**   | `http://localhost:4000/readyz`  | PostgreSQL and cache engine live connectivity checks.             |
| **Prometheus Metrics** | `http://localhost:4000/metrics` | Prometheus exposition endpoint for monitoring scrapers.           |
| **MinIO Console**      | `http://localhost:9001`         | S3-compatible media object storage console.                       |
| **Mailpit Web UI**     | `http://localhost:8025`         | Development SMTP testing mailbox.                                 |

---

## 🎯 Key Domain Implementations

### 1. Integer Paise Financial System

All currency calculations operate in integer **paise** (`bigint` in PostgreSQL / `number` in TypeScript). Zero floating-point arithmetic is permitted in order calculations.

### 2. Indian GST Compliance (HSN Chapter 08)

- **Place of Supply**: Orders shipping within Delhi (State Code `07`) incur equal **CGST (2.5%) + SGST (2.5%)**.
- **Inter-State**: Orders outside Delhi incur **IGST (5.0%)**.
- **Sequential Tax Invoices**: Generates statutory GST Tax Invoices formatted by Indian financial year (`BF/2627/000001`).

### 3. Mandi Batch Traceability & Safety Buffers

- **Harvest Lots**: Granular traceability of Kashmir and Goa consignments (`batchNumber`, `supplierName`, `grade`, `costPrice`, `bestBeforeDate`, and FSSAI certificate).
- **Safety Buffers**: Protected stock threshold preventing online overselling during busy Fatehpuri market trading hours.
- **Stock Reservation Locks**: 15-minute checkout holds with background worker automated release.

### 4. Digital Personal Data Protection (DPDP) Act 2023

- **Right to Erasure** (`DELETE /api/v1/auth/me`): Soft-deletes patron record, transactional PII anonymization (`deleted_{id}@anonymized...`), and instant session token revocation.
- **Audited Policies**: Accessible `/privacy`, `/terms`, and `/shipping-policy` documents detailing Grievance Officer contacts in Khari Baoli.

---

## 📋 Comprehensive Phase Delivery Summary

- **Phase 1: Foundation, Toolchain & Monorepo Architecture** ✅
- **Phase 2: Database Layer, Schema Architecture & Core Services** ✅
- **Phase 3: Authentication, Session Management & RBAC** ✅
- **Phase 4: Storefront Core UI Components & Design System** ✅
- **Phase 5: Full API Integration & Customer Experience** ✅
- **Phase 6: Checkout, Order Lifecycle & Payments Engine** ✅
- **Phase 7: Inventory, Batch Tracking & Mandi Operations** ✅
- **Phase 8: Admin Portal & Merchant Operations** ✅
- **Phase 9: Customer Reviews, Ratings, Moderation & Social Proof** ✅
- **Phase 10: Performance Optimization, Caching & Observability** ✅
- **Phase 11: Production Hardening, Security Engineering & Compliance** ✅
- **Phase 12: Deployment Readiness, Dockerization & Production Handoff** ✅

---

## 📜 License & Ownership

Copyright © 2026 **Bansal Foods Pvt. Ltd.** Khari Baoli, Fatehpuri, Delhi 110006. All rights reserved.
