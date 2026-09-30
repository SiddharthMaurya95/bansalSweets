# ADR 0006: Object Storage and Media Pipeline - S3 with Worker Sharp Processing

## Status

Accepted

## Context

High-resolution dry-fruit and gift-pack imagery is central to conversion. However, serving raw unoptimized images directly from application servers degrades mobile performance, balloons bandwidth costs, and exposes origin servers to denial-of-service risks. Furthermore, direct multipart uploads through application containers consume memory and saturate Node event loops.

## Decision

1. **Direct Uploads via Presigned URLs**:
   - The browser requests a presigned S3 PUT URL with constrained content-type (JPEG/PNG/WebP only; SVG disallowed for user uploads) and max size (10 MB).
   - The browser uploads directly to the S3-compatible bucket (AWS S3, Cloudflare R2, or local MinIO).
2. **Asynchronous Image Processing Pipeline**:
   - Upon upload registration, an `image.process` job is enqueued in BullMQ.
   - Dedicated background workers inspect file magic bytes, strip EXIF metadata, generate blurhash placeholders, and resize into responsive AVIF, WebP, and fallback JPEG variants using `sharp`.
3. **CDN Distribution**:
   - Processed assets are served through a global CDN with immutable 1-year cache headers (`public, max-age=31536000, immutable`).

## Consequences

- Zero image processing overhead on request-handling API threads.
- Maximum visual quality with minimal byte payloads delivered to mobile shoppers.
