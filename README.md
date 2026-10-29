# gwbar

A [Guild Wars 1](https://www.guildwars.com/) skill-bar and team-build editor for the web. Compose the classic 8-slot skill bar for any primary/secondary profession combination, browse every game skill with real stats, and share builds using the official Guild Wars template codes.

## Features

- **Build editor** — pick a primary and secondary profession and drag skills from a full, filterable list into the 8-slot bar (drag, swap, remove; keyboard & touch supported). Elite skills are highlighted; hover any skill for its real cost, activation, recharge, and description (PvE/PvP variants included).
- **Official template codes** — every change re-encodes the bar into a valid GW1 template code (type 14) that can be pasted straight into the game.
- **Build sharing** — the template code is the URL: `gwbar.app/build/OQAAAAAwAAsgAAgA` renders a read-only build card with an "add to team" action.
- **Team builds** — assemble multi-player teams locally in the browser, import builds by template code, and copy codes with one click.

Teams and builds are stored in your browser (`localStorage`) — nothing is uploaded. The database only holds game reference data (professions, attributes, skills).

## Tech stack

- [Next.js](https://nextjs.org) 15 (App Router) + React 19, TypeScript
- Tailwind CSS 3, tailwind-variants, Radix UI primitives, dnd-kit
- Prisma 6 with the Neon serverless driver adapter (Neon Postgres)
- Deployed on Vercel

## Development

Requires **pnpm** (the package manager is pinned via `packageManager`).

```bash
pnpm install     # also runs `prisma generate`
pnpm dev         # start the dev server on http://localhost:3000
pnpm build       # production build (also runs typecheck + lint)
```

Next.js loads `DATABASE_URL` from `.env` automatically (ask a maintainer for access). Note that `pnpm build` prerenders pages, which hits the database.

More documentation lives in [`docs/`](docs/): [product spec](docs/product-spec.md), [technical spec](docs/technical-spec.md), [design notes](docs/design.md), and [best practices](docs/best-practices.md).

## License

See [LICENSE](LICENSE).
