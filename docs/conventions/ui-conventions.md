# UI Conventions

How screens are built, how the component library is organised, and how a Paper
design becomes code without drift.

Read `design-system.md` first for the token vocabulary.

---

## 1. Component tiers

Three tiers. Styling lives almost entirely in Tiers 1 and 2.

### Tier 1 — Primitives (`src/components/ui/`)

shadcn/ui components, vendored into the repo and restyled against our tokens.

Button, Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Badge,
Card, Dialog, Sheet, Popover, Tooltip, Table, Tabs, DropdownMenu, Calendar,
DatePicker, Toast, Skeleton, Separator, ScrollArea.

They arrive with hover, `focus-visible`, disabled, active, `aria-invalid`, and
Radix `data-state` styling already wired, plus keyboard navigation and ARIA. What
they arrive with is shadcn's *default* styling for those states. **Restyling a
component means restyling every state, not just the resting one.** A beautiful
button with a generic hover is the most common failure of this workflow.

Do not edit these to add business logic. They stay generic.

### shadcn blocks

shadcn also publishes **blocks** — larger pre-assembled pieces such as sidebars,
login forms, and data tables. Use them, under rules.

**Take a block when it solves fiddly interaction plumbing:**

- **Sidebar.** The clear win. Collapsible state, keyboard shortcut, mobile sheet
  fallback, persistence. Start the app shell from this rather than building
  navigation from primitives.
- **Login form.** A solved problem with no design content.
- **DataTable.** The sorting, column, and selection plumbing is worth taking. The
  styling and the mobile card fallback will be entirely ours.

**Never take a block for a domain composite.** There is no `LineItemRow` in a
generic registry, and reaching for the nearest-looking dashboard block is how a
project ends up looking like every other shadcn app.

Once a block lands:

1. **It is ours.** No upstream updates, no tracking the registry. It is source in
   our repo like everything else.
2. **It is restyled to tokens immediately.** Blocks arrive with shadcn's
   defaults, and a block that keeps them is a visible seam in the design system.
3. **It becomes Tier 2** and goes in `/dev/gallery` with all its states.
4. **Strip what we do not use.** Blocks ship with demo scaffolding and
   placeholder data. Delete on arrival, not later.

A block is scaffolding, not a component. It gets past the plumbing so design
effort goes into the parts that are actually ours. It never survives contact with
the design system unchanged.

### Tier 2 — Composites (`src/components/`)

App-specific, built from Tier 1. This is where the application's visual identity
actually lives.

Extract into Tier 2 when something is used twice, not in anticipation.

#### The approved composite set

Produced by D3 (extraction + reconciliation) from the batch-1 screens, and
recorded on the Paper artboard **"D3 — Components"** (page `D3 — Components`,
file `01M1X43Q66HDD6TF72TYYWH3KE`). Every entry is drawn there in all its states
and is the build target for D4. Adding to this list after D3 follows the
promotion rule in `design-system.md` §12.

Items marked **§12** did not exist in the pre-D3 list — they were produced by the
batch screens and promoted during D3. Their four §12 consequences are recorded in
`docs/delivery/phases/` / the D3 work log.

```
MoneyDisplay        Geist Mono, tabular-nums always. Integer KES cents in,
                    formatted at the render boundary only (INV-M1/M5).
                    prop: prefix ("KES " for KPI cards / mobile; off in dense
                    table columns). Right-aligned in columns. Handles zero,
                    negative (credit / overpayment), null (em dash), loading.

QuantityInput       Integer stepper, tabular numerals. Availability-aware: border
                    turns warning when the value exceeds what is free, but never
                    blocks entry (INV-A6). 24px inside a table row, 36px
                    standalone (with ± steppers). States: resting, focus,
                    over-availability (warning), disabled (issued doc),
                    error (aria-invalid).

StatusBadge         One anatomy: a 6px dot + a label in the matching status
                    colour. NO background chip (design-lead override of the D2
                    pill treatment, 2026-09-07 — quieter, one system across all
                    three domains). variant: "document" (10 states) |
                    "event" (4) | "inventory" (5 severities). Terminal states
                    (declined / superseded / voided / completed / cancelled) use
                    muted text. Non-interactive by default; gains
                    hover / focus / selected only as a table filter chip.

DocumentStatusBadge  Named wrapper = StatusBadge variant="document".

AvailabilityBadge   Wrapper over StatusBadge variant="inventory" that formats
                    minAvailable / totalQuantity into the label. Two label forms:
                    "N of M free" (quote builder) and "N free · day"
                    (availability worst-day). Severity: available (>= requested),
                    low (0 < free < requested), damaged/none (0 free). States:
                    loading, not-checked-yet.

DayAvailabilityStrip  §12. The reconciled across-the-range breakdown. One
                    treatment, three placements: Availability Range mode,
                    Availability mobile card (as a DataTable wide-scroll region),
                    item-detail per-day strip. Drives off byDay[]. Per-day cell =
                    weekday+date label (mono, muted) over the number (mono). The
                    worst-day cell is emphasised: tinted warning-subtle when that
                    day's availability < the amount needed, success-subtle
                    otherwise, plus a border-strong outline. Scrolls inside its
                    own container; the page body never scrolls horizontally.
                    (Worst-day severity encoding — see D3 Recommendations, needs
                    orchestrator ratification.)

ClientPicker        Searchable combobox over clients (Combobox base). Trigger
                    36px; popover on surface-raised + shadow-md; options 32px.
                    "Create client <query>" inline. Unresolved-entity affordance
                    for voice ("<name> — not in your clients" + create / pick).

CatalogItemPicker   Searchable combobox over active catalog items. Each option
                    shows availability for the quote's event dates (batched
                    query, warn-not-block). States: open-with-availability,
                    loading, empty ("No item matches … · Add to catalog").

SearchInput         §12. Magnifier + field + optional result-count on the right
                    ("3 of 24"). States: resting, focus, empty (placeholder),
                    loading (count → dash / spinner).

LineItemRow         One component, variant = "quote" | "document" | "voice".
                    quote: # index, editable QuantityInput, AvailabilityBadge
                    column, unit price, line total, delete. Row hover =
                    surface-sunken; focus-within = accent inset.
                    document (invoice / delivery note): no index, no availability,
                    static qty, no delete — snapshot values only (INV-P2),
                    read-only always (INV-I2).
                    voice: item + qty only; a flagged row takes the
                    VoiceReviewField uncertainty treatment (warning-subtle bg +
                    warning border + inline triangle); flag text never truncates.
                    Mobile: each variant projects to a card via the DataTable
                    card contract — not a separate component.

TotalsPanel         One component, layout = "ledger" | "statcards".
                    ledger (quote / delivery-note builder): stacked label/value
                    rows → hairline rule → Total (label 15 semibold, value 20
                    mono semibold) → deposit line.
                    statcards (invoice detail): three KPI cards — Invoice total /
                    Paid to date / Balance (computed, INV-C5). Mobile: three
                    stacked rows. All figures via MoneyDisplay.

PageHeader           One component, two projections. desktop: breadcrumb (12px
                    muted) / title (24px semibold; Geist Mono for reference
                    numbers) / optional inline StatusBadge / action slot right
                    (ghost + accent, 36px). mobile top-bar (< md): back chevron +
                    breadcrumb + optional single action or per-form mic, then
                    title + badge below. props: breadcrumb, title, status,
                    actions. States: empty (title only), error (actions + badge
                    hidden), long title wraps to 2 lines / breadcrumb truncates.
                    (Folds in the D2.1 mobile-top-bar recommendation.)

DataTable           shadcn block — the sort/column/selection plumbing is taken;
                    styling and the card fallback are ours. Premium table spec
                    (D9-0 revision, 2026-09-08): 1px border container with SHARP
                    corners (no radius), header on --color-table-header (a
                    blue-grey wash) with a --color-table-header-border bottom
                    rule (heavier than border-strong), header labels 12px/500,
                    normal case, text-primary, 32px rows, hairline row dividers
                    (last none), NO zebra striping, numeric columns right-aligned
                    Geist Mono, sort caret on the active column. The mobile card
                    projection keeps rounded corners and its 2-up field labels
                    keep the small uppercase caption style.
                    Below md the whole table projects to CARDS — one contract
                    (the D2 divergence between Quote Builder 390 and Availability
                    390 is resolved here): each row → 1px-border card with a
                    primary line (14 semibold) + secondary (13 muted), a
                    right-aligned figure block, then a 2-up label/value grid for
                    the remaining columns. A column may set wide:true to render as
                    a horizontally-scrolling strip inside the card (the ONLY
                    permitted horizontal scroll) — this is where
                    DayAvailabilityStrip lives. States: populated, sorted,
                    loading (skeleton rows, not a spinner), empty (hands off to
                    EmptyState).

EmptyState          Centred icon (~28px, 1.5 stroke, muted) / title (16–18
                    semibold) / body (muted) / one or two action buttons.
                    Canonical uses: "No history yet", "No active catalog items",
                    "No quotes yet".

ConfirmDialog       Destructive / irreversible-action confirmation (issue,
                    accept, void). Dialog base (shadow-lg, focus trap). States a
                    plain-language description of what will happen; confirm button
                    names the action ("Void invoice", not "Confirm"). States:
                    resting, pending (button spinner + disabled), error (inline
                    message, dialog stays open).

ConflictBanner      §12. Transient, advisory (INV-A6 — warn, do not block).
                    Warning triangle, danger-subtle bg, plain-language message
                    naming the resource and the shortfall ("PA system … 1 unit,
                    2 needed"). No permanent forward link. Compact pill variant
                    for the calendar day-cell. Distinct from DocumentNoticeBanner
                    (confirmed 2026-09-07: different lifespan, severity, and
                    action model).

DocumentNoticeBanner  §12. Permanent document-state notice (INV-I3 void/replace,
                    superseded quote). X-circle icon, bold title, reason line, a
                    forward link button ("Go to INV-2026-0043"). tone: "danger"
                    (void) | "neutral" (superseded). Always carries the link.

VoiceMicButton      The shell FAB (bottom-right thumb zone on mobile, with the
                    VoiceQueueIndicator badge) and the per-form pill (alongside a
                    form title). Three visible states: idle, recording,
                    processing.

VoiceReviewField    Wraps any field to show the uncertainty flag (INV-V5):
                    warning-subtle bg + 1px warning border + an uppercase flag
                    label with a triangle icon ("NO MATCH", "CHECK THIS") +
                    optional helper text ("Heard 'the 14th' — month assumed").
                    Resting (no flag) = passthrough.

VoiceQueueIndicator  Pending-captures count. Danger circle badge (9px/600 white)
                    on the shell Voice-capture control and the mobile FAB. Zero
                    pending = no badge.

TranscriptPanel     §12. The always-visible transcript on the voice review screen
                    (INV-V3). Mic icon + "Transcript" + "0:23 · Deepgram" +
                    the quoted transcript body in a sunken card + a caption
                    ("Transcript is kept whatever you decide…"). Right rail on
                    desktop, stacked card on mobile. Never behind a disclosure.

SegmentedToggle     §12. Generic 2–3-way view switch. Absorbs Day/Range,
                    Calendar/Agenda, 1 week/2 weeks, Week/List. Track on
                    surface-sunken; selected segment = surface-0 + shadow-sm +
                    text-primary. States: resting, focus, disabled.

DateRangeControl    §12. from→to date pair (single date in Day mode) with a
                    calendar icon and ‹ › steppers. Availability view.

CalendarSpanControl  §12. ‹ Today › cluster + a SegmentedToggle for the span
                    (1 / 2 weeks). Composed from SegmentedToggle + icon buttons,
                    not monolithic. Calendar view.

CalendarGrid        §12. Month-grid focused to a 1–2-week span. Weekday header
                    row (MON…SUN, 12px), tall day cells, date number top-left
                    (12px muted), a conflict flag pill in the day cell, EventChips
                    stacked. States: populated, empty day, conflict day, loading.

EventChip           §12. The calendar item: title (13 semibold) + client·role
                    (12 muted), a status-coloured left bar. Agenda view uses the
                    row form (AgendaEventRow) instead.

AgendaDayGroup      §12. Chronological day grouping: a sunken date header
                    ("SAT 18 OCT  2 events · conflict") + event rows beneath.
                    Empty day = a quiet single "Nothing scheduled" row. A
                    conflict day shows a ConflictBanner inline before its rows.

AgendaEventRow      §12. date range (mono) / title + client·venue·detail /
                    status label or "Equipment clash" on the right; status
                    left-bar on mobile.
```

Sign-off status of the §12 promotions is tracked in the D3 work log /
`## Recommendations`. Until an item's four §12 consequences are all recorded, it
is a *proposed* addition, not part of the built set.

### Tier 3 — Screens (`src/app/`)

Composition only. Layout and data wiring. **Essentially no styling of their own.**

If a screen file contains a raw hex colour, an arbitrary spacing value, or a
one-off variant, that styling belongs in Tier 2 or the token scale is wrong.
This is the rule that keeps implementation matching the Paper designs, because it
means implementation is assembly rather than reinterpretation.

---

## 2. The component gallery

A dev-only route at `/dev/gallery` rendering **every component in every state and
variant**: resting, hover, focus, disabled, loading, error, empty, and long-content
overflow.

It is the most useful artefact in the design workflow, for three reasons:

1. It is how states get reviewed, which Paper cannot show, because a canvas is
   static.
2. It is what gets exported to Paper.
3. It is what the frontend agent screenshots to verify its work.

**Every state is rendered as a separate static instance**, using a forced-state
prop rather than relying on real hover:

```tsx
<Button data-force-state="hover">Send quote</Button>
```

That way `Button / primary / hover` is an actual element in the DOM and on the
canvas, not something you have to be hovering to see.

The route is excluded from production builds.

---

## 3. Design-to-code handoff

The full stage list is in `design-system.md` §1. In summary:

```
D0  Explore token sheet, validate on 3 screens      Paper
D1  Lock tokens → codify in globals.css             code owns tokens from here
D2  Design screen batch 1 (~7 screens)              Paper
D3  Extract + reconcile composites, normalize back  Paper
D4  Build Tier 1 + Tier 2 in code, build gallery    code
D5  Export gallery to Paper, reconcile drift        both
D6  Design remaining screens by composition         Paper
D7  Implement                                       code
```

Two properties of this order matter and are easy to lose.

**Components are extracted from screens, not designed ahead of them (D2 → D3).**
A component drawn alone on a canvas is a guess about a context nobody has looked
at. Designing the best version of seven real screens and then pulling the
recurring elements out produces a better component set than designing components
first and assembling screens from them. The batch is bounded at roughly seven
because beyond that, extraction stops being selection and becomes adjudication
between accumulated variants.

**Screens are implemented by arranging components that already exist (D6 → D7).**
Once the canvas holds real components, there is no translation step where drift
can occur. The goal is not to chase pixel-perfection; it is to remove the
possibility of divergence.

**Fidelity check (D5).** Export three or four components over MCP, screenshot the
same components from the running gallery, compare. If they match, use MCP for
everything. If they drift, Paper's Snapshot extension captures browser-computed
CSS instead. Ten minutes of checking rather than an argument.

**Round trips.** If a component looks wrong once on the canvas, fix it in Paper
and have the agent port the change back to the component source. One definition,
two views.

**New composites after D3** follow the promotion rule in `design-system.md` §12.
A screen may introduce one, but it is added to the component artboard, the code
gallery, and the approved list in §1 of this document before that screen counts
as designed. A bespoke element that never becomes a component is how a design
system erodes.

---

## 4. Responsive

**Two designs, one implementation.**

Every screen is designed at 390px and 1440px, because Susan must be able to do
everything from either device. But the mobile artboard is the **specification for
how the component tree behaves below `md`**, not a separate screen to build.

One route. One component tree. Responsive classes.

Building `QuotePageMobile` alongside `QuotePageDesktop` is a defect. The one
permitted exception is a genuinely different presentation of the same data, such
as `DataTable` falling back to stacked cards on mobile, and that lives inside the
Tier 2 component, not in the screen.

Mobile-first in the classes: base styles are mobile, `md:` and up modify.

---

## 5. Screen patterns

Consistency across screens matters more than any individual screen being clever.

**List screens.** `PageHeader` with the primary action top-right (bottom-right
FAB on mobile). Filters in the URL via `nuqs`, so a filtered view is
shareable and survives a refresh. `DataTable` with a real `EmptyState`.

**Detail screens.** Header with title, status badge, and actions. Content in
cards. Related records in tabs. Destructive and irreversible actions
(issue, accept, void) go through `ConfirmDialog` with a clear statement of what
will happen.

**Form screens.** Single column, `--container-form` wide. Fields in logical
groups. The primary action is sticky at the bottom on mobile. The mic control
sits alongside the form title, not buried in a field.

**Every screen has four states**: loading (skeleton, not a spinner), empty,
error, and populated. All four are designed in Paper and all four are built. An
unhandled empty state is an incomplete screen.

---

## 6. Voice UI

**Global mic.** Persistent in the app shell, reachable from every screen. On
mobile it sits in the thumb zone. It has three visible states: idle, recording,
processing.

**Per-form mic.** Alongside the form title on each voice-enabled form.

**The review screen** is the most important screen in the voice feature:

- The transcript is **always visible** (INV-V3). Not hidden behind a disclosure.
- Uncertain fields are visually flagged via `VoiceReviewField` — a distinct
  border and an icon, not a colour alone.
- Unresolved entities are shown as text with an affordance ("no matching client —
  create one?"), never silently dropped.
- The form is the **same component** as manual entry, pre-filled. Not a parallel
  screen.
- The confirm button says what it does: "Save quote", not "Confirm".
- Nothing saves without that press (INV-V1).

**The queue indicator** shows pending captures with a count badge. A pending
inquiry is never invisible.

---

## 7. Accessibility

Not optional, and mostly free because Radix does the work.

- Every interactive element reachable and operable by keyboard.
- Visible `:focus-visible` on everything.
- Colour never carries meaning alone — always paired with a label.
- Every input has a real `<label>`, not a placeholder standing in for one.
- Errors are associated with their field via `aria-describedby`.
- Touch targets at least 44px on mobile.
- Dialogs trap focus and restore it on close (Radix default — do not defeat it).
- Icon-only buttons have `aria-label`.

## 8. Print

Delivery notes and questionnaires are printed and carried to site. Invoices and
receipts are sometimes printed.

Printed output comes from the **generated PDF** (`@react-pdf/renderer`), not from
a print stylesheet on a screen. There is one rendering path per document and it
is the one the client receives.

---

## 9. Rules

1. Screens compose; they do not style.
2. No raw hex or arbitrary values outside `globals.css` and Tier 1.
3. One route per screen, responsive, never a mobile twin.
4. Every screen handles loading, empty, error, and populated.
5. Every component appears in `/dev/gallery` with all its states.
6. Server Components by default; `'use client'` as low in the tree as possible.
7. Filter and tab state lives in the URL.
8. Money, quantities, and reference numbers use tabular numerals, always.
9. Destructive or irreversible actions are confirmed and say what they will do.
