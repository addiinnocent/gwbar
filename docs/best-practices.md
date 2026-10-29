# Best Practices (gwbar-specific)

> Conventions that differ from generic Next.js/React defaults, plus hard-earned rules. Generic advice is deliberately excluded.

## Package management

- **pnpm only.** Never run `npm install`/`yarn` — `packageManager` pins pnpm and there is no `package-lock.json`.
- Any package imported in `src/` must be a **direct dependency** in `package.json` (pnpm doesn't hoist like npm — phantom deps fail the build, e.g. `@dnd-kit/utilities`).
- Dependency **build scripts are blocked** by default. If a package needs a postinstall, add it to `onlyBuiltDependencies` in `pnpm-workspace.yaml` (currently: prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver).
- Keep `@neondatabase/serverless` and `@prisma/adapter-neon` type-compatible — the neon package is pinned via `pnpm.overrides`; bump both together.

## Verification

- **`pnpm build` is the only gate** — it runs typecheck and lint inside `next build`. There are no tests and no CI; don't assume a green CI means anything.
- Builds hit the **live Neon database** during prerender — a broken `DATABASE_URL` or schema drift fails the build, not just runtime.
- Before committing structural changes, run `pnpm build`, not just `tsc --noEmit` in your head.

## Prisma / database

- Always construct the client via `src/lib/prisma.ts` (`PrismaNeon({ connectionString })`). **Never pass a `Pool`** — type error with adapter-neon 6.x.
- `driverAdapters` is a preview feature in `schema.prisma` — keep it until the Prisma version drops the flag.
- Migrations: `pnpm prisma migrate dev`. The `sql/gw1_*.sql` files are **raw seed data, not migrations** — never generate migrations from them or re-run them casually; they target the live Neon DB.
- Models have **no Prisma relations** — joins happen by integer ID in app code. Follow that pattern rather than "fixing" the schema ad hoc.

## Template codec (highest-risk code)

- `src/lib/template.ts` + `src/actions/encode.ts`/`decode.ts` implement the **official GW1 format (type 14)**. Bit strings are **little-endian (reversed)** — this trips everyone up; don't "simplify" to big-endian.
- Bit widths are adaptive with encoded exponents (`(len-4)/2`, `(len-4)`, `(len-8)`). Any change must keep codes **round-trip stable and compatible with in-game imports** — verify with a real template code.
- `encode` is a plain module (client-safe, runs on every bar change — keep it cheap); `decode` is `'use server'` (needs Prisma). Preserve this split.
- Template codes appear **raw in URLs** (`/build/{code}`) — they must stay URL-safe.

## Data & skills

- Skill IDs are the **real GW game IDs**; icon paths are derived from exact skill names (`parseSkillName`). Renaming a skill in data breaks its image — check `public/gw_images_large/` filenames first.
- PvE/PvP skill variants are separate columns everywhere — never mix `pve_*` and `pvp_*` fields for one skill.
- The 10 profession pages under `src/app/[slug]/` are hardcoded duplicates. When changing editor behavior, **change all 10** (or be the one to refactor them into a shared component).

## Client state

- Teams/builds live in **localStorage only** (`'current'`, `'teams'`, one key per team). Don't add server writes for user content without a deliberate product decision.
- Empty skill slots use the `noSkill` placeholder with **negated IDs per slot** (`-(index + 1)`) — filtering must account for that. Never insert `noSkill` as-is: `id: 0` collides across slots and dnd-kit's droppable registry then misroutes drops. Always spread-and-replace the id.
- `updateBuild` re-encodes the template on every change; treat the template string as derived state, never edit it directly.

## Drag & drop (dnd-kit)

- Sortable items need **stable, unique ids and React keys** (`key={skill.id}`, not index) — index keys leave stale droppable registrations behind on reorder.
- TouchSensor/PointerSensor need an **`activationConstraint`** (currently `delay: 250/tolerance: 5` and `150/5`); unconstrained sensors hijack touch scrolling on mobile.
- Any drag state (`activeSkill`, drag-start toast with `duration: Infinity`) must be cleared in **both** `onDragEnd` and `onDragCancel` — mobile drags cancel often (browser takes over scrolling); missing cleanup locks the UI.
- **dnd-kit core 6.3.1 caches droppable rects and only re-measures mid-drag** (issue #1786). After any programmatic list mutation (add/throw/swap), re-measure via `src/components/dnd/Remeasure.tsx` — if hit areas drift from visuals again, check that it's still mounted inside `DndContext` and still keyed on both lists.
- Use explicit 1D sorting strategies (`verticalListSortingStrategy` / `horizontalListSortingStrategy`) — the default `rectSortingStrategy` computes grid-style displacement transforms.
- Hide the source item while dragging (`isDragging → opacity: 0`) when using `DragOverlay`; don't re-add `snapCenterToCursor` — it moves the real item under the cursor and pollutes measurements.

## UI conventions

- Style via `src/components/common/` wrappers (tailwind-variants); don't style Radix primitives inline.
- Skill images: 100px versions from `gw_images_large`; profession icons from `class_icons` (`{Name_en}-tango-icon-200.png`).
- New UI text goes in English — the de columns exist but the UI doesn't consume them yet.

## Commits

- Plain git on `main`, push-to-deploy via Vercel. Keep migrations/lockfile/config changes in dedicated commits (see `cb6acec` for the style).
