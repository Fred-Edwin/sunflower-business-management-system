# D6 — Screen Design Phase Plan

**Stage:** D6 of `../conventions/design-system.md` §1 — "Design remaining screens
by composition."
**Status:** Planning complete. Group A not yet started.
**Written by:** Product designer session, 2026-09-08.

> D0–D5 are done. Tokens are locked in `src/styles/globals.css` (code is the
> source of truth). The 28 approved Tier 2 composites + 24 restyled Tier 1
> primitives + 3 shadcn blocks are built in code, in `/dev/gallery`, and mirrored
> on Paper artboard `4U2-0` (page "D3 — Components"), reconciled against code in
> D5. **D6 designs every remaining screen by arranging those components.** D7
> (implementation) then assembles the same components against the D6 artboards,
> so there is no translation step where drift can occur.

---

## 1. Purpose of this phase

Produce the **complete set of screen designs** for the whole product, at 390px
and 1440px, in Paper — so that:

1. The **client (Susan)** can see and understand how the finished app works
   before it is built.
2. The **frontend agent** in each build phase (D7 / PHASE-01 onward) has an
   exact visual and layout reference to assemble from existing components.

The bar is **top-tier premium**: Linear / Apple / Mercl-grade restraint as the
baseline, with **motion used throughout** (not sparingly), and **six signature
moments** where we invest real creative effort — see §5.

---

## 2. Governing constraints

These are fixed for the whole phase. Every session inherits them.

1. **Compose from the approved set first.** If an approved Tier 1 / Tier 2
   component does the job, use it exactly as built. Do not re-draw it, do not
   fork a variant. This is what keeps D6 → D7 drift-free.

2. **A new component is allowed when the premium bar requires it.** If no
   approved component can achieve the intended design, the designing session
   **builds the new component in Paper and logs it** in the running
   **`D6 — New Components` manifest** (§7). Every new component entry records:
   name · which screen forced it · what it does · its states · why an existing
   component could not do it. At phase end the manifest is the export list back
   into `src/components/`, `/dev/gallery`, a `4U2-0`-style band, and
   `ui-conventions.md` §1 (the §12 promotion rule).

3. **Two designs, one implementation.** Every screen is drawn at 390px and
   1440px. The mobile artboard is the *specification for how the component tree
   behaves below `md`*, never a separate screen. `DataTable` → card projection
   and similar live inside the Tier 2 component, not the screen.

4. **Every screen has four states.** Loading (skeleton, not spinner), empty,
   error, populated. All four are designed in Paper. An unhandled empty state is
   an incomplete screen. (`ui-conventions.md` §5.)

5. **Screens compose; they do not style.** No raw hex, no arbitrary spacing, no
   one-off variants on a screen artboard. If a screen seems to need one, that is
   either a semantic token gap (raise it) or a missing Tier 2 component (build
   and log it).

6. **Motion has an identity, not six unrelated tricks.** See §5 "The through-line
   for motion." One easing curve. Motion always carries directional meaning.
   Numbers roll to their new value rather than swapping. Nothing bounces,
   nothing exceeds ~300ms.

7. **Recommendations are proposed, not built.** Within a session, the designing
   agent proposes creative additions, new components, or flow adjustments and
   **waits** for approval. If nothing is approved, iterate in Paper until it is
   right. Silence on a recommendation is not approval.

8. **Instrument nothing, transact nothing.** D6 is Paper only. No code changes in
   a D6 session except the manifest and this plan's status log.

---

## 3. Flow groups and screen order

We design **group by group**, in the order below. The grouping is the approved
user-flow grouping; the sequence follows the document-chain spine
(`document-lifecycle.md` §1) so each group builds on the vocabulary of the last.

| # | Group | Why this position |
|---|---|---|
| A | Getting set up | Prerequisites for everything else. Gentlest screens — warms up the visual language on low-risk surfaces. |
| B | Daily inbound | The phone-call surfaces. High frequency, low complexity. Introduces availability. |
| C | Quoting | The heart of the system. Densest screens. First signature moments land here. |
| D | Running events & getting paid | The spine's second half. Calendar, event hub, the money documents. |
| E | Money & records | Period-end surfaces. Lower frequency. |
| F | Voice | Overlays every capture flow; designed last per `voice-pipeline.md`. Mostly a review shell + component states. |
| G | Dashboard | Designed last so it can reference the real screens it links into. Signature screen — unhurried. |

**PDF templates** (quote, delivery note, questionnaire, packing checklist,
receipt) are a **separate lighter track** — print layout via `@react-pdf/renderer`
language, not interaction design. Slotted in after Group D. They share a visual
language with the public shared quote (signature moment ④).

### Session mapping

**One group per session by default.** A session may cover more than one group if
context budget allows, or a heavy group (C, D) may split across two sessions. The
orchestrator/designer judges at the start of each session against the group's
screen count and state matrix.

Each session:

1. **Outline the group's screen inventory** — exact screen list, each screen's
   states, desktop + mobile notes, which approved components each composes from,
   any anticipated new component. **Wait for approval.**
2. **Design the group's artboards in Paper** — desktop + mobile per screen, all
   four states, composing from the approved set. Build + log any new component.
3. **Screenshot review, iterate in Paper** until the group meets the premium bar.
4. **Approval gate** — user approves the group (and its new components) before
   the next group starts.
5. **Append to §8 status log** of this file and the `D6 — New Components`
   manifest.

---

## 4. Approved flow consolidations

From the user-flow critique, approved for D6. These reduce the build-plan's
nominal screen list.

| Build-plan implies | D6 designs | Effect |
|---|---|---|
| Inquiry list + inquiry detail (2 screens) | **Cut entirely** (Group B session, 2026-09-08). `Inquiry` is instrumentation only; its 2 fields are captured inline in the Group C quote builder. Pending "call them back" notes → a quick-note dialog + a Dashboard section (Group G). | −2 screens |
| Damage/maintenance dialog + adjustments list (2 surfaces) | **Cut entirely** (Group B session, 2026-09-08). Damage/loss/maintenance = editing `CatalogItem.totalQuantity` on the Catalog list. `InventoryAdjustment` kept in schema, no v1 UI. Bends INV-A1/A7 — see §9a. | −2 surfaces |
| Issue / accept / decline / site-visit-confirm (4 dialogs) | **One `ConfirmDialog`** design + a copy table for the 4 variants | −3 designed dialogs |
| "Generate invoice" + "generate delivery note" (2 flows) | An action button + one `ConfirmDialog` each → lands in the **draft state** of the delivery-note / invoice detail screen (a state those screens must have anyway) | −2 net-new screens |
| Void-and-replace ×3 (invoice, delivery note, payment reversal) | **One dialog pattern**, 3 triggers | −2 flows |
| 6 "voice review: X" screens | **One voice review shell** × the form matching the intent; drawn wrapping the quote form (large) + expense form (small) | −5 screens |
| Calendar + Agenda (2 screens) | **One screen**, `SegmentedToggle` between views | −1 screen |
| Catalog: full-page form for every first-time item | An **inline quick-add row** as a *state* of the catalog list, plus the full form for edits / rich descriptions | +1 pattern, −~30 setup round-trips |

Also approved:

- **Password recovery** — a real gap. Two screens (request reset link, set new
  password). Group A.
- **"Convert to quote" and site-visit-confirm land directly in the quote
  builder** — no intermediate confirmation screen.

The dashboard is **designed from the data**, not from a client interview — Susan
has only ever used paper and cannot specify it. See §5 ② and Group G in §6.

---

## 5. The premium strategy

### 5.1 Baseline — quiet craft, everywhere

- **Restraint is the aesthetic.** Neutral-dominant (the tokens already enforce
  this). Accent appears only where it means something. No non-load-bearing
  decoration.
- **Typography does the work.** Geist + Geist Mono. Tight tracking on headings,
  generous body leading. Money / quantities / reference numbers always tabular
  mono.
- **Density with air.** Dense tables (32px rows) framed in generous whitespace.
  The *contrast* between the two is what reads as expensive.
- **Every state designed with personality.** Empty states are written, not "No
  data". Loading is always skeleton. This is most of why software feels cheap —
  only the happy path got designed.
- **Motion is a material and it is used throughout** — not reserved for the six
  moments. Page transitions, dialog entrances, row insertions, tab changes all
  move on the shared curve so the whole app feels like one physical system.

### 5.2 The through-line for motion

So motion reads as intentional identity, not scattered effects:

- **One easing curve everywhere** — a confident ease-out, approx
  `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Motion always has a direction that means something.** Data responding to
  input moves *toward* the user / *with* the cursor. Things becoming permanent
  *settle* and *lock*. Briefing content *rises* into view.
- **Numbers roll, they don't swap.** Any figure that changes as a result of a
  Susan action animates to its new value. Applied consistently, this one rule is
  a signature by itself.
- **Nothing bounces, nothing drags.** 120–300ms. Playful in *shape*, never in
  *duration*.

Each signature moment ships to the frontend agent as: the frames (storyboard),
the timing, the easing, the trigger — all on the Paper artboard as a motion-spec
note.

### 5.3 The six signature moments

> **DEFERRED 2026-09-08 (client, Group C session).** *"Get rid of the signature
> moments for now. Those will come later. After all the screens have been
> designed, then we'll come and add some moments where it will be necessary."*
>
> Signature-moment work is **out of scope for all remaining D6 group sessions.**
> D6 now designs **screens only** — layout, states, composition from the approved
> set. No motion storyboards, no bespoke graphics, no signature components. A
> dedicated **"moments" pass runs after every group's screens are approved**, at
> which point the client and designer walk the finished set and decide where a
> moment earns its place.
>
> Consequences for the groups not yet designed:
> - ① Availability horizon — already cut (Groups A + B). Stays cut.
> - ② Dashboard briefing — Group G is designed as a plain screen; the load
>   sequence is a later pass.
> - ③ Live ledger totals — Group C `TotalsPanel` is drawn static; the number-roll
>   is a later pass. (The "numbers roll, don't swap" baseline motion rule in §5.2
>   still stands as *implementation* guidance for D7 — it just isn't storyboarded
>   in D6.)
> - ④ Public shared quote — Group C C6 is designed as a clean, well-set screen
>   (it still has to look like it came from a serious company), but the "dignified
>   reveal" motion and any `LetterheadBlock` craft-polish is a later pass.
> - ⑤ Voice review — Group F is designed as a functional review shell; the
>   type-in / fly-out is a later pass.
> - ⑥ Document issued — Group C C4 issue dialog is drawn as a plain `ConfirmDialog`
>   confirm; the stamp-in ceremony is a later pass.
> - Sunflower motif — not trialled in D6.
>
> `D6-new-components.md` entries that exist only to carry a signature moment
> (`AvailabilityHorizon` already rejected; `LetterheadBlock`, `TranscriptReveal`,
> `TodayTimeline`, `KpiFigure` if they come up) are **not proposed during screen
> design** — they belong to the moments pass. A group session only proposes a new
> component when a *screen's basic function* needs it.
>
> The table below is kept for the later pass. It is not a D6 screen-session
> deliverable.

Full detail in `D6-signature-moments.md`. Summary:

| # | Moment | Where | The wow |
|---|---|---|---|
| ① | **Availability horizon** — inventory as a living landscape | Item detail, quote builder rows, availability lookup | A compact horizon graph of free units per day; redraws with a left-to-right wipe when the range or line items change. You read the *shape* of a shortage before the number. |
| ② | **Dashboard briefing** — a command center that assembles itself | `/` | Editorial column (Today / Waiting on a reply / Owed to you / This month). ~1.2s staggered load sequence, month figure counts up, timeline spine draws in. Plays once per session. |
| ③ | **Live ledger totals** — math that calculates *with* you | Quote builder, delivery-note builder | Change a quantity and the figures roll to their new values in a top-to-bottom cascade; a hairline sweeps under the Total as it settles. |
| ④ | **The public shared quote** — the business's face, built like a fine document | `/q/[token]` | Full-bleed letterhead, line items set like a financial instrument, dignified top-to-bottom reveal, sticky "Accept" on mobile. This screen can win a contract. |
| ⑤ | **Voice review** — hearing yourself thought back to you | Voice review shell | Transcript is a first-class quoted passage; uncertain phrases highlighted inline in *both* the transcript and the form. On open, the transcript types itself in, then fields fly out from their source phrases into the form. |
| ⑥ | **Document issued** — a small "it's official now" ceremony | Issue confirm (quote / DN / invoice) | The reference number stamps in (scale-down-and-settle, slight overshoot, ~300ms), a hairline ring pulses once, the status badge cross-fades Draft → Sent. |

**Optional, prototype-then-judge:** a very restrained **sunflower motif** in one
place only (empty-state icon family, or the skeleton shimmer). Prototype in
Group A empty states; kill it if it doesn't feel expensive.

---

## 6. Group screen inventories (indicative)

Each group's **exact** inventory is finalised and approved at the start of that
group's session. The lists below are the planning-level view — enough to size
sessions and see the whole shape. Screen counts exclude the four mandatory
states each screen carries.

### Group A — Getting set up

> **Revised 2026-09-08 after Session 1 client review.** The catalog seeding UX
> was redirected to **voice-first**; the full-screen item form and the item
> detail page were both cut. See §10 for the `VoiceIntent.CATALOG_ITEM`
> recommendation (approved).

- **A1** Sign in (restyle already exists — D6 confirms + designs the other states).
  Direction chosen 2026-09-08: *Split canvas*. Layout WIP pending client
  refinement notes.
- **A2** Password reset — request link *(not yet designed this session)*
- **A3** Password reset — set new password *(not yet designed this session)*
- **A4** Settings (business identity, logo, quote validity, default deposit) —
  ✅ designed
- **A5** Catalog list — the only catalog screen; the table carries enough detail
  that no separate detail page is needed. `PageHeader` action = **"Add items"**
  → menu: *Speak* (voice batch) / *Type* (opens A6 blank). ✅ designed
- **A6** Catalog **edit sheet** — a right-side `Sheet` over the list (bottom sheet
  below `md`), page dimmed behind. Replaces the full-screen form. Edit mode +
  new mode (the *Type* add path). ✅ designed
- **A7** Voice catalog review — the *Speak* path: transcript (always visible,
  INV-V3) + a list of parsed items, each an editable `VoiceItemRow` (new), with
  uncertain values flagged; confirm-all commits. *(in progress)*

**Cut this session:** the standalone *Catalog item detail* page (its content
lives in the list row + the edit sheet; per-item availability belongs to the
Group B availability lookup) and the **availability-horizon** trial — signature ①
is deferred out of Group A (`D6-signature-moments.md`).

### Group B — Daily inbound

> **Revised 2026-09-08, Group B session, client review.** Group B collapsed to a
> single screen. The client's stock "rarely increases or decreases" and she never
> asked for damage/adjustment tracking or an inquiry workflow. Decisions:
> - **Availability lookup** — kept, as a standalone screen (not merged into the
>   Catalog list; different job, different frequency — see §8). No availability
>   horizon (signature ① stays cut). Its only availability visual is
>   `DayAvailabilityStrip`.
> - **Inquiries list** and **Inquiry capture** — **cut**. The `Inquiry` row exists
>   only to measure inquiry→quote elapsed time; it does not need a workflow. The
>   two inquiry fields (channel, receivedAt) are captured inline at the top of the
>   Group C quote builder, which creates the `Inquiry` behind the quote. A
>   "couldn't quote yet, call them back" note is a small quick-note dialog + a
>   Dashboard section (Group G), not a screen. See §9a.
> - **Damage / maintenance dialog** and **Adjustments list** — **cut**. Damage /
>   maintenance / loss is handled by editing `CatalogItem.totalQuantity` on the
>   Catalog list (A5): stock breaks → reduce; fixed → increase. No dated
>   adjustment UI in v1. `InventoryAdjustment` stays in the schema (removing it
>   touches the availability formula and its tests) but has no v1 UI, so v1
>   availability is effectively `totalQuantity − bookings`. **This bends INV-A1 /
>   INV-A7 and the `inventory-availability.md` formula — logged for orchestrator /
>   backend ratification in §9a.**

- **B1** Availability lookup ("what's free on 14 Oct?") — the on-the-phone screen.
  Standalone screen, sidebar item. Day / Range date control, item list, "free on
  {date}" number, `DayAvailabilityStrip` per row in Range mode. 4 states × 2
  breakpoints + a Range-mode variant.

### Group C — Quoting

> **Revised 2026-09-08, Group C session, client review.** 6 surfaces → 3 screens
> + 1 dialog design. Signature moments deferred out of D6 (see §5.3). Decisions:
> - **Quote builder** and **Quote detail** — **merged** into one "Quote" screen:
>   editable when `DRAFT`, locked + version rail + lifecycle actions when issued.
>   Same editable/locked pattern as the Group A catalog and B1. −1 screen.
> - **Availability warning dialog** — **merged** into the issue/accept
>   `ConfirmDialog` as a `ConflictBanner` state (INV-A6 — warn, don't block; names
>   the shortfall). The `AvailabilityWarning` record is written on "proceed
>   anyway" — backend, not a screen. −1 surface.
> - Availability per quote row = `AvailabilityBadge` only. No horizon / chart /
>   sparkline (① stays cut).
> - `TotalsPanel` drawn static (③ number-roll is the later moments pass).
> - Quote form is voice-enabled (`VoiceIntent.QUOTE`) — per-form mic on the title,
>   routes to the Group F voice review shell. Affordance drawn, forward dep noted.
> - Inquiry fields (`channel`, `receivedAt`) captured inline at the top of the
>   builder → creates the `Inquiry` behind the quote (Group B dependency, §9b).

- **C1** Quotes list — list screen. `PageHeader` + `SearchInput` + `DataTable`
  (Ref · Client · Event date · Total · Status) + `StatusBadge` filter chips
  (status) + a client filter, both in the URL. `EmptyState`. 4 states × 2
  breakpoints.
- **C2** Quote screen — the builder + the detail, one screen. `--container-app`
  width. Header (breadcrumb / title / `StatusBadge` / action slot + per-form
  mic). Inline client + event-date + venue + preliminary + inquiry-channel
  fields. `LineItemRow` (variant "quote") list + `CatalogItemPicker` to add.
  `TotalsPanel` (layout "ledger") — subtotal / delivery fee / discount / total /
  deposit. Modes: new · edit-draft · revise-sent (with "this creates v2" notice
  via `DocumentNoticeBanner`) · site-visit-confirm. Locked mode (issued): all
  inputs read-only, `VersionRail` (new) shown when >1 version, lifecycle actions
  in the header (Accept / Decline / Revise / Share). 4 states × 2 breakpoints +
  the mode variants.
- **C3** Public shared quote `/q/[token]` — unauthenticated. `LetterheadBlock`
  (new) + line items set as a financial instrument + deposit/validity + sticky
  "Accept this quote" on mobile → light confirm step. Preliminary (watermark) vs
  final variants. States: valid · expired · already-accepted · not-found. 2
  breakpoints. Drawn clean and well-set (must look like a serious company) — the
  "dignified reveal" motion + `LetterheadBlock` polish is the later moments pass.
- **C4** `ConfirmDialog` — one design + a copy table for the 4 variants (issue /
  accept / decline / site-visit-confirm) + the `ConflictBanner` availability-short
  state on the issue/accept variant. Drawn as a plain confirm — the ⑥ stamp-in
  ceremony is the later moments pass. States: resting · pending · error · +
  availability-short.

**New components proposed for Group C:** `VersionRail` (quote version selector —
forced by the merged C2 when a quote is revised), `LetterheadBlock` (public quote
+ shared with the PDF track — forced by C3). Both are screen-function components,
not signature-moment components. Built in Paper + logged.

### Group D — Running events & getting paid

> **Revised 2026-09-08, Group C session (critique applied ahead of the Group D
> session), client-approved.** 12 surfaces → 8 screens + 2 sheets + 2 side-panels
> + 3 dialogs. Signature moments deferred out of D6 (§5.3). Decisions:
> - **Calendar** — **month view only.** The D2 1–2-week focused view is dropped
>   (client, 2026-09-08). One screen: month grid + Calendar/Agenda `SegmentedToggle`
>   + conflict flags. `CalendarSpanControl` (the 1wk/2wk span switch) is no longer
>   needed and drops out of the compose list; `‹ Today ›` navigation stays.
> - **Receipt detail** — **cut.** A receipt is auto-created on payment (INV-C4) and
>   has no content of its own. Each payment row on the Invoice detail shows its
>   receipt number + a Download / Share action. The receipt is a PDF (PDF track).
> - **Staff detail** + **Staff form** — **merged** into: Staff list (screen) +
>   Staff edit sheet (right-side `Sheet`, 4 fields — new / edit) + assignment
>   history as a side panel on the staff list. Same pattern as the Group A catalog
>   list + edit sheet.
> - **Clients list**, **Client detail**, **Client edit sheet** — **added.** Real
>   gap: `Client` is a core entity, `ClientPicker` is used everywhere, Client
>   detail exists as a D2 artboard but was in no D6 group, and there was no
>   Clients list. Client detail is the D2 tabbed screen (history / quotes /
>   invoices); the edit sheet matches the catalog pattern; new-client creation
>   stays inline in `ClientPicker` (no separate screen).
> - **Event detail** — kept, tabbed hub (overview / equipment / staff / documents /
>   expenses; P&L tab in Group E). Sharpen the distinction: **equipment tab** =
>   the bookings (committed units, dates, conflict status); **documents tab** =
>   the quote → DN → invoice → receipt chain with status + links. Not two views of
>   the same list.
> - **Delivery note detail** and **Invoice detail** — kept; the "generate" flow is
>   the draft state of each (−2 net-new screens, already in the plan).
> - **This group should split across two sessions** (see §3 session mapping):
>   **D-i** = the documents spine (Calendar, Event detail, Delivery note detail,
>   Invoice detail, Record payment dialog, Void-and-replace dialog); **D-ii** =
>   the lists + people (Invoices list, Staff list + edit sheet + history panel,
>   Clients list + Client detail + Client edit sheet, Staff assignment dialog).

**Screens (8):**
- **D1** Calendar — month grid + Calendar/Agenda toggle + conflict flags. Composes
  `PageHeader`, `SegmentedToggle`, `CalendarGrid` + `EventChip`, `AgendaDayGroup` +
  `AgendaEventRow`, `ConflictBanner` (day-cell pill + agenda inline), `EmptyState`.
- **D2** Event detail — tabbed hub (overview / equipment / staff / documents /
  expenses). `PageHeader` (+ status), `Tabs`, `DataTable`, `StatusBadge`,
  `AvailabilityBadge`, `ConflictBanner`, `EmptyState`, `Button`, `ConfirmDialog`
  (event cancel). New: `AssignmentRow` (staff tab).
- **D3** Delivery note detail — draft (= the "generate" flow) / issued / record-
  returns states. `PageHeader`, `LineItemRow` variant "document",
  `DocumentNoticeBanner` (voided), `ConfirmDialog` (issue), `Button`,
  `QuantityInput` (returns). Questionnaire generated alongside (PDF track, no state).
- **D4** Invoice detail — draft / issued / partially-paid / paid / voided states.
  `PageHeader`, `TotalsPanel` layout "statcards" (Invoice total / Paid to date /
  Balance — computed, INV-C5/C6), `LineItemRow` "document", `DocumentNoticeBanner`
  (void + replacement link), `ConfirmDialog` (issue / void). New: `PaymentRow`
  (payment line + receipt number + Download / Share).
- **D5** Invoices list — list-screen pattern (like C1). `PageHeader`, `StatusBadge`
  filter chips (issued / partially paid / paid / overdue / voided), `SearchInput`,
  client filter, `DataTable` (Ref · Client · Event · Issued · Due · Balance ·
  Status), `EmptyState`. Balance/status computed.
- **D6** Staff list — list-screen pattern + a side panel for assignment history.
  `PageHeader` (action "Add staff" → edit sheet), `SearchInput`, `DataTable`
  (Name · Role · Default day rate · Active), `Sheet` (right-side history panel:
  which events, days, wage paid), `EmptyState`.
- **D7** Clients list — list-screen pattern. `PageHeader` (action "New client"),
  `SearchInput`, `DataTable` (Name · Phone · Source · # quotes · Last activity),
  `StatusBadge` (source as a chip), `EmptyState`.
- **D8** Client detail — tabbed (history / quotes / invoices), the D2 artboard
  `1U2-0` as the starting point. `PageHeader` (+ source badge, actions Edit / New
  quote), Contact card, Notes card, `Tabs`, `DataTable`, `EmptyState`.

**Sheets (2):**
- Staff edit sheet — right-side `Sheet` (bottom sheet < md). Name · phone · role
  (`Select` `StaffRole`) · default day rate (`MoneyDisplay`-style input). New /
  edit modes. Deactivate via `ConfirmDialog`.
- Client edit sheet — right-side `Sheet`. Name · phone · email · source
  (`Select` `ClientSource`) · notes (`Textarea`). New / edit modes.

**Dialogs (3):**
- **Record payment** — `Dialog`. Amount (`QuantityInput`-style / money) · method
  (`Select` `PaymentMethod`) · date (`DatePicker`) · reference (M-Pesa code,
  optional `Input`) · note. Confirm names the action ("Record KES 60,000 payment").
  Auto-creates the receipt (INV-C4). Voice-enabled — per-dialog mic
  (`VoiceIntent.PAYMENT`), forward dep to Group F. Overpayment allowed → shows a
  credit, not blocked (`document-lifecycle.md` §7). States: resting · pending ·
  error · overpayment-notice.
- **Staff assignment** — `Dialog`. Staff member (`Combobox` over active staff,
  "create" inline) · role (`Select`) · day rate (prefilled from
  `defaultDayRateCents`) · days (`QuantityInput`) · a `ConflictBanner` if the
  person is already booked on an overlapping event. Confirm ("Assign Mwangi ·
  3 days · KES 4,500"). Creates a linked wage `Expense` (INV-E2). Voice-enabled
  (`VoiceIntent.STAFF_ASSIGNMENT`), forward dep to Group F. States: resting ·
  conflict · pending · error.
- **Void and replace** — one `ConfirmDialog` design + a copy table for 3 triggers
  (invoice / delivery note / payment reversal). Body states plainly what will
  happen; both the original and the replacement stay visible with their numbers
  (INV-I3, INV-N3). Confirm names the action ("Void INV-2026-0042"). A reason
  field (`Textarea`, required). States: resting · pending · error.

**New components proposed for Group D:** `PaymentRow` (D4), `AssignmentRow` (D2
staff tab / staff-list history panel). Both screen-function. Built in Paper +
logged.

### PDF template track (after Group D) — BUILT 2026-09-10

**Final set: five documents.** The packing checklist is CUT (client, 2026-09-10:
"why do we have a packing checklist? Let's just use the delivery note"). The
invoice is ADDED. Draft-PDF policy: Susan can generate a PDF at any stage, but
the face always tells the truth about its status (draft watermark + no ref
number; preliminary band; voided stamp + replacement).

- Quote PDF (letterhead from settings; draft / preliminary / continuation states)
- Delivery note PDF (name + qty only; issued / returns-recorded / voided / draft)
- Questionnaire PDF (no reference number; one face, hand-completed on site)
- **Invoice PDF** (plain commercial invoice — NO TAX; draft / unpaid /
  partially-paid / paid / voided / continuation)
- Receipt PDF (issued; reversed-payment voided variant)

### Group E — Money & records
- Expenses list (filter by event / category / month)
- Expense form (new / edit)
- Monthly summary / finance (income, expenses, profit)
- Document store (search-first; find any document by client / date / event /
  type)
- Data export (`/settings/export` — one flow)
- Event P&L (tab added to event detail)

### Group F — Voice
- Voice review shell (**signature moment ⑤**) — drawn wrapping the quote form
  (large) and the expense form (small); the other four intents are the same
  shell around forms that already exist
- Intent disambiguation (`UNKNOWN` → transcript + record-type buttons)
- Recording overlay (sheet — waveform, duration, cancel) — component states
- Queue sheet (pending captures, retry, discard) — component states

### Group G — Dashboard
- Dashboard `/` (**signature moment ②**) — replaces the PHASE-00 home. Designed
  from what the data supports: today's & this week's events, quotes awaiting a
  reply (aged), unpaid invoice balances, month-to-date earned, quick actions.
  Empty state ("nothing needs you today") is where the sunflower motif is
  trialled.

---

## 7. `D6 — New Components` manifest

Lives at `docs/delivery/D6-new-components.md`, created the first time a session
needs a new component. One row per component:

| Field | Content |
|---|---|
| Name | PascalCase, as it will land in `src/components/` |
| Forced by | The screen + group that required it |
| Purpose | One line |
| States | The full state list it needs in the gallery |
| Why not an existing component | What was tried, why it could not do it |
| Motion | If it carries a signature motion, the spec reference |
| Status | Proposed / Approved / Exported |

**Anticipated** (decided per screen — some may collapse into variants of
existing components):

- `AvailabilityHorizon` — the horizon/sparkbar graph (signature ①). Likely a
  sibling to `DayAvailabilityStrip`, or a new render mode of it.
- `AttentionRow` — a dashboard "needs you" row: aged quote / unpaid invoice with
  age + amount + jump link.
- `TodayTimeline` — the dashboard event-timeline spine with dots.
- `KpiFigure` — a large figure with count-up motion (signature ②/③). May be a
  motion variant of `MoneyDisplay` / `TotalsPanel` statcard.
- `QuickAddRow` — inline editable table row for catalog bulk entry.
- `VersionRail` — the quote version-history selector on quote detail.
- `LetterheadBlock` — the public-quote / PDF letterhead (signature ④).
- `TranscriptReveal` — the voice-review transcript with inline phrase highlights
  + the type-in / fly-out motion (signature ⑤). Likely extends `TranscriptPanel`.

None of these are committed. Each is proposed in its group's session and
approved or rejected there.

---

## 8. Status log

Append-only. Every D6 session adds an entry.

```
### 2026-09-08 · Planning
D6 plan written. Group order A→G fixed. Six signature moments approved and
documented in D6-signature-moments.md. Flow consolidations in §4 approved.
Motion dialed up (used throughout, not sparingly). Dashboard to be designed
from data, no client interview. New-component protocol: build in Paper +
log in the manifest, export at phase end. Session 1 (Group A) handoff drafted
in D6-session-01-handoff.md. No code touched.

### 2026-09-08 · Group A, Session 1 (in progress)
Paper page "D6 — Group A · Getting set up". Screens designed so far:
- A1 sign-in: three directions explored, "Split canvas" chosen; layout still WIP
  (client to send refinement notes). B and C explorations deleted.
- A4 Settings: 4 states × 2 breakpoints. FileDropField (new) drawn in all states
  incl. broken-image → typographic-wordmark fallback. First-run empty state.
- A5 Catalog list: rebuilt voice-first. 4 states + "Add items" menu variant × 2
  breakpoints. Richer 6-column table; the alignment defect (header vs rows) was
  found and fixed by building one column spec applied identically via cloning.
- A6 Catalog edit sheet: 5 desktop states (populated · loading · empty/new ·
  error · deactivate ConfirmDialog) + 4 mobile. Right-side Sheet on desktop,
  bottom sheet below md. Replaces the cut full-screen form.
- A7 Voice catalog review: in progress.

Deviations from §6 (all client-approved this session): catalog seeding is
voice-first (needs VoiceIntent.CATALOG_ITEM — see §10); the full-screen catalog
item form → a right-side sheet; the catalog item detail page → cut; the
availability-horizon trial (signature ①) → cut / deferred out of Group A.

Layout on the Paper page: one screen per horizontal row; within a row each state
is a 1440 desktop artboard immediately followed by its 390 mobile companion
(populated · loading · empty · error · then variants). A "Lane guide" strip at
the top marks the columns.

Docs touched: this file (§6, §8, §10), D6-new-components.md, D6-signature-moments.md.
No code touched. Status stays "Planning" until the client approves Group A.

### 2026-09-08 · Group B, Session 1 — APPROVED
Paper page "D6 — Group B · Daily inbound". Group B collapsed from 5 screens to 1
after client review (see §4, §6, §9b for the reasoning):
- **B1 Availability lookup** — designed and client-approved. 4 states × 2
  breakpoints (populated · loading · empty · error) + a Range-mode variant × 2
  breakpoints = 12 artboards. Empty has both sub-cases drawn (no catalog →
  EmptyState; no search match → DataTable's own empty). Composed entirely from the
  approved set — PageHeader, SegmentedToggle + DateRangeControl, SearchInput,
  DataTable (with a wide:true DayAvailabilityStrip column in Range mode),
  AvailabilityBadge, EmptyState. **No new components.** No availability
  chart/horizon (signature ① stays cut). Standalone screen, sidebar item — not
  merged into the Catalog list (different job / frequency).
- **Inquiries list + Inquiry capture** — CUT. `Inquiry` is instrumentation only;
  the 2 fields fold into the Group C quote builder. Pending "call them back" notes
  → a quick-note dialog + a Dashboard section (Group G). No `Inquiry` status enum
  needed. See §9b.
- **Damage/maintenance dialog + Adjustments list** — CUT. Damage/loss/maintenance
  = editing `CatalogItem.totalQuantity` on the Catalog list. `InventoryAdjustment`
  stays in the schema (unused in v1) — v1 availability is effectively
  `totalQuantity − bookings`. **Bends INV-A1 / INV-A7** — logged in §9b for
  orchestrator / backend ratification.

Table-alignment discipline applied (one column spec, cloned rows) on both the Day
and Range DataTables. Layout matches Group A: one screen per row, 1440 then 390
per state, lane guide strip at top.

Docs touched: this file (§4, §6, §8, §9b), D6-new-components.md. No code touched.
Status stays "Planning" until all groups are done.

### 2026-09-08 · Group C, Session 1 — APPROVED (client may bring refinements later)
Paper page "D6 — Group C · Quoting". Signature moments deferred out of D6 (§5.3 —
client). Group C = 3 screens + 1 dialog design (was 6 surfaces):
- **C1 Quotes list** — 4 states × 2 breakpoints (8 artboards). Status filter chips
  + client filter + SearchInput + DataTable (Ref · Client · Event date · Total ·
  Status) + EmptyState. Drafts render "(draft)" + em-dash total; terminal states
  (Declined / Superseded / Expired) use muted rows. Table-alignment discipline
  applied.
- **C2 Quote screen** (builder + detail merged) — 1440: editable-populated,
  locked+VersionRail, empty (blank new), loading, error, revise-sent variant
  (DocumentNoticeBanner "creates v2"), site-visit-confirm variant
  (DocumentNoticeBanner "creates final", preliminary toggle Yes→No) = 7 artboards.
  390: editable-populated (line items → cards with steppers, sticky action bar),
  locked variant = 2 artboards. Editable = full builder (ClientPicker, DatePicker,
  Select, Switch, inquiry-channel field, LineItemRow "quote" with over-availability
  warning, CatalogItemPicker add, TotalsPanel "ledger"). Locked = read-only doc
  table, VersionRail, lifecycle actions (Revise/Share/Accept/Decline) in header,
  ref-number title in mono. Per-form mic drawn (VoiceIntent.QUOTE → Group F,
  forward dep). TotalsPanel drawn static (③ deferred).
- **C3 Public shared quote** /q/[token] — mobile-first. 390: valid (LetterheadBlock
  + ruled line items as a financial instrument + sticky Accept), valid+preliminary
  variant (warning band + "Preliminary Quotation"), a states strip (expired /
  already-accepted / not-found). 1440: valid (centred 720px print-like sheet) = 5
  artboards. Accept → light ConfirmDialog. LetterheadBlock visual polish + reveal
  motion deferred (④).
- **C4 ConfirmDialog** — one board: 4 lifecycle variants (issue / accept / decline /
  site-visit-confirm) + availability-short state (ConflictBanner, "Issue anyway",
  writes AvailabilityWarning) + pending + error-stays-open + a copy table. Drawn
  as a plain confirm — ⑥ stamp-in ceremony deferred.

New components proposed (built as Paper bands pending — drawn in-context on C2/C3,
band artboards TODO): VersionRail, LetterheadBlock. Both screen-function, logged
in D6-new-components.md as Proposed.

Deviations from the §6 revision: none. Merges (C2+C3, C5→C4 ConflictBanner) were
pre-approved by the client this session.

Not yet drawn (next iteration): C2 loading/empty/error at 390; C2 revise-sent /
site-visit 390; C3 desktop preliminary + terminal states; the VersionRail and
LetterheadBlock 4U2-0-style component bands in a "Row 5 · New components" section.

Docs touched: this file (§5.3, §6, §8), D6-new-components.md. No code touched.
Status stays "Planning".

### 2026-09-09 · Group D, Session 1 — D-i built, NOT YET APPROVED (client feedback pending fixes)
Paper page "D6 — Group D · Running events & getting paid". D-i (the documents
spine) fully built: D1 Calendar, D2 Event detail, D3 Delivery note detail, D4
Invoice detail, Record payment dialog, Void-and-replace dialog. D-ii (lists +
people) not started.

- **D1 Calendar** — Calendar view (month grid) + Agenda view, 4 states each
  (populated/loading/empty/error), 1440 + 390. Agenda view was redesigned
  mid-session on client feedback: the first pass (flat AgendaDayGroup rows,
  faithful to the raw D3 component) read as too flat and thin at 1440. Explored
  three directions (Notion-Calendar-style timeline rail, grouped-by-week
  hierarchy, constrained-width card treatment); built and client-approved a
  hybrid — a vertical date-spine with dot markers, event cards with left accent
  bars in a constrained column, and a right-hand "at a glance" stats + conflict
  callout rail. This is now canonical for both breakpoints. No new components.
- **D2 Event detail** — populated (Overview canonical)/loading/empty/error + 4
  tab variants (Equipment/Staff/Documents/Expenses tabs drawn as screen-specific
  variants), 1440 + 390. P&L tab drawn greyed with a "coming in the finance
  module" affordance per spec (Group E territory, correctly out of scope here).
  Cancel event dialog (plain ConfirmDialog, 3 states) as its own titled row.
- **D3 Delivery note detail** — draft/issued/record-returns/voided/loading/error,
  1440 + 390 (draft state drawn for mobile, establishing the card + sticky-action
  pattern the other states inherit). DocumentNoticeBanner used on voided.
- **D4 Invoice detail** — draft/issued/partially-paid/paid/voided/loading/error
  (all 5 InvoiceStatus-derived states + loading/error), 1440 + 390. Overpayment
  shown as a green credit line (document-lifecycle.md §7), never as an error.
- **Record payment dialog** — empty/resting/overpayment-notice/pending/error, one
  board, 5 states.
- **Void-and-replace dialog** — one ConfirmDialog design, 3 triggers (invoice /
  delivery note / payment reversal) × resting/pending/error, plus the copy table,
  matching Group C's C4 pattern.

**New components: none required.** PaymentRow and AssignmentRow were both
anticipated in D6-plan.md §6 but the premium bar did not require either —
PaymentRow composes as a plain bordered row (amount, method, reference, receipt
link, download action) and AssignmentRow as a standard DataTable row. Decided
per the "compose first" test at each point of use. D6-new-components.md updated
to record this explicitly rather than leaving it silent.

**Client review (2026-09-09) — NOT YET APPROVED.** Four items raised, to be
addressed at the start of the next session before D-ii starts:
1. TotalsPanel "statcards" layout is not premium enough as separate bordered
   cards — redesign as one unified strip with thin hairline dividers between
   figures, no per-figure border/gap. Component-level fix (propagates to D4's 7
   states + D2 Overview's "at a glance" card).
2. Printable documents (delivery note, invoice) — confirmed as the existing PDF
   template track (D6-plan.md §3, "slotted in after Group D"), not a D6 screen
   task. Action pattern: "Download PDF" only (no separate Print button — the
   downloaded PDF opens in-browser with print built in). D-ii's D5 Invoices list
   should carry the same Download affordance consistently.
3. Voice-mic affordance gap: D2's "Log expense" action has no VoiceIntent.EXPENSE
   mic drawn, despite the enum existing (data-model.md §9) and other per-form
   mics being drawn elsewhere (Record payment, Staff assignment). Needs the same
   per-dialog/per-form mic treatment. Same question applies to D7/D8 client
   creation in D-ii — check when built.
4. Confirmed as correctly out of scope: the P&L tab (Group E, not Group D).

Docs touched: this file (§8, §9d), D6-new-components.md. No code touched. Status
stays "Planning". D-i is NOT approved — approval gate blocked on items 1–3 above.

### 2026-09-09 · Group D, Session 2 — D-i fixes APPROVED, D-ii starting
All three D-i fix items resolved and client-approved:
1. **TotalsPanel "statcards"** redrawn as one unified strip — single border,
   thin hairline dividers between figures, no per-card border/gap. Fixed on the
   component band (4U2-0) and propagated to D4's 7 states (draft/issued/
   partially-paid/paid/voided/loading/error, desktop + mobile) — the amber
   partial-balance and green paid-credit colour treatments both verified intact
   against the hairline dividers. D2 Overview's "At a glance" card checked and
   **left unchanged** — it is a single-card vertical stat list (one border, no
   per-row boxing already), a genuinely different pattern from the horizontal
   statcards strip, not the pattern the client's feedback targeted.
2. **Voice-mic affordance** added to D2's Expenses tab "Log expense" action —
   same VoiceMicButton pill used on Record payment, same placement convention.
   Forward-dependency note added to the D2 row-title card.
3. **Download PDF** added to D3 Delivery note detail's issued and voided
   headers, matching D4's placement/label exactly (draft/record-returns
   correctly get nothing — no document yet).

Noted for the record, not actioned (out of this fix's scope): D6-plan.md §9d's
claim that D4 already had "Download PDF" on issued/partially-paid/paid/voided
was inaccurate — only the paid state actually had it before this session; now
also on voided (task 1) but issued/partially-paid still do not carry it. Flagging
only; not fixed here since it wasn't part of the client's three items.

D-ii (lists + people) starting: D5 Invoices list, D6 Staff list + edit sheet +
assignment-history panel, D7 Clients list, D8 Client detail + edit sheet, Staff
assignment dialog.

### 2026-09-09 · Group D, Session 2 — D-ii built
D-ii (lists + people) fully built on the same page, continuing the row grid
from D-i (Row 8 onward):

- **D5 Invoices list** — populated / loading / empty / error (1440) + populated
  (390, cards, no FAB — nothing to create here). PageHeader has no primary
  action; a muted hint points back to the event. StatusBadge filter chips (All /
  Issued / Partially paid / Paid / Overdue / Voided) — Overdue is a derived
  filter, not a stored status (INV-C6), noted on the row-title card. DataTable:
  Ref (mono) · Client · Event · Issued · Due · Balance (mono, computed) ·
  Status. Voided rows render muted.
- **D6 Staff list** — populated with the assignment-history side panel open
  (canonical) + a panel-closed variant (full-width table) + loading / empty /
  error (1440) + populated (390, cards). DataTable: Name · Role · Default day
  rate (mono) · Active. History panel: events worked, days, wage paid, newest
  first, with an Edit affordance into the edit sheet.
- **Staff edit sheet** — empty (new, blank) / populated (edit, pre-filled) /
  error (inline danger banner, values preserved) states, right-side Sheet over
  a dimmed backdrop. Fields: Name, Phone, Role (Select), Default day rate.
  Deactivate via a small ConfirmDialog (own titled row) — never hard-deleted
  (INV-I5).
- **D7 Clients list** — populated / loading / empty / error (1440) + populated
  (390, cards, FAB for "New client" since there's a real create action here).
  DataTable: Name · Phone (mono) · Source (chip) · Quotes (count) · Last
  activity (relative date).
- **D8 Client detail** — populated (History tab canonical, chronological feed:
  quotes/events/invoices/payments) / loading / empty (brand-new client —
  Contact filled, Notes empty, tab EmptyState, canonical not a gap) / error
  (1440). Left column: Contact card + Notes card (Edit affordance). Right:
  History / Quotes / Invoices tabs. Header: source chip, Edit + New quote
  actions. Mobile behaviour specified on the row-title card (single column,
  Contact + Notes stack above a tab scroll-strip) rather than a drawn artboard,
  given session scope — flagged in §10 below, not silently skipped.
- **Client edit sheet** — empty (new) / populated (edit) states, same pattern
  as the Staff edit sheet. Fields: Name, Phone, Email (optional), Source
  (Select, ClientSource), Notes (Textarea). Deactivate affordance present
  (client deactivation, never deleted).
- **Staff assignment dialog** — resting / empty (confirm disabled) / conflict
  (ConflictBanner, warns not blocks) / pending / error, one board, 5 states.
  Per-dialog mic (VoiceIntent.STAFF_ASSIGNMENT), Combobox-style staff field,
  Role select, Day rate (prefilled), Days stepper. Confirm names the action and
  totals live: "Assign {name} · {days} days · KES {total}". Caption notes the
  automatic linked wage Expense (INV-E2).

**New components: none required.** Every D-ii screen composed from the
approved set (DataTable, PageHeader, StatusBadge, Sheet, ConfirmDialog,
ConflictBanner, EmptyState) plus the VoiceMicButton pill pattern already
established in D-i. D6-new-components.md unchanged for this session.

Docs touched: this file (§8, §10 below), D6-new-components.md unchanged
(nothing to add). No code touched.

### 2026-09-09 · Group E, Session 1 — Money & records, built and APPROVED

Client approved all Group E screens (2026-09-09), including the mid-session
fixes: E2 as a right-side Sheet (not a screen), the Finance section tab strip
(Option A), user-owned expense categories (Option C), the added Settings nav
item for E5, and the E2 sheet-render + wrong-content bug fixes. §9e recommendations
1–4 stand for D7.

**Group F handoff drafted:** `D6-session-07-handoff.md`. One scoped exception
to §5.3 approved by the client this session: the recording overlay's visual
identity (idle/recording state) gets real design exploration — 2–3 directions,
presented, picked — because it was never actually designed (only "waveform,
duration, cancel" was ever specified) and a generic pulsing-record-dot fails
the premium bar. Scope is narrow: only that one screen's resting/recording
visual; the review shell, disambiguation, and queue sheet all stay under the
standard one-line-motion-note rule. Signature moment ⑤ (voice review's
type-in / fly-out) remains fully deferred, unchanged.

### 2026-09-10 · Group F, Session 1 — Voice, built (pending client approval)

Paper page **"D6 — Group F · Voice"**. Signature moment ⑤ deferred out of D6
(§5.3) — Group F designs a functional review shell, not the type-in / fly-out
ceremony. **No new components** (two variants of existing components proposed —
see §9f and `D6-new-components.md`). The 4 planned surfaces, all composed from
the four D3 voice composites (`VoiceMicButton`, `VoiceReviewField`,
`VoiceQueueIndicator`, `TranscriptPanel`) plus `Sheet` / `ConfirmDialog` /
`EmptyState` / `PageHeader` and the two wrapped forms (C2 Quote, E2 Expense):

- **F1a Voice review shell · Quote** (the large case) — the C2 Quote screen
  cloned onto the Group F page, pre-filled, with a `TranscriptPanel` right rail.
  6 states × 1440 per `voice-pipeline.md` §8's failure table: populated ·
  all-confident · flagged · extraction-failed · saving · error. 2 states × 390
  (populated · extraction-failed). Header actions reduced to **Discard** +
  **Save quote** (INV-V1 — button states what it does). Breadcrumb "Quotes /
  Voice review". **Settings** nav item added to the cloned sidebar (was missing
  from the C2 clone — Group E's §9e addition).
- **F1a · Client variant** (1 artboard) — `VoiceIntent.CLIENT` has no standalone
  form (creation is inline in `ClientPicker`). The shell wraps a minimal card
  (Name / Phone / Email / Source / Notes — the `ClientPicker` inline-create
  field set), confirm reads "Save client". Sidebar Clients active. §9f GAP.
- **F1b Voice review shell · Expense** (the small case) — the E2 right-side
  `Sheet` cloned, pre-filled, `TranscriptPanel` as a card at the top of the
  sheet body (no room for a side rail in a Sheet). 2 states × 1440 (flagged ·
  extraction-failed); populated / all-confident / saving / error follow F1a and
  are not redrawn. Mobile = the existing E2 390 sheet + transcript card + inline
  flags, not a separate artboard. Confirm reads "Save expense".
  PAYMENT / STAFF_ASSIGNMENT reuse this identical shell around the Record
  payment / Staff assignment dialogs (Group D) — referenced, not redrawn.
- **F2 Intent disambiguation** (`UNKNOWN`) — full screen, sidebar on whichever
  screen the global mic was pressed (drawn Dashboard-active). `TranscriptPanel`
  prominent + "What was this?" + a row of record-type buttons: **Quote ·
  Expense · Payment · Staff assignment · New client**. `DAMAGE_REPORT` is
  deliberately NOT offered (see §9f decision). 2 states × 1440 (the-ask ·
  nothing-picked → "kept as a note on your voice queue") + 1 × 390.
- **F4 Queue sheet** (`voice-pipeline.md` §6, INV-V6 — the one offline surface).
  Opened from the `VoiceQueueIndicator` badge. 390 bottom-sheet primary, 4
  states (has-items — one ready to review + one waiting to upload · empty ·
  failed-item — STT failed, Retry offered · all-retrying) + 1 × 1440 anchored
  popover off the shell "Voice capture" control.
- **F3 Recording overlay** — the one named exploration exception (client,
  2026-09-09). 3 directions for the recording-state visual drawn side by side
  (A live waveform · B breathing ring · C duration-as-anchor); **client chose
  Direction A** (thin monochrome accent-only waveform, real amplitude, duration
  above). Built into all F3 artboards: idle ("Tap to speak") · recording (A) ·
  too-short (silent / under ~1s rejected client-side, "Try again" —
  `voice-pipeline.md` §8) · processing ("Transcribing…"). 390 bottom-sheet
  primary + 1440 anchored popover. Everything else drawn plainly.

**Client design feedback resolved mid-session (2026-09-10):**
1. The first flagged-field treatment (a full bordered warning card wrapping the
   field) broke the field grid's spacing. Redrawn as an **inline** treatment:
   the input border turns warning, a small `⚠ CHECK THIS` / `NO MATCH` tag sits
   above the label, helper text below — no wrapping box, the field keeps its
   grid slot. Applied across F1a/F1b. This is a `VoiceReviewField` "inline"
   variant vs the boxed D3 gallery version — logged in §9f and
   `D6-new-components.md` as a proposed variant, not a new component.
2. **Re-record was a gap** — if a transcript is garbage, Susan's only options
   were "fix it all by hand" or "Discard the whole draft". Added a **Re-record**
   control to the `TranscriptPanel` on every review state (a small ghost button;
   a prominent accent "Record it again" on the extraction-failed state and in
   F2). It routes to F3, and on return the new transcript + new extraction
   **replace** what's on the screen; a `ConfirmDialog` gate first if she has
   already hand-edited a field. Every attempt is retained on `VoiceCapture`
   (INV-V8) — the screen just shows the latest. Logged in §9f and
   `D6-new-components.md` as a proposed `TranscriptPanel` "with-re-record"
   variant (an added action slot, not a new component).
3. **F3 / F4 sheet framing** — the first pass drew the recording overlay and
   queue sheets on short artboards with a fixed grey scrim block above, reading
   as a rectangle rather than "the app dimmed." Rebuilt as proper bottom sheets:
   full 390×844 phone frames, a dimmed app screen behind a translucent scrim,
   the sheet flush to the bottom edge — the same framing as the A6 / E2 edit
   sheets. Content unchanged.

Layout matches every prior group page: one screen = one horizontal ROW, 1440
then 390 per state, a "Lane guide" strip at the top, a left-hand row-title card.
Rows on a 1400px vertical pitch; F3's 3-direction exploration strip sits above
its state row.

Docs touched: this file (§8, new §9f), `D6-new-components.md`. No code touched.
Status stays "Planning".

### 2026-09-10 · Group F, Session 1 — Voice, APPROVED

Client reviewed and approved all Group F screens, including the mid-session
fixes: the inline `VoiceReviewField` treatment, the `TranscriptPanel` Re-record
control, Direction A for the recording state, and the F3 / F4 bottom-sheet
framing rebuild + the 1400px-pitch page tidy. §9f recommendations stand for D7
(the `DAMAGE_REPORT` exclusion and `CLIENT` gap are design-decided; the two
component variants and the static phrase cross-ref are D7 / moments-pass items).

**Group G handoff drafted:** `D6-session-08-handoff.md`. Group G (Dashboard) is
the last screen group; it is designed from the data-model, not a client
interview, and drawn as a plain screen — signature moment ② (the assemble-itself
load) is a later pass. The sunflower motif may be trialled in the "nothing needs
you today" empty state, proposed not shipped. After Group G, one D6 session
remains: the PDF template track.

### 2026-09-10 · Group G, Session 1 — Dashboard, built (pending client approval)

Paper page **"D6 — Group G · Dashboard"**. Designed from the data-model (§4), not
a client interview. **No new components.** One screen (the Dashboard at `/`) +
one supporting dialog (the quick-note dialog, client-approved Option A).

**Layout redesigned mid-session after client rejection.** The first pass was a
"list of lists" — five near-identical stacked cards in a two-column split; the
client rejected it ("looks very poorly designed… it needs to look like a
dashboard"). We agreed a spec together before rebuilding: a **hero + triage**
layout. Bands top to bottom:
1. Greeting strip — "Good afternoon, Susan" + date, New quote / Log expense.
2. **Money hero** — a tinted full-width accent band: Invoiced · Expenses ·
   **Profit** (largest, green) for the month (INV-E1/E3) + a 6-bar profit trend
   (trailing 6 months, current month marked) + a hairline and a derived "Next
   payment in: KES {n} from {client}, due in {d} days" line → E3.
3. **Triage grid** — three *differentiated* tiles: **Today & tomorrow**
   (`AgendaEventRow`-style, setup time + venue + status + inline clash flag →
   D2), **Follow up** (the loud tile — a count badge + amber/red; two labelled
   sub-groups kept separate per the client: "Quotes awaiting a reply" — SENT
   oldest-first, age derived §9c → C1; and "Unpaid invoices" — computed
   `balanceCents` INV-C5, worst first, Overdue derived INV-C6 → D5), **This week**
   (a 7-day Mon–Sun strip with a dot per event / red dot on a clash day + a
   "Next 4 events" list).
4. **Waiting on you** — a thin full-width strip: `Inquiry` rows with no
   `convertedQuoteId` from the quick-note dialog · channel · "how long ago" ·
   Start a quote. The strip's label block carries a **"+ Log a call"** action —
   the quick-note dialog's only entry point. When the strip is collapsed (nothing
   waiting) the action moves to that line.

Desktop fits one viewport, no scroll. Mobile (390) is a priority stack: greeting
→ money hero → **Follow up** (urgent first on mobile) → Today & tomorrow → This
week → Waiting on you.

**Charts allowed for Group G (client, 2026-09-10) — a reversal of a logged
decision.** `D6-new-components.md` records `AvailabilityHorizon` rejected twice
by the client (2026-09-08), and the Group G handoff generalised that to "the
Dashboard gets NO chart." The client lifted that for Group G specifically:
charts are allowed here where they aid the one-second glance (not analytical —
E3 stays the analytical surface). Committed: the 6-bar profit trend in the hero
+ the 7-day week strip. A **3-way trend-visual comparison strip** (6 bars ·
area sparkline · sparkline-with-baseline) is drawn above Row 1 as a decision aid
(the F3 "3 directions" precedent). **Resolved 2026-09-10: the client chose
A (6 bars).** B / C stay on the comparison strip as documented alternatives; the
hero uses 6 bars. The sunflower-motif "nothing needs you" artboard is likewise
**resolved — the client chose the plain green check**; the motif version is kept
on the page relabelled "rejected" as a record. Logged here so a later session
does not "fix" the chart back out.

**Quick-note dialog** — drawn as Row 2 (client-approved Option A: it was never
drawn in any prior group and "Waiting on you" has no source without it). A small
`Dialog` — Client (`ClientPicker` + inline create) / How they got in touch
(`Select` over `InquiryChannel`) / What they want (`Textarea` → `rawDescription`)
+ a `receivedAt` caption. Creates an `Inquiry` with `convertedQuoteId` null;
nothing issued. **Voice-enabled for v1 (client, 2026-09-10):** a `Voice` pill in
the header, same pattern/placement as the Group D Record-payment and
Staff-assignment dialogs; routes to the Group F voice-review shell wrapped around
this dialog. This needs a new `VoiceIntent.INQUIRY` value — §9g, moved from a v2
GAP to **do-now**. 3 states side by side (resting · pending — Voice pill dimmed,
fields locked, spinner on Save · error — inline danger banner, values preserved)
+ a 390 bottom sheet with the Voice pill in its header. Drawn on a light ground
like Group D's dialogs, not a full-screen scrim.

**States (7 artboards + the dialog + the comparison strip):** populated (1440 +
390) · loading (1440, skeleton per region) · empty — first run (1440 + 390:
zeroed money hero + flat trend + a 3-step onboarding path) · empty — nothing
needs you, **plain** (1440 + 390: money hero keeps real figures, each triage
tile shows a green-check cleared line, Waiting on you collapses, "all caught up"
pill by the greeting; This week stays populated — upcoming events are ambient,
not urgent) · empty — nothing needs you, **SUNFLOWER MOTIF trial** (1440: same
as plain, the cleared-state icon swapped for a restrained 8-petal sunflower mark
in `warning-solid` ochre — the §5.3 "empty-state icon only, prototype-then-judge"
trial; drawn plain first, this is the second version, **presented not shipped**)
· error — one region failed (1440: the money hero shows an inline "Couldn't load
this month's figures · Retry", the triage tiles still render).

**Motion:** one-line note only — sections settle on the shared curve on load; the
staggered assemble-itself sequence + the trend/figure count-up are signature
moment ② and a later pass (§5.3).

**Deviations from the page convention:** the artboard grid is not the strict
"1440 then its 390 immediately" interleave used by prior groups — the 1440
states sit on the top row, the 390 states on a second row below, the dialog on a
third. The lane guide was rewritten to match. Noted so the reviewer isn't
thrown; the content and state coverage are complete.

Docs touched: this file (§8, new §9g), `D6-new-components.md` (nothing to add —
stated explicitly). No code touched. Status stays "Planning".

### 2026-09-10 · PDF template track — built (pending client approval)

Paper page **"D6 — PDF templates"**. The last piece of D6 — print layout for the
five documents the business hands to clients. Not interaction design: fixed A4
pages at 595×842 pt, one rendering path per document, no states/responsive/motion
beyond the status treatments. Composed from the token set — Fraunces proposed as
`--font-display` for the wordmark (§9h), one accent, money in Geist Mono tabular
at the render boundary (INV-M1/M5), line items render the snapshot (INV-P2).

Built (each as its own row, state variants side by side):
- **Row 0 · Letterhead** — the shared `LetterheadBlock` (print projection) in
  four states: logo present · wordmark fallback (reuses the A4 `FileDropField`
  broken-image behaviour) · preliminary band + watermark · draft ref-slot
  placeholder. Identity row (logo/wordmark + contact) → 1.5 pt accent rule →
  parties & dates block. Issuer identity carries **no KRA PIN / tax line**.
- **Row 1 · Quote** — issued (final) · draft (watermark, no ref, INV-N5) ·
  issued + preliminary · continuation page. Sections: letterhead → line-item
  table (Description / Qty / Unit price / Amount) → totals (Subtotal / Delivery
  fee / Discount / TOTAL / Deposit to confirm / Balance on delivery) → terms +
  a physical acceptance signature line → footer. Same document as the C3 public
  shared quote — kept consistent with it.
- **Row 2 · Delivery note** — issued (pre-delivery) · issued + returns recorded ·
  voided (+ replacement notice) · draft. Table is Item / Qty delivered / Qty
  returned / Condition on return (last two are ruled blanks for hand-write). NO
  prices. Delivery acknowledgement block (Received by / Signature / Date / Phone)
  + property note. No totals block.
- **Row 3 · Questionnaire** — one face, no states, no reference number. Lighter
  letterhead (title EVENT SIGN-OFF) → setup checklist (checkbox rows) → client
  feedback → sign-off block. Regenerated transiently from event data; not
  persisted (§9h).
- **Row 4 · Invoice** — draft · issued (unpaid) · partially paid · paid (PAID
  stamp) · voided (+ replacement) · continuation page. **Plain commercial
  invoice — NO tax row, no PIN, no "TAX INVOICE" title** (system-overview §8).
  Totals: Subtotal / Discount / TOTAL / Amount paid / BALANCE DUE (computed,
  INV-C5/C6; balance is the emphasised figure once partly paid — carried in
  words, not colour). Payments-received list + **How to pay** block (placeholder
  content — §9h GAP).
- **Row 5 · Receipt** — issued (one clean face; the payment amount is the hero
  figure + amount in words + invoice-standing ledger) · reversed-payment voided
  variant (payment + receipt voided together, document-lifecycle §7). No draft
  receipt.

**Client design feedback resolved mid-session (2026-09-10):**
1. Document title made **big and bold** (20 px / 700, was a 13 px letter-spaced
   label) — "that's how these documents are". Applied to the letterhead band and
   all five documents.
2. **Vendor credit line added to every footer** — "Designed by
   https://lobstertechnologies.co.ke/", 6.5 px muted, far right below the page
   number. Client's reason: these documents get photocopied around corporate /
   government procurement offices and are a referral channel. Client chose
   **Option A (fixed in the template)**; the Option-B alternative (an
   `Organization.documentCredit` setting Susan controls) is logged in §9h.

**`LetterheadBlock` finalised** — moves from Proposed to built in
`D6-new-components.md`: one component, two projections (`app` = the C3 public
shared quote, `print` = these PDFs), like `PageHeader`'s desktop/mobile split.
The `4U2-0`-style band is the Row 0 artboards. No other new components — the
faces are composed from tokens (one small print-only sub-block, `DocumentTotals`,
noted in the manifest as an option for D7, not required).

Docs touched: this file (§6, §8, new §9h, §10), `D6-new-components.md`. No code
touched. Status: **D6 is complete** pending client approval of this track and
the post-D6 signature-moments pass.

--- ORIGINAL BUILD ENTRY (kept for the record) ---

### 2026-09-09 · Group E, Session 1 — Money & records, built (pending client approval)

Paper page **"D6 — Group E · Money & records"**. Signature moments deferred out
of D6 (§5.3). Group E = 5 screens + 1 tab, all composed from the approved set —
**no new components**.

**Navigation resolved (client, this session).** The build-plan implied one
"Finance" sidebar item for three destinations. Adopted **Option A**: the sidebar
"Finance" item lands on **E3 Overview**; **Overview / Expenses / Documents** is a
tab strip on all three screens — the D2/D8 `Tabs` pattern, no new component.
Drawn on each populated state (desktop + a compact mobile strip); loading /
empty / error inherit it. Logged as a §9e GAP.

**Forms are Sheets, not screens (client, this session).** E2 rebuilt as a
right-side `Sheet` over the dimmed Expenses list (bottom sheet < md), matching
the A6 Catalog / D6 Staff / D8 Client edit sheets. The other four surfaces stay
full screens (lists + a dashboard, not forms).

**Expense categories are user-owned (client, this session — Option C).**
`ExpenseCategory` should move from a Prisma enum to a per-org table, created
inline in the E2 category picker (the `ClientPicker` "create inline" pattern).
No dedicated "Manage categories" screen in v1 (rename/reorder → v2). The E1
filter chips and E2 picker are drawn as examples; the set is hers. Logged as the
top §9e GAP (schema decision — backend ratifies).

Screens:
- **E1 Expenses list** — `/expenses` (Expenses tab). 4 states × 1440
  (populated ~7 rows mixing Manual / Voice / Wage (auto); loading skeleton;
  empty; error) + 390 populated (cards, FAB). Cloned from D5's list shell,
  reworked to the expenses column spec (Category · Description · Event · Amount
  mono-right · Date · Source). Source is plain inline text — no pills, matching
  the D2 Expenses tab. Wage-auto rows carry a muted row tint (INV-E2). PageHeader
  action "Log expense" → E2 sheet, with a `VoiceMicButton` pill
  (`VoiceIntent.EXPENSE`). Table-alignment discipline applied.
- **E2 Expense sheet** — `/expenses/new`, `/expenses/[id]/edit`. Right-side
  `Sheet`. States: editing · wage-derived (read-only) · saving · error, + 390
  full-height form. Wage-derived variant: a `DocumentNoticeBanner` explains the
  lock, fields are read-only except a free-text note, footer is "Save note /
  Back to assignment" — the screen must not imply a wage expense can drift from
  its `StaffAssignment` (INV-E2). Category field is the inline-create Combobox.
  Event field's first option is "General business expense — not tied to an
  event" (the nullable `eventId` as a visible choice). Per-form mic
  (`VoiceIntent.EXPENSE` → Group F).
- **E3 Monthly summary** — `/finance` (Overview tab, the Finance landing). 4
  states × 1440 (populated; loading skeleton; empty "Nothing recorded for
  {month} yet"; error) + 390 populated (vertical stat-stack). `TotalsPanel`
  unified hairline strip (Invoiced revenue · Expenses · Profit — computed,
  INV-E1/E3, green positive) + a month picker (‹ September 2026 ›) + one
  `DataTable` category breakdown. No second table (the "top events" list was
  cut — one breakdown, calmer layout). **No chart.** `TotalsPanel` fit the
  existing unified-strip layout cleanly — no new layout variant.
- **E4 Document store** — `/documents` (Documents tab). 4 states × 1440
  (populated 7 rows including delivery notes + receipts; loading; empty "Nothing
  matches that search"; error) + 390 populated (cards). **Reframed:** this is
  the *only* surface anywhere for delivery notes and receipts (the plan cut
  Receipt detail and any DN list); quotes/invoices are just also-findable here.
  Prominent `SearchInput` + Type / Date range / Client filters + `DataTable`
  (Type · Ref mono · Client · Event · Date · Status) + per-row "Download PDF".
  StatusBadge colours: DN/receipt "Final" green, "Issued"/"Sent" blue, "Voided"
  grey, invoice "Partly paid" amber.
- **E5 Data export** — `/settings/export`. **Settings-area, not Finance.** Added
  a **Settings nav item** (gear icon) at the bottom of the primary sidebar nav,
  below Finance — the sidebar had no Settings entry before; it is active on E5.
  Not in the Finance tab strip. (Verify placement against the A4 Settings screen
  in D7.) States: resting · preparing (progress) ·
  ready (download card) · error, + 390 resting. Export shape per build-plan
  PHASE-04: a ZIP of CSVs + PDFs. Single-column action screen — checklist of
  what's included, optional date range, "Prepare export" → "Download ZIP". Not
  a wizard.
- **E6 Event P&L tab** — the one sanctioned cross-page edit. Added a new
  `D2 · Event detail · 1440 · variant: P&L tab` artboard on the Group D page
  (next to the other four tab variants), un-greyed the P&L tab on it. Composes
  `TotalsPanel` unified strip (Invoiced revenue · Expenses · Profit) + the
  event's expense list scoped (E1's `DataTable` shape, Source column kept so
  wage rows read as not-double-counted). Profit drawn as a read-out (INV-E3).
  Before/after screenshots taken; flex-grow stretch bug checked (none). D2
  row-title card updated.

New components: **none.** Anticipated place (E3's three-figure layout) fit
`TotalsPanel` cleanly. `D6-new-components.md` updated to state this explicitly.

Sidebar active-state bug found and fixed: the D5-clone carried the "Invoices"
underline + bold alongside the new "Finance" active state on E1's first
artboards; corrected on all E1 states.

Docs touched: this file (§8, §9e), D6-new-components.md. No code touched.
Status stays "Planning".

---

## 9. Reading list for a D6 session

Only these. Do not read the whole `docs/` tree.

- This file (`D6-plan.md`) — the phase mechanic and constraints
- `D6-signature-moments.md` — the six creative pieces
- `D6-new-components.md` — the running manifest (once it exists)
- `../conventions/design-system.md` — §1 (D6), §2 token layers, §3–11 the token
  vocabulary, §12 (adding a component), §13 rules
- `../conventions/ui-conventions.md` — §1 (the approved component set), §2 the
  gallery, §3 handoff, §4 responsive, §5 screen patterns, §6 voice UI, §7 a11y
- `../architecture/domain-invariants.md` — the invariants the screens must
  respect at the component level
- The architecture doc for the group in play:
  - A: `data-model.md`
  - B: `inventory-availability.md`
  - C: `document-lifecycle.md`, `inventory-availability.md`
  - D: `document-lifecycle.md`, `data-model.md`
  - E: `document-lifecycle.md` §8, `ops/runbook.md` (export)
  - F: `voice-pipeline.md`
  - G: `data-model.md` (what the dashboard can actually show)
- Paper: file `01M1X43Q66HDD6TF72TYYWH3KE` — page "D3 — Components", artboard
  `4U2-0` (the approved set). Pull exact component values with `get_jsx`, never
  from a screenshot. D6 screens go on new pages, one per group.

---

## 9a. Recommendations — Group A, Session 1

> **[GAP] `VoiceIntent.CATALOG_ITEM` — a new enum value**
> The catalog-seeding UX was redirected to voice-first (client, 2026-09-08).
> `prisma/schema.prisma`'s `VoiceIntent` enum has no value for "add to catalog",
> so a spoken catalog batch has nowhere to route and falls to `UNKNOWN`. This
> makes the approved A7 (Voice catalog review) impossible to build against
> anything real.
> Cost: S — one enum value + a migration + an extraction prompt that pulls
> `{name, quantity, unitPriceCents, unitLabel, category}` from a sentence + the
> A7 review screen (already being designed).
> Recommendation: **do now** — approved by the client this session. Add the enum
> value in D7 when the voice module is built; the D6 A7 screen is designed
> against it.

---

## 9b. Recommendations — Group B, Session 1

> **[GAP] v1 availability drops `InventoryAdjustment` — INV-A1 / INV-A7 bent**
> Client review (2026-09-08): stock "rarely increases or decreases", no
> damage/maintenance tracking requested. Group B cut the damage dialog and the
> adjustments list. Damage/loss/maintenance is now handled by editing
> `CatalogItem.totalQuantity` on the Catalog list. Consequence: v1 availability is
> effectively `totalQuantity − bookings`; the `InventoryAdjustment` term in
> `inventory-availability.md` §1 has no data behind it because nothing writes the
> rows. `InventoryAdjustment` is kept in `schema.prisma` (removing it churns the
> availability query + tests 3, 4, 10 in §9) but is unused in v1.
> This contradicts INV-A7 ("marking units damaged removes exactly those units for
> the stated period, not the whole item") — a `totalQuantity` edit is not
> time-boxed, is not reversible cleanly, and mis-reports availability for future
> date ranges once the stock is repaired.
> Cost: S to accept as-is (keep the schema, skip the UI, keep the adjustment term
> in the query as a no-op). M if the client later wants it back (the B4 dialog +
> B5 tab designs in this session's chat log are the starting point).
> Recommendation: **orchestrator / backend to ratify.** If ratified: mark INV-A7
> "deferred, not in v1" in `domain-invariants.md`, note the no-op adjustment term
> in `inventory-availability.md` §1, and keep `getAvailability` shaped so the term
> can be re-activated without a migration. Do not delete `InventoryAdjustment`.

> **[GAP] `Inquiry` has no workflow surface — capture folds into the quote builder**
> Group B cut the inquiries list and the inquiry capture form. `Inquiry` exists
> only for the inquiry→quote elapsed-time metric (`receivedAt` → `Quote.issuedAt`,
> `data-model.md` §2). Group C's quote builder must therefore capture `channel`
> and `receivedAt` inline (top of the form) and create the `Inquiry` row when the
> quote is first saved, linking `Quote.inquiryId`. A "logged a call, can't quote
> yet" path is a small quick-note dialog (client + `rawDescription` + channel →
> creates an `Inquiry` with no quote) surfaced on the Dashboard (Group G) as
> "Waiting on you". No `Inquiry` status enum is needed (there's no list to show it
> in) — derive New / Quoted from `convertedQuoteId` if the Dashboard section ever
> needs it.
> Cost: S — two fields + one create call in the Group C builder; the quick-note
> dialog is ~1 `Dialog` + 3 inputs.
> Recommendation: **do in Group C / Group G.** Note the dependency on the Group C
> and Group G handoffs. `VoiceIntent` still has no `INQUIRY` value — irrelevant
> now that voice inquiry capture is not a Group B screen; revisit only if the
> quick-note dialog is made voice-enabled.

---

## 9c. Recommendations — Group C, Session 1

> **[GAP] Quote "expiry age" and "days since sent" are not stored — the list needs them**
> C1 shows "Sent · 3d" / "Sent · 6d" so Susan can see which quotes are going stale,
> and C3 shows "expired on {date}". `Quote` has `issuedAt` and `validUntil`
> (`data-model.md` §4) so both are derivable at read time — no schema change. But
> the quote list query (`Quote(organizationId, status, eventDate)` per
> `data-model.md` §11) is ordered by event date, not by "needs attention". For the
> phone-call workflow the useful default sort on C1 is **Sent quotes by age
> descending** (oldest waiting first), then everything else. Cost: S — a computed
> sort key in the list repository. Recommendation: do in D7 when C1 is built.

> **[IMPROVEMENT] The public-quote "Accept" needs a server-confirmed identity signal**
> C3's Accept button is on an unauthenticated page (INV-T4). Accepting creates an
> Event and commits inventory (`document-lifecycle.md` §3) — a real commitment.
> The light ConfirmDialog is drawn, but there is no way to know *who* clicked.
> Options: (a) accept on the click and trust the opaque token as sufficient proof
> (the token already scopes to one quote and expires); (b) capture a name +
> optional phone on the confirm step and store it on `Quote.acceptedByName` (a new
> nullable field). The PRD does not require signature capture. Recommendation:
> **(a) for v1** — the token is the proof, matching how WhatsApp quote links work
> elsewhere; note it for the client. If they want (b) later it is one nullable
> column.

> **[GAP] `VoiceIntent.QUOTE` exists but the quote form's voice affordance has no
> defined review target yet**
> C2 draws the per-form mic (`VoiceIntent.QUOTE` is in `data-model.md` §9, so
> unlike the Group B inquiry gap this one is real). The mic routes to the Group F
> voice review shell, which is not designed until Group F. This is a forward
> dependency, not a gap in the enum — flagging so the Group F handoff knows the
> quote form is one of its two canonical review targets (the other being the
> expense form, per `D6-plan.md` §6 Group F). Cost: none now. Recommendation:
> carry into the Group F handoff.

---

## 9d. Recommendations — Group D

> **[GAP] TotalsPanel "statcards" layout reads as generic, not premium — client
> feedback, 2026-09-09**
> Three separate bordered cards with gaps between them (Invoice total / Paid to
> date / Balance) is a stock dashboard-card pattern, not a considered one at the
> premium bar this project targets. Client's direction: one unified strip,
> sections divided by thin hairlines, no per-figure border or gap — closer to how
> Stripe/Linear present an invoice summary.
> Cost: S — this is a `TotalsPanel` "statcards" layout change (one approved D3
> component), so it is fixed once and propagates everywhere the layout is used:
> D4's 7 states (draft/issued/partially-paid/paid/voided/loading/error) and D2
> Event detail's Overview "at a glance" card, which uses the same figure-strip
> idea informally.
> Recommendation: **do first, next session**, before touching D-ii. Redraw the
> component band, then re-screenshot every D4 state + D2 Overview to confirm the
> propagation, before any new D-ii work begins.

> **[GAP] Voice-mic affordance missing on D2's "Log expense" action**
> `VoiceIntent.EXPENSE` exists in the enum (`data-model.md` §9) and other
> voice-enabled actions in this group correctly carry a per-form/per-dialog mic
> (Record payment → `VoiceIntent.PAYMENT`, Staff assignment →
> `VoiceIntent.STAFF_ASSIGNMENT`), but D2's Expenses-tab "Log expense" action does
> not. The global sidebar mic is always reachable in principle, but the
> per-action mic is what makes the *specific target* obvious to Susan on a given
> screen, and this is the pattern used consistently everywhere else voice applies
> — leaving it off here is an inconsistency, not a deliberate omission.
> Cost: S — one mic icon + label affordance on the action, same treatment as the
> other two dialogs (forward dependency to Group F for the actual review shell,
> per the established pattern).
> Recommendation: **do next session**, before D-ii. Also check D7 "New client"
> and D8 client-creation flows in D-ii when built — client creation is a
> plausible voice target and should get the same affordance check rather than
> being decided ad hoc per screen.

> **[GAP confirmed, already scheduled] Printable documents (delivery note,
> invoice) — client asked how this is handled, 2026-09-09**
> Confirmed this is not a D6 screen-design gap: the PDF template track is already
> positioned in the plan (§3, "a separate lighter track... slotted in after Group
> D") and shares a visual language with the public shared quote (signature moment
> ④, `LetterheadBlock`, proposed in Group C). Screens only need the *affordance*
> — D4 already has "Download PDF" on issued/partially-paid/paid/voided states; D3
> Delivery note detail should get the same button (not yet added — check at the
> start of next session) and D-ii's D5 Invoices list should carry it per-row or
> on click-through consistently.
> Decision on the action pattern (client-facing): **Download PDF only, no
> separate Print button** — a downloaded PDF opens in the browser's PDF viewer,
> which already has print built in; a second button duplicates that affordance
> for no gain.
> Recommendation: **do not design the PDF documents themselves in D6.** Keep the
> template track as its own dedicated session after Group D, per the existing
> plan. Do add the missing "Download PDF" button to D3 at the start of next
> session, since it's a same-pattern one-line fix, not a template-design task.

---

## 9e. Recommendations — Group E

> **[GAP] `ExpenseCategory` is a Prisma enum — Susan cannot own her own categories**
> `data-model.md` §11 defines `ExpenseCategory` as a compile-time enum (`FUEL
> REPAIRS MATERIALS WAGES TRANSPORT PERMITS OTHER`). Susan cannot add "Generator
> hire" or "Tent cleaning" without a code change and migration — and she will
> hit that the first time an expense doesn't fit. Client decided (this session):
> promote it to a **per-org table** (`ExpenseCategory` model: `id`,
> `organizationId`, `name`, `sortOrder`, `archivedAt`), seeded with the 7
> defaults, **created inline in the E2 category picker** (the `ClientPicker`
> "create inline" pattern — no dedicated screen). Archived categories stay valid
> on old rows (INV-I5). Rename/reorder and a "Manage categories" settings screen
> are v2. `ItemCategory` for the catalog has the same limitation — out of scope
> here, note it for whoever revisits catalog.
> Cost: M — new model + migration + the E2 Combobox + the E1/E3 filters read
> from the table. Recommendation: **do now** (backend to ratify the schema in
> D7); the D6 E1/E2 screens are designed against it.

> **[GAP] Wage-derived `Expense` editability is undefined**
> `document-lifecycle.md` §8 says a wage `Expense` carries a unique
> `staffAssignmentId` and that uniqueness prevents double-counting (INV-E2), but
> never says which fields Susan may edit on one. E2's wage-derived variant is
> designed as **read-only except a free-text note** — category locked to WAGES,
> amount and the staff link bound to the `StaffAssignment`; changes go through
> the Staff assignment dialog. This is inferred, not written.
> Cost: S — one sentence in `document-lifecycle.md` §8 + the read-only variant
> (already drawn). Recommendation: **do now** — ratify the rule when the finance
> module backend is built.

> **[GAP] Settings has no nav entry point on record**
> A4 Settings exists and E5 Data export lives at `/settings/export`, but the
> sidebar as drawn through Group D has no "Settings" item and no doc states how
> Settings is reached. E5 **adds a Settings nav item** (gear icon) at the bottom
> of the primary nav, below Finance, and marks it active — the conventional
> place, and it needs to be reachable for a route under `/settings/`. This
> should be confirmed against the A4 Settings screen (A4 may have assumed a
> different entry point) and stated in `ui-conventions.md` §5 so every future
> screen's sidebar carries it. Cost: S. Recommendation: **do now** — reconcile
> with A4 in D7, add the item to the app-shell component, note it in §5.

> **[GAP] The Finance section's internal navigation was not specified**
> The build-plan lists one "Finance" sidebar item but Group E has three Finance
> destinations (Expenses list, Monthly summary, Document store). Resolved this
> session (Option A): the sidebar item lands on Overview; an
> Overview / Expenses / Documents tab strip (the D2/D8 `Tabs` pattern) sits on
> all three. Logging it because the mechanic was a design decision, not
> something the handoff or build-plan covered — the D7 Finance-module handoff
> needs to carry it so the routes are shaped consistently
> (`/finance`, `/finance/expenses` or `/expenses`, `/finance/documents` or
> `/documents`). Cost: none now (drawn). Recommendation: **carry into the D7
> Finance handoff.**

> **[LATER] The export CSV column schema isn't pinned anywhere**
> `build-plan.md` PHASE-04 says "ZIP of CSVs plus PDFs"; `docs/ops/runbook.md`
> (referenced by the E-group reading list) **does not exist yet**. D7 will need
> the exact columns per CSV and the ZIP's internal folder layout before the
> export action can be built, and the restore-drill deliverable (INV-D2) depends
> on a known format. Cost: S now / M if discovered mid-build. Recommendation:
> **do next phase** — write `ops/runbook.md` with the export shape and restore
> drill table when the PHASE-04 backend starts.

---

## 9f. Recommendations — Group F

> **[GAP] `VoiceIntent.DAMAGE_REPORT` routes to a form that no longer exists**
> The enum keeps `DAMAGE_REPORT` and `voice-pipeline.md` §4's discriminated
> union still routes to it, but Group B (§9b) cut the damage/maintenance dialog
> — damage handling is now "edit `CatalogItem.totalQuantity` on the Catalog
> list," which is not a voice-fillable form. A capture that extracts as
> `DAMAGE_REPORT` has nowhere to land.
> **Decision (this session, design call): exclude it.** F2's disambiguation
> button set does NOT offer "Damage report"; a capture the model tags as
> `DAMAGE_REPORT` is treated as `UNKNOWN` — the transcript is persisted (INV-V3)
> and shown on F2, and Susan routes it herself (most often she keeps it as a
> queue note and edits `totalQuantity` on the Catalog list manually). Offering a
> button that dead-ends is worse than not offering it. Nothing is ever lost.
> Cost: S — the clean backend follow-through is removing the `DAMAGE_REPORT`
> enum value and its union arm in D7, and having the router fall to `UNKNOWN`
> for that class of transcript. Recommendation: **do now** (design side is done
> — F2 already omits it); backend removes the enum value + union arm in D7 when
> the voice module is built, or keeps it inert and never surfaces it.

> **[GAP] `VoiceIntent.CLIENT` has no standalone form for the review shell to wrap**
> Client creation lives inline in `ClientPicker` (`ui-conventions.md` §1); there
> is no `/clients/new`. F1a's `CLIENT` variant is drawn as the transcript rail +
> a minimal inline card (Name / Phone / Email / Source / Notes — the
> `ClientPicker` inline-create field set), confirm "Save client". It satisfies
> INV-V1/V3 without inventing a screen, but it is a bespoke card rather than a
> reused form. Cost: S — in D7, promote the **Client edit sheet** (Group D) to
> also serve as this voice target, so the `CLIENT` review reuses a real form the
> same way `QUOTE` reuses C2 and `EXPENSE` reuses E2. Recommendation: **do in
> D7** — the D6 F1a Client variant is the visual spec; wire it to the Client
> edit sheet component rather than a one-off card.

> **[IMPROVEMENT] `VoiceReviewField` needs an "inline" variant — the D3 boxed
> version breaks a field grid**
> The D3 gallery `VoiceReviewField` wraps the flagged field in a padded
> `warning-subtle` box with its own border. On a real review screen with a
> multi-column field grid (F1a's client / date / venue / preliminary row) that
> box shoves the field out of its slot and makes the whole row lurch — client
> flagged this directly this session. F1a/F1b now use an **inline** treatment:
> input border → `warning-solid`, a small `⚠ CHECK THIS` / `NO MATCH` tag above
> the label, helper text below, no wrapping box, field keeps its grid width. The
> boxed version still reads fine for a single stacked field (e.g. the E2 sheet's
> one-column layout). Cost: S — add an `inline` prop / variant to
> `VoiceReviewField` in D7, keep the boxed one as the default for stacked forms.
> Recommendation: **do in D7** — logged in `D6-new-components.md` as a variant,
> not a new component.

> **[IMPROVEMENT] `TranscriptPanel` needs a Re-record action slot —
> mistake-proofing the transcription**
> As drawn in D3, `TranscriptPanel` is display-only. If a transcript comes back
> garbled, Susan's only paths are "correct every field by hand" or "Discard the
> whole draft" — there is no "let me say that again." Client asked for this
> directly. F1/F2 now put a **Re-record** control in the transcript panel (small
> ghost button; a prominent accent "Record it again" on the extraction-failed
> state and F2). It reopens F3; the new transcript + new extraction replace
> what's on the review screen; a `ConfirmDialog` gates the replace if she has
> already hand-edited a field. Every attempt is retained on `VoiceCapture`
> (INV-V8) — the screen shows only the latest. Cost: S — add an optional
> `onReRecord` action slot to `TranscriptPanel` in D7 + the replace-confirm
> dialog copy. Recommendation: **do in D7** — logged in `D6-new-components.md`
> as a variant. (Not `TranscriptReveal` — that was the deferred signature-moment
> component for the type-in / phrase-highlight; this is just an action slot.)

> **[LATER] Static phrase cross-referencing in the transcript is still unbuilt**
> `voice-pipeline.md` §5 wants an uncertain field flagged **both** in the form
> and cross-referenced to its source phrase inside the transcript. F1a/F1b do
> the form half (inline `VoiceReviewField`); the transcript half — statically
> highlighting the phrase the model was unsure about — is not drawn. It was not
> required for the shell to function and the animated version is signature
> moment ⑤ (frozen). Cost: S for the static highlight alone (a `TranscriptPanel`
> variant that accepts phrase ranges + a severity). Recommendation: **do in the
> post-D6 moments pass** alongside ⑤, or earlier in D7 as a static-only
> `TranscriptPanel` enhancement if the moments pass slips.

---

## 9g. Recommendations — Group G

Max five, ranked.

> **[GAP] The Dashboard needs a computed "invoice attention" read model**
> The money hero's "Next payment in: KES {n} from {client}, due in {d} days" is
> the soonest-due `Invoice` with a non-zero computed `balanceCents` (INV-C5), and
> the "Follow up · Unpaid invoices" list is ordered worst-first (overdue by
> `dueDate`, then largest balance). `data-model.md` §11 gives the quote-list index
> but no invoice-attention index, and `balanceCents` is computed from `Payment`
> rows so "soonest-due unpaid" is not a plain indexed sort. Cost: S — a Dashboard
> read model that computes balance + due-status per invoice for the org and
> returns the worst few. Recommendation: **do in D7** — it is the same
> computation D5 and D4 already need, just aggregated.

> **[GAP] The 6-month profit trend needs trailing-month aggregates**
> The hero's 6-bar trend is profit (invoiced revenue − expenses, INV-E1) per
> calendar month over the trailing six — a read-time computation over a wider
> window than any existing screen (E3 is one month at a time). Cost: S — a
> grouped aggregate over `Invoice.totalCents` (issued) and `Expense.amountCents`
> by month. Recommendation: **do in D7**. A nightly-rolled summary table is a v2
> optimisation, not a v1 need — six months of one small business's data is a
> trivial scan.

> **[GAP] `VoiceIntent.INQUIRY` — a new enum value (client-approved for v1, 2026-09-10)**
> The quote/expense/payment/staff forms all carry a per-form mic; the client
> asked for the same on the quick-note dialog ("logged a call, wants tents for a
> December graduation" is exactly the kind of hands-busy capture voice is for).
> `VoiceIntent` (`data-model.md` §9) has no `INQUIRY` value and `voice-pipeline.md`
> §4's discriminated union has no arm for it, so today a spoken call-note would
> fall to `UNKNOWN` and the F2 disambiguation screen (which doesn't offer "Log a
> call" either). This resolves the open question Group B §9b left ("revisit only
> if the quick-note dialog is made voice-enabled" — it now is). The D6 dialog is
> drawn with the `Voice` pill in place (Group D placement/pattern) as the visual
> spec. Cost: S — one enum value + a migration + a `voice-pipeline.md` §4 union
> arm + an extraction prompt that pulls `{clientName, channel, rawDescription}`
> from a sentence + wiring the dialog as a Group F review target (the same way
> `QUOTE`→C2 and `EXPENSE`→E2 are wired). Recommendation: **do now** — add the
> enum value + union arm in D7 when the voice module is built; the Group F
> voice-review shell picks up the dialog as a third canonical target.

> **[IMPROVEMENT] Promote the trend bar / week strip to components only if a second use appears**
> The 6-bar profit trend and the 7-day week strip are drawn as screen-local
> inline SVGs (the Group D `PaymentRow` "compose first" precedent). Both are
> small and plausibly reusable (a trend bar on E3; a week strip on D1's agenda
> rail). Cost: S. Recommendation: **do in D7 if a second use appears** —
> otherwise leave them screen-local; not worth a component band on spec. The
> 3-way comparison strip on the page is the reference for whichever trend
> treatment the client confirms.

> **[LATER] Signature moment ② is the Dashboard's whole personality — prioritise it in the moments pass**
> The Dashboard is drawn plain per §5.3. The staggered load, the profit figure
> counting up, and the trend / week-strip drawing in are moment ② — the thing
> that makes this screen feel considered rather than merely functional. The plain
> screen is deliberately holding back. Recommendation: **do in the post-D6
> moments pass, first or second in the queue** — "the first thing Susan sees
> every morning" is exactly where invested motion earns its place.

---

## 9h. Recommendations — PDF template track

Max five, ranked. The §5 gaps from the handoff become these.

> **[GAP] `Organization` has no payment-details field — an invoice cannot tell
> the client how to pay**
> A proper commercial invoice states the M-Pesa paybill / till, bank account,
> and cheque payee. `Organization` has `name`, `phone`, `email`, `addressLine`,
> `logoStorageKey`, `defaultCurrency`, `quoteValidityDays`,
> `depositDefaultPercent` — nothing for payment instructions. The invoice PDF
> needs a "How to pay" block; it is drawn with placeholder content.
> Recommendation: add **`Organization.paymentInstructions Text?`** — one
> free-form block Susan fills in Settings once, rendered verbatim on the
> invoice. Cost: S (one column + one Settings field + one render block).
> **Do now** — backend ratifies in D7; the D6 invoice is designed against it.

> **[GAP] `DocumentType` has no `QUESTIONNAIRE` value**
> The enum is `{ QUOTE  DELIVERY_NOTE  INVOICE  RECEIPT }`. The questionnaire is
> a form, not a commercial document: it carries no money, allocates nothing from
> `DocumentCounter`, and is deterministic from event data.
> Recommendation: **do not add it to the enum.** Generate the questionnaire
> transiently on demand and do not persist it as a `DocumentFile`. If a stored
> copy is ever wanted, that is a v2 decision (`DocumentType.QUESTIONNAIRE` + a
> nullable `documentId`). Cost: S to decide, none to build. **Do now** (decide).

> **[IMPROVEMENT] `LetterheadBlock` — finalise as one component, two projections**
> Still "Proposed" in `D6-new-components.md` with no dedicated band. It is now
> built (the Row 0 artboards). Make it **one component with an `app` vs `print`
> projection**, like `PageHeader` — not a separate `DocumentLetterhead`. The
> public shared quote (C3) and the quote PDF are the same document and must not
> diverge; one component with a projection prop prevents that structurally.
> Cost: M (the component + the four §12 promotion consequences). **Do now** —
> recorded in `D6-new-components.md` this session.

> **[IMPROVEMENT] A serif display token for the letterhead wordmark**
> The client wants "very well branded". The only brand asset is `logoStorageKey`
> (an image) with a typographic fallback. The fallback wordmark reads more
> high-end in a serif — the PDFs are drawn with **Fraunces** (already loaded in
> the Paper file). This is a `--font-*` token addition per `design-system.md`
> §13, used **only** for the wordmark fallback; everything else stays Geist /
> Geist Mono. Cost: S (one `@theme` line + registering the font with
> `@react-pdf/renderer`). **Do now if approved** — otherwise the wordmark is
> Geist 600 and nothing else changes.

> **[GAP] `Client` has no address field — a proper invoice / delivery note shows
> the client's address**
> The parties block on the invoice and delivery note has a "Bill to" / "Deliver
> to" address line with nowhere to read it from. `Client` has `name`, `phone`,
> `email?`, `contactPersonName?`, `source`, `notes?`, `active` — no address.
> Recommendation: add **`Client.addressLine String?`**, surfaced in the Client
> edit sheet (Group D). The templates render the line when present and omit it
> when absent, so this is not blocking. Cost: S. **Do next phase** (D7 client
> module).

**Also noted, not decisions (fix-and-note in D7):**
- The vendor credit line is **Option A (fixed in the template)** per the client.
  The alternative is **Option B** — an `Organization.documentCredit Text?`
  setting (defaults to the Lobster line, Susan can edit or clear it). Option B
  is the more conventional call (the client owns their document) and still gets
  the referral by default; raise it with the client once more before D7 hard-codes A.
- A small number-to-words helper in `lib/` for the receipt "amount in words".
- The standard terms / footer / property-note copy strings want a
  `lib/documents/copy.ts` constant, agreed with Susan before launch.

---

## 10. Definition of done — D6

- [x] Every screen in every group designed at 390px and 1440px
- [x] Every screen has loading / empty / error / populated designed
- [x] Every screen composes from the approved set or from a logged new component
- [ ] The six signature moments are each drawn with a motion storyboard + spec
      — DEFERRED to the post-D6 moments pass (§5.3, client)
- [ ] `D6-new-components.md` is complete; every entry is Approved or Rejected
      — `LetterheadBlock` now built/finalised; remaining entries pending client sign-off
- [ ] Approved new components are exported to `src/components/`, `/dev/gallery`,
      a `4U2-0` band, and `ui-conventions.md` §1 — D7 task
- [x] The PDF template track is designed
- [ ] Each group has a status-log entry and a recorded approval
      — status-log entries done for every group + the PDF track; PDF-track and
      Group F/G approvals still pending
- [ ] The full set has been walked with Susan — the post-D6 signature-moments
      pass is where the full set (screens + these documents) is walked together
