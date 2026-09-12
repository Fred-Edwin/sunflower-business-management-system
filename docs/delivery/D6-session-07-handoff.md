# D6 SESSION — Group F "Voice" — HANDOFF PROMPT

You are the product designer for the Sunflower Events BMS, running design stage
D6 — designing remaining application screens in Paper by composition from the
approved component set. This session designs **Group F: Voice**.

Groups A, B, C, D, and E are done and client-approved. Group E's session is the
most recent — see `D6-plan.md` §8, the 2026-09-09 "Group E" entries, and §9e for
its five recommendations (several are "do now" items for whoever builds the
Finance module in D7 — not your job this session, just context).

The bar is top-tier premium — Linear / Apple / Mercl-grade restraint as the
baseline. You are the engineer-designer: propose what would make it better,
never build unrequested, wait for approval.

NO SIGNATURE-MOMENT WORK, WITH ONE NAMED EXCEPTION THIS SESSION. Signature
moments are DEFERRED OUT OF D6 entirely (client, 2026-09-08 — `D6-plan.md`
§5.3). D6 designs SCREENS ONLY. Voice review (moment ⑤ — the transcript
type-in, the field fly-out) stays deferred, unstoryboarded, exactly like every
other group. **The one exception, approved by the client 2026-09-09, is
narrower: the recording overlay's visual identity (§4, item 3 below) gets
real exploration this session** — not because it is a signature moment, but
because it was never designed at all (the plan only ever said "waveform,
duration, cancel") and a generic pulsing-red-record-dot is exactly the
stock-component-library look this project's premium bar exists to avoid. This
exception is scoped to that one screen's resting/recording visual. Everything
else in Group F — the review shell, disambiguation, the queue sheet — follows
the standard rule: motion is a one-line intent note, not a storyboard.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `CLAUDE.md`
- `docs/delivery/D6-plan.md` — §2 the eight governing constraints, §3 the
  session mechanic, §5.3 (signature moments deferred — read the full note,
  it lists voice review ⑤ specifically as "a functional review shell; the
  type-in / fly-out is a later pass" — that part is unchanged), §6 "Group F —
  Voice" (the planning-level inventory — you finalise the exact one this
  session), §8 status log — read the two 2026-09-09 "Group E" entries so you
  know what conventions and components are current (the `Tabs` Finance strip,
  the `Sheet`-for-forms pattern, the fixed sidebar Settings item). §9a–§9e
  recommendations already logged — check before proposing anything new.
- `docs/delivery/D6-new-components.md` — the running manifest. Nothing in it
  is Group-F-specific yet, but re-read the "Rejected / superseded" section —
  `AvailabilityHorizon` was rejected twice on the "generic chart" principle;
  the recording-overlay exploration this session is not that kind of
  exception, and the manifest should reflect why once you've built it.
- `docs/conventions/design-system.md` — §1 (D6 stage), §2 token layers, §3–11
  the token vocabulary, §12 (adding a component), §13 rules
- `docs/conventions/ui-conventions.md` — §1 (the approved component set — your
  build vocabulary, includes `VoiceMicButton`, `VoiceReviewField`,
  `VoiceQueueIndicator`, `TranscriptPanel` — all already built), §2 the
  gallery, §4 responsive, **§6 Voice UI** (read closely — this is the existing
  spec for the global mic's three states, the per-form mic, and what the
  review screen must show), §7 accessibility
- `docs/architecture/domain-invariants.md` — INV-V1 through INV-V8 if present
  there (voice invariants), otherwise cross-reference `voice-pipeline.md`'s
  own INV-V numbering (it is the source for these)
- `docs/architecture/voice-pipeline.md` — **read in full, this is your group's
  primary doc.** §1 shape of the pipeline, §2 entry points (global vs.
  per-form), §4 intent routing (the discriminated union — this is F2's exact
  spec), §5 the review step (INV-V1 nothing auto-saves, INV-V3 transcript
  always visible, INV-V5 uncertain fields flagged), §6 resilient capture
  (INV-V6 — this is F4's spec, the IndexedDB queue), §8 failure handling (the
  table of failure → behaviour pairs — this is your states list for F1/F3/F4,
  don't invent states it doesn't name)
- `docs/architecture/data-model.md` — the `VoiceIntent` enum (`QUOTE EXPENSE
  CLIENT DAMAGE_REPORT PAYMENT STAFF_ASSIGNMENT UNKNOWN`) and `VoiceCapture`
  entity fields (`intent`, `intentConfidence`, `correctedFields`,
  `transcript`, status)

Do not read the wider `docs/` tree.

---

## 2. PAPER — file, tools, page

File: `01M1X43Q66HDD6TF72TYYWH3KE` ("Sunflower BMS").

First calls, in order:
1. `get_guide({topic:"paper-mcp-instructions"})` — once. Again if a long
   thread compresses.
2. `open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})`
3. `get_basic_info` — note the pages and the token set
4. `create_page` — a new page named **"D6 — Group F · Voice"**. Group F gets
   its own page; do not build on the Group E page.
5. `get_font_family_info(["Geist","Geist Mono"])` once this session before any
   typographic styling.
6. `get_guide({topic:"mobile-status-bar"})` before drawing any new 390
   artboard.

**THE APPROVED COMPONENT SET** — your build vocabulary. Page "D3 —
Components" (pageId `6-0`), artboard `4U2-0`. Pull exact values with `get_jsx`
— never read them off a screenshot. Bands you'll lean on most this session:
`VoiceMicButton` (the shell FAB + the per-form pill — you are not redesigning
this, you are placing it and drawing what happens after it's pressed),
`VoiceReviewField` (the uncertainty wrapper — border + icon, INV-V5),
`VoiceQueueIndicator` (the count badge on the shell control and the mobile
FAB), `TranscriptPanel` (the always-visible transcript rail, INV-V3),
`VoiceItemRow` (Group A's catalog-review row — reference for anatomy, not
reused directly), `Sheet` (F3 and F4 are both sheets, matching the E2
Expense-sheet pattern from Group E), `ConfirmDialog`, `EmptyState`.

**Existing screens you are wrapping, not redesigning.** Group F's review shell
places these forms inside itself — screenshot each once to know its shape
before you start:
- C2 Quote screen (Group C page, quoting) — the large case for F1
- E2 Expense sheet (Group E page, `01M1X43Q66HDD6TF72TYYWH3KE`/`C-0`) — the
  small case for F1, and note it is a right-side **Sheet**, not a full screen
  — F1's expense variant should probably follow the same Sheet placement,
  confirm with the user if this isn't obvious once you see the form
- Record payment dialog, Staff assignment dialog (Group D page) — the other
  two intents' destinations, referenced not redrawn
- Client creation — inline in `ClientPicker` per the plan, so `VoiceIntent.
  CLIENT`'s destination is wherever that picker's inline-create lives; note
  this precisely once found, it may itself be a small gap (client creation
  has no standalone form to wrap — flag it, don't invent one)

**App shell**: page "D2 — Batch 1 Screens" (pageId `2-0`), sidebar node
`11S-0` inside App Shell 1440 `F6-0`. Clone via `<x-paper-clone
node-id="11S-0" />`, or clone a recent Group E artboard's sidebar wholesale
(faster — every Group E screen has the current sidebar, including the
**Settings** item added this session below Finance; duplicate one and swap
the active nav item). Nav order: Dashboard · Calendar · Inquiries · Quotes ·
Invoices · Clients · Catalog · Availability · Staff · Finance · **Settings**.
Verify nav order with a screenshot before proceeding — the Settings item is
new as of Group E and easy to miss if you clone an older Group C/D artboard
instead. Voice screens are overlays/shells, not sidebar destinations in their
own right — the sidebar's active item on F1/F2/F3/F4 should match whichever
screen the overlay sits on top of (e.g. F1's quote variant sits on Quotes
active, its expense variant on Finance active).

**DO NOT TOUCH**
- Pages "D6 — Group A · Getting set up" (`7-0`, `8-0`), "D6 — Group B · Daily
  inbound" (`9-0`), "D6 — Group C · Quoting" (`A-0`), "D6 — Group D · Running
  events & getting paid" (`B-0`), "D6 — Group E · Money & records" (`C-0`)
- Artboard `4U2-0` itself (read-only this session — if a fix to
  `VoiceMicButton`/`VoiceReviewField`/`VoiceQueueIndicator`/`TranscriptPanel`
  turns out to be needed, propose it, get approval, then the one sanctioned
  edit, same as the Group D TotalsPanel precedent)
- Page "D2 — Batch 1 Screens" (`2-0`), "Page 1" (`1-0`), any sign-in artboard

**YOUR PAGE**: the new page you create this session, "D6 — Group F · Voice".
Match the row / lane-guide / title-card convention established on every other
D6 group page exactly — screenshot Group E's Row 1 (E1 Expenses list) to
re-internalize spacing and the row-title card format before adding your own
lane guide and first row.

`get_screenshot` to review after each meaningful group of edits.
`finish_working_on_nodes` when done. No raw node IDs in anything you tell the
user.

---

## 3. THE EIGHT GOVERNING CONSTRAINTS (`D6-plan.md` §2 — inherited, unchanged)

Compose from the approved set first — new component only if genuinely
required; two designs / one implementation; four states always (adapted per
screen — see §4, some of these are "states" in the failure-handling-table
sense, not the usual populated/loading/empty/error four); screens compose,
don't style; motion is a one-line intent note, not a storyboard — **except
the one named exception in this handoff's preamble and §4 item 3**;
recommendations are proposed, not built, and wait for approval; D6 is
Paper-only.

---

## 4. GROUP F — SCREEN INVENTORY (planning-level, finalise at session start)

From `D6-plan.md` §6, four surfaces. Confirm this list — and any consolidation
you think is warranted — with the user before building anything, the same way
every prior group session opened with an inventory-and-approval step.

1. **Voice review shell** — the core screen. One shell, drawn wrapping two
   forms to prove the pattern generalises:
   - **Wrapping the quote form (the large case).** The Group C C2 quote
     screen, pre-filled, with a `TranscriptPanel` rail. `VoiceReviewField` on
     uncertain fields — flagged **both** in the form and, per
     `voice-pipeline.md` §5, ideally cross-referenced in the transcript (check
     whether this needs a `TranscriptPanel` variant or is achievable with the
     existing component before proposing anything new — see the
     `TranscriptReveal` note below). Unresolved client → shown as text with a
     "no matching client — create one?" affordance (INV-V4/V5), never
     silently dropped. Confirm button reads **"Save quote"** (INV-V1 — states
     what it does).
   - **Wrapping the expense form (the small case).** The Group E E2 expense
     sheet, pre-filled. Same transcript rail. Confirm button reads **"Save
     expense"**.
   - The other four intents (`CLIENT`, `DAMAGE_REPORT`, `PAYMENT`,
     `STAFF_ASSIGNMENT`) reuse the identical shell around forms that already
     exist (or, for `CLIENT`, may not have a standalone form to wrap — see §2
     above). Note this explicitly rather than redrawing four more full
     variants; one sentence per intent naming its destination is enough
     unless a destination turns out not to exist.
   - **`DAMAGE_REPORT` is a live gap.** `document-lifecycle.md`/Group B cut
     the damage/maintenance dialog entirely (§9b) — damage handling is now
     "edit `CatalogItem.totalQuantity` on the Catalog list," which is not a
     voice-fillable form. `VoiceIntent.DAMAGE_REPORT` still exists in the
     enum and the pipeline still routes to it (`voice-pipeline.md` §4). This
     session must decide and record what happens when Susan says something
     that extracts as a damage report: does F2's disambiguation list it as an
     option with nowhere to land, or does it get quietly excluded from the
     button set with the transcript still saved as `UNKNOWN`/unactioned? This
     is a real product decision, not a drawing task — propose an answer, do
     not silently pick one. Likely a §9f recommendation regardless of which
     way it's decided.
   - **States** (per `voice-pipeline.md` §8's failure table — use exactly
     these, do not invent extras): populated (model filled it, some fields
     confident) · all-confident (clean case, nothing flagged) · flagged
     (one-plus uncertain field) · **extraction-failed** (transcript persisted,
     form opens empty, she corrects manually — INV-V3/V4) · saving · error.
     1440 + 390, for both the quote and expense wrap.
   - Motion: **deferred, one-line note only** (the type-in / fly-out is
     signature moment ⑤, still frozen).

2. **Intent disambiguation** (`UNKNOWN`) — `voice-pipeline.md` §4: *"guessing
   wrong ... is worse than asking."* The transcript, prominent (`TranscriptPanel`
   again). "What was this?" + a row of record-type buttons for each known
   intent (minus whatever §4 item 1's `DAMAGE_REPORT` decision resolves to).
   Picking one routes into the review shell (item 1) wrapping that intent's
   form, re-running extraction against its schema. States: the ask · (if it
   still can't help — e.g. she picks nothing — a "start over" or discard
   affordance). 1440 + 390. Motion: one-line note only.

3. **Recording overlay — component states, WITH THE NAMED EXPLORATION
   EXCEPTION.** The global mic's three visible states from `ui-conventions.md`
   §6 (idle · recording · processing) plus the per-form mic's pill, drawn as
   an overlay/sheet (mobile: bottom-sheet in the thumb zone, matching the
   `Sheet` pattern already used for A6/D6/D8/E2; desktop: a smaller anchored
   popover off the shell mic).
   - **The recording state itself is the one screen this session designs with
     real creative latitude** (see the handoff preamble). Explore **2–3
     directions** and present them side by side before building the final
     one into every artboard — the same process Groups A/C/D used for their
     open design questions (A1 sign-in, the D1 Agenda hybrid). Directions to
     try, not a prescription:
     - a live waveform, thin and monochrome (accent colour only, never a
       multi-colour equalizer), driven by real amplitude
     - a breathing ring around the mic icon that scales with input level
       instead of a generic uniform pulse
     - the elapsed-duration readout (Geist Mono, tabular, large) as the
       visual anchor, with the waveform/ring as a quiet frame around it, not
       the headline
     - one shared easing curve throughout, nothing bouncing, restraint over
       spectacle — this is still the project's baseline aesthetic, the
       exploration is about finding a *premium* version of the recording
       state, not an ornate one
   - Also draw, plainly (no exploration needed): duration counter, a Cancel
     affordance, the too-short rejection message (`voice-pipeline.md` §8:
     silent or under ~1s is rejected client-side before upload), the
     processing state ("transcribing…" then handing off to extraction).
   - 390 is the primary spec (thumb-zone sheet); a 1440 variant for the
     desktop shell mic, smaller footprint.
   - Present the 2–3 directions to the user as a chat message with a clear
     recommendation, the same format used for every other open design
     question this phase. Wait for the pick before finishing the states.

4. **Queue sheet** — component states, not a full screen. `voice-pipeline.md`
   §6, the one place v1 works offline. Opened from the `VoiceQueueIndicator`
   badge.
   - Pending captures list: timestamp, a short transcript preview once one
     exists, per-item **Retry** / **Discard**, an overall status line ("2
     waiting — will send when you're back online").
   - States: has-items · empty · a failed-item (STT failed, retry offered per
     the §8 table) · all-retrying/in-flight. 390 sheet (primary) + 1440.
   - Motion: one-line note only.

**New components — likely none, possibly one.** The four D3 voice composites
(`VoiceMicButton`, `VoiceReviewField`, `VoiceQueueIndicator`, `TranscriptPanel`)
plus `VoiceItemRow` should cover the review shell, disambiguation, and queue
sheet. Test the "compose first" rule at every point before proposing:
- If cross-referencing a flagged field to its source phrase *inside* the
  transcript (static highlighting, not the deferred type-in motion) can't be
  done with the existing `TranscriptPanel`, that is the one place a variant —
  not a new component — might be warranted. `D6-plan.md` §7 anticipated this
  as `TranscriptReveal`, but flagged the motion half as deferred; if you need
  only the static highlight, propose it as a `TranscriptPanel` variant and
  name exactly what it adds.
- The recording overlay and queue sheet may compose entirely from `Sheet` +
  primitives + the existing voice composites once item 3's exploration
  concludes. Decide at that point, log the decision either way (built or
  consciously not needed) per the established manifest protocol — Group D and
  Group E both recorded "none required" explicitly rather than leaving it
  silent; do the same.

---

## 5. THE TASK — ORDER OF WORK

1. Reconnect context: read the docs in §1, run the Paper context calls in §2.
   Screenshot the C2 Quote screen and the E2 Expense sheet (the two forms F1
   wraps) to know their exact shape before drawing anything around them.
2. Post the Group F screen inventory (§4 above, refined with your own
   judgement) as a chat message, including states and the compose-from list
   per screen, and flag the `DAMAGE_REPORT` and `CLIENT`-destination gaps for
   a decision. **Wait for approval.** Do not create the page or any artboard
   before this.
3. On approval: create the page, build the legend + lane guide + Row 1 title
   card, matching every prior group page exactly.
4. Build screens in this order: Voice review shell (quote variant, then
   expense variant) → Intent disambiguation → Queue sheet → Recording overlay
   last, since it needs the exploration step (§4 item 3) before it can be
   finalised. `get_screenshot` review after each screen against the premium
   bar (spacing / typography / contrast / alignment / artboard-fit /
   repetition) — one-line verdict, fix before moving on.
5. When you reach the recording overlay: build 2–3 directions for the
   recording state, present them side by side with a recommendation, **wait
   for the pick**, then finish all its states with the chosen direction.
6. Full-page screenshot review of everything built so far. Present to the
   user. Iterate until approved.
7. Append a status-log entry to `D6-plan.md` §8, update
   `D6-new-components.md` if anything changed (state explicitly if nothing
   did, per the established pattern — Group D and Group E both did this),
   append recommendations (max 5, ranked) to a new `D6-plan.md` §9f. The
   `DAMAGE_REPORT` decision belongs here if it wasn't fully resolved as a
   design call during the session.
8. `finish_working_on_nodes`. Do NOT start the PDF template track or Group G.

---

## 6. LESSONS FROM PAST SESSIONS — apply proactively

- **Flex-grow stretch bug on inserted content.** When inserting a block into
  an existing flex-column artboard via `write_html` (insert-children or
  replace mode), the inserted frame sometimes inherits `flex-grow`/
  `flex-basis` from context and renders far taller/shorter than intended.
  Fix immediately by setting `flexGrow: "0", flexShrink: "0", flexBasis:
  "auto", height: "auto"` explicitly on the inserted frame, then
  re-screenshot to confirm.
- **`position: absolute` on an artboard, or on a node you then reposition via
  `update_styles`, can shove its child frame's world position far off the
  artboard while the artboard itself looks correctly placed in
  `get_basic_info`.** This bit the Group E session hard on the Expense sheet
  artboards — the root frame inside the artboard ended up thousands of pixels
  away, rendering blank screenshots, and had to be reset to `position:
  relative; left: 0; top: 0` explicitly. If you build any overlay/sheet this
  session (all four surfaces are sheets or overlays) and a screenshot comes
  back blank or oddly cropped, check the immediate child's `x`/`y` via
  `get_node_info` before assuming the content is missing — it is very likely
  just mispositioned.
- **Verify node identity before editing, especially after `duplicate_nodes`,
  and especially when a session edits a wage/variant-style artboard right
  after duplicating it.** The Group E session edited the *source* artboard's
  nodes by mistake immediately after a duplicate (mixing up which IDs
  belonged to the original vs. the clone), landing a wage-derived-only header
  and footer on the plain "editing" state. When you duplicate an artboard to
  make a variant, re-derive which IDs belong to which copy from the
  `duplicate_nodes` result's `descendantIdMap` before making the next edit —
  don't edit "the node I just made changes near" from memory.
  `find_nodes` by text is the reliable fallback.
- **Nav active-state.** Every cloned sidebar needs its active item swapped
  explicitly (icon stroke + text color + weight + border-bottom underline all
  four change together) — this has been missed at least once per group,
  including within Group E on its first artboards (the D5-clone's "Invoices"
  underline survived alongside the new "Finance" active state until caught).
  Screenshot and check the sidebar specifically, not just the content area.
- **Don't add fills to plain-text chips unless the source explicitly wants a
  pill.** Group E's Source column (Manual / Voice / Wage (auto)) is plain
  inline text, no pill — check with the user if a screen's chip/status
  treatment is ambiguous rather than defaulting to the pill pattern. This
  applies directly to F1's confidence/flag indicators — check
  `VoiceReviewField`'s existing treatment before adding anything new.

---

## 7. CONSTRAINTS THAT DO NOT BEND

Compose from the approved set first; a new component only when the premium
bar genuinely requires it, always logged. NO signature-moment work except the
one named exception (§4 item 3, the recording state) — no chart, no bespoke
graphics elsewhere, no motion storyboard anywhere else (a one-line intent
note is fine, including for the review shell and disambiguation screens —
the type-in/fly-out ceremony for voice review is signature moment ⑤ and
stays frozen). Two designs (390 / 1440), one implementation — mobile artboard
is the spec for behavior below `md`. Screens compose, they don't style — no
raw hex / arbitrary spacing / one-off variants; token gap → raise it, missing
component → build + log. States per screen exactly as enumerated in §4 (drawn
from `voice-pipeline.md` §8's failure table, not the generic
populated/loading/empty/error four — voice has its own state shape). Propose,
never build unrequested — silence on a recommendation is not approval,
including the `DAMAGE_REPORT` destination question, which must be explicitly
decided, not defaulted. D6 is Paper-only. Files you may write this session:
`D6-plan.md` §8 / a new §9f, `D6-new-components.md`. Nothing else. No raw
node IDs to the user. `finish_working_on_nodes` when done.

Nothing saves without an explicit press, ever (INV-V1). The transcript is
always visible on the review screen (INV-V3). Uncertain fields are flagged
with a border + icon, never colour alone (INV-V5). Unresolved entities (a
spoken client name, a damage report with nowhere to go) are shown as text
with an affordance, never silently dropped (this is the spirit of INV-V4
applied broadly). Audio is queued in IndexedDB before any upload — the queue
sheet's whole reason to exist (INV-V6). Money is integer KES cents, tabular
mono (INV-M1), wherever a voice-filled form shows a figure.
