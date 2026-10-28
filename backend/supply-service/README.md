# Supply Service

Supply owns listings, offerings, dated inventory slots, and holds in the `supply` PostgreSQL schema. Admins create and publish inventory. Public readers only see published listings and active offerings. There is no sample inventory in this service.

## Local configuration

- `SUPPLY_DATABASE_URL`: PostgreSQL connection using `?schema=supply`.
- `SUPPLY_SERVICE_KEY`: private key shared with Booking Service for hold creation and transitions.
- `SUPPLY_ADMIN_KEY`: private admin API key for pilot inventory management. Do not expose it to browser clients.

Keys are required; an unset key rejects protected requests. Run `pnpm --filter @pqlc/supply-service prisma:generate` after installing dependencies. Apply the service-owned migration only to the selected local or development database; never run it automatically against production.

## API

All paths start with `/v1`.

- `GET /listings` filters by `category` (`STAY`, `TOUR`, `TRANSPORT`, `SPA`, `LAUNDRY`), `query`, `area`, `date` (YYYY-MM-DD in Phú Quốc time), `minPriceVnd`, `maxPriceVnd`, and `guests`.
- `GET /listings/:id` returns one published listing, offerings, and future slots.
- `POST /holds` requires `X-Service-Key` and `{offeringId,dateTime,quantity,idempotencyKey,bookingId?}`. The exact date-time must exist as an unblocked slot. The reply includes `id`, `expiresAt`, `unitPriceVnd`, `totalPriceVnd`, `category`, `cancellationPolicy`, `partnerRef`, and `status`. The trusted partner reference lets Booking validate the coupon sponsor. This is a 15-minute inventory hold, not a confirmed booking.
- `POST /holds/:id/confirm`, `/release`, and `/extend` require `X-Service-Key`. Extend succeeds at most once while active and unexpired, for up to two hours.
- `POST /admin/listings`, `PATCH /admin/listings/:id`, `POST /admin/listings/:id/offerings`, and `POST /admin/offerings/:id/slots` require `X-Admin-Key`.

Hold creation uses a serializable database transaction and a unique idempotency key. Inventory counts confirmed holds and unexpired active holds. Expired holds stop consuming inventory even before their stored state is updated. The `capacity` on a slot cannot be reduced below reservations already made.

Pilot operations still need a scheduler to mark old active holds as `EXPIRED` for reporting; capacity calculation does not depend on that scheduler. Partner listing proposals and approval workflow need a separate authenticated partner/admin interface before exposing pilot inventory management outside trusted operators.
