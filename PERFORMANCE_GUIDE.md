# Performance Guide

## Build Pipeline

The project now uses Turbopack by default for both development and production builds:

```bash
npm run dev
npm run build
```

Webpack fallback scripts are available for debugging compatibility issues:

```bash
npm run dev:webpack
npm run build:webpack
```

## Current Verification

`npm run build` completes successfully with Next.js 16.2.6 and Turbopack.

The build output includes static prerendering for the public pages and dynamic rendering for `/api/bookings`.

## Optimization Priorities

- Use `next/image` for landing page and gallery imagery so dimensions stay stable across screen sizes.
- Keep public page content statically renderable where possible.
- Avoid large client components unless interactivity requires them.
- Keep shared content in `src/config` so page components stay small and easy to cache.
- Review third-party animation usage when adding above-the-fold content.

## Next.js Features In Use

- App Router
- Server Components by default
- Metadata API
- Turbopack build and dev server

## Local Development Note

Next.js may report a slow filesystem warning for this workspace. If rebuilds feel slow, move the project to a faster local disk path and reinstall dependencies there.
