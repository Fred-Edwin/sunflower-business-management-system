# D6 SESSION — Group E "Money & records" — HANDOFF PROMPT

You are the product designer for the Sunflower Events BMS, running design stage
D6 — designing remaining application screens in Paper by composition from the
approved component set. This session designs **Group E: Money & records**.

Groups A, B, C, and D are done and client-approved. Group D's two sub-sessions
(D-i the documents spine, D-ii the lists + people) are both built and approved
— see `D6-plan.md` §8, the 2026-09-09 entries.

The bar is top-tier premium — Linear / Apple / Mercl-grade restraint as the
baseline. You are the engineer-designer: propose what would make it better,
never build unrequested, wait for approval.

NO SIGNATURE-MOMENT WORK. Signature moments are DEFERRED OUT OF D6 entirely
(client, 2026-09-08 — `D6-plan.md` §5.3). D6 designs SCREENS ONLY. This still
applies unchanged this session.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `CLAUDE.md`
- `docs/delivery/D6-plan.md` — §2 the eight governing constraints, §3 the
  session mechanic, §5.3 (signature moments DEFERRED), §6 "Group E — Money &
  records" (the planning-level inventory — you finalise the exact one this
  session), §8 status log — read the two 2026-09-09 "Group D" entries so you
  know what already exists and what conventions are established. §9a–§9d
  recommendations already logged — check before proposing anything new.
- `docs/delivery/D6-new-components.md` — the running manifest. Nothing in it is
  Group-E-specific yet; read it so you know what's already approved and don't
  re-propose it.
- `docs/conventions/design-system.md` — §1 (D6 stage), §2 token layers, §3–11
  the token vocabulary, §12 (adding a component), §13 rules
- `docs/conventions/ui-conventions.md` — §1 (the approved component set — your
  build vocabulary), §2 the gallery, §4 responsive, §5 screen patterns, §6
  voice UI, §7 accessibility
- `docs/architecture/domain-invariants.md` — §7 Event profitability (INV-E1,
  INV-E2, INV-E3 — profit is computed, never stored; wage expenses are never
  double-counted), plus INV-M1 (money) and INV-N2 (reference numbers) since
  they apply to every screen you touch
- `docs/architecture/document-lifecycle.md` — §8 Expenses (the section that
  governs this whole group: manual / voice / auto-from-wage creation,
  `eventId` nullable for general business expenses)
- `docs/architecture/data-model.md` — the `Expense` entity and its fields
  (category, eventId nullable, staffAssignmentId unique), and confirm what a
  "document" means for the Document store screen (which entities have a
  `DocumentFile`)
- Skim `docs/ops/runbook.md` if it exists and has an export/backup section —
  Data export in this group should match whatever the real export shape is.
  If the doc doesn't cover it, design the screen from the build-plan
  description only and flag the gap rather than guessing at a file format.

Do not read the wider `docs/` tree.

---

## 2. PAPER — file, tools, page

File: `01M1X43Q66HDD6TF72TYYWH3KE` ("Sunflower BMS").

First calls, in order:
1. `get_guide({topic:"paper-mcp-instructions"})` — once. Again if a long
   thread compresses.
2. `open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})`
3. `get_basic_info` — note the pages and the token set
4. `create_page` — a new page named **"D6 — Group E · Money & records"**.
   Group E gets its own page; do not build on the Group D page.
5. `get_font_family_info(["Geist","Geist Mono"])` once this session before any
   typographic styling.
6. `get_guide({topic:"mobile-status-bar"})` before drawing any new 390
   artboard.

**THE APPROVED COMPONENT SET** — your build vocabulary. Page "D3 —
Components" (pageId `6-0`), artboard `4U2-0`. Pull exact values with `get_jsx`
— never read them off a screenshot. Bands you'll lean on most this session:
`DataTable` (`58H-0`), `TotalsPanel` (`5ES-0` — the statcards layout is now
the unified hairline-strip version, redesigned in the last Group D session;
use that version, not the old boxed-cards one if you see it anywhere stale),
`PageHeader` (`573-0`), `StatusBadge` (`4U7-0`), `MoneyDisplay` (`4X8-0`),
`Pickers` (`5D6-0`), `EmptyState` (`5G9-0`), `SearchInput`, `VoiceMicButton`
(`5KU-0` — reuse the bordered pill pattern exactly, per-form mic for the
Expense form).

**App shell**: page "D2 — Batch 1 Screens" (pageId `2-0`), sidebar node
`11S-0` inside App Shell 1440 `F6-0`. Clone via
`<x-paper-clone node-id="11S-0" />` for any new artboard, or clone a recent
Group D artboard's sidebar wholesale (faster — every Group D screen already
has a correct sidebar; duplicate one and swap the active nav item). Nav order:
Dashboard · Calendar · Inquiries · Quotes · Invoices · Clients · Catalog ·
Availability · Staff · **Finance** — Finance is the nav item this group's
screens activate. Verify nav order with a screenshot before proceeding (this
has bitten past sessions).

**DO NOT TOUCH**
- Pages "D6 — Group A · Getting set up" (`7-0`, `8-0`), "D6 — Group B · Daily
  inbound" (`9-0`), "D6 — Group C · Quoting" (`A-0`), "D6 — Group D · Running
  events & getting paid" (`B-0`)
- Artboard `4U2-0` itself (read-only this session — no TotalsPanel-style fix
  is anticipated for Group E; if one turns out to be needed, treat it the same
  way the Group D session treated the statcards fix: propose, get approval,
  then the one sanctioned edit)
- Page "D2 — Batch 1 Screens" (`2-0`), "Page 1" (`1-0`), any sign-in artboard

**YOUR PAGE**: the new page you create this session, "D6 — Group E · Money &
records". Match the row / lane-guide / title-card convention established on
every other D6 group page exactly — screenshot Group D's Row 5 (D4 Invoice
detail) or Row 9 (D6 Staff list) to re-internalize spacing and the row-title
card format before adding your own lane guide and first row.

`get_screenshot` to review after each meaningful group of edits.
`finish_working_on_nodes` when done. No raw node IDs in anything you tell the
user.

---

## 3. THE EIGHT GOVERNING CONSTRAINTS (`D6-plan.md` §2 — inherited, unchanged)

Compose from the approved set first — new component only if genuinely
required (Group D needed zero across both sub-sessions; hold that discipline
here too); two designs / one implementation; four states always; screens
compose, don't style; motion is a one-line intent note, not a storyboard;
recommendations are proposed, not built, and wait for approval; D6 is
Paper-only.

---

## 4. GROUP E — SCREEN INVENTORY (planning-level, finalise at session start)

From `D6-plan.md` §6, six surfaces. Confirm this list — and any consolidation
you think is warranted — with the user before building anything, the same way
every prior group session opened with an inventory-and-approval step.

1. **Expenses list** — filterable by event / category / month. List-screen
   pattern, same as D5/D7. `PageHeader` (action "Log expense" → the Expense
   form), `SearchInput`, filter chips or selects for event/category/month,
   `DataTable` (Category · Description · Amount mono right · Date · Event
   link or "General" · Source — manual / voice / wage-auto). Wage-derived
   rows should read as clearly distinct from manual ones (INV-E2) — a source
   chip is the natural fit, matching the pattern already used for Payment
   "Source" and D2 Documents-tab chain status. `EmptyState`.
2. **Expense form** (new / edit) — single-column form pattern
   (`--container-form`). Fields: Category (Select), Description, Amount
   (money input), Date, Event (Picker, optional — nullable per
   `data-model.md`), attach-to-event vs general-business framing should be
   obvious in the UI, not just implied by an empty field. Per-form
   `VoiceMicButton` (VoiceIntent.EXPENSE — this is the forward-dependency that
   D2's Expenses tab already flagged; this form is that mic's actual
   destination). Wage-derived expenses are **read-only or edit-restricted** —
   check `document-lifecycle.md` §8 for exactly what's editable on a
   wage-auto row and design accordingly; do not let this screen imply a wage
   expense can silently drift from its `StaffAssignment`.
3. **Monthly summary / finance** — income, expenses, profit for a selected
   month. This is the Finance nav item's landing screen. Likely composes from
   `TotalsPanel` (a new layout variant may be warranted here — check "ledger"
   and "statcards" against this shape first; a three-figure income/expenses/
   profit summary is close to "statcards" already) + a month picker + maybe a
   simple category breakdown table. Do not design a chart — no chart has been
   approved anywhere in this system (`AvailabilityHorizon` was rejected
   twice); a `DataTable` category breakdown is the composed-first answer.
4. **Document store** — search-first, find any document (quote, delivery
   note, invoice, receipt) by client / date / event / type. `PageHeader`,
   `SearchInput` (prominent — this screen's whole job is search), filters
   (type, date range, client), `DataTable` (Type · Ref · Client · Event ·
   Date · Status), each row's action is "Download" or "Open" depending on
   type. This is meant to be Susan's single "find any paper" screen — keep it
   simple, not another list with a different name.
5. **Data export** — one flow, `/settings/export`. This is a Settings-area
   screen even though it's grouped with Finance conceptually — confirm with
   the user whether it lives under the Finance nav item or is reached from
   Settings (Group A territory) before building, since the nav item it hangs
   off changes the sidebar active-state. A single-column form/action screen:
   what's exported, a date-range picker, an Export button, a note on format.
   Cost is low; don't over-design it into a wizard.
6. **Event P&L** — a **tab added to Event detail** (D2), not a new screen.
   D2's P&L tab is already drawn greyed-out with a "coming in the finance
   module" note in the built Group D artboards — that placeholder now needs
   its real content. Composes `TotalsPanel` (Invoiced revenue · Expenses ·
   Profit) + the event's expense list filtered to that event (reuse the
   Expenses list's `DataTable` shape, scoped). Profit is computed, never
   stored (INV-E3) — draw it as a read-out, same discipline as Invoice
   balance/status. **This one edits an existing Group D artboard** (D2's P&L
   tab, inside `IRK-0`'s row on the Group D page) — that's the one sanctioned
   cross-page edit this session; do it last, after Group E's own page is
   built and reviewed, and treat it with the same care as the TotalsPanel fix
   (screenshot before, screenshot after, one-line verdict).

**New components**: none anticipated. If the monthly-summary screen's
three-figure layout doesn't fit `TotalsPanel`'s existing layouts cleanly,
that's the most likely place a new layout *variant* (not a new component)
gets proposed — check against "statcards" first, it's the closest fit.

---

## 5. THE TASK — ORDER OF WORK

1. Reconnect context: read the docs in §1, run the Paper context calls in §2.
   Screenshot a couple of existing Group D screens (D5 Invoices list, D2's
   P&L tab as currently drawn) to internalize the list-screen convention and
   see exactly what placeholder you're replacing later.
2. Post the Group E screen inventory (§4 above, refined with your own
   judgement) as a chat message, including states and the compose-from list
   per screen, and flag the Data-export nav-placement question. **Wait for
   approval.** Do not create the page or any artboard before this.
3. On approval: create the page, build the legend + lane guide + Row 1 title
   card, matching every prior group page exactly.
4. Build screens in this order: Expenses list → Expense form → Monthly
   summary/finance → Document store → Data export. `get_screenshot` review
   after each screen against the premium bar (spacing / typography / contrast
   / alignment / artboard-fit / repetition) — one-line verdict, fix before
   moving on. Apply TABLE-ALIGNMENT DISCIPLINE (§6 below) to every
   `DataTable`.
5. Full-page screenshot review of everything built so far. Present to the
   user. Iterate until approved.
6. On approval: do the Event P&L tab edit on the Group D page (§4 item 6).
   Screenshot before and after, one-line verdict.
7. Append a status-log entry to `D6-plan.md` §8, update
   `D6-new-components.md` if anything changed (state explicitly if nothing
   did, per the established pattern), append recommendations (max 5, ranked)
   to a new `D6-plan.md` §9e.
8. `finish_working_on_nodes`. Do NOT start the PDF template track, Group F,
   or Group G.

---

## 6. TABLE-ALIGNMENT DISCIPLINE — unchanged, apply it

One column spec, applied byte-identically to header and every row via
`duplicate_nodes` + `set_text_content`. Never hand-edit individual cell
widths. Screenshot and trace column boundaries after 3+ rows. Applies to
every `DataTable` in this group (Expenses list, Document store, the P&L tab's
scoped expense list).

---

## 7. LESSONS FROM PAST SESSIONS — apply proactively

- **Flex-grow stretch bug on inserted content.** When inserting a block into
  an existing flex-column artboard via `write_html` (insert-children or
  replace mode), the inserted frame sometimes inherits `flex-grow`/
  `flex-basis` from context and renders far taller/shorter than intended.
  Fix immediately by setting `flexGrow: "0", flexShrink: "0", flexBasis:
  "auto", height: "auto"` explicitly on the inserted frame, then
  re-screenshot to confirm. This will matter most when you edit D2's P&L tab
  (§4 item 6, an edit into an existing artboard) — check it immediately after
  that edit.
- **Verify node identity before editing, especially after `duplicate_nodes`.**
  A duplicated artboard's descendant ID map can be large; when you go back to
  edit a specific field days into a build, re-run `find_nodes` by text rather
  than trusting an ID you remember from an earlier step in the same session —
  a mismatched target has caused wrong-node edits and duplicate/leftover
  content in past sessions (surfaced once as a broken loading state that
  silently rendered real data underneath a skeleton). Always screenshot after
  a `write_html replace` to confirm nothing old is left behind.
- **Nav active-state.** Every cloned sidebar needs its active item swapped
  explicitly (icon stroke + text color + weight + border-bottom underline all
  four change together) — this has been missed at least once per group.
  Screenshot and check the sidebar specifically, not just the content area.
- **Don't add fills to plain-text chips unless the source explicitly wants
  a pill.** If a status/category is meant to read as inline colored text (no
  background, no border), build it that way from the start — check with the
  user if a screen's chip treatment is ambiguous rather than defaulting to
  the pill pattern.

---

## 8. CONSTRAINTS THAT DO NOT BEND

Compose from the approved set first; a new component only when the premium
bar genuinely requires it, always logged. NO signature-moment work — no
chart, no bespoke graphics, no motion storyboard (a one-line intent note is
fine). Two designs (390 / 1440), one implementation — mobile artboard is the
spec for behavior below `md`. Screens compose, they don't style — no raw hex
/ arbitrary spacing / one-off variants; token gap → raise it, missing
component → build + log. Every screen: loading / empty / error / populated,
all drawn. Propose, never build unrequested — silence on a recommendation is
not approval. D6 is Paper-only. Files you may write this session:
`D6-plan.md` §8 / a new §9e, `D6-new-components.md`. Nothing else. No raw
node IDs to the user. `finish_working_on_nodes` when done.

Money is integer KES cents, tabular mono on money/quantities/reference
numbers (INV-M1). An event's profit is computed, never stored, and is never
double-counted for wage expenses (INV-E1/E2/E3). Nothing hard-deleted
(INV-I5) — if an expense needs a "remove" affordance, it's a status change or
a reversal, not a delete; check `document-lifecycle.md` §8 for the exact
mechanic before designing it. Timezone display Africa/Nairobi; event dates
`@db.Date`.
