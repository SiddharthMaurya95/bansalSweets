# ADR 0002: Frontend Framework - Next.js App Router for Web and Admin

## Status

Accepted

## Context

E-commerce retail success for a local brand requires strong technical SEO (crawling of product and category pages), fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP) on mid-range mobile devices on 4G networks, and dynamic client interactivity for shopping carts and checkout flows. The admin application requires a separate bundle, responsive tables, and isolated security headers.

## Decision

1. **Customer Storefront (`apps/web`)**: Next.js App Router (React Server Components by default).
   - Public catalog and informational pages use Incremental Static Regeneration (ISR) with tag-based on-demand invalidation.
   - Client-side interactivity is limited to islands (variant pickers, search combobox, mini-cart, and checkout accordion).
   - Live pricing and stock availability on product pages are refreshed from a lightweight cached live endpoint (`GET /products/:slug/live`) to ensure stale HTML never presents misleading pricing.
2. **Admin Application (`apps/admin`)**: Separate Next.js application deployed on a dedicated subdomain (`admin.<domain>`).
   - Bundle isolation prevents administrative dependencies from leaking into customer page loads.
   - Enables independent IP allow-listing, stricter Content Security Policies, and complete `noindex` enforcement.

## Consequences

- Exceptional SEO and Core Web Vitals on the customer storefront.
- Clean separation of administrative surface and customer surface.
- Frontend never calculates authoritative pricing; Server Components and Client Components consume server quotes.
