# PHASE-00B · Design system in code

**Status:** Planning
**Written by:** Orchestrator, 2026-09-07

> This phase is design stages **D4 and D5** of `design-system.md` §1. It is
> infrastructure, like PHASE-00A, so it collapses the four-session model:
> Session 1 (this file), Session 2 (implementation — items in §6), Session 3
> (orchestrator, fresh context — D5 reconciliation and review to exit).
> There is no schema and no server actions. The "contract" in §5 is the
> **component inventory**.

---

## 1. Susan can

> Susan can sign in and see the real application — the restyled sign-in screen,
> the app shell with navigation, and a plain home page, all in the Ledger design
> system rather than shadcn defaults.

Nothing new is *transacted*. What changes is that every surface from here on is
built from a real, tokenised component library instead of raw shadcn.

## 2. Scope

**In scope**

1. **Confirm tokens.** `src/styles/globals.css` `@theme` block against the Paper
   theme (`get_basic_info` on file `01M1X43Q66HDD6TF72TYYWH3KE`). Tokens were
   written in D1 and already match; this is a verification, not a re-derivation.
   Any mismatch is fixed **in `globals.css`** (code is the source of truth from
   D1 on, `design-system.md` §1) and recorded in §7. **No new tokens** — adding
   one to solve a component means the scale is wrong (`design-system.md` §13.7).
2. **Tier 1 — restyle every shadcn primitive to tokens**, every state (see §6.2
   for the list and the state matrix). Keyboard nav and ARIA stay as Radix ships
   them. No business logic — primitives stay generic.
3. **shadcn blocks — take, restyle, demote to Tier 2.** Sidebar, login-form,
   DataTable. Plumbing kept; styling and (for DataTable) the mobile card
   fallback are ours. Once landed, each is Tier 2, in the gallery, no upstream
   tracking (§6.3).
4. **Tier 2 — build the approved composite set.** Every entry in
   `ui-conventions.md` §1, built from Tier 1, referencing **semantic tokens
   only**. Each has a drawn target on Paper artboard `4U2-0` in every state
   (§6.4).
5. **`/dev/gallery`** — a dev-only route rendering every component in every
   state and variant as **separate static forced-state instances**
   (`data-force-state="hover"`), excluded from production builds (§6.5).
6. **App shell + navigation, responsive.** Server Components by default;
   `'use client'` as low as possible. Nav / mobile drawer from the Sidebar
   block. Home (`/`) stays a plain landing page. Navigable at 390px and 1440px
   (§6.6).

**Explicitly out of scope**

- Any screen beyond `/sign-in`, the app shell, `/`, and `/dev/gallery`. **No**
  Clients, Quotes, Invoices, Calendar, Availability, or Voice screens — those
  are D6 / PHASE-01+.
- All business tables, `src/modules/*`, Prisma models, server actions, the
  Vercel AI SDK, `@react-pdf/renderer`, cron routes, Playwright specs.
- The shared-quote public view `/q/[token]` (D3-worklog Rec #5 — D6).
- Buffer days (`inventory-availability.md` §8).
- Dark mode (`design-system.md` §3 — light only in v1; tokens are already
  structured for a later value swap).
- Any *new* composite beyond `ui-conventions.md` §1. A component that seems
  missing is a §10 recommendation, not a build.

> Anything not listed as in scope is out of scope. If something seems necessary,
> record it in §10 rather than building it.

## 3. Reading list

- `docs/architecture/domain-invariants.md` — §1 money (INV-M1/M5), §9 voice
  (INV-V3, INV-V5). Component-level enforcement only — there is no data layer in
  this phase.
- `docs/conventions/coding-standards.md` — §2 layout / no barrels, §7 money, §8
  dates, §10 React, §13 dependencies, §14 performance.
- `docs/conventions/design-system.md` — §1 (D4/D5), §2 token layers, §3–11 the
  token vocabulary, §12 (adding to the set — you are *not* adding), §13 rules.
- `docs/conventions/ui-conventions.md` — §1 (**the build list**), §2 the
  gallery, §3 handoff, §4 responsive, §5 screen patterns, §6 voice UI, §7 a11y.
- `docs/architecture/inventory-availability.md` — §7 (`DayAvailabilityStrip`
  worst-day encoding, ratified 2026-09-07).
- `docs/delivery/D3-worklog.md` — whole file. D3.2 locked decisions, D3.4
  normalize-back, D3.5 §12 promotion table, and the carried recommendations
  (#1 RESOLVED; #2 and #4 folded into §5 of this file; #3 and #5 parked).
- `docs/delivery/phases/PHASE-00A.md` — §5 task list, §6 decisions (8: shadcn
  `-b radix`; 9: `shadcn` is a runtime dep; 10), §8 gotchas.
- Paper: file `01M1X43Q66HDD6TF72TYYWH3KE`, page `D3 — Components`, artboard
  `4U2-0` ("D3 — Components (Approved Composite Set)"). 22 composite bands +
  the shadcn spec-cards band, each drawn in all states. **This is the visual
  build target.** Pull exact values per band with `get_jsx` — do not read them
  off a screenshot.

## 4. Invariants in play

Component-level enforcement only — there is no data layer yet.

| ID | Rule | Where it is enforced in this phase |
|---|---|---|
| INV-M1 | Money is integer KES cents | `MoneyDisplay` takes `cents: number`, never a pre-formatted string |
| INV-M5 | Formatting only at the render boundary; tabular numerals on money / quantity / reference numbers | `MoneyDisplay` / `QuantityInput` call `formatMoney()` internally and set `font-variant-numeric: tabular-nums`; `PageHeader` uses Geist Mono for reference numbers |
| INV-P2 | Never join catalog for display on a document | `LineItemRow` `document`/`quote` variants take snapshot values as props — the component API implies no catalog lookup |
| INV-I2 | Issued documents immutable | `LineItemRow` `document` variant is read-only always — no editable controls, no delete |
| INV-A6 | Warn, do not block | `ConflictBanner` and `QuantityInput` over-availability state warn visually; neither disables input or submission; `ConflictBanner` carries **no** forward link |
| INV-I3 | Void/replace notice always carries the forward link | `DocumentNoticeBanner` always renders the link button; distinct component from `ConflictBanner` |
| INV-V3 | Transcript always visible, never behind a disclosure | `TranscriptPanel` has no collapsed state; it renders the transcript inline in every state including extraction-failed |
| INV-V5 | Uncertainty flag = border + label + icon, not colour alone | `VoiceReviewField` flag anatomy: 1px warning border + uppercase label + triangle icon; colour is additive |
| INV-T4 | The only unauthenticated surface is `/q/[token]` | `login-form` (`/sign-in`) is the only unauthenticated surface touched here; `/dev/gallery` sits behind the existing middleware and is excluded from production |

Not in play: INV-N\*, INV-C\*, INV-E\*, INV-A1–A5/A7, INV-D\*, all of §6
document-chain — no document, booking, or persistence code exists in this phase.

---

## 5. Contract

**The contract for PHASE-00B is the component inventory.** No schema, no Zod, no
server actions, no repository, no domain functions. Fixed once committed; a
change is made here first and recorded in §7.

### 5.1 Tier 1 primitives — the exact list

From `ui-conventions.md` §1. All restyled to tokens, every state:

```
Button · Input · Textarea · Select · Combobox · Checkbox · RadioGroup ·
Switch · Badge · Card · Dialog · Sheet · Popover · Tooltip · Table · Tabs ·
DropdownMenu · Calendar · DatePicker · Toast · Skeleton · Separator · ScrollArea
```

Notes on what already exists in `src/components/ui/` (PHASE-00A, shadcn `-b
radix`):

- Present as files: `badge button calendar card checkbox combobox dialog
  dropdown-menu form input input-group label popover radio-group scroll-area
  select separator sheet skeleton sonner switch table tabs textarea tooltip`.
- **`DatePicker`** is not a discrete shadcn primitive — it is the documented
  Calendar-in-a-Popover composition. Build it as `src/components/ui/date-picker.tsx`
  wrapping the restyled `Calendar` + `Popover`. It stays generic (no
  Nairobi-timezone logic here — that is `lib/dates` at the call site later).
- **`Toast`** is `sonner` (`sonner.tsx` present). Restyle the Sonner theme to
  tokens; that is the `Toast` deliverable. `sonner` is already the decided
  dependency (`coding-standards.md` §13).
- `form.tsx`, `input-group.tsx`, `label.tsx` are supporting primitives — restyle
  them too (they carry `aria-invalid` / error styling that the state matrix
  covers).

### 5.2 shadcn blocks — the three, and what is kept vs. ours

| Block | Kept from upstream (plumbing) | Ours (restyle + build) | Strip |
|---|---|---|---|
| **Sidebar** | collapsible state, ⌘-keyboard shortcut, mobile Sheet fallback, persistence | 240px panel `linear-gradient(in oklab 160deg, var(--color-chrome-gradient-start) 0%, var(--color-chrome-gradient-end) 60%)`; nav item pad 9px/10px, 16px icon slot, gap 10, text 14 / weight 500 / `chrome-text-muted`; **active = ghost underline** (1px bottom border `chrome-active-underline`, text+icon → `chrome-text`, weight 600, **no fill**); footer 1px `chrome-border` top rule + Voice-capture pill (`#00000033` bg, 1px `chrome-border` ring via box-shadow, `VoiceQueueIndicator` danger badge) + user row (24px avatar) | demo nav items, teams / org switcher, placeholder data |
| **login-form** | form structure, submit handling | tokens; 44px controls; accent primary button; wire to `/sign-in` (replaces the PHASE-00A default-styled form, keeping `auth-client` + `react-hook-form` + `zodResolver` + server-error mapping) | demo copy, "or continue with" / social-login row, sign-up link |
| **DataTable** | `@tanstack/react-table` sort / column-visibility / row-selection plumbing (add the dependency if the block needs it — it is the block's engine, not a new arbitrary choice) | 1px border container; header on `surface-sunken` with a `border-strong` bottom rule; column labels 11px / 600 / 0.03em / uppercase; 32px rows; hairline row dividers (last none); numeric columns right-aligned Geist Mono; sort caret on the active column. **Below `md` the whole table projects to CARDS** — the one contract (D3.2 #3): row → 1px-border card, primary line (14 semibold) + secondary (13 muted), right-aligned figure block, then a 2-up label/value grid; a column may set `wide: true` to render as a horizontally-scrolling strip inside the card (**the only permitted horizontal scroll** — where `DayAvailabilityStrip` sits). States: populated, sorted, loading (skeleton rows, **not a spinner**), empty (delegates to `EmptyState`). | demo columns, faker data, any dashboard chrome |

Exact Sidebar / login-form chrome values are on the spec-cards band (`5TI-0`);
the DataTable spec is on the DataTable band (`58H-0`). Pull both with `get_jsx`.

### 5.3 Tier 2 composites — the exact set, props, variants

Every entry in `ui-conventions.md` §1. Semantic tokens only — never a primitive
token, never a raw hex (`design-system.md` §13.1 / §13.2). Each has a drawn
target on artboard `4U2-0` in every state.

| Component | Props / variants (from `ui-conventions.md` §1) |
|---|---|
| **MoneyDisplay** | `cents: number \| null`, `prefix?: boolean` ("KES " for KPI cards / mobile; off in dense columns). Geist Mono, `tabular-nums` always. `formatMoney()` at the render boundary only (INV-M1/M5). Right-aligned in columns. States: positive, zero, negative (credit / overpayment), null (em dash), loading. |
| **QuantityInput** | Integer stepper, tabular numerals. Availability-aware: border turns warning when the value exceeds what is free, **never blocks entry** (INV-A6). 24px inside a table row, 36px standalone (with ± steppers). States: resting, focus, over-availability (warning), disabled (issued doc), error (`aria-invalid`). |
| **StatusBadge** | One anatomy: 6px dot + label in the matching status colour. **No background chip** (D3.2 #1). `variant: "document" (10 states) \| "event" (4) \| "inventory" (5 severities)`. Terminal states (declined / superseded / voided / completed / cancelled) → muted text. Non-interactive by default; gains hover / focus / selected **only** as a table filter chip. |
| **DocumentStatusBadge** | Named wrapper = `StatusBadge variant="document"`. |
| **AvailabilityBadge** | Wrapper over `StatusBadge variant="inventory"`. Formats `minAvailable` / `totalQuantity` into the label. Two label forms: `"N of M free"` (quote builder), `"N free · day"` (worst-day). Severity: available (≥ requested), low (0 < free < requested), damaged/none (0 free). States: loading, not-checked-yet. |
| **DayAvailabilityStrip** | Drives off `byDay: { day: string; available: number }[]`, plus `checkedQuantity` and `minAvailable`. Per-day cell = weekday+date label (mono, muted) over the number (mono). **Worst-day cell** (the `byDay` entry whose `available === minAvailable`; ties → earliest day) is emphasised: `warning-subtle` tint when that day's availability `< checkedQuantity`, `success-subtle` otherwise, plus a `border-strong` outline. Every other cell untinted. This is the **only** severity encoding on the strip (`inventory-availability.md` §7). Scrolls inside its own `overflow-x: auto` container; page body never scrolls horizontally. Placements: Availability Range mode, Availability mobile card (as a DataTable `wide:true` region), item-detail per-day strip. |
| **ClientPicker** | Searchable combobox over clients (Combobox base). Trigger 36px; popover on `surface-raised` + `shadow-md`; options 32px. "Create client `<query>`" inline. Unresolved-entity affordance for voice (`"<name> — not in your clients"` + create / pick). |
| **CatalogItemPicker** | Searchable combobox over active catalog items. Each option shows availability for the quote's event dates (batched query implied, warn-not-block). States: open-with-availability, loading, empty (`"No item matches … · Add to catalog"`). |
| **SearchInput** | Magnifier + field + optional result-count on the right (`"3 of 24"`). States: resting, focus, empty (placeholder), loading (count → dash / spinner). |
| **LineItemRow** | `variant: "quote" \| "document" \| "voice"`. **quote**: # index, editable `QuantityInput`, `AvailabilityBadge` column, unit price, line total, delete. Row hover = `surface-sunken`; focus-within = accent inset. **document** (invoice / delivery note): no index, no availability, static qty, no delete — snapshot values only (INV-P2), read-only always (INV-I2). **voice**: item + qty only; a flagged row takes the `VoiceReviewField` uncertainty treatment; flag text never truncates. Mobile: each variant projects to a card via the DataTable card contract — **not** a separate component. |
| **TotalsPanel** | `layout: "ledger" \| "statcards"`. **ledger** (quote / delivery-note builder): stacked label/value rows → hairline rule → Total (label 15 semibold, value 20 mono semibold) → deposit line. **statcards** (invoice detail): three KPI cards — Invoice total / Paid to date / Balance (computed, INV-C5). Mobile: three stacked rows. All figures via `MoneyDisplay`. |
| **PageHeader** | `breadcrumb`, `title`, `status?`, `actions?`, **`capturedAt?`** — see 5.4. desktop: breadcrumb (12px muted) / title (24px semibold; Geist Mono for reference numbers) / optional inline `StatusBadge` / action slot right (ghost + accent, 36px). mobile top-bar (< md): back chevron + breadcrumb + optional single action or per-form mic, then title + badge below. States: empty (title only), error (actions + badge hidden), long title wraps to 2 lines / breadcrumb truncates. |
| **DataTable** | See 5.2. `columns` may carry `wide?: boolean`, `numeric?: boolean`. States: populated, sorted, loading (skeleton rows), empty (→ `EmptyState`). |
| **EmptyState** | Centred icon (~28px, 1.5 stroke, muted) / title (16–18 semibold) / body (muted) / one or two action buttons. Canonical uses: "No history yet", "No active catalog items", "No quotes yet". |
| **ConfirmDialog** | Dialog base (`shadow-lg`, focus trap). Plain-language description of what will happen; confirm button **names the action** ("Void invoice", not "Confirm"). States: resting, pending (button spinner + disabled), error (inline message, dialog stays open). |
| **ConflictBanner** | Transient, advisory (INV-A6 — warn, do not block). Warning triangle, `danger-subtle` bg, plain-language message naming the resource and the shortfall. **No forward link.** Compact pill variant for the calendar day-cell. Distinct from `DocumentNoticeBanner`. |
| **DocumentNoticeBanner** | Permanent document-state notice (INV-I3 void/replace, superseded quote). X-circle icon, bold title, reason line, a forward link button ("Go to INV-2026-0043"). `tone: "danger" (void) \| "neutral" (superseded)`. **Always** carries the link. |
| **VoiceMicButton** | The shell FAB (bottom-right thumb zone on mobile, with the `VoiceQueueIndicator` badge) and the per-form pill (alongside a form title). Three visible states: idle, recording, processing. |
| **VoiceReviewField** | Wraps any field. Flag (INV-V5): `warning-subtle` bg + 1px warning border + uppercase flag label with a triangle icon ("NO MATCH", "CHECK THIS") + optional helper text ("Heard 'the 14th' — month assumed"). Resting (no flag) = passthrough. |
| **VoiceQueueIndicator** | Pending-captures count. Danger circle badge (9px / 600 / white) on the shell Voice-capture control and the mobile FAB. Zero pending = no badge. |
| **TranscriptPanel** | The always-visible transcript on the voice review screen (INV-V3). Mic icon + "Transcript" + "0:23 · Deepgram" + the quoted transcript body in a sunken card + a caption. Right rail on desktop, stacked card on mobile. **Never behind a disclosure.** States: populated, extraction-failed (transcript still shown), mobile. |
| **SegmentedToggle** | Generic 2–3-way view switch. Absorbs Day/Range, Calendar/Agenda, 1 week/2 weeks, Week/List. Track on `surface-sunken`; selected segment = `surface-0` + `shadow-sm` + `text-primary`. States: resting, focus, disabled. |
| **DateRangeControl** | from→to date pair (single date in Day mode) with a calendar icon and ‹ › steppers. Composes Tier 1 `DatePicker`. |
| **CalendarSpanControl** | ‹ Today › cluster + a `SegmentedToggle` for the span (1 / 2 weeks). **Composed** from `SegmentedToggle` + icon buttons, not monolithic. |
| **CalendarGrid** | Month-grid focused to a 1–2-week span. Weekday header row (MON…SUN, 12px), tall day cells, date number top-left (12px muted), a conflict flag pill in the day cell, `EventChip`s stacked. States: populated, empty day, conflict day, loading. |
| **EventChip** | Calendar item: title (13 semibold) + client·role (12 muted), a status-coloured left bar. Agenda view uses `AgendaEventRow` instead. |
| **AgendaDayGroup** | Chronological day grouping: a sunken date header ("SAT 18 OCT  2 events · conflict") + event rows beneath. Empty day = a quiet single "Nothing scheduled" row. A conflict day shows a `ConflictBanner` inline before its rows. |
| **AgendaEventRow** | date range (mono) / title + client·venue·detail / status label or "Equipment clash" on the right; status left-bar on mobile. |

### 5.4 Folded-in decisions (from D3-worklog carried recommendations)

- **PageHeader `capturedAt` slot (D3-worklog Rec #2).** Add an optional
  `capturedAt?: string` prop to `PageHeader`. The Voice Review 1440 "Captured
  3:42 PM" chip becomes this slot (capture-time metadata pill, 12px muted mono,
  **not** a `StatusBadge`). If, when `PageHeader` is on the bench, the
  implementer judges the transcript panel's provenance line ("0:23 · Deepgram")
  already covers it, the slot may be **dropped instead** — record which in §7.
  Either way it does not stay a bespoke element.
- **Shared internal `SearchableList` (D3-worklog Rec #4).** `ClientPicker`,
  `CatalogItemPicker`, and `SearchInput`'s popover behaviour share **one
  internal** `SearchableList` so the popover, keyboard nav, and empty / loading
  states are defined once. It is **not** a public composite — not exported for
  screen use, not a gallery entry of its own (its states are exercised through
  the three pickers). Lives at `src/components/internal/searchable-list.tsx` or
  co-located; the implementer picks. Do not pre-abstract beyond these three
  consumers.

### 5.5 Gallery state matrix

`/dev/gallery` renders **every** component in **every** applicable state and
variant as a **separate static instance** via a forced-state prop, not real
interaction:

```
resting · hover · focus (2px bg + 4px ring, design-system §10) · disabled ·
active · aria-invalid / error · loading · empty · long-content overflow ·
every Radix data-state the component exposes
```

Plus each component's own variant axis (e.g. `StatusBadge` × 19 status values ×
document/event/inventory; `LineItemRow` × quote/document/voice; `TotalsPanel` ×
ledger/statcards). The forced-state mechanism:

```tsx
<Button data-force-state="hover">Send quote</Button>
```

`Button / primary / hover` is then a real element in the DOM and on the exported
canvas. The route is **excluded from production builds** — see §6.5 for the
mechanism.

> Fixed once committed. If an implementation session must change any of the
> above, the change is made here first and recorded in §7.

---

## 6. Handoff — implementation (Session 2)

```
You are the implementation agent for PHASE-00B of the Sunflower Events system
(design system in code — stages D4/D5).
Read CLAUDE.md, then docs/delivery/phases/PHASE-00B.md in full.
Read §3 (reading list) and §4 (invariants) — only those docs.
Implement §6.1–§6.6 below. The component inventory in §5 is the fixed contract.
Run `pnpm verify` — it must pass. Do not disable a check.
Append your work log to §7 and any recommendations to §10 (max 5, ranked;
check §10 first — do not re-raise parked items #3/#5 from D3-worklog).
```

### 6.1 Confirm tokens
- [ ] Diff `globals.css` `@theme` against the Paper theme (`get_basic_info` on
      `01M1X43Q66HDD6TF72TYYWH3KE`). Colours, spacing, radius, type sizes,
      weights, breakpoints, containers.
- [ ] Motion, elevation, density, focus-ring, and per-step type line-height /
      letter-spacing tokens are **code-only** (Paper has no equivalent) — that
      is expected, not drift. Confirm they are present and correct in
      `globals.css`, do not add them to Paper.
- [ ] Any genuine value mismatch → fix **in `globals.css`**, note in §7. **Do
      not add a token.** If a component seems to need one, stop — that is a §10
      item, not a build.

### 6.2 Tier 1 — restyle every primitive, every state
- [ ] The 24-name list in §5.1. For each: restyle resting **and** hover,
      `:focus-visible` (`--focus-ring`: 2px bg + 4px ring), disabled, active,
      `aria-invalid`, and every Radix `data-state`. A primitive that keeps
      shadcn's default hover is a defect.
- [ ] Keyboard navigation and ARIA stay exactly as Radix ships them — do not
      touch behaviour, only appearance.
- [ ] Build `date-picker.tsx` (Calendar-in-Popover) and restyle the Sonner
      theme (that is `Toast`). Restyle `form.tsx` / `input-group.tsx` /
      `label.tsx` too (error / `aria-invalid` styling).
- [ ] No business logic in any primitive. No import from `@/modules/*`. No
      barrel file (`coding-standards.md` §2 / §14).

### 6.3 shadcn blocks
- [ ] **Sidebar** — add the block, restyle to the spec-cards band (`5TI-0`,
      pull with `get_jsx`), keep collapse state / ⌘-shortcut / mobile Sheet /
      persistence, strip demo nav + teams switcher. This is where the app shell
      starts (§6.6).
- [ ] **login-form** — add the block, restyle to tokens, 44px controls, accent
      primary, strip demo copy + social row, wire `/sign-in` to it (keep the
      PHASE-00A `auth-client` + `react-hook-form` + `zodResolver` + server-error
      mapping — swap the presentation, not the logic).
- [ ] **DataTable** — add the block + `@tanstack/react-table` if the block
      needs it; keep sort / column-visibility / row-selection; build the premium
      table styling **and** the mobile card fallback per the DataTable band
      (`58H-0`) and §5.2. `wide:true` column → the one permitted horizontal
      scroll.
- [ ] Each of the three: demote to Tier 2, add to `/dev/gallery` with all
      states, no upstream tracking.

### 6.4 Tier 2 — the approved composite set
- [ ] Every row of the §5.3 table. Built from Tier 1. **Semantic tokens only**
      — a primitive token or raw hex in a Tier 2 component is a defect
      (`design-system.md` §13.1/§13.2).
- [ ] Match each component to its band on artboard `4U2-0` — pull exact values
      per band with `get_jsx`, not from a screenshot.
- [ ] `MoneyDisplay`: `cents` in, `formatMoney()` at the render boundary only
      (INV-M1/M5), `tabular-nums` always; zero / negative / null (em dash) /
      loading.
- [ ] `DayAvailabilityStrip`: worst-day encoding exactly per
      `inventory-availability.md` §7 (worst day = `byDay` entry `=== minAvailable`;
      `warning-subtle` when `< checkedQuantity`, `success-subtle` otherwise,
      `border-strong` outline, ties → earliest day). Own `overflow-x` container.
- [ ] `PageHeader`: implement the `capturedAt?` slot **or** decide to drop it
      (§5.4) — record which in §7.
- [ ] `ClientPicker` / `CatalogItemPicker` / `SearchInput`: one internal
      `SearchableList` (§5.4), not exposed as a public composite.
- [ ] `LineItemRow` `document` variant is read-only always (INV-I2), snapshot
      values only (INV-P2). `voice` variant flag text never truncates.
- [ ] `TranscriptPanel` has no collapsed state (INV-V3). `VoiceReviewField`
      flag = border + uppercase label + icon, never colour alone (INV-V5).
- [ ] `ConflictBanner` (no link, INV-A6) and `DocumentNoticeBanner` (always a
      link, INV-I3) are two components — do not merge.
- [ ] One component per file, PascalCase file + export (`coding-standards.md`
      §2). Server Components unless state / effects / browser APIs are needed;
      `'use client'` as low as possible.

### 6.5 `/dev/gallery`
- [ ] Dev-only route at `src/app/dev/gallery/` (or a `(dev)` group) rendering
      every component in every state per the §5.5 matrix, as separate static
      forced-state instances (`data-force-state="…"`), **not** real hover.
- [ ] **Excluded from production builds.** Mechanism (implementer's call, state
      it in §7): a `not-found()` in the route when `process.env.NODE_ENV ===
      'production'`, and/or the route segment gated behind an env check, and/or
      a build-time exclusion. It must not ship a reachable page to production.
      It still sits behind the existing auth middleware.
- [ ] The forced-state CSS approach is shared, so a component's `hover` / etc.
      appearance in the gallery is the same rule real `:hover` triggers.

### 6.6 App shell + navigation, responsive
- [ ] App shell layout in `src/app/(app)/layout.tsx` (or a nested layout):
      Sidebar nav + content region. Nav items are the real destinations that
      exist now (Dashboard/Home only) plus the Voice-capture pill +
      `VoiceQueueIndicator` (zero-state) + user row / sign-out. Do **not** add
      nav links to screens that do not exist yet.
- [ ] Mobile (< `md`): Sidebar collapses to the Sheet fallback; a hamburger in
      the `PageHeader` mobile top-bar opens it.
- [ ] `/` stays a plain landing page (greets the signed-in user; keep the
      PHASE-00A sign-out). Restyled to tokens but no dashboard content — that is
      Phase 4.
- [ ] Server Components by default; `'use client'` only where the Sidebar
      collapse / Sheet needs it, as low as possible.
- [ ] Navigate the shell at **390px** and **1440px** — verify visually via
      screenshots (Playwright MCP or `pnpm dev` + browser). Frontend agents do
      not write Playwright specs (`testing.md` §4).

### Done when
- [ ] `globals.css` tokens confirmed against the Paper theme; any fix recorded
      in §7
- [ ] Every Tier 1 primitive restyled in every state — no shadcn-default state
      left anywhere
- [ ] The 3 blocks restyled, demoted to Tier 2, in the gallery with all states
- [ ] Every Tier 2 composite from `ui-conventions.md` §1 built, semantic tokens
      only, matching its band on `4U2-0`
- [ ] `/dev/gallery` renders every component in every state as forced-state
      instances, and is excluded from production
- [ ] App shell navigable at 390px and 1440px
- [ ] `pnpm verify` passes (typecheck + lint + test)
- [ ] §7 updated; §10 updated or marked "no recommendations"

---

## 7. Status log

Append-only. This is the handoff mechanism and it survives context loss.

```
### 2026-09-07 · Orchestrator — planning
Contract defined: the component inventory in §5 (24 Tier 1 primitives, 3 shadcn
blocks demoted to Tier 2, 28 Tier 2 composites incl. the 12 §12 promotions from
D3, the gallery state matrix). No schema, no actions — infra phase.

Token check (D4 item 1, pre-verified against Paper): globals.css @theme and the
Paper theme (contentHash tokens 72796a7d) are equivalent for every category
Paper carries — neutral ramp, accent ramp, status hues, all semantic + business-
semantic colours, spacing, radius, type sizes, weights, breakpoints, containers.
Paper carries no motion / elevation / density / focus-ring / per-step type
metric tokens; those are code-only and correct in globals.css. No drift, no
token to add. Session 2 re-confirms as item 6.1 but is not expected to find a
change.

Carried D3-worklog recommendations folded into the contract:
- Rec #2 (PageHeader capturedAt chip) → §5.4: optional `capturedAt?` slot, or
  drop-and-record. Session 2 decides on the bench.
- Rec #4 (shared SearchableList) → §5.4: one internal helper behind the 3
  pickers, not a public composite.
- Rec #1 RESOLVED (worst-day encoding in inventory-availability §7) — built to
  in §5.3 / §6.4.
- Rec #3 (ConfirmDialog vs real flow) and Rec #5 (/q/[token] bare frame) parked
  with a plan — not re-raised.

Gap analysis: no material gap found that blocks the work. Two items go to §10.

### <date> · Implementation (Session 2)
Completed:
Contract changes (recorded here first):
Deviations from plan, and why:
capturedAt slot — implemented / dropped (which, and why):
/dev/gallery production-exclusion mechanism used:
Dependencies added (if any) and the reason:

### <date> · Orchestrator — D5 + review (fresh session)
Fidelity check (3–4 gallery components exported to Paper vs. running-gallery
screenshots): match / drift — and therefore MCP trusted for D6 / Snapshot path.
Components reconciled against artboard 4U2-0:
Invariants checked (§4):
Violations found:
Resolved:
Status set to Complete:
```

---

## 8. Acceptance criteria

From `build-plan.md` "PHASE-00B" + "Definition of done", and `design-system.md`
§1 (D4/D5). Not paraphrased.

- [ ] *(build-plan PHASE-00B / Verify)* Navigate the shell at 390px and 1440px.
- [ ] *(build-plan PHASE-00B / Verify)* Gallery renders every component in every
      state.
- [ ] *(build-plan PHASE-00B / Build)* Tokens from D1 in `globals.css` as a
      Tailwind v4 `@theme` block — confirmed against the Paper theme.
- [ ] *(build-plan PHASE-00B / Build)* Tier 1 primitives restyled against the
      tokens, starting from the shadcn sidebar block for the shell.
- [ ] *(build-plan PHASE-00B / Build)* The approved Tier 2 composites from D3.
- [ ] *(build-plan PHASE-00B / Build)* `/dev/gallery` with every component in
      every state as a forced-state instance, excluded from production.
- [ ] *(build-plan PHASE-00B / Build)* App shell and navigation, responsive.
- [ ] *(design-system §1 D4)* shadcn primitives restyled against the tokens +
      the approved composites + the gallery.
- [ ] *(design-system §1 D5)* Gallery exported to Paper over MCP; fidelity
      verified against gallery screenshots for 3–4 components; any drift against
      the D3 artboard `4U2-0` reconciled once, here.
- [ ] *(ui-conventions §1)* Every §12-promoted composite has its consequence 3
      satisfied (Tier-2 build + gallery entry) — until then it is only proposed.
- [ ] *(Definition of done)* `pnpm verify` passes; no invariant test modified;
      loading / empty / error / populated states all exist (in the gallery and
      the shell); the review pass found no violations; §10 decisions all
      recorded; §7 complete; **Current phase** in `build-plan.md` updated.

## 9. Demo script

Run in a browser before marking complete.

1. From a clean state: `pnpm install && docker compose up -d db && pnpm db:reset
   && pnpm dev`.
2. Go to `/sign-in` — it is the restyled login-form (tokenised, 44px controls,
   accent button), not shadcn default. Sign in with the seeded credentials.
3. Land on `/` inside the app shell: gradient Sidebar (240px, ghost-underline
   active item), content region, Voice-capture pill with a zero-state queue
   indicator, user row.
4. Resize to 390px — the Sidebar collapses; the mobile top-bar hamburger opens
   it as a Sheet. Resize to 1440px — it is back to the fixed panel.
5. Go to `/dev/gallery` — every component renders in every state as a static
   instance (hover / focus / disabled / loading / error / empty / overflow all
   visible without interacting).
6. Confirm `NODE_ENV=production pnpm build` (or the chosen mechanism) does not
   serve `/dev/gallery`.

## 10. Recommendations and decisions

**Check this section before proposing.** Parked already (D3-worklog, not
re-raised): ConfirmDialog-vs-real-flow (#3, verify in the phase that builds each
action), `/q/[token]` bare frame (#5, D6).

### Orchestrator — gap analysis

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| 1 | GAP | `/dev/gallery` production-exclusion mechanism is unspecified | S | do now (in this phase) | — |
| 2 | IMPROVEMENT | Gallery needs a forced-state CSS convention decided once | S | do now (in this phase) | — |

**Details**

> **[GAP] `/dev/gallery` production-exclusion mechanism is unspecified**
> `design-system.md`, `ui-conventions.md` §2, and `build-plan.md` all say the
> gallery is "excluded from production builds", but none say how, and the Next.js
> App Router does not exclude a route by default. Without a decision the
> implementer guesses, and a guess that half-works (e.g. a client-only check)
> ships a reachable dev route to Susan's production site. This phase *is* the
> gallery's home, so the decision belongs here, not later.
> Cost: S · Recommendation: do now — §6.5 lists the candidate mechanisms
> (`notFound()` on `NODE_ENV==='production'`, env-gated segment, build-time
> exclusion); the implementer picks one and records it in §7.
> **Decision:** —

> **[IMPROVEMENT] Gallery needs a forced-state CSS convention decided once**
> The gallery renders `data-force-state="hover"` as *static* instances, but
> every Tier 1 primitive also has a real `:hover` / `:focus-visible` rule. If
> the forced-state styles are written separately from the real-state styles they
> will drift, and the gallery stops being a faithful preview — which is its
> whole purpose (`ui-conventions.md` §2). Recommend the restyle authors a single
> selector list per state (e.g. `&:hover, &[data-force-state="hover"]`) so one
> rule serves both, and the gallery documents that convention at the top of the
> route. Small if done during the Tier 1 restyle; a rewrite if bolted on after.
> Cost: S · Recommendation: do now — fold into §6.2 as the primitives are
> restyled.
> **Decision:** —

### Implementation session

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| | | | | | |

### Review session (D5)

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|

---

### Carried forward

| Item | From | Target |
|---|---|---|
| ConfirmDialog copy + error surface checked against real server-action returns | D3-worklog Rec #3 | The phase that builds issue / accept / void (PHASE-02) |
| Shared-quote public view `/q/[token]` — no "bare document frame" composite exists | D3-worklog Rec #5 | D6 |

### Blocking questions

- None.
