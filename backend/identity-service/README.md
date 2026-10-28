# Identity Service

The customer auth flow uses Firebase Authentication as the identity provider. `POST /v1/auth/session` verifies a Firebase ID token (including revocation) and exchanges it for a one-hour GOPU bearer token. `GET /v1/auth/me` and `PATCH /v1/auth/me` accept only the GOPU bearer token. The stable `customerId` in their response is the ID used by other services. No account is linked by matching name or email.

Required environment variables:

- `IDENTITY_DATABASE_URL`: PostgreSQL URL for this service's schema.
- `FIREBASE_PROJECT_ID`: expected Firebase project ID and token audience.
- `GOOGLE_APPLICATION_CREDENTIALS`: path to a service account JSON file in local development; on Google Cloud, Application Default Credentials can be supplied by the runtime instead. Keep credentials outside Git.
- `IDENTITY_JWT_SECRET`: random signing secret of at least 32 UTF-8 bytes. Keep it private to this service; other services validate sessions by calling `/v1/auth/me`.

When the Firebase project or signing secret is not configured, session issuance fails closed. Database migration is committed but must only be applied to a selected local/development database. Run `pnpm --filter @pqlc/identity-service prisma:generate` after installing dependencies, then apply the migration explicitly against the selected database.

Request/response shapes:

```text
POST /v1/auth/session  { "idToken": "Firebase ID token" }
200 { "accessToken": "GOPU JWT", "tokenType": "Bearer", "expiresIn": 3600,
      "customer": { "customerId": "UUID", "displayName": null, "preferredLocale": "vi" } }

GET /v1/auth/me       Authorization: Bearer <GOPU JWT>
200 { "customerId": "UUID", "displayName": null, "preferredLocale": "vi" }

PATCH /v1/auth/me     Authorization: Bearer <GOPU JWT>
                       { "displayName": "Name", "preferredLocale": "en" }
200 { "customerId": "UUID", "displayName": "Name", "preferredLocale": "en" }
```

Profile fields may be updated independently; `displayName: null` clears the name. Requests with extra fields are rejected. Tokens and Firebase subjects are not returned in profile responses.
