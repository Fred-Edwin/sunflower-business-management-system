# D6 — New Components manifest

**Companion to `D6-plan.md` §7.** The running list of components introduced during
D6 that did not exist in the D3 approved set.

> A new component is allowed only when the premium bar genuinely requires it and
> no approved Tier 1 / Tier 2 component can do the job (`D6-plan.md` §2.2). Every
> entry is built in Paper as a `4U2-0`-style band, logged here, and — once
> approved — exported at phase end to `src/components/`, `/dev/gallery`, a
> `4U2-0` band, and `ui-conventions.md` §1 (the `design-system.md` §12 promotion
> rule). Until an entry's four §12 consequences are all recorded it is
> **Proposed**, not part of the built set.

**Status values:** Proposed · Approved · Rejected · Exported

---

## Components

### FileDropField

| Field | Content |
|---|---|
| **Forced by** | A4 Settings (Group A) — the business logo upload. |
| **Purpose** | A labeled file field: an empty drop target OR a current-file preview, with replace / remove actions and a format + size hint. On A4 the caption reads "this appears on your quote letterhead". |
| **States** | empty · dragover · uploading (hairline progress under the tile) · populated (preview thumbnail) · populated-but-unloadable (image failed to load → falls back to the business name as a typographic wordmark, no broken-image icon; the letterhead itself falls back the same way) · error (wrong type / too big) |
| **Why not an existing component** | No approved component accepts a file. `Input` is text-only. This needs a drop zone, a preview thumbnail, and upload progress. Small, generic, and reusable later (payment proof, receipt scans). |
| **Motion** | Dragover: border + background → `--color-accent-subtle`, 120ms. Upload: hairline progress bar under the tile. Settle on the shared curve `cubic-bezier(0.16, 1, 0.3, 1)`. |
| **Status** | Proposed |

### VoiceItemRow

| Field | Content |
|---|---|
| **Forced by** | A7 Voice catalog review (Group A) — the review list after speaking a batch of catalog items. |
| **Purpose** | One editable row per extracted catalog item in the voice-review list: Name / Category / Unit price / Owned qty / Unit label, each cell editable in place, each carrying the `VoiceReviewField` uncertainty treatment when the model was unsure (warning-subtle bg + warning border + a "CHECK THIS" flag), plus a remove-row affordance. A "＋ Add another" row at the bottom. Confirm-all commits every row (INV-V1 — nothing saves until she presses). |
| **States** | resting · flagged (one or more cells uncertain) · focus-within (editing a cell) · error (per-cell `aria-invalid`, e.g. price < 1 cent per INV-M1) · removing |
| **Why not an existing component** | `LineItemRow` variant `"voice"` exists, but it is *item + qty only* for a **quote** line with snapshot semantics — wrong field set (no category / unit price / unit label / owned qty), wrong data shape (a `QuoteLineItem`, not a `CatalogItem`), wrong rules. `VoiceReviewField` wraps a **single** field, not a row of five. This is a create-catalog-items-from-voice affordance and needs its own row anatomy. Replaces the rejected `QuickAddRow` (see status log). |
| **Motion** | On confirm-all: rows commit top-to-bottom in a quick stagger (~40ms/row), each holding a one-frame `--color-success-subtle` wash fading over 400ms. Uncertain cells pulse once amber on review open (consistent with signature ⑤). "＋ Add another" inserts a blank row: height 0→auto + fade 200ms. Curve `cubic-bezier(0.16, 1, 0.3, 1)`. |
| **Status** | Proposed |

---

### VersionRail

| Field | Content |
|---|---|
| **Forced by** | C2 Quote screen (Group C) — the locked (issued) mode, when a quote has been revised and has more than one version. |
| **Purpose** | A compact version-history selector for a quote. Lists every version of the quote root — `v3 · current · QUO-2026-0044`, `v2 · superseded`, `v1 · superseded · preliminary` — newest first, each row a link to that version's read-only view. The current version is marked; superseded rows use muted text. Only the current version can be accepted; the rail makes the older estimates reachable without cluttering the header. |
| **States** | single-version (hidden — nothing to select) · two-plus versions (rail shown) · current-selected · older-version-selected (viewing a superseded version → a "You're viewing an old version · Go to current" line) · loading |
| **Why not an existing component** | Nothing in the approved set is a document-history navigator. `SegmentedToggle` is a 2–3-way view switch, not an n-item history with per-item status. `DataTable` is far too heavy for a 2–4 row list that lives in a screen header/sidebar. `StatusBadge` labels one state, it does not list versions. This is a small, specific affordance tied to the quote versioning rule (INV-I4) and it recurs nowhere else, but it is structural — without it, superseded versions are unreachable from the UI. |
| **Motion** | Deferred (D6 signature-moment freeze, plan §5.3). Drawn static. |
| **Status** | Proposed — drawn in-context on the C2 locked-mode artboard (Group C page). A dedicated 4U2-0-style band is still TODO. |

### LetterheadBlock

| Field | Content |
|---|---|
| **Forced by** | C3 Public shared quote `/q/[token]` (Group C) — the letterhead at the top of the client-facing document. |
| **Purpose** | The business-identity header for a client-facing document: logo (or the typographic-wordmark fallback, reusing the A4 `FileDropField` broken-image behaviour), business name, address line, phone/email, then the document title (`QUOTATION`), reference number (Geist Mono), and the parties/dates block (For / Event / Venue / Valid until). One block, two placements: the public shared quote (C3) and, later, the PDF templates (shared visual language, PDF track after Group D). |
| **States** | logo present · logo absent → wordmark fallback · preliminary (a "PRELIMINARY — pricing subject to site visit" band + watermark treatment) · final |
| **Why not an existing component** | `PageHeader` is the *app-chrome* header — breadcrumb + title + status + action slot, styled for the authenticated shell. This is a *document* header on an unauthenticated, full-bleed, print-like surface with a logo, contact block, and a formal parties/dates layout. Different anatomy, different surface, different type treatment. It also has to be shareable with the `@react-pdf/renderer` templates, which `PageHeader` is not. |
| **Structure** | **One component, two projections** — `app` (the C3 public shared quote, on screen) and `print` (the four numbered PDFs), the same pattern `PageHeader` uses for desktop/mobile. NOT a separate `DocumentLetterhead`: the public shared quote and the quote PDF are the same document and a projection prop prevents them diverging. |
| **Anatomy (both projections)** | Identity row: logo image from `Organization.logoStorageKey` (max 140×48 pt in print) OR — absent/unloadable — the business name as a serif wordmark (`--font-display` / Fraunces, reusing the A4 `FileDropField` broken-image fallback); then address · phone · email. Right, on the content edge: the **document title** (big + bold, 20 px/700 — client 2026-09-10) and the **reference number** (Geist Mono) beneath, or a draft placeholder ("Draft — not yet issued"). Then a 1.5 pt accent rule, then the parties & dates block (left = client per `BILL TO` / `PREPARED FOR` / `DELIVER TO` / `RECEIVED FROM`; right = dates & context per document). **No KRA PIN / tax line** on the issuer identity. |
| **States** | logo present · logo absent → wordmark fallback · preliminary (warning band + "PRELIMINARY — pricing subject to site visit" + light watermark) · draft (ref-slot placeholder + "DRAFT — NOT ISSUED" watermark) |
| **Motion** | None (static document header). Any reveal animation is the later moments pass (plan §5.3). |
| **§12 promotion consequences (for D7)** | (1) Add to the component artboard — the Row 0 artboards on "D6 — PDF templates" are the `4U2-0`-style band. (2) Checked against the set — `PageHeader` is the nearest and it is a different surface (above); this is its own component with an `app`/`print` projection prop. (3) Build in code as Tier 2 (`src/components/LetterheadBlock.tsx`) with both projections, add to `/dev/gallery` in all states × both projections. (4) List in `ui-conventions.md` §1. |
| **Status** | **Built / finalised (2026-09-10, PDF template track).** Drawn in-context on C3 (Group C page) and as the Row 0 band on the PDF-templates page. Pending client approval of the PDF track. |

---

## Rejected / superseded

### AvailabilityHorizon — REJECTED 2026-09-08

Was proposed as signature moment ① on the (now cut) A7 Catalog item detail page.
Client cut both the detail page and the horizon trial: *"I do not like that
availability horizon, get rid of it… we'll think of something else later on. It
doesn't have to be in this screen."* Signature ① is **deferred out of Group A**
entirely — see `D6-signature-moments.md`. The concept may be revisited when the
Group B availability lookup is designed, or dropped. `DayAvailabilityStrip` (the
approved tabular per-day readout) remains the only availability visualisation in
the built set.

### QuickAddRow — REJECTED 2026-09-08

Was proposed for inline bulk catalog entry on A5. Client redirected the catalog
seeding UX to be **voice-first**: *"instead of quick add, why don't we just
refine the UX… make it easier for her to use voice instead of typing manually,
but we'll also have that option for typing manually."* The inline-row mechanic is
replaced by (a) a voice path → `VoiceItemRow` review list (A7), and (b) a typed
path → the Catalog edit sheet (A6) opened blank. `QuickAddRow` is not built.

---

## Status log

```
### 2026-09-08 · Group A session 1
Manifest created. Three components proposed: AvailabilityHorizon (A7 detail,
signature ①), FileDropField (A4 logo), QuickAddRow (A5 bulk entry).

### 2026-09-08 · Group A revision (client feedback)
AvailabilityHorizon REJECTED — A7 detail page cut, signature ① deferred out of
Group A. QuickAddRow REJECTED — catalog seeding redirected to voice-first.
FileDropField unchanged (Proposed). New: VoiceItemRow (Proposed) — the
voice-catalog-review row on the new A7. Net: 2 proposed components in Group A.

### 2026-09-08 · Group B session
No new components. Group B collapsed to one screen (B1 Availability lookup) after
client review — the inquiries list, inquiry capture, damage/maintenance dialog and
adjustments list were all cut (D6-plan.md §6, §4, §9b). B1 composes entirely from
the approved set: PageHeader, SegmentedToggle + DateRangeControl, SearchInput,
DataTable (with a wide:true DayAvailabilityStrip column in Range mode),
AvailabilityBadge (via the "N of M free" / worst-day labels), EmptyState. The
"compose first" test passed with nothing left over. No AvailabilityHorizon / chart
proposed (settled — rejected).

### 2026-09-08 · Group C session
Signature moments deferred out of D6 (plan §5.3) — Group C designs screens only.
Group C: 6 surfaces → 3 screens (C1 Quotes list, C2 Quote screen = builder+detail
merged, C3 Public shared quote) + 1 dialog design (C4 ConfirmDialog + copy table
+ ConflictBanner availability-short state). Two new components proposed, both
screen-function (not signature-moment): VersionRail (C2 locked mode, quote
versioning) and LetterheadBlock (C3, shared with the PDF track). Everything else
composes from the approved set — LineItemRow variant "quote", TotalsPanel layout
"ledger", CatalogItemPicker, ClientPicker, DocumentNoticeBanner (revise / site-
visit notices), ConfirmDialog, ConflictBanner. AvailabilityHorizon / any chart in
the quote rows — not proposed (settled — rejected); availability per row is
AvailabilityBadge only.

### 2026-09-09 · Group D session (D-i)
D-i built: D1 Calendar, D2 Event detail, D3 Delivery note detail, D4 Invoice
detail, Record payment dialog, Void-and-replace dialog. **No new components
required** — both anticipated components from D6-plan.md §6 were tested against
the "compose first" rule at their point of use and neither survived it:
- **PaymentRow** — anticipated for D4's payments list. Composes as a plain
  bordered row from primitives (amount in mono, method + reference caption,
  receipt reference number as a link, a Download action) — no new component
  needed, matches the D2 exploration (20X-0) this group started from.
- **AssignmentRow** — anticipated for D2's Staff tab. Composes as a standard
  DataTable row (Person · Role · Days · Day rate · Wage total · Conflict flag
  column) — no new component needed.
Recorded explicitly here per the new-component protocol (D6-plan.md §6) so the
decision is documented, not silent. D-i is built but **not yet client-approved**
— see D6-plan.md §8 (2026-09-09 entry) and §9d for the three fix items blocking
approval (TotalsPanel statcards redesign, missing Log-expense voice-mic
affordance, D3 missing Download PDF button).

### 2026-09-09 · Group D session 2 — D-i fixes approved, D-ii built
D-i's three fix items resolved and approved (TotalsPanel statcards redesigned
as a unified hairline-divided strip; D2 Expenses voice-mic added; D3 Download
PDF added). D-ii built: D5 Invoices list, D6 Staff list + edit sheet +
assignment-history panel, D7 Clients list, D8 Client detail, Client edit sheet,
Staff assignment dialog. **No new components required anywhere in D-ii** —
every screen composed from the approved set (DataTable, PageHeader,
StatusBadge, Sheet, ConfirmDialog, ConflictBanner, EmptyState) plus the
VoiceMicButton pill pattern already established in D-i. Decided per the
"compose first" test at each point of use; recorded here explicitly per the
new-component protocol rather than leaving it silent. Group D (D-i + D-ii) is
now fully built — see D6-plan.md §8 for the complete session record.

### 2026-09-09 · Group E session
Group E (E1 Expenses list, E2 Expense sheet, E3 Monthly summary, E4 Document
store, E5 Data export, E6 Event P&L tab). **No new components required.** The
one place a new component looked plausible — E3's three-figure income /
expenses / profit summary — fit the existing `TotalsPanel` unified hairline
strip cleanly (the same layout D4 Invoice uses), so no new layout *variant* was
proposed either. Everything else composed from the approved set: `DataTable`,
`PageHeader`, `TotalsPanel`, `Sheet` (E2, matching the A6/D6/D8 edit-sheet
pattern), `Tabs` (the Finance section's Overview / Expenses / Documents strip,
matching D2/D8), `DocumentNoticeBanner` (E2 wage-derived lock), `SearchInput`,
`EmptyState`, `DatePicker`, `Select`/`Combobox`, plus the `VoiceMicButton` pill
pattern established in Group D. Recorded here explicitly per the new-component
protocol. See D6-plan.md §8 (2026-09-09 Group E entry) and §9e.

### 2026-09-10 · Group F session
Group F (F1a Voice review · Quote + Client variant, F1b Voice review · Expense
sheet, F2 Intent disambiguation, F4 Queue sheet, F3 Recording overlay).
**No new components required.** All five surfaces composed from the four D3
voice composites (`VoiceMicButton`, `VoiceReviewField`, `VoiceQueueIndicator`,
`TranscriptPanel`) plus `Sheet`, `ConfirmDialog`, `EmptyState`, `PageHeader`,
`Button`/`Input`/`Select`/`DatePicker`, and the two wrapped forms (C2 Quote
screen, E2 Expense sheet) reused whole. `D6-plan.md` §7 anticipated
`TranscriptReveal` — NOT proposed; it is the deferred signature-moment component
for the type-in / phrase-highlight (⑤, frozen), and the shell does not need it
to function.

**Two variants of existing components proposed** (variants, not new components —
promoted to `VoiceReviewField` / `TranscriptPanel` in D7 per design-system.md
§12, added to the gallery + the 4U2-0 band + `ui-conventions.md` §1):

- **`VoiceReviewField` — "inline" variant.** The D3 gallery version wraps the
  flagged field in a padded `warning-subtle` box with its own border; on a
  multi-column field grid that box breaks the row's spacing (client feedback,
  2026-09-10). The inline variant styles the field in place: input border →
  `warning-solid`, a small `⚠ CHECK THIS` / `NO MATCH` tag above the label,
  helper text below, no wrapping box, field keeps its grid slot. The boxed
  version stays the default for single-column stacked forms (E2). Add an
  `inline` prop in D7. See `D6-plan.md` §9f.
- **`TranscriptPanel` — Re-record action slot.** The D3 version is display-only.
  If a transcript is garbled, Susan's only options were fix-every-field-by-hand
  or discard-the-whole-draft — no "say it again." Client asked for this
  (2026-09-10). The variant adds an optional `onReRecord` action (a small ghost
  "Re-record" button; a prominent accent "Record it again" on the
  extraction-failed state and F2). Routes to F3; on return the new transcript +
  extraction replace the review screen, gated by a `ConfirmDialog` if a field
  was already hand-edited. Every attempt is kept on `VoiceCapture` (INV-V8). Add
  an `onReRecord` slot in D7. See `D6-plan.md` §9f.

Recorded here explicitly per the new-component protocol. See `D6-plan.md` §8
(2026-09-10 Group F entry) and §9f. No code touched.

### 2026-09-10 · Group G session — Dashboard

Group G (the Dashboard at `/` + the quick-note dialog). **No new components.**
`D6-plan.md` §7 anticipated `AttentionRow`, `TodayTimeline` and `KpiFigure` —
none were proposed:
- **`AttentionRow`** → the "Follow up" tile's rows compose as plain bordered rows
  from `MoneyDisplay` + `StatusBadge` + text (the Group D `PaymentRow` /
  `AssignmentRow` call).
- **`TodayTimeline`** → the "Today & tomorrow" tile reuses the D1
  `AgendaEventRow` treatment directly.
- **`KpiFigure`** → the money hero's figures are `MoneyDisplay` in a tinted band;
  the count-up is a §5.2 baseline-motion concern for D7 / the moments pass, not a
  D6 screen component.

**Two screen-local visuals drawn as inline SVG, not proposed as components:**
- **6-bar profit trend** (money hero) — 6 bars, trailing 6 months, current month
  marked in `success-solid`. Tokens only, no axes.
- **7-day week strip** ("This week" tile) — Mon–Sun, a dot per event per day, a
  red dot on a clash day.
Both are self-contained and plausibly reusable (a trend bar on E3; a week strip
on the D1 agenda rail) but neither has a second use yet — logged in `D6-plan.md`
§9g as "promote in D7 only if a second use appears" (the compose-first bar,
same as Group D's `PaymentRow`). Provisional names if promoted: `SparkBars` /
`WeekStrip`.

**Charts:** `D6-plan.md` §8 records the client lifting the "no chart on the
Dashboard" rule for Group G specifically (2026-09-10) and choosing **A (6 bars)**
from the 3-way comparison strip. `AvailabilityHorizon` stays **rejected** — that
decision is unchanged; the Group G allowance is scoped to the hero trend + week
strip and is glance-only, not analytical.

**Voice on the quick-note dialog:** the dialog uses the **existing** `Voice` pill
pattern from the Group D Record-payment / Staff-assignment dialogs — no new
component. It does need a new **`VoiceIntent.INQUIRY`** enum value + a
`voice-pipeline.md` §4 union arm (client-approved for v1, 2026-09-10) — that is a
schema/pipeline change, not a component, logged in `D6-plan.md` §9g as do-now.

Recorded here explicitly per the new-component protocol. See `D6-plan.md` §8
(2026-09-10 Group G entry) and §9g. No code touched.

### 2026-09-10 · PDF template track

The five client-facing document PDFs (quote, delivery note, questionnaire,
invoice, receipt). **`LetterheadBlock` finalised** — moved from Proposed to
Built above, with its structure decided (one component, `app` vs `print`
projection, like `PageHeader`), its anatomy, its four states, and its four §12
promotion consequences all recorded. The Row 0 artboards on the "D6 — PDF
templates" page are its `4U2-0`-style band.

**No other new components.** The faces are composed from the token set. One
print-only sub-block was considered — `DocumentTotals` (the Subtotal / … /
TOTAL / Balance stack that the quote and invoice share) — but it is small,
`@react-pdf/renderer`-specific, and only used inside these templates; logged
here as an **option for D7** to extract if the two implementations drift,
not a required D6 component. The line-item tables, parties blocks, checklist
rows, and signature lines are all plain token-composed markup.

`D6-plan.md` §7 anticipated `LetterheadBlock` as a signature-moment carrier —
it is not: the "dignified reveal" motion (④) stays deferred to the moments
pass; this is the static print/app document header only.

Recorded per the new-component protocol. See `D6-plan.md` §8 (2026-09-10 PDF
template track entry) and §9h. No code touched.
```
