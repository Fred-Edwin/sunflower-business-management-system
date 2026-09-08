# D3 — Extraction & Reconciliation · Work log

D3 runs against `docs/conventions/design-system.md` §1 (D3 steps) and produces
the **approved composite set** recorded on Paper page **"D3 — Components"**
(artboard `D3 — Components (Approved Composite Set)`, file
`01M1X43Q66HDD6TF72TYYWH3KE`) and in `docs/conventions/ui-conventions.md` §1.

D3 was split across sessions. Part 1 built the first 11 bands and locked the
reconciliation decisions. Part 2 (this log) finished the artboard, normalised the
batch screens back, and recorded the §12 promotions.

---

## D3.1 / D3.3 — Extract + complete (all bands, all states)

**Part 1 (done earlier):** StatusBadge · MoneyDisplay · QuantityInput ·
AvailabilityBadge · DayAvailabilityStrip · LineItemRow · PageHeader · DataTable ·
Date & view controls (SegmentedToggle / DateRangeControl / CalendarSpanControl /
SearchInput) · Pickers (ClientPicker / CatalogItemPicker) · TotalsPanel.

**Part 2 (this session):** the remaining bands, each drawn in all its states:

| Band | States drawn |
|---|---|
| EmptyState | 3 canonical uses (No history yet / No active catalog items / No quotes yet), icon + title + body + 1–2 actions |
| ConfirmDialog | resting · pending (spinner + disabled) · error (inline message, dialog stays open) — designed from §1, no batch-screen source (D3 Rec #3) |
| ConflictBanner | full (availability shortfall) · full (staff/equipment clash) · compact pill (calendar day-cell). No forward link. |
| DocumentNoticeBanner | tone="danger" (voided & replaced) · tone="neutral" (superseded quote). Always carries the forward-link button. |
| VoiceMicButton | shell FAB idle / recording / processing (with queue badge) · per-form pill idle / recording / processing |
| VoiceReviewField | resting (passthrough) · flagged "CHECK THIS" + helper · flagged "NO MATCH" (unresolved entity + create/pick) |
| VoiceQueueIndicator | zero (no badge) · 3 pending · 9+ (capped) · on the shell Voice-capture row |
| TranscriptPanel | populated (desktop right rail) · extraction-failed (transcript still shown) · mobile stacked card |
| CalendarGrid + EventChip | populated day · empty day · conflict day (day-cell pill + tinted cell) · loading (skeleton chips) |
| AgendaDayGroup + AgendaEventRow | day header · event row (status label right) · conflict day (inline ConflictBanner + "Equipment clash" right) · empty day ("Nothing scheduled") |
| shadcn block restyle — spec cards | Sidebar (ink-gradient, ghost-underline active, footer Voice pill) · login-form (tokens, 44px controls) · DataTable (points at the DataTable band). **Spec only — built as CODE in D4, not components on this artboard.** |

Artboard is one frame, `height: fit-content`, 22 bands + the progress card.

---

## D3.2 — Reconciliation decisions (LOCKED — set in part 1, unchanged)

1. **StatusBadge loses the grey pill everywhere.** One anatomy: a 6px dot + a
   label in the matching status colour, no background chip. `variant` =
   `document` (10) | `event` (4) | `inventory` (5). `DocumentStatusBadge` /
   `AvailabilityBadge` are thin wrappers. Terminal states use muted text.
   *(Design-lead override of the D2 pill treatment, user call 2026-09-07.)*
2. **LineItemRow** = one component, `variant` = `quote` | `document` | `voice`.
3. **DataTable card fallback** = one contract. Below `md` each row → a
   1px-border card: primary line (14 semibold) + secondary (13 muted), a
   right-aligned figure block, then a 2-up label/value grid for the remaining
   columns. A column may set `wide:true` to render as a horizontally-scrolling
   strip inside the card — the **only** permitted horizontal scroll, and where
   `DayAvailabilityStrip` lives. Resolves the QB-390 vs Availability-390
   divergence.
4. **ConflictBanner ≠ DocumentNoticeBanner** — two components (user ratified
   2026-09-07). ConflictBanner = transient advisory, no link (INV-A6).
   DocumentNoticeBanner = permanent void/replace/superseded notice, always has a
   forward link (INV-I3).
5. **SegmentedToggle** = one primitive absorbing all four batch toggles
   (Day/Range, Calendar/Agenda, 1wk/2wk, Week/List).
6. **TotalsPanel** = one component, `layout` = `ledger` | `statcards`.
7. **DateRangeControl** and **CalendarSpanControl** are distinct;
   CalendarSpanControl composes SegmentedToggle.

Components reference **semantic tokens only**, never primitives (design-system
§13.1).

---

## D3.4 — Normalize backwards (batch screens → reconciled composites)

Page **"D2 — Batch 1 Screens"**. Row 05 (reference / superseded) left as
lineage. Row 07 (state artboards) inherit the shell edits.

| Screen | Edit |
|---|---|
| Quote Builder 1440 (`HA-0`) | "Draft" badge → bare dot + label (status-draft, 13px/500). Line-item table already matches DataTable premium spec + LineItemRow `quote`. TotalsPanel `ledger` unchanged. |
| Quote Builder 390 (`3X5-0`) | "Draft" badge → bare (border pill stripped). Line-item cards already express the DataTable card contract — footer line-total confirmed as the figure block. |
| Client Detail 1440 (`1U2-0`) | "Referral" badge → bare (grey fill pill stripped, dot kept). |
| Client Detail 390 (`43K-0`) | "Referral" badge → bare (border pill stripped). Top bar already the reconciled breadcrumb pattern; EmptyState "No history yet" matches canonical. |
| Invoice Detail 1440 (`20X-0`) | "Voided" badge already bare — weight normalised 600 → 500 to match StatusBadge spec. DocumentNoticeBanner (danger), TotalsPanel `statcards`, LineItemRow `document` all already match. |
| Invoice Detail 390 (`45F-0`) | "Voided" badge → bare (border pill stripped, colour → status-voided). Banner + stacked totals + document-variant card list already match. |
| Calendar — Calendar view D (`3GJ-0`) | Legend swatches: 8px `radius 2px` squares → 6px round dots, to match StatusBadge `variant="event"`. |
| Calendar — Agenda view B (`34T-0`) | No top legend; inline right-side status labels + left-bar dots already match AgendaEventRow. No change. |
| Calendar 390 (`488-0`) | Legend dots already round + label. Agenda structure already matches AgendaDayGroup / AgendaEventRow. No change. |
| Availability 390 (`40V-0`) | Per-item borderless blocks → **DataTable card contract**: each item is now a 1px-border card (surface, radius-lg, 12px gap between), with the per-day strip set to `overflow-x: auto` as the `wide:true` scroll region. Worst-day cell keeps the warning-subtle tint + border-strong outline. |
| Voice Review 390 (`1RL-0`) | Bespoke "Review quote" title-in-bar → reconciled PageHeader mobile projection: top bar = `‹ Quotes / Review` breadcrumb (muted 13px) + per-form mic pill; "Review quote" title (24/600) moved to a Header block below the bar. Resolves D2.1 Rec #5. |
| Quotes list — empty (`4M6-0`) | Filter tabs confirmed as Tabs (underline), not badges — unaffected. EmptyState matches "No quotes yet" canonical. |
| PageHeader (all 8 desktop + 6 mobile) | Confirmed against the reconciled PageHeader: breadcrumb / title (Geist Mono for reference numbers) / optional inline StatusBadge / action slot. Voice Review 1440's "Captured 3:42 PM" chip is a capture-time metadata pill, **not** a StatusBadge — left as-is. |
| LineItemRow variants | Invoice Detail (1440 + 390) rows = `document`; Quote Builder rows = `quote`; Voice Review rows = `voice`. Confirmed. |

**Step 4 is not optional** (design-system §1) — done, so a single reconciled
version of each concept reaches the D4 build.

---

## D3.5 — §12 promotion record

Twelve composites did not exist in the pre-D3 list; they were produced by the
batch screens and promoted during D3. Each promotion has four consequences
(design-system §12); this table records all four.

| Composite | 1. On the component artboard | 2. Variant of something existing? | 3. Build as Tier 2 + gallery in D4 | 4. Listed in ui-conventions §1 |
|---|---|---|---|---|
| DayAvailabilityStrip | ✓ (band, all states) | No — distinct. Consumed by DataTable as the `wide:true` region, and by item-detail. | Tier 2 · gallery: worst-day / ample / loading / mobile-scroll | ✓ |
| SearchInput | ✓ | No — wraps Tier 1 Input + a count slot; not a Combobox. | Tier 2 · gallery: resting / focus / empty / loading | ✓ |
| ConflictBanner | ✓ | No — split from DocumentNoticeBanner is a locked decision (#4). | Tier 2 · gallery: full (2 messages) / compact pill | ✓ |
| DocumentNoticeBanner | ✓ | No — permanent + always-linked; distinct from ConflictBanner. | Tier 2 · gallery: tone danger / tone neutral | ✓ |
| TranscriptPanel | ✓ | No — voice-review specific, always visible (INV-V3). | Tier 2 · gallery: populated / extraction-failed / mobile | ✓ |
| SegmentedToggle | ✓ | No — it **is** the generalisation; the four batch toggles become uses of it. | Tier 2 · gallery: 2-way / 3-way / focus / disabled | ✓ |
| DateRangeControl | ✓ | No — from→to pair + steppers; composes Tier 1 DatePicker. | Tier 2 · gallery: range / single (Day mode) / focus | ✓ |
| CalendarSpanControl | ✓ | Partly — **composes** SegmentedToggle + icon buttons; not monolithic. | Tier 2 · gallery: 1wk / 2wk / today-cluster | ✓ |
| CalendarGrid | ✓ | No — month grid focused to a span; distinct from Tier 1 Calendar. | Tier 2 · gallery: populated / empty day / conflict day / loading | ✓ |
| EventChip | ✓ | No — calendar item; Agenda view uses AgendaEventRow instead. | Tier 2 · gallery: 4 statuses / long title | ✓ |
| AgendaDayGroup | ✓ | No — day grouping wrapper; embeds ConflictBanner on conflict days. | Tier 2 · gallery: normal / conflict / empty | ✓ |
| AgendaEventRow | ✓ | No — row form of an event; sibling of EventChip. | Tier 2 · gallery: status label / equipment-clash / mobile left-bar | ✓ |

**Consequence 3 is a D4 obligation.** Until an item's Tier-2 build + gallery
entry exists, it is a *proposed* addition (ui-conventions §1). D4 / PHASE-00B
owns that.

Non-promoted reconciliations (ConfirmDialog, EmptyState — both pre-D3 names —
plus the StatusBadge / LineItemRow / TotalsPanel / DataTable consolidations) are
covered by D3.2 above and need no §12 record.

---

## Recommendations — D3 part 2

Checked against the two existing D3 Recommendations blocks in memory
(`d2-screen-batch-progress.md`). Not repeated here. Carried forward:

1. **[RESOLVED 2026-09-07] Worst-day cell severity encoding is now ratified in
   `inventory-availability.md` §7.** (Was D3 part-1 Rec #1 / D2.1 Rec #2.) The
   encoding — worst day = the `byDay` entry equal to `minAvailable`; tint
   warning-subtle when below the checked quantity, success-subtle otherwise,
   border-strong outline, ties to the earliest day — is written into §7 and
   matches the artboard + §1. No open action; D4 builds to §7.

2. **[IMPROVEMENT] The voice-capture-time chip on Voice Review 1440 is an
   undocumented pill.** "Captured 3:42 PM" in the PageHeader is not a StatusBadge
   and was deliberately left during normalize-back, but it is a bespoke element
   with no composite. Either fold it into PageHeader as an optional `capturedAt`
   slot (small, consistent) or drop it — the transcript panel already carries
   provenance. Cost: S. Recommendation: do in D4 when PageHeader is built.

3. **[GAP] ConfirmDialog is specified without a real flow behind it.** (Carried
   from D3 part-1 Rec #3.) It now has resting / pending / error on the artboard,
   modelled on the void flow. When the real issue / accept / void actions are
   built, the orchestrator should check the copy ("what will happen") and the
   error surface against what those server actions actually return. Cost: S.
   Recommendation: verify in the phase that builds each action.

4. **[LATER] The four Combobox-based composites should share one internal
   `SearchableList`.** (Carried from D3 part-1 Rec #4.) ClientPicker,
   CatalogItemPicker, SearchInput's popover behaviour, and any future entity
   picker wrap the same shadcn Combobox with different option renderers. Not a
   Paper concern — note it for D4 so the popover, keyboard nav, and empty/loading
   states are defined once. Cost: M. Recommendation: do in D4 (build), do not
   pre-abstract in Paper.

5. **[LATER] No composite covers the shared-quote public view (`/q/[token]`,
   INV-T4).** (Carried from D3 part-1 Rec #5.) The only unauthenticated screen,
   renders a quote without the app shell; the PDF path is separate
   (`@react-pdf/renderer`). D3's set has no "bare document frame" primitive.
   D6 work — flagged so it is not a surprise. Cost: S. Recommendation: do in D6.

---

## Exit

D3 is complete. The approved composite set is on the Paper artboard and in
`ui-conventions.md` §1, and the batch screens are normalised to it.
**Next: D4 / PHASE-00B** builds Tier 1 (restyled shadcn primitives + the three
blocks) and Tier 2 (the approved composites, including the twelve §12 promotions)
in code, with `/dev/gallery` covering every state.
