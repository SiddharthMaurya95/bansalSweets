# ADR 0007: Payments Architecture - Razorpay Gateway Abstraction and Webhook Source-of-Truth

## Status

Accepted

## Context

Online payment in India relies heavily on UPI (Intent & QR), Net Banking, Rupay/Visa/Mastercard, and mobile wallets. Payment verification must be resilient against dropped client connections, browser closures, network timeouts, duplicate webhook deliveries, and replay attacks. Card security regulations (RBI / PCI-DSS SAQ-A) dictate that raw card information, CVVs, or UPI PINs must never touch our application servers.

## Decision

1. **Gateway Abstraction (`PaymentGateway` interface)**:
   - All payment interactions (create order, verify signature, fetch payment status, process refund) are isolated behind a strongly-typed `PaymentGateway` interface.
   - `RazorpayGateway` implements the live production gateway.
   - `TestGateway` implements exact cryptographic verification with test secrets for automated integration testing, and is excluded from production bundles.
2. **Standard Checkout (SAQ-A Posture)**:
   - The browser opens Razorpay's Standard Checkout SDK directly using a server-created Gateway Order ID (`amount_paise`, `receipt = order_number`).
3. **Webhook as Authoritative Source of Truth**:
   - `POST /webhooks/razorpay` captures raw request body buffers to compute HMAC-SHA256 signatures with constant-time comparison (`crypto.timingSafeEqual`).
   - Webhook events are deduplicated via a unique index on `webhook_events(provider, event_id)`.
   - Client-side callbacks to `POST /payments/verify` provide immediate UI confirmation but fetch the authoritative payment status from the gateway before confirming the order.
4. **Reconciliation Job**:
   - Background worker `payments.reconcile` polls stuck `PAYMENT_PENDING` orders every 5 minutes to detect confirmed payments where neither client callback nor webhook arrived.

## Consequences

- Complete compliance with PCI-DSS SAQ-A.
- Zero lost orders due to dropped client tabs.
- Clean abstraction allowing additional payment providers to be added without modifying order orchestration.
