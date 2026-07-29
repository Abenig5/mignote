# Mignote Catering

A modern catering website built with Next.js App Router, Turbopack, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Responsive public pages for home, menu, gallery, booking, and contact
- Booking inquiry API with Zod validation
- Prisma-backed booking persistence
- Admin dashboard entry point
- Config-driven menu, gallery, and testimonial content
- Turbopack-powered development and production builds

## Tech Stack

- Next.js 16
- React 19
- Turbopack
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Framer Motion
- Lucide React

## Requirements

- Node.js compatible with Next.js 16
- npm
- PostgreSQL database

## Installation

```bash
npm install
```

Create `.env.local` from `.env.example` and provide the required values:

```env
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
EMAIL_FROM=
NOTIFICATION_EMAIL=
```

See [Email Notifications](#email-notifications) for how the email variables are used.

Generate the Prisma client after installing dependencies:

```bash
npm run prisma:generate
```

## Development

```bash
npm run dev
```

The default development command runs Next.js with Turbopack. The app is served at `http://localhost:3000` unless the port is already in use.

For webpack comparison or fallback:

```bash
npm run dev:webpack
```

## Build

```bash
npm run build
```

The default production build uses Turbopack.

For webpack comparison or fallback:

```bash
npm run build:webpack
```

Start a production build locally:

```bash
npm run start
```

## Quality Checks

```bash
npm run lint
```

ESLint uses the flat config in `eslint.config.mjs` with the Next.js Core Web Vitals and TypeScript presets.

```bash
npm run typecheck
```

## Email Notifications

Booking and contact inquiries are emailed through the [Resend](https://resend.com) HTTP API in `src/lib/email.ts`.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from https://resend.com/api-keys |
| `EMAIL_FROM` | Sender address, e.g. `Mignote Catering <onboarding@resend.dev>` |
| `NOTIFICATION_EMAIL` | Inbox that receives the inquiries |

The HTTP API is used instead of SMTP because outbound SMTP connections are unreliable from
serverless functions on Vercel. No SMTP variables are read by the application.

### Sender and recipient rules

Until a domain is verified at https://resend.com/domains, the Resend account is in sandbox mode:

- `EMAIL_FROM` must use the `onboarding@resend.dev` address.
- `NOTIFICATION_EMAIL` must be the email address that owns the Resend account. Any other
  recipient is rejected by Resend with HTTP `403`.

To send from a Mignote address, or to any recipient, verify a domain in Resend first and then
set `EMAIL_FROM` to an address on that domain.

### Behaviour on failure

- Missing or placeholder variables: the send is skipped, the missing names are logged, and
  `/api/contact` returns `503`.
- Resend rejects the request: the provider message is logged and `/api/contact` returns `502`.
- A booking is still saved when its notification fails. The response includes
  `notified: false` and the booking form shows a warning instead of a plain success message.

## Project Docs

- `PROJECT_STRUCTURE.md` explains the main folders and runtime configuration files.
- `BOOKING_FLOW.md` documents the booking request lifecycle.
- `PERFORMANCE_GUIDE.md` covers Turbopack and frontend performance notes.
- `SECURITY.md` tracks implemented safeguards and security work still pending.
- `CHANGELOG.md` records notable project changes.

## Deployment

Deploy on Vercel or any platform that supports Next.js 16 and PostgreSQL connectivity. Set the same environment variables in the hosting provider before running Prisma migrations and production builds.

`.env` and `.env.local` are gitignored and are **not** uploaded by a deployment. Every variable
must be added in the Vercel project under Settings -> Environment Variables, for the Production,
Preview, and Development environments, and a redeploy is required for changes to take effect:

- `DATABASE_URL` must point at a network-reachable PostgreSQL host. A `localhost` value fails on
  Vercel with `Can't reach database server at localhost:5432`.
- `RESEND_API_KEY`, `EMAIL_FROM`, and `NOTIFICATION_EMAIL` are required for email notifications.

Runtime errors for both API routes appear in the Vercel dashboard under the deployment's
Functions logs.

## License

Private project.
