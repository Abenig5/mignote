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
SMTP_USER=
SMTP_PASSWORD=
```

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

Current known lint warnings:

- `src/lib/email.ts` keeps the `_booking` parameter for the future SMTP integration.

## Project Docs

- `PROJECT_STRUCTURE.md` explains the main folders and runtime configuration files.
- `BOOKING_FLOW.md` documents the booking request lifecycle.
- `PERFORMANCE_GUIDE.md` covers Turbopack and frontend performance notes.
- `SECURITY.md` tracks implemented safeguards and security work still pending.
- `CHANGELOG.md` records notable project changes.

## Deployment

Deploy on Vercel or any platform that supports Next.js 16 and PostgreSQL connectivity. Set the same environment variables in the hosting provider before running Prisma migrations and production builds.

## License

Private project.
