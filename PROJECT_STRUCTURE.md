# Project Structure

```text
.
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- app/
|   |-- components/
|   |-- config/
|   |-- hooks/
|   |-- lib/
|   |-- services/
|   |-- styles/
|   `-- types/
|-- eslint.config.mjs
|-- next.config.mjs
|-- package.json
|-- tailwind.config.ts
`-- tsconfig.json
```

## App Routes

`src/app` contains the Next.js App Router routes and layout.

- `/` renders the public landing page.
- `/booking` renders the booking form page.
- `/menu` renders menu content.
- `/gallery` renders gallery content.
- `/contact` renders contact content.
- `/admin` renders the admin dashboard entry point.
- `/api/bookings` accepts booking submissions.

## Components

`src/components` contains reusable UI and feature components, including the booking form, admin dashboard, menu preview, gallery preview, and testimonials.

## Configuration

`src/config` stores editable site content such as gallery items, menu items, site metadata, and testimonials.

## Data And Services

`src/lib` contains shared helpers:

- `db.ts` creates the Prisma client.
- `validation.ts` defines Zod validation schemas.
- `email.ts` contains the booking notification placeholder.

`src/services` contains business logic that coordinates persistence and side effects.

## Styling

`src/styles/globals.css` contains global styles. Tailwind is configured through `tailwind.config.ts` and PostCSS through `postcss.config.mjs`.

## Tooling

- `package.json` defines Turbopack-first scripts for development and builds.
- `eslint.config.mjs` defines the ESLint 9 flat config.
- `next.config.mjs` contains the Next.js runtime configuration.
- `tsconfig.json` contains TypeScript and path alias settings.
