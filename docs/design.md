# Design Notes

> How the UI is designed and why — reverse-engineered from the implementation.

## Layout

- **Fixed bottom skill bar**: the 8-slot bar is the centerpiece, always visible while scrolling the skill list — mirrors the in-game HUD.
- **Fixed left rail (`ClassPanel`)**: current team's players with profession tango icons for fast switching between editors; "+" opens the New Build dialog.
- **Top nav (`TopNav`)**: global navigation (build, teams, changelog).
- Content in centered containers (`common/Container`); cards (`common/Card`) for teams, players, and shared builds.

## Visual language

- Dark game-adjacent theme; skill imagery and tango icons carry most of the visual identity.
- **Elite skills** get a yellow border overlay — matches in-game elite framing conventions.
- `tailwind-variants` defines variant sets (Button, Card, Input, …) composed with `clsx` + `tailwind-merge`; Radix handles behavior, the `common/` wrappers own appearance. Do not style Radix primitives directly — go through `src/components/common/`.

## Interaction patterns

- **Drag & drop** is the core editor interaction (list → bar, bar reordering, drag-out to remove). dnd-kit with pointer/touch/keyboard sensors keeps it accessible — touch drags start on long-press so list scrolling still works on mobile; `DragOverlay` provides the floating ghost while the source item is hidden.
- **Copy-to-clipboard** is built into `common/Input` — template codes never need manual selection.
- **Hover detail**: `SkillOverlay`/`SkillCost` show full skill stats on hover instead of navigating away; a toast shows extended skill text.
- **Dialogs** (Radix): NewBuildDialog (profession grid), ImportBuildDialog (paste template code; form posts to the `fromInput` server action via `useActionState` — errors render inline).
- **Destructive actions** (delete player/team) are direct with toast feedback; no confirmation modals currently.

## Information density

- Team overview tables (`common/Table`): title, profession icon strip, last edited, delete — optimized for scanning many teams.
- Player cards in `TeamComponent` show professions as icon pairs ("First / Second") plus 8 skill thumbnails — a team should be readable at a glance.

## Accessibility

- Keyboard drag support via dnd-kit keyboard sensor.
- Radix primitives provide focus management and ARIA for dialogs/selects/accordions.
- Not audited; no dedicated a11y work has been done.

## Known design debt

- English-only UI despite bilingual data model — German columns are ready but unused.
- No empty-state illustrations; empty teams/lists render plain text.
- Changelog page is unstyled prose data, hand-maintained.
