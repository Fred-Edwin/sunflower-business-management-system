# D6 · Session 4 — Group D (Running events & getting paid)

**Paste the block below into a fresh session.** The durable context is the linked
files, not this prompt. Group D is the largest group — the handoff recommends
splitting it across two sub-sessions (D-i, D-ii); the agent may run both in one
session if context budget allows.

---

```
D6 SESSION — Group D "Running events & getting paid" · HAND-OFF

You are the product designer for the Sunflower Events BMS, running design stage D6
— designing remaining application screens in Paper by composition from the
approved component set. This session covers flow Group D: Running events & getting
paid — the second half of the document-chain spine.

Groups A, B and C are done and client-approved (A finalised in parallel; B = one
screen; C = 3 screens + 1 dialog). Do not touch anything belonging to A, B or C.
Your work is a new, separate Paper page.

The bar is top-tier premium — Linear / Apple / Mercl-grade restraint as the
baseline. You are the engineer-designer: propose what would make it better, never
build unrequested, wait for approval.

NO SIGNATURE-MOMENT WORK. Signature moments are DEFERRED OUT OF D6 entirely
(client, 2026-09-08 — D6-plan.md §5.3). D6 designs SCREENS ONLY: layout, states,
composition from the approved set. No motion storyboards, no bespoke graphics, no
signature components. A dedicated "moments" pass runs after every group's screens
are approved. In particular for Group D: do NOT design a "document issued"
ceremony (⑥) on the delivery-note / invoice issue confirms — draw them as plain
ConfirmDialogs. The "numbers roll, don't swap" baseline rule from D6-plan.md §5.2
still applies as *implementation guidance for D7* — it just isn't storyboarded in
D6, and TotalsPanel is drawn static.

1. READ FIRST, IN THIS ORDER, AND ONLY THESE

* CLAUDE.md
* docs/delivery/D6-plan.md — §2 the eight governing constraints (non-negotiable),
  §3 the session mechanic (note: Group D "may split across two sessions"), §4
  approved flow consolidations, §5.1 the premium baseline, §5.3 (signature moments
  DEFERRED — read this), §6 the Group D inventory (the revised block — 8 screens +
  2 sheets + 2 side-panels + 3 dialogs), §8 status log (read the Group A, B and C
  entries for context and the layout convention), §9 reading list, §9a/§9b/§9c
  recommendations already logged (do not repeat)
* docs/delivery/D6-new-components.md — the running manifest. FileDropField,
  VoiceItemRow, VersionRail, LetterheadBlock are Proposed. AvailabilityHorizon and
  QuickAddRow are Rejected — do not revive them. Group D anticipates two more:
  PaymentRow and AssignmentRow — build in Paper + log ONLY if the premium bar
  genuinely requires them (check the approved set first).
* docs/conventions/design-system.md — §1 (D6 stage), §2 token layers, §3–11 the
  token vocabulary, §12 (adding a component), §13 rules
* docs/conventions/ui-conventions.md — §1 (the approved component set — your build
  vocabulary), §2 the gallery, §4 responsive (two designs / one implementation),
  §5 screen patterns (list / detail / form), §7 accessibility
* docs/architecture/domain-invariants.md — the invariants screens must respect at
  the component level. Group D leans hard on: INV-I2/I3 (immutability, void &
  replace), INV-N2/N3 (gapless, never reused), INV-C1–C6 (the chain; invoice
  balance + status are COMPUTED, never stored), INV-A3/A4 (commit on acceptance,
  re-check in transaction), INV-A6 (warn, do not block), INV-E1/E2 (event profit;
  wage expenses not double-counted).
* docs/architecture/document-lifecycle.md — THE architecture doc for this group.
  §1 the chain, §3 Quote acceptance (creates the Event + COMMITTED bookings), §4
  Event states, §5 Delivery Note (draft→issued→returns; questionnaire alongside),
  §6 Invoice (draft→issued→partially_paid→paid; void & replace; status DERIVED),
  §7 Payment & Receipt (one transaction; receipt auto-created; overpayment
  allowed → credit), §9 "what each stage may and may not do", §10 implementation
  notes (transactions, PDF post-commit, status derived).
* docs/architecture/data-model.md — §2 Client, §3 Booking / AvailabilityWarning,
  §5 Event / StaffMember / StaffAssignment, §6 DeliveryNote /
  DeliveryNoteLineItem (returnedQuantity / returnedAt) / Invoice (balanceCents and
  amountPaidCents are NOT columns) / InvoiceLineItem / Payment / Receipt /
  DocumentCounter, §7 Expense (staffAssignmentId unique → no double-count), §9 the
  enums (EventType, EventStatus, StaffRole, PaymentMethod, DocumentStatus,
  InvoiceStatus, ExpenseCategory, ClientSource, VoiceIntent).

Do not read the wider docs/ tree.

2. PAPER — file, tools, page

File: 01M1X43Q66HDD6TF72TYYWH3KE ("Sunflower BMS").
First calls, in order:
1. get_guide({topic:"paper-mcp-instructions"}) — once. Again if a long thread compresses.
2. open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})
3. get_basic_info — note the pages and the token set
4. get_font_family_info(["Geist","Geist Mono"]) — before any typographic styling.
   Weights locked to 400 / 500 / 600 (design-system.md §4). No other weights.
5. get_guide({topic:"mobile-status-bar"}) — before drawing any 390 artboard. Use
   the paste-ready status bar, do not hand-draw one. (Light background → use
   color:"black" / fill:"black".)

THE APPROVED COMPONENT SET — your build vocabulary
Page "D3 — Components" (pageId 6-0), artboard 4U2-0. Pull exact values with
get_jsx on the relevant band — never read them off a screenshot. Bands render
font-family as system-ui as a shorthand for Geist; the real font is Geist / Geist
Mono. Band node IDs:
  StatusBadge 4U7-0 · MoneyDisplay 4X8-0 · QuantityInput 4Y0-0 ·
  AvailabilityBadge 4YY-0 · DayAvailabilityStrip 500-0 · LineItemRow 51H-0 ·
  PageHeader 573-0 · DataTable 58H-0 · Controls (SegmentedToggle /
  DateRangeControl / CalendarSpanControl / SearchInput) 5AO-0 · Pickers
  (ClientPicker / CatalogItemPicker) 5D6-0 · TotalsPanel 5ES-0 · EmptyState
  5G9-0 · ConfirmDialog 5HH-0 · ConflictBanner 5IX-0 · DocumentNoticeBanner
  5JT-0 · VoiceMicButton 5KU-0 · VoiceReviewField 5M5-0 · VoiceQueueIndicator
  5NC-0 · TranscriptPanel 5OJ-0 · CalendarGrid + EventChip 5PY-0 · AgendaDayGroup
  + AgendaEventRow 5RU-0 · shadcn block restyle specs 5TI-0.

The Group D screens lean on: PageHeader, DataTable, StatusBadge (variant
"document" 10 states / "event" 4 states), TotalsPanel (layout "statcards" for the
invoice), LineItemRow (variant "document" — static, read-only, no availability,
INV-I2), ConfirmDialog, ConflictBanner, DocumentNoticeBanner (void / superseded —
always carries a forward link), EmptyState, QuantityInput (returns), Select,
DatePicker, Combobox, Sheet, Tabs, and the calendar composites CalendarGrid /
EventChip / AgendaDayGroup / AgendaEventRow.

Also get_jsx the app shell: page "D2 — Batch 1 Screens" (pageId 2-0) — App Shell
1440 F6-0, App Shell 390 3UA-0. Clone the sidebar (node 11S-0 inside F6-0) via
<x-paper-clone node-id="11S-0" /> and set the active nav item per screen:
  D1 Calendar → "Calendar" active
  D2 Event detail → "Calendar" active (events are reached from the calendar; there
     is no top-level "Events" nav item)
  D3 Delivery note detail, D4 Invoice detail, D5 Invoices list → "Invoices" active
  D6 Staff list → "Staff" active
  D7 Clients list, D8 Client detail → "Clients" active
Recolour the previously-active "Dashboard" item to muted (border-bottom removed,
icon strokes and text → --color-chrome-text-muted, weight 500) and the target
item to active (border-bottom: 1px solid var(--color-chrome-active-underline),
text --color-chrome-text weight 600, icon strokes --color-chrome-text). The
sidebar nav order is Dashboard · Calendar · Inquiries · Quotes · Invoices ·
Clients · Catalog · Availability · Staff · Finance — count carefully when picking
the frame to recolour (the Group C session mis-picked Invoices for Quotes once;
verify with a screenshot of the sidebar before proceeding).

Reference-only screens (screenshot to understand, DO NOT edit):
* Calendar — Calendar view (D) 3GJ-0 and Agenda view (B) 34T-0 (page 2-0) — the
  D2 exploration. Note: these are the OLD 1–2-week focused view; your D1 is
  MONTH VIEW (see §5). Layout and the conflict-flag treatment are still a useful
  reference.
* Invoice Detail 1440 20X-0 (page 2-0) — the D2 exploration; the statcards +
  void banner + payments-list layout is a strong starting point for D4.
* Client Detail 1440 1U2-0 (page 2-0) — the tabbed detail pattern (history /
  quotes / invoices) + the Contact card + Notes card. This is the starting point
  for D8.
* The Group C page "D6 — Group C · Quoting" (pageId A-0) — for the list-screen
  pattern (C1 Quotes list) which D5 Invoices list, D6 Staff list and D7 Clients
  list all reuse, and the C4 ConfirmDialog + copy-table pattern which the
  void-and-replace dialog reuses. Screenshot, do not edit.

DO NOT TOUCH
* Pages "D6 — Group A · Getting set up" (7-0 and 8-0), "D6 — Group B · Daily
  inbound" (9-0), "D6 — Group C · Quoting" (A-0) and everything on them
* Artboard 4U2-0, page "D3 — Components" (6-0), page "D2 — Batch 1 Screens" (2-0),
  "Page 1" (1-0)
* Any sign-in family artboard

YOUR PAGE
create_page — name it exactly "D6 — Group D · Running events & getting paid".
Confirm you are on it with open_file({fileId:"...", pageId:"<the new page id>"})
before drawing. Beware id-namespace collision: page ids and node ids overlap —
address artboards by their own node IDs and pages via pageId in open_file.

get_screenshot to review after each meaningful group of artboards. When content
clips, switch the artboard to height:"fit-content" via update_styles — never
guess a fixed height. Authenticated screens with a fixed-height sidebar should
stay height:"900px" and let the content fit; empty/error states that would leave
a huge void may go to fit-content. finish_working_on_nodes when done. No raw node
IDs in anything you tell the user.

3. THE EIGHT GOVERNING CONSTRAINTS (D6-plan.md §2 — inherited, non-negotiable)
1. Compose from the approved set first. If a Tier 1 / Tier 2 component does the
   job, use it exactly as built. Do not re-draw it, do not fork a variant.
2. A new component only when the premium bar genuinely requires it AND no approved
   component can do it. Build it in Paper, log it in D6-new-components.md (name ·
   forced by · purpose · states · why not an existing component · motion:
   "deferred, D6 signature-moment freeze" · status Proposed).
3. Two designs, one implementation. Every screen at 390px and 1440px. The mobile
   artboard is the spec for how the tree behaves below md — DataTable → card
   projection, Dialog → bottom sheet, Sheet → bottom sheet all live inside the
   Tier 1/2 component, not the screen.
4. Every screen has four states: loading (skeleton, not a spinner), empty, error,
   populated. All drawn. An unhandled empty state is an incomplete screen. For a
   detail screen whose "empty" is degenerate (a brand-new invoice draft), draw it
   and label it as the canonical state rather than a gap.
5. Screens compose, they do not style. No raw hex, no arbitrary spacing, no
   one-off variants on a screen artboard. If a screen seems to need one → a token
   gap (raise it) or a missing Tier 2 component (build + log).
6. Motion has an identity — but in D6 it is NOT storyboarded (see §5.3). Note each
   screen's motion INTENT in one line on its artboard for the D7 agent; do not
   draw frames.
7. Recommendations are proposed, not built. Silence on a recommendation is not
   approval.
8. Instrument nothing, transact nothing. D6 is Paper only. No code changes except
   D6-plan.md §8 / §9d and D6-new-components.md.

4. INVARIANTS IN PLAY FOR GROUP D
* INV-C1 The chain derives each step from the previous — the DN line items are
  copied from the accepted quote (INV-C2), the invoice line items from the DN
  (INV-C3). Never re-keyed. No screen shows a "type the line items" step after
  the quote.
* INV-C5 / INV-C6 Invoice balanceCents = totalCents − sum(payments); status is
  ISSUED / PARTIALLY_PAID / PAID derived from the balance. Draw them as computed
  read-outs (TotalsPanel statcards), never as editable fields.
* INV-C4 A receipt is auto-created when a payment is recorded. There is no
  "create receipt" action and NO receipt detail screen — the receipt is a row on
  the invoice with its number + a Download / Share action, and a PDF (PDF track).
* INV-I2 / INV-I3 Issued documents are immutable; corrections VOID and replace,
  keeping both visible with their own reference numbers. The void-and-replace
  dialog is one design, three triggers (invoice / DN / payment reversal).
  DocumentNoticeBanner sits permanently on a voided/superseded document and
  ALWAYS carries a forward link to the replacement.
* INV-N2 / INV-N3 Reference numbers are gapless and never reused, allocated at
  issue inside the transaction. Drafts have no number — show "(draft)" or "—".
* INV-A3 / INV-A4 / INV-A6 Accepting a quote (Group C) commits inventory; the
  event's equipment tab shows those COMMITTED bookings with conflict status. If a
  booking is short, a ConflictBanner (warn, do not block) — every such warning
  writes an AvailabilityWarning. Staff double-booking on an overlapping event is
  the same pattern (ConflictBanner in the assignment dialog).
* INV-E1 / INV-E2 Event profit = invoiced revenue − sum of logged expenses. A
  StaffAssignment wage auto-creates a linked Expense (staffAssignmentId unique →
  never double-counted). The assignment dialog states this; the P&L tab is Group
  E, not this session — draw the tab affordance, note the forward dependency.
* INV-V1 / INV-V2 / INV-V3 Voice never saves without confirmation; two-stage
  pipeline; transcript always persisted and visible. Record-payment
  (VoiceIntent.PAYMENT) and Staff-assignment (VoiceIntent.STAFF_ASSIGNMENT) are
  voice-enabled — per-dialog mic on the title, voice path routes to the Group F
  voice review shell (not this session — draw the affordance, note the forward
  dependency).
* INV-T2 / INV-T7 Every list is org-scoped. Not a UI concern directly; no screen
  implies cross-org data.
* Money is integer KES cents, fields end in Cents, tabular mono on money /
  quantities / reference numbers (INV-M1). Overpayment is allowed and shows as a
  negative balance / credit, not an error (document-lifecycle.md §7).
* Timezone display Africa/Nairobi; event dates @db.Date; timestamps UTC displayed
  in Nairobi time.

5. THE SCREEN INVENTORY — APPROVED (build this)

Group D was critiqued and reduced with the client (2026-09-08): 12 surfaces → 8
screens + 2 sheets + 2 side-panels + 3 dialogs. Full rationale in D6-plan.md §6
(the revised Group D block). RECOMMENDED SPLIT across two sub-sessions:

  D-i (the documents spine): D1 Calendar · D2 Event detail · D3 Delivery note
      detail · D4 Invoice detail · Record payment dialog · Void-and-replace dialog
  D-ii (lists + people): D5 Invoices list · D6 Staff list (+ edit sheet + history
      panel) · D7 Clients list · D8 Client detail (+ edit sheet) · Staff
      assignment dialog

Run D-i, get client approval, then D-ii — or run both if context budget allows.
Each sub-session ends with a screenshot review + an approval gate.

Layout on the Paper page: match Groups A/B/C EXACTLY. Screenshot the Group C page
(A-0) once (do not edit it) to internalise the convention, then reproduce:
* One screen = one horizontal ROW. Within a row, each STATE is a 1440 desktop
  artboard immediately followed by its 390 mobile companion — populated · loading
  · empty · error, then screen-specific variants. 80px gutters.
* A row-title frame on the left of each row (id + name + one-line purpose +
  composed-from list + state list + motion intent). Get the exact format by
  get_jsx on a Group C row-title card.
* A grey "Lane guide" strip at the top marking the columns.
* An A0-style page legend top-left: what Group D is, the screen list, the layout.
* Dialogs and sheets: one board each (like C4) showing every state side by side +
  a copy table where there are copy variants.

--- D-i SCREENS ---

D1 — Calendar (MONTH VIEW)
The "what's happening" screen. Authenticated (Calendar active).
* MONTH VIEW ONLY. The D2 1–2-week focused view is DROPPED (client, 2026-09-08).
  CalendarSpanControl (the 1wk/2wk switch) is no longer used and is not on the
  compose list. Keep ‹ Today › month navigation.
* Pattern: calendar screen. PageHeader (title = the month, e.g. "October 2026").
  A SegmentedToggle Calendar / Agenda. ‹ Today › cluster. A legend row (Scheduled
  / In progress / Staff or equipment conflict).
* Calendar view: CalendarGrid as a full MONTH grid (weekday header MON…SUN,
  6 week-rows, date number top-left, EventChips stacked in the day cell, a
  ConflictBanner compact pill in a day cell that has a clash). Focus the current
  month; dim leading/trailing days from adjacent months.
* Agenda view: AgendaDayGroup (sunken date header "SAT 18 OCT · 2 events ·
  conflict") + AgendaEventRow beneath; a conflict day shows a ConflictBanner
  inline before its rows; an empty day = a quiet "Nothing scheduled" row.
* Row click on a chip / agenda row → the Event detail (D2).
* States: populated (a busy month, ~8 events, 1 conflict day — draw both Calendar
  and Agenda as the canonical pair) · loading (grid skeleton / agenda skeleton) ·
  empty (EmptyState "Nothing booked this month" — body about accepting a quote to
  create an event; the grid still renders, empty) · error (inline block + Retry;
  PageHeader + toggle still render).
* Mobile: month grid is tight but works at 390 (small cells, a dot per event, tap
  a day → that day's agenda sheet). Agenda view is the better default on mobile —
  note that. SegmentedToggle full width.
* Motion intent (one line): switching Calendar↔Agenda cross-fades; navigating
  months slides the grid horizontally in the direction of travel. No storyboard.

D2 — Event detail (the hub)
Reached from the calendar. Authenticated (Calendar active). Tabbed.
* Pattern: detail screen with tabs. PageHeader (breadcrumb "Calendar / {event}",
  title = event name, inline StatusBadge variant "event" — Scheduled / In
  progress / Completed / Cancelled, action slot: "Cancel event" → ConfirmDialog).
* Tabs (Tabs component): Overview · Equipment · Staff · Documents · Expenses.
  (A P&L tab is added in Group E — draw the tab label greyed / "coming in the
  finance module" affordance, note the forward dependency. Do NOT design P&L.)
  - Overview: client (link to D8), event type, dates, setup time, venue,
    location, notes. A small "at a glance" — total quoted, staff assigned,
    documents issued.
  - Equipment: the COMMITTED bookings for this event — a DataTable (Item ·
    Quantity · Dates · Conflict status via AvailabilityBadge / ConflictBanner).
    This is the bookings view, NOT the document line items. If a booking is short,
    a ConflictBanner.
  - Staff: assigned staff — a list of AssignmentRow (new — person · role · days ·
    day rate · wage total · conflict flag), action "Assign staff" → the Staff
    assignment dialog. Note the wage → Expense link (INV-E2).
  - Documents: the chain — Quote (link to Group C) · Delivery note · Invoice ·
    Receipt(s), each with its StatusBadge and a link. Actions to generate the
    next document in the chain ("Generate delivery note" → lands in D3's draft
    state; "Generate invoice" → D4's draft state).
  - Expenses: logged expenses for this event — a DataTable (Category · Description
    · Amount · Date · source: manual / voice / wage). Action "Log expense" (the
    expense form is Group E — draw the affordance, forward dependency).
* States: populated (an event mid-flow — quote accepted, DN issued, invoice
  draft, 2 staff assigned, 1 expense — draw the Overview tab as canonical, plus
  each other tab as a screen-specific variant) · loading (tab skeleton) · empty
  (a brand-new event straight from quote acceptance — no DN, no staff, no
  expenses yet; each tab shows its own EmptyState; this is canonical, not a gap)
  · error (tab area inline + Retry; PageHeader + tabs still render).
* Mobile: tabs become a scrollable tab strip or a Select; each tab's DataTable →
  cards. Actions in a bottom sheet / row menu.
* Motion intent: tab change cross-fades the panel; a newly-generated document row
  inserts at the top of the Documents tab.

D3 — Delivery note detail
Reached from the event's Documents tab ("Generate delivery note") or the Invoices
area. Authenticated (Invoices active).
* Pattern: document detail. PageHeader (breadcrumb, title = ref number in Geist
  Mono once issued / "New delivery note" while draft, StatusBadge variant
  "document" — Draft / Issued / Voided, action slot).
* Content: event + client (read-only, from the event), then the line items —
  LineItemRow variant "document" (no index, no availability, static qty, no
  delete, read-only always — INV-I2). Copied from the accepted quote (INV-C2).
  Delivery details (deliveredAt, receivedByName). A "questionnaire generated
  alongside" note (PDF track, no state of its own).
* Return recording: a state where each line item gains a QuantityInput for
  "returned" (returnedQuantity / returnedAt — document-lifecycle.md §5). Partial
  returns are normal. This is a distinct state of the same screen.
* States: draft (= the "generate" flow — line items shown, "Issue delivery note"
  → ConfirmDialog; editable only in the sense of confirming, the items come from
  the quote) · issued (read-only, "Record returns" action) · record-returns (the
  QuantityInput-per-row state) · voided (DocumentNoticeBanner with the forward
  link to the replacement) · loading · empty (n/a — a DN is always generated from
  an event with line items; note this) · error.
* Mobile: line items → cards; returns = a QuantityInput per card; sticky action.
* Motion intent: on issue, the ref number appears in the title (plain — NO stamp
  ceremony, that's ⑥, deferred).

D4 — Invoice detail
Reached from the event's Documents tab ("Generate invoice") or the Invoices list
(D5). Authenticated (Invoices active). The D2 exploration 20X-0 is a strong
starting point.
* Pattern: document detail. PageHeader (breadcrumb, ref number mono / "New
  invoice" draft, StatusBadge variant "document" — Draft / Issued / Partially
  paid / Paid / Voided, action slot: Download PDF / Record payment / Void).
* Content: TotalsPanel layout "statcards" — three KPI cards: Invoice total / Paid
  to date / Balance (ALL computed — INV-C5/C6, never editable). Then a right rail
  (or below on mobile): Client · Event · Issued date · "From delivery note
  DN-YYYY-NNNN" (link). Then the line items — LineItemRow variant "document"
  (copied from the DN, INV-C3). Then the Payments section — a list of PaymentRow
  (new — amount · method · M-Pesa reference · date · receipt number RCP-YYYY-NNNN
  · Download / Share receipt). "Record payment" → the Record payment dialog.
* States: draft (= the "generate" flow — "Issue invoice" → ConfirmDialog) · issued
  (no payments — balance = total) · partially-paid (0 < paid < total; one or two
  PaymentRows; balance amber) · paid (paid >= total; balance zero or a credit if
  overpaid — show "KES 5,000 credit" not a negative-looking error) · voided
  (DocumentNoticeBanner + forward link to the replacement invoice; "no further
  payments — this invoice is voided") · loading · empty (n/a — draw the draft as
  canonical) · error.
* Mobile: statcards stack to three rows; line items → cards; PaymentRows → cards;
  sticky "Record payment".
* Motion intent: on a payment, the three statcard figures move to their new
  values (implementation note only — NOT storyboarded).

Record payment — DIALOG (D-i)
A Dialog, drawn over D4. Authenticated context.
* Pattern: Dialog base (shadow-lg, focus trap). Title "Record a payment". Per-
  dialog mic on the title (VoiceIntent.PAYMENT — voice path → Group F, forward
  dependency, affordance only). Fields:
  - Amount — money input (tabular mono, KES). No cap — overpayment allowed.
  - Method — Select (PaymentMethod: CASH / MOBILE_MONEY / BANK_TRANSFER / CHEQUE).
    Default MOBILE_MONEY.
  - Date — DatePicker → paidAt, default today.
  - Reference — Input, optional (M-Pesa code / bank reference). Mono.
  - Note — Textarea, optional.
* Confirm names the action: "Record KES 60,000 payment" (updates as the amount
  changes). Cancel = "Cancel". Recording auto-creates the receipt (INV-C4) — a
  caption says so ("A receipt is created automatically").
* States: resting (= populated, filled, confirm enabled) · empty (amount blank,
  method MOBILE_MONEY, date today; confirm disabled until amount valid) ·
  overpayment-notice (amount > balance → an inline info note "This is KES 5,000
  more than the balance. The extra shows as a credit." — NOT a ConflictBanner,
  NOT blocked) · pending (spinner) · error (inline, dialog stays open).
* Mobile: bottom sheet, sticky confirm.
* Motion intent: the confirm label number rolls as the amount changes (impl note).

Void and replace — DIALOG (D-i)
One ConfirmDialog design + a copy table for THREE triggers (invoice / delivery
note / payment reversal). Same pattern as Group C's C4. Drawn over D4 (or D3).
* Pattern: ConfirmDialog base. Body states plainly what will happen. A reason
  field — Textarea, REQUIRED (voidReason). Confirm names the action: "Void
  INV-2026-0042" / "Void DN-2026-0031" / "Reverse this payment". Cancel = "Keep".
* Copy table (the 3 triggers):
  - invoice: "Void this invoice?" — "{ref} will be marked Voided and can no
    longer be edited or paid. A replacement invoice will be created and linked.
    The client-facing PDF stays on record." · confirm "Void invoice"
  - delivery note: "Void this delivery note?" — "{ref} will be marked Voided. A
    replacement delivery note will be created and linked. Both stay on record
    with their own numbers." · confirm "Void delivery note"
  - payment reversal: "Reverse this payment?" — "The {amount} payment and its
    receipt {rcp-ref} are both voided and stay visible. The invoice balance goes
    back up by {amount}." · confirm "Reverse payment"
* States: resting (each trigger) · pending · error (inline, dialog stays open).
* Deferred: NO ceremony. Plain ConfirmDialog.

--- D-ii SCREENS ---

D5 — Invoices list
List screen, like C1 (screenshot the Group C page for the pattern). Authenticated
(Invoices active).
* Pattern: PageHeader (title "Invoices", no create action — invoices are
  generated from events, not created here; instead a hint "Invoices are created
  from an event"). StatusBadge filter chips: All · Issued · Partially paid · Paid
  · Overdue · Voided. SearchInput with count. A client filter. DataTable: Ref
  (mono) · Client · Event · Issued (date) · Due (date) · Balance (mono, right,
  computed) · Status. Filters in the URL (nuqs). Row click → D4.
* "Overdue" is derived (issued, past dueDate, balance > 0) — document that; it is
  not a stored status (INV-C6). Voided rows use muted text.
* States: populated (~10 rows, mixed statuses; drafts if shown = "(draft)" + no
  ref) · loading (DataTable skeleton) · empty (EmptyState "No invoices yet" —
  body about generating one from an event) · error (table area inline + Retry).
* Mobile: DataTable → cards. No FAB (nothing to create here).
* Motion intent: count rolls on filter change.

D6 — Staff list (+ assignment-history side panel)
List screen + a right-side Sheet for history. Authenticated (Staff active). Same
list + edit-sheet pattern as the Group A catalog list + edit sheet.
* Pattern: PageHeader (title "Staff", action "Add staff" → the Staff edit sheet).
  SearchInput with count. DataTable: Name · Role (StatusBadge? — or plain) ·
  Default day rate (mono, right) · Active. Filter (role, active) in URL. Row
  click → the assignment-history side panel (right-side Sheet on desktop, bottom
  sheet < md): which events this person worked, days, wage paid, most recent
  first. From the panel: "Edit" → the Staff edit sheet.
* States: populated (~8 staff, a mix of roles, one inactive) · loading · empty
  (EmptyState "No staff yet" — body about adding casual crew, action "Add staff")
  · error.
* Screen-specific variants: history panel open (canonical, so the panel is
  visible) · panel closed · the Staff edit sheet open (new + edit).
* Mobile: DataTable → cards; row tap → the bottom-sheet history.

Staff edit sheet
Right-side Sheet over the staff list (bottom sheet < md), page dimmed behind.
* Fields: Name (Input) · Phone (Input) · Role (Select, StaffRole: DRIVER / SETUP
  / SUPERVISOR / AUDIO / GENERAL) · Default day rate (money input, optional).
  New mode (blank) + edit mode (pre-filled). Deactivate via a small ConfirmDialog
  ("Deactivate {name}? They stay on past events but won't show when assigning
  staff.") — never hard-delete (INV-I5).
* States: populated (edit) · empty (new — blank, canonical) · loading (edit) ·
  error (save-failed inline danger panel, values preserved) · deactivate
  ConfirmDialog.

D7 — Clients list
List screen, like C1. Authenticated (Clients active).
* Pattern: PageHeader (title "Clients", action "New client" → the Client edit
  sheet). SearchInput with count. DataTable: Name · Phone (mono) · Source
  (ClientSource as a chip — REFERRAL / TENDER / WALK_IN / REPEAT / WEBSITE /
  OTHER) · Quotes (count) · Last activity (relative date). Filter (source) in URL.
  Row click → D8.
* States: populated (~12 clients, mixed sources) · loading · empty (EmptyState
  "No clients yet" — body: clients are added when you create a quote, or add one
  here; action "New client") · error.
* Mobile: DataTable → cards; "New client" = FAB.

D8 — Client detail
Tabbed detail. Authenticated (Clients active). Start from the D2 artboard 1U2-0.
* Pattern: PageHeader (breadcrumb "Clients / {name}", title = name, inline source
  chip, actions: Edit → the Client edit sheet, New quote → Group C quote builder
  pre-filled). A left column: Contact card (phone / email / town / added date) +
  Notes card (with an Edit affordance). A right column with Tabs: History /
  Quotes / Invoices.
  - History: a merged chronological feed — quotes issued, events, invoices,
    payments. AgendaDayGroup-style or a simple DataTable.
  - Quotes: this client's quotes (Ref · Event date · Total · Status) — links to
    Group C.
  - Invoices: this client's invoices (Ref · Event · Balance · Status) — links to
    D4.
* States: populated (an established client — 3 quotes, 2 events, 1 open invoice —
  History tab canonical) · loading (card + tab skeleton) · empty (a brand-new
  client — Contact card filled, Notes empty, every tab EmptyState "No history
  yet" like the D2 artboard; canonical, not a gap) · error.
* Mobile: single column — Contact + Notes stack above the tabs; tabs → a scroll
  strip or Select; each tab's list → cards.

Client edit sheet
Right-side Sheet over the clients list / client detail (bottom sheet < md).
* Fields: Name (Input) · Phone (Input) · Email (Input, optional) · Source (Select,
  ClientSource) · Notes (Textarea, optional). New + edit modes. Deactivate via a
  small ConfirmDialog (clients are deactivated, never deleted — INV-P4/I5 spirit).
* States: populated (edit) · empty (new — blank, canonical) · loading (edit) ·
  error.

Staff assignment — DIALOG (D-ii)
A Dialog, drawn over D2 (the event's Staff tab). Authenticated context.
* Pattern: Dialog base. Title "Assign staff to this event". Per-dialog mic on the
  title (VoiceIntent.STAFF_ASSIGNMENT — voice path → Group F, forward dependency,
  affordance only). Fields:
  - Staff member — Combobox over active staff, "Create '{query}'" inline for a
    new casual hire (the unresolved-entity affordance for the voice path —
    "'{name}' — not in your staff" + create / pick, never dropped, INV-V5).
  - Role — Select (StaffRole), default = the person's default role.
  - Day rate — money input, prefilled from defaultDayRateCents, editable per
    event.
  - Days — QuantityInput.
  - A ConflictBanner if this person is already assigned to an overlapping event
    ("Peter Kimani is also assigned to the Kiama harambee on 18 Oct.") — warn,
    not block.
* Confirm names the action: "Assign Peter Kimani · 3 days · KES 13,500" (the
  total updates as role/rate/days change). A caption: "A wage expense is added to
  this event automatically." (INV-E2). Cancel = "Cancel".
* States: resting (= populated, confirm enabled) · empty (staff blank, days 1;
  confirm disabled until a staff member is picked) · conflict (the ConflictBanner
  shown) · pending · error (inline, dialog stays open).
* Mobile: bottom sheet, sticky confirm.
* Motion intent: the confirm label total rolls as days / rate change (impl note).

6. NEW-COMPONENT PROTOCOL
Anticipated for Group D — build in Paper + log in D6-new-components.md ONLY if the
premium bar genuinely requires them (check the approved set first every time):
* PaymentRow — a payment line on the invoice: amount · method · M-Pesa reference ·
  date · receipt number · Download / Share. LineItemRow variant "document" is the
  wrong shape (it is item + qty + price for a document line, not a payment). If a
  simple 2-line DataTable row does the job, use that and do NOT create a
  component. Decide when D4 is drawn.
* AssignmentRow — a staff assignment on the event: person · role · days · day
  rate · wage total · conflict flag. Again — if a DataTable row does it, no new
  component. Decide when D2's Staff tab is drawn.
* Everything else composes. Do NOT propose: any calendar chart, any "living
  landscape", any signature component (LetterheadBlock, TranscriptReveal,
  TodayTimeline, KpiFigure — these belong to the deferred moments pass).

For each new component actually built: a 4U2-0-style band in a "Row N · New
components" section at the bottom of your page; the manifest row (name · forced by
· purpose · states · why not an existing component · motion: "deferred (D6
signature-moment freeze)" · status Proposed); tell the user in the session summary.

7. RECOMMENDATIONS TO WATCH FOR
End each sub-session with a ## Recommendations block (max 5, ranked, GAP /
IMPROVEMENT / LATER per CLAUDE.md), also appended to D6-plan.md §9d. Check §9a,
§9b, §9c FIRST — do not repeat. Likely items (verify against the code/docs before
raising):
* [GAP?] The event's "Documents" tab implies generate-next-document actions, but
  document-lifecycle.md is the only place the chain order is stated. Confirm the
  UI shows exactly the allowed next step (DN only after acceptance; invoice only
  after a DN — "invoice without a DN" is discouraged not blocked, §9). Propose
  the exact affordance rules.
* [GAP?] "Overdue" invoice status is derived (issued + past dueDate + balance>0)
  but InvoiceStatus enum has no OVERDUE value (data-model.md §9). D5's filter
  chip needs it. Mirror the derived-status decision from the Group B / C Inquiry
  gap — document the derivation, no enum change.
* [GAP?] Client / Staff "last activity" and "# quotes" columns are derived
  aggregates the list query must compute. Note the cost.
* Confirm the "Cancel event" action (D2) → the RELEASED-bookings behaviour
  (document-lifecycle.md §4) is a plain ConfirmDialog, not void-and-replace.
Silence is a valid output.

8. PAGE ORGANISATION (agreed convention — match Groups A / B / C exactly)
* One Paper page: "D6 — Group D · Running events & getting paid".
* Strict grid: labelled horizontal rows, one screen per row, 1440 then 390 per
  state, 80px gutters. Row-title frame on the left of each row. Grey "Lane guide"
  strip at the top. A0-style page legend top-left.
* Dialogs / sheets: one board each showing every state + a copy table where
  relevant (like Group C's C4).
* Row plan (if run as one session):
  Row 0 = legend + lane guide
  Row 1 = D1 Calendar · Row 2 = D2 Event detail · Row 3 = D3 Delivery note ·
  Row 4 = D4 Invoice detail · Row 5 = Record payment dialog ·
  Row 6 = Void-and-replace dialog · Row 7 = D5 Invoices list ·
  Row 8 = D6 Staff list (+ edit sheet + history panel) ·
  Row 9 = D7 Clients list · Row 10 = D8 Client detail (+ edit sheet) ·
  Row 11 = Staff assignment dialog · Row 12 = New-component bands (if any)
* Every artboard named "D{n} · {Screen} · {breakpoint} · {state}".

9. THE TASK — ORDER OF WORK
1. Reconnect context: read the docs in §1, run the Paper context calls in §2
   (including get_jsx on the component bands you will use, the app shell, and the
   D2 reference screens 3GJ-0 / 34T-0 / 20X-0 / 1U2-0). Screenshot the Group C
   page (A-0) once to internalise the layout convention — do not edit it.
2. Post the D-i screen inventory + open questions (the event Documents-tab
   affordance rules; the OVERDUE derived status; any new component you
   anticipate) as a chat message. WAIT for approval. Do not create the page or
   any artboard before this.
3. On approval: create_page "D6 — Group D · Running events & getting paid". Build
   the legend + lane guide + Row 1 title frame.
4. Build D-i: D1 Calendar (4 states + Calendar/Agenda pair, 1440 + 390) → D2
   Event detail (4 states + per-tab variants) → D3 Delivery note detail (states
   incl. record-returns + voided) → D4 Invoice detail (all 5 status states) →
   Record payment dialog (one board) → Void-and-replace dialog (one board + copy
   table). get_screenshot review after each screen against the premium bar
   (spacing / typography / contrast / alignment / artboard-fit / repetition) —
   one-line verdict, fix before moving on. Apply TABLE-ALIGNMENT DISCIPLINE (§10).
5. Full-page screenshot review of D-i. Present to the user. Iterate until
   approved. Append a status-log entry to D6-plan.md §8, update
   D6-new-components.md, append recommendations to §9d.
6. On D-i approval: build D-ii (D5 Invoices list → D6 Staff list + sheet + panel
   → D7 Clients list → D8 Client detail + sheet → Staff assignment dialog).
   Screenshot review per screen.
7. Full-page review of D-ii + the whole page. Present. Iterate until approved.
8. On full approval: finish_working_on_nodes. Final status-log entry to §8,
   D6-new-components.md complete for Group D, recommendations in §9d. Leave
   D6-plan.md status "Planning". Do NOT start the PDF template track or Group E.

10. TABLE-ALIGNMENT DISCIPLINE (a lesson from Groups A & C — apply it)
Group A's and one of Group C's DataTables drifted because header and row cells
were hand-built with slightly different flex / width values. The rule: define ONE
column spec (fixed px for trailing numeric columns, flex for text columns), apply
it byte-identically to the header row and every data row — build one row
template, then duplicate_nodes it and only set_text_content the copies. Never
hand-edit individual cell widths. After 3+ rows, screenshot and trace vertical
lines through every column boundary. This applies to every DataTable in Group D
(D1 agenda, D2 tabs, D3, D4 line items + payments, D5, D6, D7, D8 tabs).
Also verify the sidebar active-item recolour with a screenshot before proceeding
— the Group C session mis-picked the Invoices frame for Quotes once.

11. CONSTRAINTS THAT DO NOT BEND
* Compose from the approved set first; a new component only when the premium bar
  genuinely requires it, always logged (§6).
* NO signature-moment work. No document-issued ceremony, no calendar chart, no
  bespoke graphics, no signature components. Plain ConfirmDialogs. TotalsPanel
  static. Motion is a one-line INTENT note per artboard, not a storyboard.
* Two designs (390 / 1440), one implementation. Mobile artboard = the spec for
  behaviour below md. DataTable → card, Dialog → bottom sheet, Sheet → bottom
  sheet live inside the Tier 1/2 component, not the screen.
* Screens compose, they don't style — no raw hex / arbitrary spacing / one-off
  variants. Token gap → raise it; missing component → build + log.
* Every screen: loading / empty / error / populated, all drawn. A degenerate
  empty (brand-new invoice draft) is drawn and labelled canonical, not skipped.
* Propose, never build unrequested. Silence on a recommendation is not approval.
* D6 is Paper-only. Files you may write: D6-plan.md §8 / §9d and
  D6-new-components.md. Nothing else.
* No raw node IDs in anything you tell the user. finish_working_on_nodes when
  done.
* Money is integer KES cents, fields end in Cents, tabular mono on money /
  quantities / reference numbers (INV-M1). Invoice balance + status are COMPUTED,
  drawn as read-outs (INV-C5/C6). Receipt is a row on the invoice + a PDF, NOT a
  screen (INV-C4). Issued documents are immutable; corrections VOID and replace,
  both visible with their numbers, DocumentNoticeBanner always carries the
  forward link (INV-I2/I3/N3). Reference numbers gapless, never reused, allocated
  at issue (INV-N2/N5) — drafts show "(draft)" / "—". Warn, do not block
  (INV-A6). Overpayment → credit, not an error. Wage → linked Expense, never
  double-counted (INV-E2). Nothing hard-deleted — deactivate (INV-I5). Timezone
  display Africa/Nairobi; event dates @db.Date.
* Do not touch pages 7-0, 8-0, 9-0, A-0 (Groups A/B/C), 4U2-0, page D2 (2-0),
  page D3 (6-0), "Page 1" (1-0), or any sign-in artboard.
```
