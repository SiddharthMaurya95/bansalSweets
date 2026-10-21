# Google Search Console Verification & SEO Maintenance Guide

This guide details how to verify Bansal Foods on Google Search Console (GSC), submit the XML sitemap, monitor Core Web Vitals, and ensure indexation across all pages.

---

## 1. Google Search Console Verification Methods

Bansal Foods supports all Google-recommended verification methods.

### Method 1: HTML Meta Tag (Configured in Code)
1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix**: `https://bansalfoods.in`.
3. Select **HTML tag** under "Other verification methods".
4. Copy the verification token (e.g., `google-site-verification=XXXXXXXXXXXXXXXXXXXXX`).
5. Add the token to your environment variables or deployment config:
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="XXXXXXXXXXXXXXXXXXXXX"
   ```
6. In `apps/web/src/app/layout.tsx`, the verification tag is automatically injected:
   ```tsx
   verification: {
     google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'GSC-BANSAL-FOODS-VERIFICATION',
   }
   ```
7. Click **Verify** in Search Console.

---

### Method 2: DNS TXT Record (Recommended for Domain Property)
To verify the entire domain including `bansalfoods.in` and all subdomains:
1. In Search Console, select **Domain property**: `bansalfoods.in`.
2. Google provides a TXT record value such as:
   ```
   google-site-verification=abc123xyz456...
   ```
3. Log into your domain registrar / DNS provider (e.g., Cloudflare, GoDaddy, Namecheap).
4. Add a new **TXT Record**:
   - **Host / Name**: `@` (or leave blank depending on registrar)
   - **Type**: `TXT`
   - **Value**: `google-site-verification=abc123xyz456...`
   - **TTL**: Auto or 3600
5. Wait 5-15 minutes for DNS propagation, then click **Verify** in GSC.

---

### Method 3: HTML File Upload
If Google requests an HTML verification file (e.g. `google1234567890abcdef.html`):
1. Download the file from Google Search Console.
2. Place the file directly in `apps/web/public/` (e.g., `apps/web/public/google1234567890abcdef.html`).
3. Deploy the application.
4. Verify by visiting `https://bansalfoods.in/google1234567890abcdef.html` in your browser.
5. Click **Verify** in Google Search Console.

---

## 2. Submitting the XML Sitemap

Once verified:
1. Navigate to **Sitemaps** in the left sidebar of Google Search Console.
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. The status will display **Success**. Google will crawl:
   - Root homepage (`/`)
   - Category archives (`/category/*`)
   - Product detail pages (`/products/*`)
   - Wholesale inquiries (`/wholesale`)
   - Blog guides (`/blog`, `/blog/*`)
   - Company & policy pages (`/about`, `/contact`, `/shipping-policy`, `/returns`)

---

## 3. Robots.txt Configuration

The live robots file is generated at `https://bansalfoods.in/robots.txt`:
- **Allows**: All public catalog, shop, category, blog, and content pages.
- **Disallows**: Private customer screens (`/account`, `/checkout`, `/api/`, `/*?*q=*`).
- **Declares**: Sitemap location (`https://bansalfoods.in/sitemap.xml`) and Host.

---

## 4. Validating Rich Results & Schema Markup

Bansal Foods includes structured data via JSON-LD:
- **Store / LocalBusiness**: Logo, Khari Baoli address, geocoordinates, opening hours, contact phone, and sameAs links.
- **WebSite**: Sitelinks searchbox action pointing to `/search?q={search_term_string}`.
- **Product**: Price, currency (INR), availability, SKU, brand, and aggregate ratings.
- **BreadcrumbList**: Hierarchical breadcrumb navigation across all pages.
- **Article / BlogPosting**: Structured articles with authors, publication dates, and feature images.
- **FAQPage**: Expandable accordion questions on Shipping and Returns.

### How to test:
1. Open the [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Enter any URL (e.g. `https://bansalfoods.in/products/kashmiri-mamra-almonds`).
3. Confirm that **Product**, **Breadcrumbs**, and **Merchant listings** validate with zero errors.

---

## 5. Monitoring Core Web Vitals (CWV)

In Google Search Console under **Experience > Core Web Vitals**:
- **LCP (Largest Contentful Paint)**: Maintained under 2.5s with optimized 82-quality progressive images, AVIF/WebP formats, and `priority` hero flags.
- **INP (Interaction to Next Paint)**: Kept under 200ms using `touch-action: manipulation` and streamlined React state updates.
- **CLS (Cumulative Layout Shift)**: Maintained at 0.00 by utilizing Next.js image aspect ratios and explicit skeleton placeholders.
