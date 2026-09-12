# D6 · Session 8 — Group G (Dashboard)

**Paste the block below into a fresh session.** The durable context is the linked
files, not this prompt.

---

```
D6 SESSION — Group G "Dashboard" — HANDOFF PROMPT

You are the product designer for the Sunflower Events BMS, running design stage
D6 — designing remaining application screens in Paper by composition from the
approved component set. This session designs the LAST screen group: Group G, the
Dashboard at `/`. It replaces the placeholder PHASE-00 home.

Groups A, B, C, D, E and F are all done and client-approved. Group G is designed
LAST on purpose: so it can reference the real screens it links into, which now
all exist. After Group G, only the PDF template track remains before D6 is done.

The bar is top-tier premium — Linear / Apple / Mercl-grade restraint as the
baseline. You are the engineer-designer: propose what would make it better,
never build unrequested, wait for approval.

NO SIGNATURE-MOMENT WORK. Signature moments are DEFERRED OUT OF D6 entirely
(client, 2026-09-08 — D6-plan.md §5.3). D6 designs SCREENS ONLY — layout,
states, composition from the approved set. Signature moment ② is the Dashboard's
"assembles-itself" load sequence (staggered load, the month figure counting up,
the timeline spine drawing in) — that is a LATER pass, walked with the client
after every group's screens are approved. This session draws the Dashboard as a
PLAIN, well-composed screen. Motion is a one-line intent note, not a storyboard.
The sunflower motif (D6-plan.md §5.3, "optional, prototype-then-judge") MAY be
trialled in the empty state only — see §4 below; propose, don't just do it.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `CLAUDE.md`
- `docs/delivery/D6-plan.md` — §2 the eight governing constraints, §3 the
  session mechanic, §4 (the dashboard is designed FROM THE DATA, not from a
  client interview — Susan has only ever used paper and cannot specify it),
  §5.1 the baseline aesthetic, §5.3 (signature moments deferred — read the ②
  "Dashboard briefing" row and the sunflower-motif note), §6 "Group G —
  Dashboard" (the planning-level inventory — you finalise the exact one this
  session), §7 the anticipated components (`AttentionRow`, `TodayTimeline`,
  `KpiFigure` — decide per-section whether each is genuinely needed or collapses
  into an existing component/variant), §8 status log — read the Group A→F
  entries so you know every screen the Dashboard links into and what's current
  (the fixed sidebar with the Settings item below Finance; the `Tabs` Finance
  strip; `Sheet`-for-forms; `TotalsPanel` unified hairline strip). §9a–§9f
  recommendations already logged — several bear on the Dashboard:
    - §9b: pending "call them back" notes → a quick-note dialog + a Dashboard
      section ("Waiting on you"). The `Inquiry` row exists only for the
      inquiry→quote elapsed-time metric; derive New / Quoted from
      `convertedQuoteId`.
    - §9c: quote "age" ("Sent · 3d") and "days since sent" are derivable at
      read time from `Quote.issuedAt` / `validUntil` — no schema change; the
      useful default sort for the attention list is oldest-waiting-first.
    - §9f: `DAMAGE_REPORT` is excluded from voice; a `DAMAGE_REPORT` capture is
      kept as an unactioned queue note — if you surface "voice queue" on the
      Dashboard, that's where those land.
  Check §9a–§9f before proposing anything new.
- `docs/delivery/D6-new-components.md` — the running manifest. Re-read the
  "Rejected / superseded" section (`AvailabilityHorizon` rejected twice on the
  "generic chart" principle — the Dashboard gets NO chart; a KPI figure is a
  number, not a graph) and the Group F entry (two variants proposed, no new
  components — the compose-first bar held for five voice surfaces; hold it here).
- `docs/conventions/design-system.md` — §1 (D6 stage), §2 token layers, §3–11
  the token vocabulary, §12 (adding a component), §13 rules
- `docs/conventions/ui-conventions.md` — §1 (the approved component set — your
  build vocabulary), §2 the gallery, §4 responsive, §5 screen patterns (there
  is no "dashboard" pattern yet — you're establishing it), §7 accessibility
- `docs/architecture/domain-invariants.md` — the money / tenancy / computed-
  field invariants the Dashboard figures must respect (INV-M1 integer KES cents
  + tabular mono; INV-C5 invoice balance is computed; INV-C6 invoice status is
  derived; INV-E1/E3 profit is computed; INV-T2 every query filters on
  organizationId)
- `docs/architecture/data-model.md` — **read in full, this is your group's
  primary doc.** The Dashboard can only show what the data supports. Map each
  proposed section to concrete fields:
    - §2 `Client`, `Inquiry` (`receivedAt`, `channel`, `convertedQuoteId?`)
    - §4 `Quote` (`status QuoteStatus`, `issuedAt?`, `validUntil @db.Date?`,
      `acceptedAt?`) — "awaiting a reply, aged" = SENT quotes ordered by
      `issuedAt` ascending
    - §5 `Event` (`eventDate @db.Date`, `eventEndDate?`, `setupAt?`,
      `status EventStatus`, `venueName?`) — "today" and "this week"
    - §6 `Invoice` (`status InvoiceStatus`, `dueDate @db.Date?`,
      `totalCents`) — `balanceCents` / `amountPaidCents` are COMPUTED, not
      columns (§6 note); "unpaid balance" and "overdue" derive from those
    - §7 `Expense`; "month-to-date earned" = invoiced revenue − expenses for
      the current month (INV-E1), a read-time computation
    - §11 "Notes for implementers"
- `docs/architecture/document-lifecycle.md` — §1 the document-chain spine (so
  the Dashboard's links point at the right stage of each chain) and the state
  each status implies
- `docs/architecture/system-overview.md` — §8 (out of scope for v1 — do NOT
  add analytics, reporting, trends, win/loss, or follow-up reminders to the
  Dashboard; it is a "what needs me today" surface, not a BI tool)

Do not read the wider `docs/` tree. Do not read `D6-signature-moments.md`
(moment ② is a later pass, not this session's deliverable).

---

## 2. PAPER — file, tools, page

File: `01M1X43Q66HDD6TF72TYYWH3KE` ("Sunflower BMS").

First calls, in order:
1. `get_guide({topic:"paper-mcp-instructions"})` — once. Again if a long
   thread compresses.
2. `open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})`
3. `get_basic_info` — note the pages and the token set
4. `create_page` — a new page named **"D6 — Group G · Dashboard"**. Group G gets
   its own page.
5. `get_font_family_info(["Geist","Geist Mono"])` once this session before any
   typographic styling.
6. `get_guide({topic:"mobile-status-bar"})` before drawing the 390 artboard.

**THE APPROVED COMPONENT SET** — your build vocabulary. Page "D3 —
Components" (pageId `6-0`), artboard `4U2-0`. Pull exact values with `get_jsx`
— never off a screenshot. Bands you'll lean on: `PageHeader` (the Dashboard's
greeting header), `MoneyDisplay` (every figure — integer KES cents, tabular
mono, `prefix` on for KPI cards), `TotalsPanel` (the unified hairline strip —
a candidate for the "this month" figure cluster), `StatusBadge` /
`DocumentStatusBadge` (quote + invoice states), `DataTable` (only if a section
is genuinely tabular — most Dashboard sections are lists, not tables),
`AgendaDayGroup` + `AgendaEventRow` (the D1 Calendar agenda components — the
"today / this week" section should reuse these, not reinvent an event row),
`EventChip` (calendar-cell form — reference, probably not used here),
`EmptyState`, `Button`, `Card`, `Separator`.

**Existing screens the Dashboard links INTO** — screenshot each once so your
link targets and section framing match what actually exists:
- **D1 Calendar / Agenda** (page "D6 — Group D · Running events & getting paid",
  pageId `B-0`) — the agenda hybrid (date-spine + event cards + at-a-glance
  rail). The Dashboard's "Today / This week" section should feel like a
  compressed slice of this, using the same `AgendaEventRow`.
- **C1 Quotes list** (page "D6 — Group C · Quoting", pageId `A-0`) — the
  "awaiting a reply" section links here, filtered to SENT, sorted oldest-first.
- **D5 Invoices list** (page `B-0`) — the "owed to you" section links here.
- **D2 Event detail** (page `B-0`) — each event row links here.
- **E3 Monthly summary** (page "D6 — Group E · Money & records", pageId `C-0`) —
  the "this month" figure(s) link here; do NOT duplicate E3's full breakdown on
  the Dashboard, just the headline figure(s) + a link.
- **The quick-note dialog** (Group B, §9b — a small `Dialog`: client +
  `rawDescription` + channel → creates an `Inquiry` with no quote). If it was
  never actually drawn as an artboard, that's a real gap — flag it; the
  "Waiting on you" section needs somewhere for "logged a call, can't quote yet"
  entries to come from.

**App shell**: clone a recent Group E or Group F artboard's sidebar wholesale
(every one has the current sidebar incl. the **Settings** item below Finance).
The Dashboard's sidebar active item is **Dashboard** (the first nav item).
Verify the nav order with a screenshot before proceeding: Dashboard · Calendar ·
Inquiries · Quotes · Invoices · Clients · Catalog · Availability · Staff ·
Finance · Settings. The Dashboard is a real sidebar destination (unlike the F
voice overlays) — its active state is the top item.

**DO NOT TOUCH**
- Pages "D6 — Group A" (`7-0`, `8-0`), "D6 — Group B" (`9-0`), "D6 — Group C"
  (`A-0`), "D6 — Group D" (`B-0`), "D6 — Group E" (`C-0`), "D6 — Group F" (`D-0`)
- Artboard `4U2-0` (read-only — if a fix to an approved component is genuinely
  needed, propose it, get approval, then the one sanctioned edit, same as the
  Group D TotalsPanel precedent)
- Page "D2 — Batch 1 Screens" (`2-0`), "Page 1" (`1-0`), any sign-in artboard

**YOUR PAGE**: the new "D6 — Group G · Dashboard" page. Match the
row / lane-guide / title-card convention from every prior D6 group page — one
screen per horizontal ROW, 1440 then 390 per state, a "Lane guide" strip at the
top, a left-hand row-title card. Screenshot Group F's Row 1 title card and its
legend to re-internalize the format before adding your own. Rows on a ~1400px
vertical pitch (the Group F fix).

`get_screenshot` to review after each meaningful group of edits.
`finish_working_on_nodes` when done. No raw node IDs in anything you tell the
user.

---

## 3. THE EIGHT GOVERNING CONSTRAINTS (D6-plan.md §2 — inherited, unchanged)

Compose from the approved set first — new component only if genuinely required;
two designs / one implementation (1440 + 390); four states always (loading /
empty / error / populated — for the Dashboard, "empty" is the brand-new-org
first-run and also the quiet "nothing needs you today" state; draw both);
screens compose, don't style; motion is a one-line intent note, not a
storyboard; recommendations are proposed, not built, and wait for approval;
D6 is Paper-only (no code changes except the manifest and this plan's status
log).

---

## 4. GROUP G — SCREEN INVENTORY (planning-level, finalise at session start)

**One screen: the Dashboard at `/`.** From D6-plan.md §6, designed from what the
data supports. Confirm this shape — and any section you'd cut or merge — with
the user before building anything, the same inventory-and-approval step every
prior group opened with.

**Candidate sections** (map each to data-model fields; propose the final set):

1. **Greeting / header** — `PageHeader`-style: "Good afternoon, Susan" + today's
   date (Africa/Nairobi). Quick-action buttons (New quote · Log expense ·
   the global mic is already in the shell, don't duplicate it here).

2. **Today & this week** — the operational "what's happening" section. Reuse
   `AgendaEventRow` from D1: today's events (setup time, venue, status), then a
   compact "this week" list. Each row links to D2 Event detail. If nothing is
   scheduled, this section shows its own quiet empty row ("Nothing on today"),
   not a full-page empty state.

3. **Waiting on a reply** (aged) — SENT quotes ordered by `issuedAt` ascending,
   each showing client, event date, total (`MoneyDisplay`), and age
   ("Sent · 6d" — derivable, §9c). Links to C1 Quotes list filtered to SENT.
   `AttentionRow` (anticipated §7) is a candidate here — decide whether it earns
   being a new component or is a plain bordered row / a `DataTable` row.

4. **Waiting on you** — "logged a call, haven't quoted yet": `Inquiry` rows with
   no `convertedQuoteId`, from the Group B §9b quick-note dialog. Client +
   channel + when it came in + "how long ago". Links to a new quote pre-filled
   with that inquiry. **If the quick-note dialog was never drawn, this section
   has no real source — flag it (see §2).**

5. **Owed to you** — invoices with a non-zero computed `balanceCents`, worst
   first (overdue by `dueDate`, then largest balance). Ref (mono), client,
   balance (`MoneyDisplay`, amber for partial, red for overdue), age past due.
   Links to D5 Invoices list. Overdue is a DERIVED state (INV-C6), not a stored
   status — note that on the row-title card.

6. **This month** — the one "money at a glance" figure cluster: invoiced revenue
   · expenses · profit (computed, INV-E1) for the current calendar month. A
   `TotalsPanel` unified hairline strip is the likely fit (same as E3 / D4) —
   NO chart, NO trend line, NO sparkline (settled — `AvailabilityHorizon`
   precedent). Links to E3 Monthly summary for the breakdown. `KpiFigure`
   (anticipated §7) — decide whether the count-up is enough of a reason to make
   it a component now (it is a §5.2 baseline-motion concern, not a D6 screen
   component — lean toward "no, `MoneyDisplay` in a `TotalsPanel` strip is the
   figure").

7. **(Optional) Voice queue peek** — if there are pending / unactioned captures
   (INV-V6, and the §9f `DAMAGE_REPORT`-as-note case), a small line linking to
   the F4 queue sheet. Propose whether this belongs on the Dashboard or stays
   only in the shell badge. Lean toward: shell badge is enough, don't duplicate.

**States (the mandatory four, adapted):**
- **populated** — a realistic mix: 1–2 events today, a few aged quotes, one
  overdue invoice, the month figures. 1440 + 390.
- **loading** — skeleton rows per section (not a spinner). 1440 (+ 390 if it
  diverges).
- **empty — first run** — a brand-new org: no events, no quotes, no invoices.
  Written, not "No data". Points at the first useful action (add catalog items /
  create a quote). 1440 + 390.
- **empty — nothing needs you** — a live org with a genuinely clear plate:
  today's events done, no aged quotes, no unpaid balances. "Nothing needs you
  today." This is the state D6-plan.md §5.3 nominates for a **restrained
  sunflower-motif trial** (empty-state icon only) — draw it once plain, and if
  you want to propose the motif, draw a second version and present both. Do NOT
  ship the motif unproposed. 1440 + 390.
- **error** — the Dashboard aggregates many queries; if one section fails, that
  section shows an inline error and a retry, the rest still render. Draw the
  one-section-failed case, not a whole-page error. 1440.

**Layout note:** desktop is a multi-column editorial layout (D6-plan.md §5.3 ②
describes "an editorial column: Today / Waiting on a reply / Owed to you / This
month"). Mobile is a single scrolling column, same sections in priority order.
One route, one component tree, responsive — not a mobile twin.

Motion: **one-line intent note only.** The staggered assemble-itself load, the
month figure counting up, the timeline spine drawing in — all signature moment
②, a later pass. The §5.2 baseline rule ("numbers roll, don't swap") still
stands as D7 implementation guidance; it is not storyboarded here.

---

## 5. THE TASK — ORDER OF WORK

1. Reconnect context: read the docs in §1, run the Paper context calls in §2.
   Screenshot D1 Agenda, C1 Quotes list, D5 Invoices list, E3 Monthly summary,
   D2 Event detail — the screens the Dashboard links into — so your sections and
   links match what exists.
2. Post the Group G section inventory (§4, refined with your judgement) as a
   chat message: the final section list, each section's data-model source, which
   approved components it composes from, the state list, and the desktop-column
   vs mobile-stack layout. Flag the quick-note-dialog gap and any section whose
   data source is thin. Say explicitly which of `AttentionRow` / `TodayTimeline`
   / `KpiFigure` (if any) you think is genuinely required vs collapsible.
   **Wait for approval.** Do not create the page or any artboard before this.
3. On approval: create the page, build the legend + lane guide + Row 1 title
   card, matching every prior group page exactly.
4. Build the Dashboard: populated (1440) first — get the editorial column layout
   and section composition right — then 390 populated, then loading, then the
   two empty states, then the one-section-error. `get_screenshot` review after
   each against the premium bar (spacing / typography / contrast / alignment /
   artboard-fit / repetition / editorial rhythm — the contrast between dense
   list rows and generous section spacing is what should read as expensive).
   One-line verdict, fix before moving on.
5. If you propose the sunflower motif: draw the plain "nothing needs you" state
   AND a motif version, present both side by side with a recommendation, wait
   for the pick.
6. Full-page screenshot review. Present to the user. Iterate until approved.
7. Append a status-log entry to `D6-plan.md` §8, update `D6-new-components.md`
   (state explicitly if nothing changed, per the established pattern — Groups D,
   E and F all did this), append recommendations (max 5, ranked) to a new
   `D6-plan.md` §9g.
8. `finish_working_on_nodes`. Do NOT start the PDF template track — that is the
   next and final D6 session.

---

## 6. LESSONS FROM PAST SESSIONS — apply proactively

- **Sheet / overlay framing (Group F fix).** Any overlay drawn on a short
  artboard with a fixed grey scrim block reads as a stray rectangle. If the
  Dashboard has any overlay (e.g. the quick-note dialog referenced here), draw
  it as a real modal over a dimmed full screen, not a floating block. The
  Dashboard itself is a full screen, so this mostly won't bite — but the
  first-run empty state should still be a full 1440 / 390 screen, not a centred
  card on grey.
- **Flex-grow stretch bug on inserted content.** When inserting a block into an
  existing flex-column artboard via `write_html`, the inserted frame sometimes
  inherits `flex-grow` / `flex-basis` and renders far taller/shorter than
  intended. Fix immediately: `flexGrow:"0", flexShrink:"0", flexBasis:"auto",
  height:"auto"` on the inserted frame, then re-screenshot.
- **`position:absolute` shoving a child off the artboard.** Bit Group E's
  Expense sheet and was watched for in Group F. If a screenshot comes back blank
  or oddly cropped after positioning, check the immediate child's `x`/`y` via
  `get_node_info` before assuming content is missing — it's usually just
  mispositioned; reset to `position:relative; left:0; top:0`.
- **Nav active-state.** Every cloned sidebar needs its active item swapped
  explicitly (icon stroke + text colour + weight + border-bottom underline —
  all four change together). Missed at least once per group. The Dashboard's
  active item is the FIRST nav item ("Dashboard"); a Group E/F clone will have
  Dashboard or Finance active — verify and fix. Screenshot the sidebar
  specifically, not just the content area.
- **Verify node identity after `duplicate_nodes`**, especially when editing a
  clone right after making it — re-derive which IDs belong to which copy from
  the `descendantIdMap` before the next edit; `find_nodes` by text is the
  reliable fallback.
- **Opacity on a large frame renders near-transparent in screenshots** (bit the
  Group F saving state). To dim a section for a loading/disabled look, prefer a
  translucent scrim overlay child over setting `opacity` on the section frame.
- **Don't add fills to plain-text chips unless the source wants a pill.** The
  Group E Source column and Group D status treatments are plain inline text.
  Check `StatusBadge`'s actual anatomy (6px dot + coloured label, NO background
  chip) before adding anything.
- **Money is always integer KES cents, tabular mono** (INV-M1), via
  `MoneyDisplay`, formatted at the render boundary only. Every Dashboard figure.
- **Computed, never stored.** Invoice balance (INV-C5), invoice status
  (INV-C6), event profit (INV-E1/E3), quote age (§9c) — all read-time
  computations. Note this on the relevant row-title cards so D7 doesn't add
  columns.

---

## 7. CONSTRAINTS THAT DO NOT BEND

Compose from the approved set first; a new component only when the premium bar
genuinely requires it, always logged (`AttentionRow` / `TodayTimeline` /
`KpiFigure` are candidates, not commitments — the compose-first bar held for all
of Groups D, E and F). NO signature-moment work — no chart, no trend line, no
sparkline, no count-up storyboard, no assemble-itself load sequence (a one-line
intent note is fine). NO analytics / reporting / trends / win-loss / follow-up
reminders — out of scope (`system-overview.md` §8); the Dashboard is "what needs
me today", not BI. Two designs (1440 / 390), one implementation — mobile artboard
is the spec for behaviour below `md`, never a twin component. Screens compose,
they don't style — no raw hex / arbitrary spacing / one-off variants; token gap
→ raise it, missing component → propose + log. Four states, adapted: populated ·
loading (skeleton) · empty-first-run · empty-nothing-needs-you · one-section-
error. The sunflower motif is PROPOSED (draw plain + motif, present both), never
shipped unproposed. Propose, never build unrequested — silence on a
recommendation is not approval. D6 is Paper-only. Files you may write this
session: `D6-plan.md` §8 / a new §9g, `D6-new-components.md`. Nothing else. No
raw node IDs to the user. `finish_working_on_nodes` when done.

After Group G is approved, ONE D6 session remains: the PDF template track (quote
/ delivery note / questionnaire / packing checklist / receipt — print layout in
`@react-pdf/renderer` language, sharing a visual language with the public shared
quote C3 / `LetterheadBlock`). Do not start it this session.
```
