# ADR 001: Customer booking and sandbox payments

Status: accepted for development on 2026-10-29.

## Boundaries

Identity verifies Firebase tokens and owns customer profiles. Supply owns listings, availability and 15 minute holds. Booking owns booking state, concierge requests, coupons, reviews, payment attempts, audit and outbox. Services exchange IDs and HTTP contracts; they never read each other's database.

The legal gate for collecting deposits is not complete. Production collection is disabled. Customers may request a booking with payment directly to the partner; SEPay is restricted to sandbox configuration for development. No production payment instructions or merchant account details are shown without a separate product/legal release.

## State machine and invariants

Instant flow: hold inventory, then create `AWAITING_DEPOSIT` with the hold expiry. If no verified payment or manual proof is received by expiry, mark `EXPIRED` and release the hold. A verified sandbox payment changes it to `CONFIRMED`; a submitted proof changes it to `PAYMENT_SUBMITTED` and extends the hold for at most two hours. A rejected proof returns to `AWAITING_DEPOSIT` only if the original hold is valid, otherwise `EXPIRED`. Request bookings start `PENDING_PARTNER`, remind at 30 minutes, escalate at 60 minutes; admin gets another 60 minutes. Confirmation and cancellation require explicit actors and audit entries. Only `COMPLETED` bookings accept one review per customer.

Creation requires a customer identity and idempotency key, unique per customer. Payment callbacks require provider event ID and verified signature, and are deduplicated in the Booking transaction. Each state mutation writes an audit row and outbox event in the same database transaction. A worker delivers outbox events, with retries; expired holds and overdue request bookings are reconciled by a periodic worker. Cross-service calls use a service credential, timeouts and retry-safe keys. Booking must reconcile a succeeded Supply hold if its own transaction fails.

Prices are snapshots from Supply at booking time. Default deposit is 20% per `PROJECT_PLAN.md`; admin-configurable 10% and 30% are future work. A coupon is validated and reserved atomically before discount; one coupon per booking, with time window, minimum subtotal, quota and per-account limits. Cancellation uses the offering's recorded category/policy and start time. Flexible accommodation: 100% before 72h, 50% at 24–72h, 0% below 24h. Flexible tour, transport and spa: 100% before 24h, 50% at 6–24h, 0% below 6h. Laundry: 100% before pickup, otherwise 0%. Partner fault: 100%. Non-refundable: 0% except partner fault. Refund is a separate, audited action and cannot be assumed from a cancellation response.

Payment evidence belongs in private object storage and is accessed only with signed URLs. Until storage and SEPay sandbox secrets are configured, those endpoints fail closed. Never log bearer tokens, personal data, payment payloads or proof content.

## Integration and rollout

OpenAPI in `packages/api-contracts` defines public endpoints. Frontend displays provider configuration errors, loading and empty states. Database migrations run only against a named local/dev database. Before accepting production money, legal review, merchant/partner agreements, refund policy, privacy policy, provider credentials, webhook reachability and reconciliation operations must be approved separately.
