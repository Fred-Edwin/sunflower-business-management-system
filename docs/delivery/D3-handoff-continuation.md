# D3 continuation — handoff prompt

Paste this to a fresh session to finish D3 (extraction + reconciliation) for
Sunflower Events BMS. D3 was split; part 1 is done.

---

You are the **design-system session** continuing **D3 — extraction and
reconciliation** (design-system.md §1). You are NOT the orchestrator. Part 1 of
D3 is complete. Your job is to finish it.

## READ FIRST, in order
1. `CLAUDE.md` — hard rules, invariants 1–10
2. `docs/architecture/domain-invariants.md`
3. `docs/conventions/design-system.md` §1 (D3 steps + §12), §2, §3
4. `docs/conventions/ui-conventions.md` §1 — **already rewritten** with the full
   approved composite set. This is your spec. Every composite, its variants, and
   its states are described there.
5. Memory `d2-screen-batch-progress.md` — the D3 part-1 section + both
   Recommendations blocks. All reconciliation decisions are locked there.
6. `src/styles/globals.css` — live tokens (Paper theme already matches).

## PAPER
File `01M1X43Q66HDD6TF72TYYWH3KE`.
- Page **"D3 — Components"** (id `6-0`), artboard **"D3 — Approved Composite Set"**
  (id `4U2-0`). 11 bands done. A yellow **"RESUME HERE"** card at the bottom
  lists exactly what is left.
- Page **"D2 — Batch 1 Screens"** (id `2-0`) — the screens to normalize back.

## CONTEXT DISCIPLINE (learned the hard way in part 1)
`write_html` echoes every node it creates — that is the token cost, not the
artboard size. So:
- **One composite per `write_html` call.** Do not batch sub-groups.
- **Batch screenshots** — one `get_screenshot` per ~4–5 bands, not per band.
- **Do not draw near-identical state chips** when a one-line spec in the band
  description covers them (e.g. hover = "bg shifts to surface-sunken").
- Keep the artboard as ONE artboard. Do not split it — that is more expensive,
  not less.

## LOCKED DECISIONS (do not re-litigate — see memory for full text)
- StatusBadge: **no grey pill anywhere.** Bare 6px dot + status-colour label.
  `variant` = document | event | inventory. `DocumentStatusBadge` /
  `AvailabilityBadge` = thin wrappers.
- LineItemRow: one component, `variant` = quote | document | voice.
- DataTable card fallback: one contract (see §1). `wide:true` column →
  horizontal-scroll strip = the only permitted h-scroll = DayAvailabilityStrip.
- ConflictBanner ≠ DocumentNoticeBanner — **two** components.
- SegmentedToggle: one primitive for all 4 batch toggles.
- TotalsPanel: one component, `layout` = ledger | statcards.
- Components reference **semantic tokens only**, never primitives.
- No component CODE. Paper + the §1 doc only. D4/PHASE-00B builds code.

## TASK A — finish the component artboard (D3.1 + D3.3)
Add these bands to `4U2-0`, below "RESUME HERE" (then move that card to the
bottom, or delete it when done). Each in ALL its states — spec is in
`ui-conventions.md` §1:

1. **EmptyState** — icon / title / body / action(s). 3 canonical uses.
2. **ConfirmDialog** — dialog base; plain-language "what will happen";
   action-named button. States: resting, pending (spinner + disabled),
   error (inline, dialog stays open). No batch-screen source — design from §1
   spec; see D3 Recommendation #3.
3. **ConflictBanner** — warning triangle, danger-subtle bg, plain message naming
   resource + shortfall. No forward link. + compact **pill variant** for the
   calendar day-cell.
4. **DocumentNoticeBanner** — x-circle, bold title, reason line, forward link
   button. `tone` = danger (void) | neutral (superseded). Always has the link.
5. **VoiceMicButton** — shell FAB (with queue badge) + per-form pill. States:
   idle, recording, processing.
6. **VoiceReviewField** — uncertainty: warning-subtle bg + warning border +
   uppercase flag label ("NO MATCH" / "CHECK THIS") + optional helper. Resting =
   passthrough.
7. **VoiceQueueIndicator** — danger count badge (9px/600 white). Zero = no badge.
8. **TranscriptPanel** — mic + "Transcript" + "0:23 · Deepgram" + quoted body in
   a sunken card + caption. Right rail desktop / stacked card mobile.
9. **CalendarGrid + EventChip** — weekday header (MON…SUN 12px), tall day cells,
   date number top-left, conflict flag pill in cell, EventChips stacked.
   EventChip: title 13 semibold + client·role 12 muted, status-coloured left bar.
   States: populated / empty day / conflict day / loading.
10. **AgendaDayGroup + AgendaEventRow** — sunken date header
    ("SAT 18 OCT  2 events · conflict") + rows; empty day = quiet "Nothing
    scheduled" row; conflict day = ConflictBanner inline before rows.
    AgendaEventRow: date range (mono) / title + client·venue·detail / status
    label or "Equipment clash" right; status left-bar on mobile.
11. **shadcn block restyle spec cards** (spec only — these start as CODE in D4,
    NOT here; the card just gives D4 a visual target):
    - **Sidebar** — ink-gradient (`linear-gradient(in oklab 160deg,
      chrome-gradient-start 0%, chrome-gradient-end 60%)`), nav item 9px/10px pad
      + 16px icon slot + gap 10; **active = 1px bottom-border `chrome-active-
      underline` + text/icon → chrome-text + weight 600** (ghost underline);
      footer Voice-capture pill (`#00000033` bg, 1px chrome-border ring, danger
      count badge) + user row. Pull exact values with `get_jsx` on `2-0` artboard
      `F6-0` / `HA-0`.
    - **login-form** — solved problem, no design content; just note "restyle to
      tokens, 44px controls, accent primary".
    - **DataTable** — the premium-table spec above; point at the DataTable band.

Screenshot after every ~4 bands, self-critique (spacing / type / contrast /
alignment / artboard fit / repetition), fix before moving on. Switch the artboard
to `height: fit-content` if content clips (it already is).

## TASK B — D3.4 normalize backwards (MANDATORY — the step that gets skipped)
Update the batch screens on page `2-0` to use the reconciled composites. Rows
01–04 (desktop) AND row 06 (the 6 mobile 390 artboards). Row 05
(reference/superseded) is lineage — leave it.

Specific edits:
- **Every StatusBadge loses the grey pill.** Concretely:
  - Quote Builder 1440 (`HA-0`) + 390 (`3X5-0`): "Draft" badge → bare dot+label.
  - Client Detail 1440 (`1U2-0`) + 390 (`43K-0`): "Referral" badge → bare.
  - Invoice Detail "Voided" is already bare — confirm it matches the new spec
    (muted text, 6px dot).
  - Calendar legend dots (`3GJ-0`, `34T-0`, `488-0`) — already dot+label, confirm
    they match StatusBadge variant="event".
  - Quotes-list-empty (`4M6-0`) filter tabs — unaffected (those are Tabs, not
    badges) but confirm.
- **Unify the two table→card fallbacks** to the DataTable card contract:
  - Quote Builder 390 (`3X5-0`) line-item cards — already close; formalise the
    footer line-total as the "figure block".
  - Availability 390 (`40V-0`) per-item blocks — convert to the card form with
    the DayAvailabilityStrip as the `wide` scroll region inside each card.
- **Voice Review 390 (`1RL-0`) chrome** — align its top bar to the other 5 mobile
  top-bars (PageHeader mobile projection): plain breadcrumb + per-form mic pill,
  not the bespoke "Voice" treatment. (D2.1 rec #5.)
- **PageHeader** — confirm all 8 desktop + 6 mobile headers match the reconciled
  PageHeader (breadcrumb / title / inline badge / action slot).
- **LineItemRow** — Invoice Detail (`20X-0`, `45F-0`) rows → `variant="document"`;
  Quote Builder rows → `variant="quote"`; Voice Review rows → `variant="voice"`.

Screenshot each normalized screen, confirm no regression, no horizontal overflow.

## TASK C — D3.5 record
For each §12 promotion (list in memory + §1), record the four consequences:
(1) on the component artboard ✓  (2) checked against the existing set — is it a
variant of something?  (3) to be built as Tier 2 + gallery in D4  (4) listed in
§1 ✓. Put this table in the D3 work log (create
`docs/delivery/phases/PHASE-00B.md` §7 if the orchestrator hasn't, or a
`docs/delivery/D3-worklog.md`) and note it in the memory.

## CLOSE
- `## Recommendations` block, max 5, ranked. Check the two existing D3
  Recommendations blocks in memory first — don't repeat. The worst-day severity
  encoding (Rec #1) still needs orchestrator ratification — carry it forward if
  still open.
- Update memory `d2-screen-batch-progress.md`: mark D3 complete, or list any
  residue.
- `finish_working_on_nodes`.

## THEN D3 EXITS → D4/PHASE-00B builds Tier 1 + Tier 2 in code + /dev/gallery.
