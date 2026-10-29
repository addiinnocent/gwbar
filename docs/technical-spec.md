# Technical Spec (retroactive)

> Describes the system as implemented (Next.js 15 App Router, React 19, TypeScript, Tailwind 3, Prisma 6 + Neon Postgres, deployed on Vercel). Package manager: pnpm.

## Architecture overview

Single Next.js app. **Game reference data** (professions, attributes, skills) lives in Postgres and is read server-side via Prisma. **User content** (teams, builds) never touches the server — it lives in `localStorage` and travels via template codes in URLs.

```
Browser ── localStorage ── TeamContext (teams, builds, templates)
   │
   ├─ RSC: profession pages ── Prisma ── Neon Postgres (read-only game data)
   └─ Server action: decode ──── Prisma ──┘ (hydrate template → skills)
```

## Data model (`prisma/schema.prisma`)

Four flat models, no Prisma relations — joined by integer IDs in application code:

| Model | Purpose | Notes |
|---|---|---|
| `Gw1Profession` | 10 professions | manual int id, name/abbr/desc/armor, per-armor-piece stats, all de/en |
| `Gw1Attribute` | attributes | `profession` int (0 = shared), `primary` flag, `max` (default 21) |
| `Gw1SkillData` | numeric skill stats | `id` = real GW skill ID; mirrored `pve_*`/`pvp_*` columns (type, energy, activation, recharge, adrenaline, upkeep, sacrifice, overcast, …) |
| `Gw1SkillDesc` | skill text | autoincrement id; PvE/PvP name/desc/concise (English only) |

Seed/reference data: `sql/gw1_*.sql` (applied manually to Neon, not part of migrations).

## Guild Wars template codec

Implements the **official GW1 skill template format** (template type 14, version 0):

- `src/lib/template.ts` — bit machinery: custom base64 alphabet; ints as **little-endian (reversed) bit strings**; char↔6-bit packing with zero padding.
- `src/actions/encode.ts` — plain module (imported client-side): `[4b type][4b version][2b prof-exp] primary secondary [4b attrCount=0] [4b skill-exp] 8 × skillId`. Bit widths are adaptive: professions ≥4 bits, skills ≥8 bits, encoded exponents `(len-4)/2`, `(len-4)`, `(len-8)`. Attributes are written as empty.
- `src/actions/decode.ts` — `'use server'` module: `decodeTemplate` is the pure bit reader; `decode` hydrates IDs via Prisma (profession names, skill data + desc, Decimal→number). Exposes:
  - `fromInput(state, formData)` — server action for the import form (`useActionState`)
  - `fromUrl(template)` — used by `/build/[slug]`
- Asymmetry is intentional: encode must run client-side on every bar change (`TeamContext.updateBuild`), decode needs DB access.

## State & persistence (`src/context/team.tsx`)

Client-only context:

- `team: Player[]` — `Player = { id, first, second, attributes, build: Gw1Skill[8], template }`
- `teams: Team[]` — metadata (title, professions, lastEdited); `current: string`
- localStorage keys: `'current'`, `'teams'`, and one key per team holding the full team
- `updateBuild` re-encodes the template string on every change; empty slots use the `noSkill` placeholder (`src/lib/noSkill.ts`) with negated IDs per slot

## Routes & rendering

| Route | Type | Behavior |
|---|---|---|
| `/` | static | landing, NewBuildDialog |
| `/[slot]/<Profession>` ×10 | dynamic (`searchParams`) | server component; queries professions, attributes (`profession in [0, primary, secondary]`), skills; renders SkillWindow |
| `/build/[slug]` | dynamic | slug = raw template code; decoded server-side via `fromUrl` |
| `/teams`, `/teams/[slug]` | client | localStorage-backed via TeamContext |
| `/changelog` | static | hardcoded inline array, no DB/git integration |

The 10 profession pages are **hardcoded copies** (one per profession) — adding a profession means adding a page. Prerendering hits the live Neon DB (`DATABASE_URL` from `.env`).

## Frontend stack

- **dnd-kit** (`core`/`sortable`/`modifiers`/`utilities`) for list→bar drag; sensors: pointer, touch, keyboard; `closestCenter` + `snapCenterToCursor`; swap/remove logic in `SkillWindow.tsx`
- **Radix primitives** (accordion, dialog, select, toast, slot) wrapped by shadcn/Tremor-style components in `src/components/common/`
- **tailwind-variants + clsx + tailwind-merge** for styling; **@remixicon/react** icons; `@vercel/analytics` in root layout

## Assets & icon resolution

- `public/gw_images_large/` — 1349 skill images (100px), wiki-scraped filenames
- `public/class_icons/` — profession tango icons (20/200px)
- `parseSkillName()` (`src/lib/utils.ts`) maps `pve_name` → `100px-{Name_with_underscores}_(large).jpg`; **requires exact name match** — mismatched names break icons (known issue with anniversary elites)
- Template codes double as URL paths — base64 alphabet is URL-safe here (no `+/` usage in practice for type-14 codes)

## Tooling & ops

- pnpm 10 (`packageManager` pinned); `pnpm-workspace.yaml` whitelists build scripts (prisma, sharp, unrs-resolver)
- `@neondatabase/serverless` pinned to `1.2.0` via `pnpm.overrides` (type parity with `@prisma/adapter-neon` 6.x)
- Prisma client: `PrismaNeon({ connectionString })` driver adapter — never pass a `Pool`
- No tests, no CI; `pnpm build` (typecheck + lint inside `next build`) is the verification gate
- Deploys: Vercel auto-detects pnpm from `pnpm-lock.yaml`
