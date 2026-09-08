# PHASE-00B · Design system in code

**Status:** Complete
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

## 6b. Handoff — Tier 2 composites (follow-up implementation session)

> Session 2 (2026-09-07) took the vertical slice: §6.1 tokens, §6.2 Tier 1,
> §6.3 the three blocks, §6.6 the app shell, and a §6.5 gallery covering only
> Tier 1 + the blocks. This session finishes §6.4 — the 28 Tier 2 composites —
> and extends the gallery to cover them. §7 has the full slice work log; §10
> "Implementation session" #1 is this gap.

```
You are the implementation agent for the PHASE-00B FOLLOW-UP of the Sunflower
Events system — the Tier 2 composite set (design stage D4, remainder).

Read CLAUDE.md, then docs/delivery/phases/PHASE-00B.md IN FULL, paying
attention to §5.3 (the composite contract), §5.4 (folded-in decisions), §5.5
(the gallery state matrix), §7 (what the vertical slice already built and
why), and §10 (do not re-raise anything already there).

Read from §3 only: domain-invariants.md §1 + §9, coding-standards.md §2/§7/§8/
§10/§13, design-system.md §2/§3–11/§13, ui-conventions.md §1 (THE BUILD LIST)
+ §2/§4/§7, inventory-availability.md §7.

PAPER: file 01M1X43Q66HDD6TF72TYYWH3KE, page "D3 — Components", artboard
"D3 — Components (Approved Composite Set)" id 4U2-0. Each composite has a
drawn band there in every state. Call get_guide({topic:"paper-mcp-instructions"})
once, then get_jsx on a band for its EXACT values — never read them off a
screenshot. Band IDs:
  4U7-0 StatusBadge · 4X8-0 MoneyDisplay · 4Y0-0 QuantityInput ·
  4YY-0 AvailabilityBadge · 500-0 DayAvailabilityStrip · 51H-0 LineItemRow ·
  573-0 PageHeader · 58H-0 DataTable · 5AO-0 Controls (SegmentedToggle /
  DateRangeControl / CalendarSpanControl / SearchInput) · 5D6-0 Pickers
  (ClientPicker / CatalogItemPicker) · 5ES-0 TotalsPanel · 5G9-0 EmptyState ·
  5HH-0 ConfirmDialog · 5IX-0 ConflictBanner · 5JT-0 DocumentNoticeBanner ·
  5KU-0 VoiceMicButton · 5M5-0 VoiceReviewField · 5NC-0 VoiceQueueIndicator ·
  5OJ-0 TranscriptPanel · 5PY-0 CalendarGrid + EventChip ·
  5RU-0 AgendaDayGroup + AgendaEventRow · 5TI-0 shadcn block spec cards.
Do NOT edit Paper. Read only. Drift you spot goes to §10, not a Paper edit —
that is the D5 orchestrator session's call.

STATE OF THE CODE (branch phase-00b, all uncommitted):
- Tokens: src/styles/globals.css — confirmed against Paper, do not touch
  except a genuine value mismatch (record in §7). `--color-ring` and the
  forced-state @custom-variant blocks were added by the slice — leave them.
- Tier 1: src/components/ui/ — all 24 primitives token-styled, every state.
  Plus date-picker.tsx (Calendar-in-Popover) and sidebar.tsx (trimmed block).
  Compose from these. Do not restyle them.
- Blocks (Tier 2, done): src/components/{AppSidebar,AppShellTopBar,LoginForm,
  DataTable,VoiceQueueIndicator}.tsx. DataTable.tsx is the premium table +
  card-projection contract over a plain typed column model — NO
  @tanstack/react-table yet (add it only if a composite you build needs the
  sort/selection plumbing, and record why in §7). VoiceQueueIndicator.tsx is
  already built — the shell needed it.
- Gallery: src/app/dev/gallery/{page,gallery-shell,tier1,blocks}.tsx.
  gallery-shell.tsx exports <GallerySection> and <StateRow> — reuse them.
  The route is at src/app/dev/ (literal /dev/gallery), excluded from prod by
  src/app/dev/layout.tsx (notFound() when NODE_ENV==="production"). Add a
  tier2.tsx sibling and render it from page.tsx.
- Forced-state: `data-force-state="hover" | "focus" | "active"` on any element
  makes globals.css fire that primitive's real state rule. `disabled` /
  `aria-invalid` / Radix `data-state` are set as real attributes/props in the
  gallery. Do NOT force-mount a Radix Select/Dialog/Sheet `open` in the
  gallery — it locks body scroll. Show trigger states live; open one to see
  the panel.

WHAT TO BUILD — every row of PHASE-00B §5.3, built from Tier 1, SEMANTIC
TOKENS ONLY (a primitive token like `--color-neutral-900` or a raw hex in a
Tier 2 file is a defect — design-system.md §13.1/§13.2). One component per
file, PascalCase file + export, in src/components/. Server Components unless
state/effects/browser APIs are needed; 'use client' as low as possible.
No barrel file. No import from @/modules/* (none exist).

  Money & quantity   MoneyDisplay, QuantityInput
  Status             StatusBadge, DocumentStatusBadge, AvailabilityBadge
  Availability       DayAvailabilityStrip
  Pickers            ClientPicker, CatalogItemPicker, SearchInput
                     + one internal SearchableList (NOT a public composite —
                       src/components/internal/searchable-list.tsx or
                       co-located; §5.4)
  Documents          LineItemRow (quote|document|voice), TotalsPanel
                     (ledger|statcards), PageHeader, EmptyState, ConfirmDialog
  Banners            ConflictBanner, DocumentNoticeBanner  (two components —
                     do NOT merge)
  Voice              VoiceMicButton, VoiceReviewField, TranscriptPanel
  Calendar           SegmentedToggle, DateRangeControl, CalendarSpanControl,
                     CalendarGrid, EventChip, AgendaDayGroup, AgendaEventRow

INVARIANTS TO ENFORCE AT THE COMPONENT LEVEL (§4 — no data layer exists):
  INV-M1/M5  MoneyDisplay takes `cents: number | null`, never a pre-formatted
             string; calls formatMoney() (lib/money.ts) INTERNALLY, at the
             render boundary only; font-variant-numeric: tabular-nums always;
             Geist Mono. States: positive, zero, negative (credit), null
             (em dash), loading.
  INV-M5     QuantityInput tabular-nums; PageHeader uses Geist Mono for
             reference numbers.
  INV-P2     LineItemRow document/quote variants take snapshot values as
             props — the component API implies NO catalog lookup.
  INV-I2     LineItemRow document variant is read-only ALWAYS — no editable
             control, no delete.
  INV-A6     ConflictBanner and QuantityInput over-availability state WARN
             visually; neither disables input or submission; ConflictBanner
             carries NO forward link.
  INV-I3     DocumentNoticeBanner ALWAYS renders the forward-link button.
  INV-V3     TranscriptPanel has no collapsed state — transcript inline in
             every state, including extraction-failed.
  INV-V5     VoiceReviewField flag = 1px warning border + uppercase label +
             triangle icon; colour is additive, never alone.

FOLDED-IN DECISIONS (§5.4):
  - PageHeader `capturedAt?: string` slot — implement it (12px muted mono
    pill), OR decide the transcript panel's "0:23 · Deepgram" line already
    covers it and DROP it. Record which in §7.
  - SearchableList shared by the 3 pickers — one internal helper, not exported.

DAYAVAILABILITYSTRIP — worst-day encoding EXACTLY per inventory-availability.md
§7: worst day = the byDay entry whose available === minAvailable (ties →
earliest day). That cell is tinted warning-subtle when its availability <
checkedQuantity, success-subtle otherwise, plus a border-strong outline.
Every other cell untinted. Own overflow-x:auto container; page body never
scrolls horizontally. It is the DataTable `wide:true` region.

GALLERY — extend src/app/dev/gallery with a tier2.tsx section per the §5.5
matrix: every state (resting · hover · focus · disabled · active ·
aria-invalid/error · loading · empty · long-content overflow · every Radix
data-state) PLUS each component's own variant axis (StatusBadge × 19 status
values × 3 domains; LineItemRow × 3 variants; TotalsPanel × 2 layouts; etc.).
Separate static instances, forced-state props, not real interaction.

VERIFY: `pnpm verify` must pass (typecheck + lint + test). Do not disable a
check or modify an invariant test. Also run `pnpm build` — the slice found it
was broken on main and verify does not catch it (§10 Implementation #2).
Then run the app (docker compose up -d db && pnpm dev — DB is already
migrated + seeded; login susan@sunflowerevents.example /
sunflower-dev-password) and screenshot /dev/gallery to confirm every new
section renders and the page scrolls.

CLOSE:
  - Append a work log to §7: what was built, the capturedAt decision, any
    @tanstack/react-table addition + reason, any globals.css fix, any
    deviation from §5.3.
  - §10 "Implementation session" table: mark #1 (the Tier 2 gap) RESOLVED;
    add any NEW recommendation (max 5 total, ranked; check §10 first — the
    parked D3 items #3/#5 and the resolved orchestrator #1/#2 stay as they
    are).
  - Do NOT run D5 — that is the separate orchestrator session (§6 planning
    entry, "Session 3"). Leave Status: Planning.
```

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

### 2026-09-07 · Implementation (Session 2) — vertical slice

**Scope taken (user decision, this session): the vertical slice.** §6.1 tokens,
§6.2 Tier 1, §6.3 the three blocks, §6.5 gallery (Tier 1 + blocks), §6.6 app
shell. The 28 Tier 2 composites in §5.3 and their gallery bands are **deferred to
a PHASE-00B follow-up session** — see §10 item 1. Susan's real flow
(sign-in → shell → home, responsive) is delivered.

**Completed:**
- §6.1 Tokens confirmed. `globals.css` `@theme` vs the Paper theme
  (`contentHash.tokens` `72796a7d`) — equivalent for every category Paper
  carries. Code-only tokens (motion, elevation, density, focus-ring,
  per-step type metrics) present and correct. **No drift, no token added.**
  Matches the orchestrator's pre-verification in the §7 planning entry.
- §6.2 Tier 1. The 24-name list was already restyled to tokens in a prior
  pass (file mtimes 2026-09-07 09:00–09:23 — `components.json` `style:
  "radix-nova"`, `-b radix` base per PHASE-00A decision 8). This session:
  audited every primitive against the state matrix (§5.5); added the shared
  **forced-state convention** (§10 item 2 — resolved) so `data-force-state`
  in the gallery drives the same rule as the real pseudo-class; added
  `date-picker.tsx` (Calendar-in-Popover); confirmed the Sonner theme is
  tokenised (that is `Toast`). Raw values remaining in Tier 1
  (`bg-black/10` scrims, `bg-neutral-900` tooltip, `bg-neutral-100`
  skeletons) are **permitted in Tier 1** by `ui-conventions.md` §9.2 / §2
  ("no raw hex outside `globals.css` and Tier 1") — §13.1/§13.2 bind Tier 2.
  Left as-is.
- §6.3 The three blocks, built as Tier 2 in `src/components/`:
  `app-sidebar.tsx` + `sidebar.tsx` (primitive), `login-form.tsx`,
  `data-table.tsx`. Restyled to the spec-cards band (`5TI-0`) and the
  DataTable band (`58H-0`), pulled with `get_jsx`. No `@tanstack/react-table`
  — see Dependencies below.
- §6.5 `/dev/gallery` — every Tier 1 primitive and the three blocks in every
  applicable state as forced-state instances.
- §6.6 App shell at `src/app/(app)/layout.tsx`; `/sign-in` rewired to
  `login-form.tsx`; `/` restyled, plain. Nav links: Home only (no
  destinations exist yet). Responsive: Sidebar → Sheet below `md`, hamburger
  in the shell top-bar.

**Contract changes (recorded here first):** none. The §5 inventory is
unchanged; the deferred composites are still the contract, just not built
this session.

**capturedAt slot:** not reached — `PageHeader` is a deferred Tier 2
composite. The §5.4 decision (implement or drop) moves to the follow-up
session with the rest of Tier 2.

**/dev/gallery production-exclusion mechanism used:** the route segment
group `src/app/(dev)/` with a layout that calls `notFound()` when
`process.env.NODE_ENV === "production"`. It still sits behind the existing
auth middleware. §10 item 1 from the orchestrator's gap analysis — resolved.

**globals.css fixes recorded (§6.1 says any genuine mismatch is fixed here):**
- `--color-ring: var(--color-border-focus)` added. Not a design token — the
  scaffold's own base layer (`* { @apply … outline-ring/50 }`) referenced a
  `ring` colour that was never defined; dev (Lightning CSS) tolerated it, the
  Turbopack **production** build failed on it (`Cannot apply unknown utility
  class outline-ring/50`). `pnpm build` was already broken on `main` before
  this session. Aliased to the one focus hue so it stays single-sourced
  (design-system.md §10). No Paper equivalent needed.
- Forced-state convention (below) added as three `@custom-variant` extensions.

**Forced-state CSS convention (§10 orchestrator IMPROVEMENT #2 — resolved):**
`globals.css` extends the built-in `hover` / `focus-visible` / `active`
variants so each ALSO matches `&[data-force-state="…"]`. One rule serves both
the real pseudo-class and the gallery's static instance — a primitive's
`hover:` utility fires for `data-force-state="hover"` with no separate
styling to drift. `disabled` / `aria-invalid` / Radix `data-state` are set as
real attributes in the gallery, so they need no alias. Verified in the
running gallery: the Button band's six columns (resting / hover / focus /
active / disabled / aria-invalid) each render distinctly.

**Dependencies added:** none. `@tanstack/react-table` was **not** added — the
vertical slice has no screen that renders a real `DataTable` yet, and the
sort/selection plumbing has no consumer to exercise it. `data-table.tsx`
ships the premium styling + the card-projection contract (the parts that are
"ours" per §5.2) over a plain typed column model; the follow-up session adds
`@tanstack/react-table` when a real table screen (D6/PHASE-01) needs the
plumbing. Recorded so the choice is visible, not silent.

**Live verification (this session):** `pnpm verify` passes (typecheck + lint +
32/32 tests). `pnpm build` (NODE_ENV=production) passes; an unauthenticated
request to `/dev/gallery` 307s to `/sign-in` (middleware), and the `(dev)`
`notFound()` fires for a signed-in prod request. Playwright MCP at 1440px:
`/sign-in` restyled, sign-in with the seeded credentials → `/` in the shell
(240px ink-gradient sidebar, ghost-underline active "Home", footer
Voice-capture pill + user row + sign-out). At 390px: sidebar → Sheet,
hamburger top-bar opens the full ink-gradient drawer. Gallery renders every
Tier 1 primitive + the 3 blocks; the Button band's forced-state columns
(resting / hover / focus / active / disabled / aria-invalid) render
distinctly. **Not done this session:** the D5 Paper export/reconcile
(Session 3), the deferred Tier 2 composites (follow-up).

**Files touched:** `globals.css`; new `components/ui/{sidebar,date-picker}.tsx`;
new `components/{AppSidebar,AppShellTopBar,LoginForm,DataTable,VoiceQueueIndicator}.tsx`;
new `app/(app)/layout.tsx`, new `app/dev/layout.tsx` +
`app/dev/gallery/{page,tier1,blocks,gallery-shell}.tsx`; edited
`app/(app)/{page,sign-out-button}.tsx`, `app/(auth)/sign-in/page.tsx`;
deleted `app/(auth)/sign-in/sign-in-form.tsx`.

### 2026-09-08 · Tier 1 fidelity pass + DataTable D9-0 revision

**Tier 1 fidelity pass** (user asked for a real visual diff against Paper, not
"built to spec"). Full record: `docs/delivery/PHASE-00B-tier1-fidelity.md`.
Pulled reference values from Paper (spec-card `5TI-0`, D2 screens `HA-0` /
`1U2-0`, ConfirmDialog band `5HH-0`), diffed each primitive, applied fixes,
verified against browser-computed styles:
- `Button` default 32→36px / pad 10→14px (designed default = code's old `lg`);
  `sm`/`lg`/`icon*` pinned to `--control-h-*` tokens.
- `DatePicker` trigger `size="lg"`→`"default"` (40→36px).
- `FormLabel` 14px → 12/500/text-secondary; `FormItem` gap 8→6px; base
  `Label` (inline) 14→13px.
- `Switch` thumb 16→14px, track 18.4→18px + 2px inset, thumb `bg-neutral-0`.
- `Dialog` padding 16→20px (+ footer/close offsets), `DialogTitle` weight
  500→600 / line-height 22.
- Primitives with **no Paper reference** (checkbox, radio, popover, tooltip,
  dropdown, calendar, scrollarea, separator, skeleton, sonner) verified
  token-consistent; listed in the fidelity doc for the D5 pass.
- **Radius inconsistency in the design** flagged: QB toolbar buttons draw 4px,
  ConfirmDialog / login-form controls draw 6px (not a token). Code uses
  `--radius-md` (4px) per design-system §6. D5 to ratify or add a step.

**DataTable — D9-0 revision** (user redesigned the table, Paper `1-0/D9-0`,
2026-09-08). Sharp corners (no container radius), header on a new
`--color-table-header` blue-grey wash with a heavier `--color-table-header-border`
(neutral-700) bottom rule, header labels 12/500/normal-case/text-primary
(was 11/600/uppercase), **zebra striping removed**. Mobile card projection
unchanged (keeps rounded corners + uppercase field-label captions).
- **New tokens** added to `globals.css` AND the Paper theme (kept in sync;
  `contentHash.tokens` `72796a7d` → `6881a1e6`): `--color-blue-grey-100`
  (primitive), `--color-table-header` (semantic surface), `--color-table-header-border`
  (semantic border). This is the phase's first token addition — recorded here
  per §6.1.
- `ui-conventions.md` §1 DataTable entry updated.
- **Paper D3 spec-card `58H-0` is now stale** — it still shows the old
  surface-sunken header / uppercase labels / radius. D5 reconciles it (or the
  band is re-drawn) since D9-0 supersedes it.

**Tier 2 gallery scroll-lock — FIXED.** `src/app/dev/gallery/tier2.tsx`
force-mounted two `ConfirmDialog`s with `open`, which locked body scroll and
froze the whole gallery (the §6b handoff warned against exactly this). Swapped
the two `open` instances for a static `ConfirmDialogPanelPreview` (gallery-only
div mirroring the panel); the resting state still opens a real dialog from its
trigger. Verified the page scrolls, 0 mounted overlays.

### 2026-09-08 · Implementation (follow-up) — Tier 2 composites

**Scope: §6.4 in full — the 28 Tier 2 composites + their §5.5 gallery bands.**
Built from Tier 1, semantic tokens only, one file per component in
`src/components/`. Paper values pulled with `get_jsx` on every band (4U7-0 …
5RU-0) before building — never read off a screenshot.

**Built (24 files, 28 exports):**
- Money/qty: `MoneyDisplay.tsx` (cents|null in, `formatMoney()` at the render
  boundary, tabular-nums, Geist Mono; positive/zero/negative/null/loading),
  `QuantityInput.tsx` (`row` 24px / `standalone` 36px ± steppers;
  over-availability = warning border, never blocks — INV-A6; disabled;
  aria-invalid).
- Status: `StatusBadge.tsx` (6px dot + label, no chip; document 10 / event 4 /
  inventory 5; terminal → muted label; filter-chip interaction states),
  `DocumentStatusBadge.tsx` (named wrapper), `AvailabilityBadge.tsx` (wraps
  inventory severity; "N of M free" / "N free · day"; loading / not-checked).
- Availability: `DayAvailabilityStrip.tsx` — worst-day encoding EXACTLY per
  inventory-availability.md §7 (`byDay` entry === `minAvailable`, ties →
  earliest; warning-subtle when `< checkedQuantity`, else success-subtle, +
  border-strong outline; every other cell untinted). Own `overflow-x:auto`
  container.
- Pickers: `ClientPicker.tsx`, `CatalogItemPicker.tsx`, `SearchInput.tsx`, and
  `internal/searchable-list.tsx` — ONE internal `SearchableList` behind the
  three pickers (§5.4), not exported, no gallery entry of its own. See
  Deviations below re: Combobox base.
- Documents: `LineItemRow.tsx` (`quote` | `document` | `voice`; document is
  read-only ALWAYS — INV-I2; snapshot values as props, no catalog lookup —
  INV-P2; voice flag text never truncates — INV-V5), `TotalsPanel.tsx`
  (`ledger` | `statcards`, all figures via `MoneyDisplay`),
  `PageHeader.tsx` (desktop + mobile top-bar; Geist Mono for reference-number
  titles; empty / error states), `EmptyState.tsx`, `ConfirmDialog.tsx`
  (Dialog base; confirm button names the action; pending / error-stays-open).
- Banners: `ConflictBanner.tsx` (full + compact pill; NO forward link —
  INV-A6) and `DocumentNoticeBanner.tsx` (`danger` | `neutral`; ALWAYS a
  forward-link button — INV-I3). Two components, not merged.
- Voice: `VoiceMicButton.tsx` (`fab` | `pill`; idle / recording / processing),
  `VoiceReviewField.tsx` (flag = warning border + uppercase label + triangle,
  colour never alone — INV-V5; resting = passthrough), `TranscriptPanel.tsx`
  (no collapsed state — INV-V3; transcript inline in every state incl.
  extraction-failed).
- Calendar: `SegmentedToggle.tsx`, `DateRangeControl.tsx`,
  `CalendarSpanControl.tsx` (composed from SegmentedToggle + icon buttons),
  `CalendarGrid.tsx` + `EventChip.tsx`, `AgendaDayGroup.tsx` +
  `AgendaEventRow.tsx`.

**Gallery:** `src/app/dev/gallery/tier2.tsx` added, rendered from `page.tsx`
after `<BlocksGallery />`. Nine sections mirroring §5.3, every state + each
component's variant axis as separate static forced-state instances. Reuses
`<GallerySection>` / `<StateRow>` from `gallery-shell.tsx`. Interactive
popovers/dialogs are shown at their trigger (a force-mounted Radix overlay
engages `react-remove-scroll` and freezes the page); `ConfirmDialog` pending /
error use a static `ConfirmDialogPanelPreview` mirror kept in sync by eye.

**§5.4 `capturedAt` decision: DROPPED.** Band 573-0 draws no capture-time chip,
and `TranscriptPanel`'s provenance line ("0:23 · Deepgram") already carries
capture metadata on the one screen that needs it. `PageHeader` has no
`capturedAt` prop.

**@tanstack/react-table: NOT added.** No composite this session needed the
sort/selection plumbing — `DataTable.tsx` still models sort as a controlled
`sort` prop. Unchanged from the vertical slice's decision; the real table
screen (D6/PHASE-01) adds it.

**globals.css: no change by this session.** The DataTable D9-0 revision (see
below) added `--color-blue-grey-100` / `--color-table-header` /
`--color-table-header-border` — that was a separate design revision landed
alongside, not this session's work.

**Contract changes (§5): none.** The §5.3 inventory is built as written.

**Deviations from §5.3, recorded:**
1. **Pickers compose `Popover` + `SearchableList`, not the base-ui `Combobox`
   primitive.** §5.3 says "Combobox base". The base-ui Combobox API (item
   collections, async filtering) has no consumer to shape it against with no
   data layer, and wiring it blind risked getting the contract wrong. The
   three pickers are the visual + interaction contract (trigger 36px, popover
   surface-raised + shadow-md, options 32px, keyboard nav in `SearchableList`,
   create / no-match / loading / empty states) and D6 swaps the internals to
   the Combobox primitive when real client/catalog queries exist. `SearchableList`
   is the seam that keeps that swap local.
2. **DataTable + LineItemRow header treatment now follows the D9-0 revision**
   (blue-wash band, heavy `--color-table-header-border` rule, 12/500
   normal-case labels, sharp corners, no zebra) — this DIVERGES from bands
   58H-0 / 51H-0 on Paper, which still show the pre-D9-0 style
   (surface-sunken, 11/600 uppercase, rounded, zebra). Logged for D5 to
   reconcile — see §10. CalendarGrid's weekday header and AgendaDayGroup's
   date header stay on `surface-sunken` (they are not data-column headers and
   the bands draw them that way).

**Visual-diff pass (this session, section by section vs. the artboard bands):**
running gallery at 1440px screenshotted per section against `get_screenshot`
of each band. Verdicts: Money/qty MATCH · Status MATCH · Availability MATCH
(gallery day-labels re-anchored to a Saturday so they read like the band) ·
Pickers MATCH (open popover shown at the trigger, not statically) · Documents
MATCH (document-variant name confirmed regular weight per 51H-0) · Banners
MATCH · Voice MATCH (VoiceReviewField near-pixel) · Calendar MATCH
(AgendaDayGroup near-pixel). Drifts found were gallery-data or Paper-mock
issues, not component defects — the two real Paper-vs-code divergences
(minus-sign glyph, "Balance" vs "Balance computed", and the D9-0 header) are
in §10 for D5.

**Responsive:** gallery navigated at 390px — one page-level horizontal-scroll
bug found and fixed (the `LineItemRow variant="document"` gallery wrapper
lacked `overflow-x-auto`, so its wide fixed-column row pushed the page body to
657px). After the fix `document.scrollWidth === innerWidth === 390`. Wide
LineItemRow / DataTable regions scroll inside their own containers only.

**Verification:** `pnpm verify` passes (typecheck + lint + 32/32 tests).
`pnpm build` (production, Turbopack) passes, exit 0 — `/dev/gallery`
prerenders (231 kB). App run: signed in with the seeded credentials, every new
tier2.tsx section renders and the page scrolls vertically only.

**Gotcha for the next session:** never run `pnpm build` and `pnpm dev`
concurrently against this tree — it corrupts `.next/` (ENOENT on
`_buildManifest.js.tmp.*`), forcing `rm -rf .next` + restart. This can also be
triggered by a second agent in the same session. Sequence: verify → build →
dev. Dev falling back to port 3001 gets a 403 on `/api/auth/sign-in/email`
because `BETTER_AUTH_URL` is pinned to `:3000`.

**Files touched:** new `src/components/{MoneyDisplay,QuantityInput,StatusBadge,
DocumentStatusBadge,AvailabilityBadge,DayAvailabilityStrip,ClientPicker,
CatalogItemPicker,SearchInput,LineItemRow,TotalsPanel,PageHeader,EmptyState,
ConfirmDialog,ConflictBanner,DocumentNoticeBanner,VoiceMicButton,
VoiceReviewField,TranscriptPanel,SegmentedToggle,DateRangeControl,
CalendarSpanControl,CalendarGrid,EventChip,AgendaDayGroup,AgendaEventRow}.tsx`;
new `src/components/internal/searchable-list.tsx`; new
`src/app/dev/gallery/tier2.tsx`; edited `src/app/dev/gallery/page.tsx`.
(`src/components/DataTable.tsx` + `src/styles/globals.css` D9-0 revision landed
in a separate concurrent revision, not this session.)

### 2026-09-08 · Orchestrator — D5 + review (fresh session)

**Fidelity check (design-system.md §1 D5).** Signed in as Susan, ran the shell
and `/dev/gallery` at 1440px in a real browser. Exported four bands to Paper
and compared against running-gallery screenshots of the same components:
`MoneyDisplay` (4X8-0), `StatusBadge` (4U7-0), `LineItemRow` (51H-0),
`TranscriptPanel` (5OJ-0). **StatusBadge and TranscriptPanel: exact match** —
same anatomy, same states, same copy. **MoneyDisplay: match except the known
minus-glyph divergence** (below). **LineItemRow: match except the known
pre-D9-0 header** (below). No *unexpected* drift on any of the four. **Verdict:
MCP is trusted for D6** — no fallback to the Snapshot extension needed.

**Reconciliation against artboard 4U2-0 (design-system.md §1 D5 — code is the
source of truth for tokens and token-driven visual decisions from D1 on).**
Independently re-walked every band (not taken on the follow-up session's
verdicts alone) via `get_screenshot`, cross-checked against the running
gallery and, for exact values, the component source. Components reconciled:

- **DataTable (58H-0) and LineItemRow (51H-0) headers → D9-0.** Both bands
  still drew the pre-D9-0 header (surface-sunken fill, 11px/600/0.03em
  uppercase labels, rounded container, zebra on alternating rows). Updated
  both to match `DataTable.tsx` / `LineItemRow.tsx` exactly: header
  background → `--color-table-header`, bottom rule → 1px
  `--color-table-header-border`, labels → 12px/500/normal-case/`text-primary`,
  outer container radius → 0 (sharp corners), zebra fill removed. Updated the
  DataTable band's own spec paragraph and the shadcn spec-cards band's
  (5TI-0) DataTable recap paragraph to describe D9-0 instead of the old spec,
  so no stale text survives pointing at the wrong values.
  `CalendarGrid` (5PY-0) and `AgendaDayGroup` (5RU-0) verified independently —
  both correctly still draw their date/weekday headers on `surface-sunken`,
  confirmed against `CalendarGrid.tsx` / `AgendaDayGroup.tsx`; left untouched,
  per §10: they are row-group/calendar headers, not data-column headers.
- **MoneyDisplay minus glyph.** Band showed `−12,000.00` (U+2212 minus sign);
  `formatMoney()` (`lib/money.ts`) emits an ASCII hyphen. **Decision: the band
  was wrong, not the code** — `formatMoney()` is the INV-M5 formatting
  boundary and is explicitly off-limits to this session. Corrected the band's
  text to `-12,000.00`.
- **TotalsPanel statcard label.** Band read "Balance computed"; code
  (`TotalsPanel.tsx`) reads "Balance". **Decision: "Balance" is right** — the
  three-card row (Invoice total / Paid to date / Balance) already reads as a
  narrative; "computed" describes an implementation fact (INV-C5) Susan has
  no reason to see on her own KPI card. Corrected the band's text to
  "Balance".
- Every other band (StatusBadge, DocumentStatusBadge/AvailabilityBadge,
  QuantityInput, DayAvailabilityStrip, ClientPicker/CatalogItemPicker,
  SearchInput, controls (SegmentedToggle/DateRangeControl/
  CalendarSpanControl), PageHeader, EmptyState, ConfirmDialog,
  ConflictBanner, DocumentNoticeBanner, VoiceMicButton, VoiceReviewField,
  TranscriptPanel, CalendarGrid/EventChip, AgendaDayGroup/AgendaEventRow,
  shadcn spec cards) — independently screenshotted and compared: **no
  drift**. In particular confirmed: `PageHeader` has no `capturedAt` chip
  (matches the follow-up session's DROP decision — `5OJ-0`'s "0:23 ·
  Deepgram" provenance line is the only capture-time metadata anywhere), and
  Geist Mono is used for reference-number titles (`INV-2026-0042`).

**Invariants checked (§4) — fresh-eyes pass, source inspection + Paper +
running gallery, all 28 Tier 2 composites and the 3 blocks:**
- **INV-M1/M5** — `MoneyDisplay` (`src/components/MoneyDisplay.tsx:1-83`)
  takes `cents: number | null`, calls `formatMoney()` only at the return
  boundary, `font-mono tabular-nums` unconditional. `QuantityInput`
  (`QuantityInput.tsx`) is `font-mono tabular-nums` in both sizes.
  `PageHeader` reference-number titles render in Geist Mono (confirmed on
  band `573-0` and in the shell). **Holds.**
- **INV-P2 / INV-I2** — `LineItemRow` `document` variant
  (`LineItemRow.tsx`) takes only snapshot props (name, description, qty,
  unit price, total) with no catalog-id prop in its public API, and its
  render path has no stepper, no delete, no index column — read-only always,
  independent of any `disabled` flag. **Holds.**
- **INV-A6** — `ConflictBanner` (`ConflictBanner.tsx`) has no `href`/`link`
  prop in either variant and renders no anchor or button — advisory only.
  `QuantityInput`'s `overAvailable` prop only toggles a border class
  (`border-warning-solid`); `commit()` still clamps and calls `onChange`
  normally — entry is never blocked. **Holds.**
- **INV-I3** — `DocumentNoticeBanner` (`DocumentNoticeBanner.tsx`) takes a
  required (non-optional) `link: { label; href }` prop and always renders the
  `<a>` — there is no code path that omits it. **Holds.**
- **INV-V3** — `TranscriptPanel` (`TranscriptPanel.tsx`) has no
  collapsed/expanded state, no disclosure control, and always renders the
  transcript `<p>`; `extractionFailed` only adds a notice above it, never
  hides it. **Holds.**
- **INV-V5** — `VoiceReviewField` (`VoiceReviewField.tsx`) flagged state
  renders a 1px `border-warning-solid`, an uppercase flag label with
  `TriangleAlertIcon`, and `bg-warning-subtle` — colour is additive to the
  border+label+icon, never the sole signal; resting state is an unstyled
  passthrough. **Holds.**

**Violations found: none.** **Resolved: none required** beyond the
reconciliation above (drift in artboards, not in invariant-bearing behaviour).

**Small token-hygiene fixes made this session** (obviously-wrong constants,
CLAUDE.md's narrow exception — not a design decision): a handful of Tier 2
loading/skeleton placeholders referenced primitive tokens instead of the
semantic layer (`design-system.md` §13.1/§13.2) — `bg-neutral-100` /
`bg-neutral-200` where the rest of the system uses `bg-surface-sunken`.
Fixed in `StatusBadge.tsx`, `DayAvailabilityStrip.tsx`, `CalendarGrid.tsx`,
`internal/searchable-list.tsx`. Left two related but non-trivial cases
unfixed because they need a real token decision, not a drive-by substitution:
`QuantityInput.tsx`'s stepper `hover:bg-neutral-100` (no semantic
"hover-on-sunken" token exists yet) and `text-neutral-0` on solid-colour
buttons in three files (no semantic "text-on-solid" token distinct from
`text-on-accent`) — noted, not raised as a §10 item (too small individually;
folded into the token-scale note below if it recurs).

**§10 decisions (Implementation session table):**
- **#2 (`pnpm build` not in the gate) — do now, CI-only.** Added a `pnpm
  build` step (`NODE_ENV=production`) to `.github/workflows/verify.yml`,
  after the existing `pnpm verify` step. Not folded into local `verify` —
  the build takes ~70s and would slow the inner loop for no benefit once
  CI catches it. **Decision: CI-only.**
- **#3 (no toast story on an unauthenticated surface) — confirmed do in
  v2.** No new reason surfaced this session to pull it forward; `/sign-in`
  stays inline-error-only (correct for INV-T4's minimal-surface intent).
  **Decision: do in v2 (confirmed).**
- **#4 (bands 58H-0 / 51H-0 pre-D9-0) — RESOLVED this session**, see the
  reconciliation above.
- **#5 (pickers compose Popover + SearchableList, not Combobox) — confirmed
  do in D6.** The reasoning holds: no data layer exists yet to shape the
  Combobox primitive against, and `SearchableList` is already the isolated
  seam. **Decision: do in D6 (confirmed)**, alongside the first screen that
  lists real clients or catalog items.

**Acceptance (§8) — confirmed line by line:**
- Shell navigable at 390px and 1440px — re-verified live (Playwright): 1440px
  shows the fixed 240px sidebar; 390px collapses to a hamburger top-bar that
  opens the full nav as a Sheet drawer. `document.scrollWidth === innerWidth
  === 390` at the mobile breakpoint — no page-level horizontal scroll (the
  follow-up session's fix holds).
- Gallery renders every component in every state (confirmed by the D5
  visual-diff pass above, which necessarily exercised every section);
  excluded from production — `src/app/dev/layout.tsx` calls `notFound()`
  when `NODE_ENV === "production"`, verified by inspection; the follow-up
  session's live `NODE_ENV=production pnpm build` + request test already
  confirmed the 404 fires (§7, 2026-09-07 entry). Naming nit: the layout's
  comment calls it "the (dev) route group" but the segment is the literal
  path `src/app/dev/` — cosmetic, not a defect (the `notFound()` mechanism
  itself doesn't depend on route-group parens); left as is, not worth its
  own §10 line.
- Tokens confirmed (contentHash `6881a1e6` matches between `globals.css` and
  the open Paper file — no drift); Tier 1 restyled every state (verified in
  the follow-up session, spot-checked again here via the gallery); approved
  Tier 2 set built (all 28, confirmed present in `src/components/` and in
  `tier2.tsx`); app shell responsive (above).
- `pnpm verify` passes (32/32 tests, typecheck, lint) after this session's
  token-hygiene fixes; no invariant test modified; loading/empty/error/
  populated states all exist (seen throughout the gallery walk above);
  review found no invariant violations; §10 decisions all recorded (above);
  §7 complete (this entry).

**Status set to Complete** — see the header of this file and
`build-plan.md`'s "Current phase" line, both updated by this session.
```

---

## 8. Acceptance criteria

From `build-plan.md` "PHASE-00B" + "Definition of done", and `design-system.md`
§1 (D4/D5). Not paraphrased.

- [x] *(build-plan PHASE-00B / Verify)* Navigate the shell at 390px and 1440px.
- [x] *(build-plan PHASE-00B / Verify)* Gallery renders every component in every
      state.
- [x] *(build-plan PHASE-00B / Build)* Tokens from D1 in `globals.css` as a
      Tailwind v4 `@theme` block — confirmed against the Paper theme.
- [x] *(build-plan PHASE-00B / Build)* Tier 1 primitives restyled against the
      tokens, starting from the shadcn sidebar block for the shell.
- [x] *(build-plan PHASE-00B / Build)* The approved Tier 2 composites from D3.
- [x] *(build-plan PHASE-00B / Build)* `/dev/gallery` with every component in
      every state as a forced-state instance, excluded from production.
- [x] *(build-plan PHASE-00B / Build)* App shell and navigation, responsive.
- [x] *(design-system §1 D4)* shadcn primitives restyled against the tokens +
      the approved composites + the gallery.
- [x] *(design-system §1 D5)* Gallery exported to Paper over MCP; fidelity
      verified against gallery screenshots for 3–4 components; any drift against
      the D3 artboard `4U2-0` reconciled once, here.
- [x] *(ui-conventions §1)* Every §12-promoted composite has its consequence 3
      satisfied (Tier-2 build + gallery entry) — until then it is only proposed.
- [x] *(Definition of done)* `pnpm verify` passes; no invariant test modified;
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
| 1 | GAP | `/dev/gallery` production-exclusion mechanism is unspecified | S | do now (in this phase) | **RESOLVED** (Session 2) — `src/app/dev/layout.tsx` calls `notFound()` when `NODE_ENV === "production"`; still behind auth middleware. Recorded §7. |
| 2 | IMPROVEMENT | Gallery needs a forced-state CSS convention decided once | S | do now (in this phase) | **RESOLVED** (Session 2) — `globals.css` extends the `hover` / `focus-visible` / `active` variants to also match `&[data-force-state="…"]`; one rule serves both. Verified in the running gallery. Recorded §7. |

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
> **Decision:** RESOLVED (Session 2) — see the summary table above.

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
> **Decision:** RESOLVED (Session 2) — see the summary table above.

### Implementation session

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| 1 | GAP | The 28 Tier 2 composites (§5.3) + their gallery bands are unbuilt | L | do next — a dedicated PHASE-00B follow-up session before D6 | **RESOLVED** (follow-up, 2026-09-08) — all 28 built from Tier 1, semantic tokens only; `tier2.tsx` gallery covers every state + variant axis; `pnpm verify` + `pnpm build` pass; section-by-section visual diff vs. bands 4U7-0…5RU-0 done. Recorded §7. |
| 2 | IMPROVEMENT | `pnpm build` was broken on `main` and `pnpm verify` never catches it | S | do now — add `build` to the gate, or a CI build step | **DONE** (D5) — `pnpm build` (`NODE_ENV=production`) added as a CI step in `.github/workflows/verify.yml`, after `pnpm verify`. Not added to local `verify` (too slow for the inner loop). |
| 3 | GAP | Sonner/Toaster is mounted in the root layout, so `/sign-in` and `/dev/gallery` share the app's toast region — fine now, but there is no story for a toast fired from an unauthenticated surface | S | do in v2 | **CONFIRMED** (D5) — do in v2, no new reason to pull forward. |
| 4 | GAP | Bands 58H-0 (DataTable) + 51H-0 (LineItemRow) show the pre-D9-0 header style; code now uses the D9-0 revision (blue-wash band, `--color-table-header-border` rule, 12/500 normal-case labels, sharp corners, no zebra) | S | reconcile in D5 — update the two bands to the D9-0 treatment (code is source of truth from D1 on) | **RESOLVED** (D5) — both bands, plus the DataTable spec-card recap on 5TI-0, updated to the D9-0 treatment. Recorded §7. |
| 5 | IMPROVEMENT | Pickers compose `Popover` + internal `SearchableList`, not the base-ui `Combobox` primitive §5.3 names | M | do in D6 — swap `SearchableList`'s internals to the Combobox primitive when real client/catalog queries exist; the seam is already isolated | **CONFIRMED** (D5) — do in D6, alongside the first real client/catalog screen. |

**Details**

> **[GAP] The 28 Tier 2 composites are unbuilt**
> The vertical slice delivered §6.1–§6.3 + §6.6 + a Tier-1/blocks gallery.
> `ui-conventions.md` §1's approved set — MoneyDisplay, StatusBadge family,
> DayAvailabilityStrip, the pickers + shared `SearchableList`, LineItemRow,
> TotalsPanel, PageHeader (+ the §5.4 `capturedAt` decision), EmptyState,
> ConfirmDialog, the two banners, the five voice composites, and the eight
> calendar/agenda composites — is still only *proposed* (§12 consequence 3
> unmet). D6 screens compose these; none can be built until they exist. This
> is the bulk of the phase and needs its own session with the artboard
> `4U2-0` bands open. The contract in §5 is unchanged and still governs it.
> Cost: L · Recommendation: do next — a PHASE-00B follow-up before D6, same
> phase file, appending to §7.
> **Decision:** RESOLVED (follow-up, 2026-09-08) — see the summary table above.

> **[IMPROVEMENT] `pnpm build` is not in the gate**
> `pnpm verify` is typecheck + lint + test. `pnpm build` (Turbopack,
> `NODE_ENV=production`) fails on CSS that dev's Lightning CSS tolerates —
> this session hit `outline-ring/50` with no `--color-ring`, a defect that
> predates the branch and would have shipped. The gallery's production
> exclusion (§8, §9 step 6) can only be checked by a real build. A build is
> slow (~70s) so maybe not in the local inner loop, but CI should run it and
> the phase's own acceptance depends on it.
> Cost: S · Recommendation: do now — `verify` or CI gains a build step.
> **Decision:** DONE (D5) — `pnpm build` (`NODE_ENV=production`) added as a
> step in `.github/workflows/verify.yml`, after `pnpm verify`. CI-only: a
> local build is ~70s and would slow the inner loop for no benefit once CI
> catches regressions.

> **[GAP] No story for a toast on an unauthenticated surface**
> `Toaster` is in the root `app/layout.tsx`, so `/sign-in` can technically
> fire one, but nothing designs for it and the sign-in error is inline text
> (correct — INV-T4 keeps that surface minimal). Not a problem today; noting
> it so a future "check your email" style flow on an unauthenticated screen
> doesn't quietly reach for a toast with no design.
> Cost: S · Recommendation: do in v2.
> **Decision:** CONFIRMED (D5) — do in v2. No new reason surfaced to pull it
> forward.

> **[GAP] Table-header treatment drifted from the Paper bands (D9-0 revision)**
> A design revision (user, 2026-09-08) reworked the `DataTable` column-header
> row: `--color-table-header` blue-grey wash, a heavier `--color-table-header-border`
> bottom rule, 12/500 normal-case `text-primary` labels (was 11/600 uppercase
> muted), sharp container corners, and no zebra striping on body rows. The
> `LineItemRow` quote/document header in the gallery follows this now, for one
> consistent system. Bands **58H-0** (DataTable) and **51H-0** (LineItemRow)
> still show the old style. `design-system.md` §1 makes code the source of
> truth for tokens from D1 on, and this is a token-driven visual decision, so
> the bands should move — not the code. `CalendarGrid`'s weekday header and
> `AgendaDayGroup`'s date header are intentionally left on `surface-sunken`:
> they are row-group / calendar headers, not data-column headers, and their
> bands (5PY-0 / 5RU-0) draw them sunken.
> Cost: S · Recommendation: reconcile the two bands in D5.
> **Decision:** RESOLVED (D5) — both bands (plus the DataTable recap on the
> shadcn spec-cards band, 5TI-0) updated to the D9-0 treatment. Recorded §7.

> **[IMPROVEMENT] Pickers are `Popover` + `SearchableList`, not `Combobox` base**
> §5.3 specifies the shadcn/base-ui `Combobox` as the base for `ClientPicker` /
> `CatalogItemPicker`. With no data layer in this phase there is no item
> collection or async filter to shape that primitive against, and wiring it
> blind risked baking in the wrong contract. The three pickers instead compose
> the restyled `Popover` with one internal `SearchableList` (§5.4) that owns
> the search row, roving keyboard nav, and the loading / empty / create /
> no-match states — the visual + interaction contract from bands 5D6-0 / 5AO-0
> is met. `SearchableList` is the single seam: D6 swaps its internals to the
> `Combobox` primitive when real client/catalog repository queries exist,
> without touching the three call sites.
> Cost: M · Recommendation: do in D6, alongside the first screen that lists
> real clients or catalog items.
> **Decision:** CONFIRMED (D5) — do in D6. The seam (`SearchableList`) is
> already isolated; no reason to force it earlier with no data layer to
> shape it against.

### Review session (D5)

No new recommendations. This session's job was fidelity-checking the gallery,
reconciling artboard `4U2-0` against code, running the invariant review, and
deciding the five items already carried in the Implementation-session table
above (see their Decision columns) — nothing surfaced that wasn't already on
the table.

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
