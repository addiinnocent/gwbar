# Product Spec (retroactive)

> Written after the fact from the current implementation (v1.3). Describes what the app does today, not a plan.

## Vision

gwbar is a web-based **Guild Wars 1 skill-bar and team-build editor**. Players compose the classic 8-slot skill bar for a primary/secondary profession combination, browse all game skills with their real stats, export the bar as an official Guild Wars template code, share builds via URL, and assemble multi-player team builds locally in the browser.

## Target user

Guild Wars 1 players planning builds — solo (single bar) or for group content (team of up to N players, one bar each). Bilingual audience anticipated (German/English schema), but the shipped UI is English-only (see Gaps).

## Core features

### 1. Build editor (`/{slot}/{Profession}?secondary={X}`)
- Pick a **primary profession** (all 10 core professions) and optionally a **secondary profession** from a dropdown.
- Browse the full skill list for the chosen combination (primary + shared attributes, plus the secondary's attributes except its primary one — a secondary cannot use its primary attribute, matching the game).
- Drag skills from the list into the **8-slot skill bar** (drag, drop, swap, remove; keyboard/touch supported). Elite skills are visually highlighted.
- Click (or start dragging) a skill to see full details in a toast: type, cost (energy / adrenaline / upkeep / sacrifice), activation, recharge, description with attribute-scaled values (PvE vs PvP variants distinguished).
- Distribute attribute points (200-point budget) in the attribute dialog; switching the secondary profession resets the ranks spent in its attributes.
- Every change re-encodes the bar into a valid **Guild Wars template code** (type 14), shown copy-pasteable on the team page.

### 2. Team builds (`/teams`, `/teams/[slug]`)
- Create named teams (random fun titles like "Fizzy-Latte" if unnamed).
- Add players (profession pairs) to a team; navigate between player editors via a left rail.
- Import an existing build by pasting a template code.
- Each player card shows profession icons, the 8 skill thumbnails, and the template code with one-click copy.
- Teams are listed with profession icons and last-edited timestamp; can be deleted.

### 3. Build sharing (`/build/[slug]`)
- The URL path is the raw encoded template code, e.g. `/build/OQAAAAAwAAsgAAgA`.
- Renders a read-only build card with an "add to current team" action — the primary share mechanism.

### 4. Landing & changelog (`/`, `/changelog`)
- Landing page with "Create a Build" entry point and team management link.
- Hand-maintained changelog, stored as a markdown table in `docs/changelog.md` and rendered by the `/changelog` page (version, status, author).

## Explicitly out of scope (current state)

- **No accounts / server persistence** — teams and builds live in `localStorage` only; clearing browser data loses everything. Sharing happens exclusively via URL/template codes.
- **No i18n switch** — database columns exist for German, UI renders English only.
- **No database-backed teams** — Postgres stores game reference data (professions, attributes, skills), never user content.

## Known gaps / planned

- Anniversary elite skills have icon-ID mismatches (tracked as "pending" in the changelog).
- German UI is schema-ready but unimplemented.
