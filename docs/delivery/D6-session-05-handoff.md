# D6 · Session 5 — Group D (Running events & getting paid), continued: D-i fixes → D-ii

**Paste the block below into a fresh session.** The durable context is the linked
files, not this prompt.

---

```
D6 SESSION — Group D "Running events & getting paid" · CONTINUATION HAND-OFF

You are the product designer for the Sunflower Events BMS, running design stage D6
— designing remaining application screens in Paper by composition from the
approved component set. This session continues flow Group D: Running events and
getting paid — the second half of the document-chain spine.

Groups A, B and C are done and client-approved. Group D's D-i sub-session (the
documents spine) was built in the previous session but is NOT YET APPROVED —
the client reviewed it and asked for three fixes before D-i can be signed off.
Your first job this session is to make those three fixes, get D-i approved, THEN
build D-ii (lists + people). Do not start D-ii before D-i is approved.

The bar is top-tier premium — Linear / Apple / Mercl-grade restraint as the
baseline. You are the engineer-designer: propose what would make it better, never
build unrequested, wait for approval.

NO SIGNATURE-MOMENT WORK. Signature moments are DEFERRED OUT OF D6 entirely
(client, 2026-09-08 — D6-plan.md §5.3). D6 designs SCREENS ONLY. This still
applies unchanged this session.

1. READ FIRST, IN THIS ORDER, AND ONLY THESE

* CLAUDE.md
* docs/delivery/D6-plan.md — §2 the eight governing constraints, §3 the session
  mechanic, §5.3 (signature moments DEFERRED), §6 the Group D inventory (8
  screens + 2 sheets + 2 side-panels + 3 dialogs), §8 status log — READ THE
  2026-09-09 "Group D, Session 1" ENTRY CAREFULLY, it records exactly what was
  built, what changed mid-session (the Agenda view redesign), and the client
  feedback blocking approval. §9a–§9d recommendations already logged (§9d has
  the three fix items in detail — do not repeat, do not re-litigate, just fix).
* docs/delivery/D6-new-components.md — the running manifest. Read the
  2026-09-09 Group D entry: PaymentRow and AssignmentRow were BOTH tested and
  REJECTED (composed from plain primitives instead) — do not revive either
  without a new, real reason. FileDropField, VoiceItemRow, VersionRail,
  LetterheadBlock remain Proposed from earlier groups. AvailabilityHorizon and
  QuickAddRow remain Rejected.
* docs/conventions/design-system.md — §1 (D6 stage), §2 token layers, §3–11 the
  token vocabulary (§7 Elevation and §9 Density matter most this session for the
  TotalsPanel fix), §12 (adding a component), §13 rules
* docs/conventions/ui-conventions.md — §1 (the approved component set — your
  build vocabulary; TotalsPanel is documented here, "statcards" layout, and you
  are changing this entry), §2 the gallery, §4 responsive, §5 screen patterns,
  §6 voice UI (read this closely — it's the spec for the voice-mic fix), §7
  accessibility
* docs/architecture/domain-invariants.md — INV-V1–V8 (voice) matter most this
  session alongside the Group D invariants already in play: INV-I2/I3, INV-N2/
  N3, INV-C1–C6, INV-A3/A4/A6, INV-E1/E2.
* docs/architecture/document-lifecycle.md — unchanged relevance from last
  session (the chain, DN, Invoice, Payment/Receipt sections).
* docs/architecture/data-model.md — §9 the enums, specifically VoiceIntent
  (confirm EXPENSE exists) and the DocumentFile / shareToken shape (relevant to
  confirming Download PDF is the only action needed, no separate print flow).

Do not read the wider docs/ tree.

2. PAPER — file, tools, page

File: 01M1X43Q66HDD6TF72TYYWH3KE ("Sunflower BMS").
Your page already exists: "D6 — Group D · Running events & getting paid".
First calls, in order:
1. get_guide({topic:"paper-mcp-instructions"}) — once. Again if a long thread
   compresses.
2. open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})
3. get_basic_info — note the pages and the token set
4. open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE", pageId:"B-0"}) — this is your
   page, already built through D-i. Confirm you are on it before touching
   anything.
5. get_screenshot on the whole page / row by row to re-orient yourself on what
   exists. Row 1 = D1 Calendar, Row 2 = D2 Event detail + Cancel event dialog,
   Row 4 = D3 Delivery note, Row 5 = D4 Invoice detail, Row 6 = Record payment
   dialog, Row 7 = Void-and-replace dialog. (Row numbering in artboard names is
   authoritative — read names via get_basic_info, do not guess positions.)
6. get_font_family_info(["Geist","Geist Mono"]) if you haven't already this
   session. Weights locked to 400/500/600.
7. get_guide({topic:"mobile-status-bar"}) before drawing any new 390 artboard.

THE APPROVED COMPONENT SET — your build vocabulary
Page "D3 — Components" (pageId 6-0), artboard 4U2-0. Pull exact values with
get_jsx — never read them off a screenshot. Same band node IDs as last session;
the one you need most this session is:
  TotalsPanel 5ES-0 — you are REDESIGNING the "statcards" layout within this
  band (see task 1 below). Read it first via get_jsx to see the current
  three-separate-cards treatment before changing it.
  VoiceMicButton 5KU-0 — the per-form/per-dialog mic pattern already used on
  Record payment and (to be built) Staff assignment. Reuse this exact pattern
  for the D2 Log-expense fix, do not invent a new mic treatment.
Also re-reference: StatusBadge 4U7-0, MoneyDisplay 4X8-0, LineItemRow 51H-0,
PageHeader 573-0, DataTable 58H-0, Pickers 5D6-0, EmptyState 5G9-0, ConfirmDialog
5HH-0, ConflictBanner 5IX-0, DocumentNoticeBanner 5JT-0.

App shell: page "D2 — Batch 1 Screens" (pageId 2-0), sidebar node 11S-0 inside
App Shell 1440 F6-0. Clone via <x-paper-clone node-id="11S-0" /> for any new
artboard. Nav order: Dashboard · Calendar · Inquiries · Quotes · Invoices ·
Clients · Catalog · Availability · Staff · Finance — count carefully, verify
with a screenshot before proceeding (this bit the Group C session once).

DO NOT TOUCH
* Pages "D6 — Group A · Getting set up" (7-0, 8-0), "D6 — Group B · Daily
  inbound" (9-0), "D6 — Group C · Quoting" (A-0)
* Artboard 4U2-0 ITSELF stays read-only EXCEPT for the one deliberate edit this
  session makes: updating the TotalsPanel "statcards" example on the component
  band to match the new design (see task 1 — this is the one sanctioned
  exception, because you are changing an approved component, not a screen).
* Page "D2 — Batch 1 Screens" (2-0), "Page 1" (1-0), any sign-in artboard

YOUR PAGE
Already exists: "D6 — Group D · Running events & getting paid" (pageId B-0).
Continue building on it. Match the existing row/lane-guide/title-card convention
exactly — screenshot an existing row (e.g. Row 5, D4 Invoice detail) to
re-internalize spacing and the row-title card format before adding anything new.

get_screenshot to review after each meaningful group of edits. finish_working_on_nodes
when done. No raw node IDs in anything you tell the user.

3. THE EIGHT GOVERNING CONSTRAINTS (D6-plan.md §2 — inherited, unchanged)
Same as last session — compose from the approved set first; new component only
if genuinely required (none was, last session — keep that discipline); two
designs/one implementation; four states always; screens compose, don't style;
motion is a one-line intent note, not a storyboard; recommendations are
proposed, not built, and wait for approval; D6 is Paper-only.

4. THIS SESSION'S TASK — ORDER OF WORK

### Task 1 — Redesign TotalsPanel "statcards" (do this FIRST)

**Client feedback, verbatim reasoning:** the current statcards layout (three
separate bordered cards with gaps between them: Invoice total / Paid to date /
Balance) reads as a generic, stock dashboard pattern — not premium. Direction:
**one unified strip**, sections divided by **thin hairlines**, not separate
cards. Think Stripe/Linear invoice summaries — restrained, intentional, quietly
expensive. No per-figure border, no per-figure background, no gap between them
as separate boxes.

Concretely: a single container (one border, one radius, one background), display
flex row, each figure as a padded segment, with a 1px vertical hairline
(`--color-border`) between segments instead of a gap. Money still via tabular
mono (INV-M1). Labels still small/muted above each figure. This is a token-only,
composition-only change — no new component, no raw hex.

**Where this propagates (fix in this order):**
1. First, update the component reference: get_jsx on TotalsPanel (5ES-0) to see
   the current statcards treatment, then redesign IN PLACE on that band (the one
   sanctioned edit to 4U2-0 this session) so the approved-component record
   matches what screens now use. Screenshot to verify before moving on.
2. D4 Invoice detail — all 7 states (draft/issued/partially-paid/paid/voided/
   loading/error) use TotalsPanel statcards. Redraw the strip on each. The
   voided state's amber/credit/computed color treatment must survive the
   redesign — this is not just a visual reskin, verify balance-partial (amber),
   balance-credit (success green) and balance-computed (neutral) still read
   correctly against hairline dividers instead of card borders.
3. D2 Event detail's Overview tab "At a glance" card (Total quoted / Staff
   assigned / Documents issued) uses an informal version of the same
   figure-strip idea — client did not explicitly call this out, but check
   whether it should match the new statcards treatment for consistency. If yes,
   fix it; if you judge it's a genuinely different pattern (a vertical stat list
   in a sidebar card, not a horizontal summary strip), leave it and say why in
   your session summary rather than guessing.
4. D4's 390 mobile companion — statcards "stack to three rows" per the original
   spec. Re-verify the stacked-row treatment still reads as premium with the new
   hairline-divider language (horizontal dividers between stacked rows, likely,
   rather than vertical).

Screenshot every touched artboard after the fix, one-line verdict each, before
moving to task 2.

### Task 2 — Add the missing voice-mic affordance (D2 Log expense)

`VoiceIntent.EXPENSE` exists in the schema but D2's Expenses tab "Log expense"
action has no mic affordance, unlike Record payment (VoiceIntent.PAYMENT) and
the planned Staff assignment dialog (VoiceIntent.STAFF_ASSIGNMENT). Fix: add the
same per-form/per-dialog mic pattern (VoiceMicButton 5KU-0) alongside the "Log
expense" action on D2's Expenses tab variant. This is an affordance only — the
actual expense form and its voice review target are Group E / Group F territory,
not built here. Note the forward dependency in the row-title card text if not
already noted.

Do NOT go looking for other voice gaps beyond what's logged in D6-plan.md §9d —
the client also asked generally "are we catered for voice on every screen", and
the answer given was: the global sidebar mic is the catch-all per
ui-conventions.md §6, per-form mics are reserved for screens tied to a specific
VoiceIntent. D7/D8 client-creation is flagged in §9d as "check when built" — do
that check when you get to D-ii, not now as a separate sweep.

### Task 3 — Add "Download PDF" to D3 Delivery note detail

D4 already has this button on issued/partially-paid/paid/voided states. D3
(issued and voided states specifically — draft has nothing to download yet, no
button needed on draft/record-returns) should carry the same action, same
placement (header action slot), same label. This is a same-pattern one-line fix,
not a new design decision. Do not design the PDF document itself — that's the
separate PDF template track, confirmed in D6-plan.md §9d as correctly out of
scope for D6. The button is just the affordance.

### Task 4 — Present D-i fixes for approval

After tasks 1–3, do a full screenshot pass of every touched artboard (TotalsPanel
band, all D4 states, D2 Overview if changed, D2 Expenses tab, D3 issued/voided),
present to the user with one-line verdicts, and explicitly ask for D-i approval
before starting D-ii. Do not proceed to D-ii on silence — wait for an explicit
go-ahead, per the "recommendations are proposed, not approved by silence" rule
that applies to any material change, and this is a client-requested rework, not
a minor tweak.

### Task 5 — On D-i approval, build D-ii

D-ii = D5 Invoices list, D6 Staff list (+ edit sheet + assignment-history side
panel), D7 Clients list, D8 Client detail (+ edit sheet), Staff assignment
dialog. Full inventory, states, and composition notes are in the ORIGINAL Group D
handoff prompt (docs/delivery/D6-session-04-handoff.md, section "--- D-ii
SCREENS ---") — read that section fresh, it was not pasted into this file to
avoid duplication drift. Apply the same table-alignment discipline (one column
spec, cloned rows) and the same row/lane-guide/title-card page convention.

Continue the row numbering from where D-i left off (Row 7 was Void-and-replace;
D-ii starts at Row 8). Verify no row overlaps using get_children on the page
root before drawing — the previous session had to fix several row-position
errors from artboards landing at auto-placed positions instead of the intended
grid; be deliberate about setting explicit top/left on every new artboard and
re-checking with get_node_info (not get_basic_info, which can return stale
cached positions within a session) after each move.

5. TABLE-ALIGNMENT DISCIPLINE — still applies, unchanged
One column spec, applied byte-identically to header and every row via
duplicate_nodes + set_text_content. Never hand-edit individual cell widths.
Screenshot and trace column boundaries after 3+ rows. Applies to every DataTable
in D-ii (D5, D6, D6's history panel, D7, D8's tabs).

6. A LESSON FROM LAST SESSION — flex-grow stretch bug on inserted banners
When inserting a DocumentNoticeBanner or similar block into an existing
flex-column artboard via write_html (insert-children or replace mode), the
inserted frame sometimes inherits `flex-grow`/`flex-basis` from context and
renders far taller than its content (a large empty colored box). Fix
immediately after insertion by setting `flexGrow: "0", flexShrink: "0",
flexBasis: "auto", height: "auto"` explicitly on the inserted frame, then
re-screenshot to confirm. This happened twice last session (D3 voided, D4
voided) and was fixed both times with this exact style patch — apply it
proactively when inserting any banner/notice block this session, especially
during the TotalsPanel redesign where you're inserting new segment structure
into existing artboards.

7. CONSTRAINTS THAT DO NOT BEND
Same list as the original Group D handoff — compose from the approved set;
new component only when genuinely required, always logged; no signature-moment
work; two designs/one implementation; screens compose, don't style; every
screen's four states drawn; propose, never build unrequested, silence is not
approval; D6 is Paper-only (files you may write: D6-plan.md §8/§9d and
D6-new-components.md); no raw node IDs to the user; finish_working_on_nodes when
done. Money integer KES cents, tabular mono (INV-M1). Invoice balance + status
computed (INV-C5/C6) — the TotalsPanel redesign must not turn these into
editable-looking fields, they stay read-outs. Receipt is a row + PDF, not a
screen (INV-C4). Issued documents immutable, void & replace with forward links
(INV-I2/I3/N3). Reference numbers gapless, allocated at issue (INV-N2/N5).
Warn, don't block (INV-A6). Overpayment → credit (document-lifecycle.md §7).
Wage → linked Expense (INV-E2). Nothing hard-deleted (INV-I5). Voice never saves
without confirmation (INV-V1), two-stage pipeline (INV-V2), transcript always
visible (INV-V3) — all forward-dependency notes only in D6, the actual pipeline
is Group F. Timezone Africa/Nairobi; event dates @db.Date.
```
