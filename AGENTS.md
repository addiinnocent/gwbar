# AGENTS.md

## Project

Guild Wars 1 skill-bar / build editor. Next.js 15 App Router + React 19, TypeScript, Tailwind 3, Prisma 6 with the Neon serverless driver adapter, deployed on Vercel.

Detailed specs live in `docs/`: `product-spec.md`, `technical-spec.md`, `design.md`, `best-practices.md`.

## Commands

Package manager is **pnpm** (enforced via `packageManager`). Do not use npm/yarn — no `package-lock.json`.

```bash
pnpm install     # also runs `prisma generate` (postinstall)
pnpm dev
pnpm build       # next build; runs typecheck + lint as part of the build
```

There are no unit tests and no CI. `pnpm build` is the only verification step — use it to check type errors and lint.

## Environment

- `DATABASE_URL` in `.env` points at a live Neon Postgres (pooled connection). Next.js loads it automatically; `next build` prerendering hits the real database.
- Prisma uses the `driverAdapters` preview feature; the client is constructed in `src/lib/prisma.ts` with `PrismaNeon({ connectionString })` — do not pass a `Pool` instance (type error with adapter 6.x).
- `@neondatabase/serverless` is pinned to `1.2.0` via `pnpm.overrides` in `package.json` to keep its types in sync with `@prisma/adapter-neon`. Keep them aligned when upgrading.

## pnpm strictness

pnpm does not hoist like npm: any package imported in `src/` must be a direct dependency in `package.json` (e.g. `@dnd-kit/utilities` had to be added explicitly). Build scripts of dependencies are blocked unless listed in `onlyBuiltDependencies` in `pnpm-workspace.yaml`.

## Data & schema

- Schema: `prisma/schema.prisma`; migrations in `prisma/migrations` (created via `pnpm prisma migrate dev`). Bilingual (de/en) columns throughout.
- Raw skill data lives in `sql/gw1_*.sql` (seed/reference data for the Neon DB), not loaded automatically.
- Build template encode/decode logic: `src/actions/encode.ts` / `decode.ts`; skill domain logic in `src/lib/`.

## Structure

- `src/app` — routes (`/`, `/[slug]` per profession, `/build/[slug]`, `/teams`, `/changelog`)
- `src/components` — UI, incl. drag-and-drop skill bar (`src/components/dnd/`)
- `src/context/team.tsx` — central team/build state used across pages
