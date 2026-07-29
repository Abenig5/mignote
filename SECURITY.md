# Security Guide

## Implemented

- Booking requests are validated with Zod before database writes.
- Prisma is used for database access instead of handwritten SQL.
- Secrets are expected through environment variables, not source files.
- `.env.example` documents required environment variables without real values.
- Email notifications go through the Resend HTTP API and delivery failures are handled: the
  provider message is logged server side and the API responds with `502` or `503`. The provider
  message is only included in the response body outside production.

## Booking API

`POST /api/bookings` validates the request body with `bookingSchema`.

Invalid payloads return `400` and do not reach the database write path.

## Environment Variables

Use `.env.local` for local development and configure the same variables in the deployment environment:

```env
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
EMAIL_FROM=
NOTIFICATION_EMAIL=
```

Do not commit real `.env.local` values.

`RESEND_API_KEY` is a sending credential. Rotate it at https://resend.com/api-keys if it is ever
committed, pasted into a log, or shared.

## Pending Before Production

- Add rate limiting to `/api/bookings`.
- Add spam protection for public forms.
- Add authentication and authorization before exposing real admin data or actions.
- Review logging so request bodies and secrets are not written to logs.
- Add admin status update routes with authorization checks.

## Dependency Checks

Run the standard project checks before deployment:

```bash
npm run lint
npm run build
```

Use `npm audit` as part of release review when dependency updates are introduced.
