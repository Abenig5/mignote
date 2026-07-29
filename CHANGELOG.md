# Changelog

## Unreleased

- Fixed email notifications failing on Vercel by replacing the nodemailer SMTP transport with
  the Resend HTTP API in `src/lib/email.ts`.
- Removed the `nodemailer` and `@types/nodemailer` dependencies.
- Replaced the `EMAIL_SERVER` SMTP URL with `RESEND_API_KEY`. The old variable is still read as a
  fallback so existing deployments keep working.
- Corrected the email environment variables in `README.md` and `SECURITY.md`, which documented
  `SMTP_USER` and `SMTP_PASSWORD` that the application never read.
- Documented the Resend sandbox sender and recipient restrictions.
- Added delivery failure handling: `/api/contact` returns `503` when unconfigured and `502` when
  Resend rejects the request, with the provider message logged.
- `POST /api/bookings` now returns a `notified` flag, returns `500` instead of throwing on a
  database failure, and rejects malformed JSON with `400`.
- The booking form now warns when an inquiry is saved but its notification did not send, and
  handles network failures on submit.
- Switched the default development script to `next dev --turbo`.
- Switched the default production build script to `next build --turbo`.
- Added `dev:webpack` and `build:webpack` fallback scripts.
- Added `eslint.config.mjs` for ESLint 9 flat config support.
- Verified the Turbopack production build.
- Updated project documentation for the Turbopack migration.

## v1.1.0

- Added admin dashboard entry point.
- Added SEO-focused project structure.
- Added Prisma booking model and booking persistence flow.

## v1.0.0

- Initial project setup.
- Added landing page.
- Added booking system.
- Added menu section.
- Added gallery section.
- Added contact page.
