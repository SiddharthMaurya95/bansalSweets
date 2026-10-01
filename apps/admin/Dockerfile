# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Dependencies Stage ──
FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/

RUN pnpm install --frozen-lockfile

# ── Build Stage ──
FROM dependencies AS builder
COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BUILD_STANDALONE=true
RUN pnpm --filter @bansal/shared build && \
    pnpm --filter @bansal/ui build && \
    pnpm --filter @bansal/admin build

# ── Production Runner ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

USER node

# Copy standalone build
COPY --chown=node:node --from=builder /app/apps/admin/.next/standalone ./
COPY --chown=node:node --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static

EXPOSE 3001

CMD ["node", "apps/admin/server.js"]
