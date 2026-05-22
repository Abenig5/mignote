# Security Guide

## Implemented

- Booking requests are validated with Zod before database writes.
- Prisma is used for database access instead of handwritten SQL.
- Secrets are expected through environment variables, not source files.
- `.env.example` documents required environment variables without real values.

## Booking API

`POST /api/bookings` validates the request body with `bookingSchema`.

Invalid payloads return `400` and do not reach the database write path.

## Environment Variables

Use `.env.local` for local development and configure the same variables in the deployment environment:

```env
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
SMTP_USER=
SMTP_PASSWORD=
```

Do not commit real `.env.local` values.

## Pending Before Production

- Add rate limiting to `/api/bookings`.
- Add spam protection for public forms.
- Add authentication and authorization before exposing real admin data or actions.
- Connect email notifications to a real provider and handle delivery failures.
- Review logging so request bodies and secrets are not written to logs.
- Add admin status update routes with authorization checks.

## Dependency Checks

Run the standard project checks before deployment:

```bash
npm run lint
npm run build
```

Use `npm audit` as part of release review when dependency updates are introduced.
