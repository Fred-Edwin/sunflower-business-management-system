# PHASE-00B / D4–D5 — Orchestrator handoff

Paste the block below into a fresh session. It is the **orchestrator** handoff:
that session writes `docs/delivery/phases/PHASE-00B.md`, then drives the
implementation and the D5 reconciliation. PHASE-00B is infra-shaped (no domain
logic, no schema, no business modules) so it does **not** use the 4-session
backend/frontend split — see "Session shape" below.

---

## HANDOFF PROMPT

```
You are the orchestrator for PHASE-00B (design system in code) of the Sunflower
Events BMS. This phase is stages D4 and D5 of design-system.md §1. D0–D3 are
complete. PHASE-00A (scaffold) is complete. Your job: write
docs/delivery/phases/PHASE-00B.md from PHASE-TEMPLATE.md, then drive the build
and the D5 reconciliation to exit.

READ FIRST, in order
- CLAUDE.md — hard rules, invariants 1–10, "Working on a phase"
- docs/delivery/build-plan.md — "PHASE-00B · Design system in code" + the
  "Design and build interleave" section
- docs/architecture/domain-invariants.md — §1 money, §9 voice (component-level
  enforcement only; there is no data layer in this phase)
- docs/conventions/design-system.md — §1 (D4/D5 steps), §2 token layers, §3–11
  the token vocabulary, §12 (adding to the set), §13 rules
- docs/conventions/ui-conventions.md — §1 (the approved composite set — THIS IS
  THE BUILD LIST), §2 the gallery, §3 handoff, §4 responsive, §5 screen
  patterns, §6 voice UI, §7 a11y
- docs/conventions/coding-standards.md — §2 layout / no barrels, §7 money, §8
  dates, §13 dependencies
- docs/architecture/inventory-availability.md — §7 (DayAvailabilityStrip
  worst-day encoding, ratified 2026-09-07)
- docs/delivery/D3-worklog.md — the whole file. D3.2 locked decisions, D3.4
  normalize-back, D3.5 §12 promotion table, and the 4 carried-forward
  recommendations (Rec #1 is RESOLVED; #2 and #4 are yours to fold into the
  contract; #3 and #5 are parked).
- docs/delivery/phases/PHASE-00A.md — §5 task list + §8 gotchas (shadcn `-b
  radix`, `shadcn` is a runtime dep, globals.css imports shadcn/tailwind.css)

PAPER (read, do not edit unless D5 finds drift)
File 01M1X43Q66HDD6TF72TYYWH3KE, page "D3 — Components", artboard
"D3 — Components (Approved Composite Set)" (id 4U2-0). 22 composite bands, each
drawn in all states. This artboard is the visual build target for every Tier 2
component. The three "shadcn block restyle — spec cards" (Sidebar / login-form /
DataTable) carry exact chrome values — pull them with get_jsx on that band.

STATE OF THE CODEBASE
- Tokens are already in src/styles/globals.css as a Tailwind v4 @theme block
  (D1). They match the Paper theme — confirm equivalence, do not re-derive.
- shadcn/ui is initialised at DEFAULT styling. Nothing is restyled yet.
  src/components/ui/ and src/components/ exist; src/modules/ is empty.
- lib/money.ts, lib/dates, lib/env, lib/errors, auth, db all exist and are
  tested. Do not touch them.

WHAT PHASE-00B BUILDS (put this in PHASE-00B.md §2 Scope, §5 Contract, §6)

1. Confirm tokens. globals.css @theme vs the Paper theme in get_basic_info.
   Any mismatch is fixed in globals.css (code is the source of truth from D1 on)
   and noted in §7. No new tokens — adding one to solve a component means the
   scale is wrong (design-system §13.7).

2. Tier 1 — restyle every shadcn primitive to tokens. The list in
   ui-conventions.md §1: Button, Input, Textarea, Select, Combobox, Checkbox,
   RadioGroup, Switch, Badge, Card, Dialog, Sheet, Popover, Tooltip, Table,
   Tabs, DropdownMenu, Calendar, DatePicker, Toast, Skeleton, Separator,
   ScrollArea. RESTYLE EVERY STATE, not just resting: hover, :focus-visible
   (2px bg + 4px ring, design-system §10), disabled, active, aria-invalid, and
   every Radix data-state. A primitive that keeps shadcn's default hover is a
   defect. Keyboard nav and ARIA stay as Radix ships them. No business logic in
   these — they stay generic.

3. shadcn blocks — take, restyle, demote to Tier 2 (ui-conventions §1 "shadcn
   blocks"):
   - Sidebar — the app shell starts here. Collapsible state, keyboard shortcut,
     mobile Sheet fallback, persistence all kept. Restyle to the spec on the
     Paper "Sidebar" spec card: 240px panel, linear-gradient(in oklab 160deg,
     chrome-gradient-start 0%, chrome-gradient-end 60%), nav item pad 9px/10px,
     16px icon slot, gap 10, active = ghost underline (1px bottom border
     chrome-active-underline, text+icon -> chrome-text, weight 600, no fill),
     footer 1px chrome-border rule + Voice-capture pill (#00000033 bg, 1px
     chrome-border ring, VoiceQueueIndicator danger badge) + user row. Strip
     the demo nav and teams switcher.
   - login-form — restyle to tokens, 44px controls, accent primary. Strip demo
     copy and any social-login row. Wire /sign-in to it.
   - DataTable — keep the sort / column-visibility / row-selection plumbing.
     The premium table styling AND the mobile card fallback are ours — build to
     the DataTable band: 1px border container, header on surface-sunken with a
     border-strong bottom rule, labels 11px/600/0.03em uppercase, 32px rows,
     hairline dividers, numeric columns right-aligned Geist Mono, sort caret on
     the active column. Below md the whole table projects to CARDS — the ONE
     contract (D3.2 #3): row -> 1px-border card, primary line (14 semibold) +
     secondary (13 muted), right-aligned figure block, then a 2-up label/value
     grid; a column may set wide:true to render as a horizontally-scrolling
     strip inside the card (the ONLY permitted horizontal scroll) — this is
     where DayAvailabilityStrip sits. States: populated, sorted, loading
     (skeleton rows), empty (hands off to EmptyState).
   Once a block lands it is ours: no upstream tracking, it is Tier 2, it goes in
   /dev/gallery with all its states.

4. Tier 2 — build the approved composite set. EVERY entry in ui-conventions.md
   §1, built from Tier 1, referencing SEMANTIC TOKENS ONLY (never a primitive
   token, never a raw hex — design-system §13.1/§13.2). Each has a drawn target
   on artboard 4U2-0 in every state. The set:
     MoneyDisplay, QuantityInput, StatusBadge (+ DocumentStatusBadge,
     AvailabilityBadge wrappers), DayAvailabilityStrip, ClientPicker,
     CatalogItemPicker, SearchInput, LineItemRow (variant quote|document|voice),
     TotalsPanel (layout ledger|statcards), PageHeader, DataTable, EmptyState,
     ConfirmDialog, ConflictBanner, DocumentNoticeBanner, VoiceMicButton,
     VoiceReviewField, VoiceQueueIndicator, TranscriptPanel, SegmentedToggle,
     DateRangeControl, CalendarSpanControl, CalendarGrid, EventChip,
     AgendaDayGroup, AgendaEventRow.
   Fold in during the build:
   - MoneyDisplay: integer KES cents in, formatMoney() at the render boundary
     only (INV-M1/M5), tabular-nums always, handles zero / negative (credit) /
     null (em dash) / loading. prop: prefix.
   - DayAvailabilityStrip: worst-day encoding per inventory-availability.md §7
     (worst day = byDay entry == minAvailable; warning-subtle tint when below
     the checked quantity, success-subtle otherwise, border-strong outline,
     ties to earliest day).
   - PageHeader: add an optional capturedAt slot (D3-worklog Rec #2 — the Voice
     Review 1440 "Captured 3:42 PM" chip becomes this, or is dropped; decide
     when PageHeader is on the bench).
   - ClientPicker / CatalogItemPicker / SearchInput: share one internal
     <SearchableList> so the popover, keyboard nav, and empty/loading states
     are defined once (D3-worklog Rec #4). Do not expose SearchableList as a
     public composite.
   - VoiceReviewField / TranscriptPanel / VoiceQueueIndicator: honour INV-V3
     (transcript always visible, never behind a disclosure) and INV-V5 (flag
     is a border + uppercase label + icon, never colour alone).
   - ConflictBanner (INV-A6 warn-not-block, no link) vs DocumentNoticeBanner
     (INV-I3, always a forward link) — two components, do not merge.

5. /dev/gallery — a dev-only route rendering EVERY component in EVERY state and
   variant (resting, hover, focus, disabled, loading, error, empty,
   long-content overflow) as SEPARATE static instances via a forced-state prop
   (data-force-state="hover"), not real hover. Excluded from production builds.
   This is what D5 exports to Paper and what future frontend agents screenshot.

6. App shell + nav, responsive. Server Components by default; 'use client' as
   low as possible. Nav state / mobile drawer from the Sidebar block. Home (/)
   stays a plain landing page. Navigate it at 390px and 1440px.

OUT OF SCOPE for PHASE-00B (state in §2)
- Any screen beyond /sign-in, the shell, / and /dev/gallery. No Clients,
  Quotes, Invoices, Calendar, Availability, Voice screens — those are D6/PHASE-1+.
- All business tables, modules, Prisma models, server actions, AI SDK, PDF,
  cron, Playwright specs.
- The shared-quote public view /q/[token] (D3-worklog Rec #5 — D6).
- Buffer days (inventory-availability §8).

CONTRACT (§5). This phase has no schema and no server actions. The "contract"
is the component inventory: the exact Tier 1 list, the 3 blocks, the Tier 2
list with each component's props and variants (copy them from ui-conventions
§1), and the gallery's state matrix. Fixed once committed; a change is made in
§5 first and recorded in §7.

INVARIANTS IN PLAY (§4) — component-level enforcement, since there is no data
layer yet:
  INV-M1/M5  MoneyDisplay: cents in, formatMoney() at render boundary, never a
             formatted string from a domain fn
  INV-M5     tabular-nums on every money / quantity / reference number
  INV-P2     LineItemRow document/quote variants render snapshot values only —
             no catalog join implied by the component API
  INV-I2     LineItemRow document variant is read-only always
  INV-A6     ConflictBanner warns, never blocks; no forward link
  INV-I3     DocumentNoticeBanner always carries the forward link
  INV-V3     TranscriptPanel always visible, never behind a disclosure
  INV-V5     VoiceReviewField flag = border + label + icon, not colour alone
  INV-T4     login-form is the only unauthenticated surface touched here

SESSION SHAPE
PHASE-00B collapses the 4-session model (it is infra, like 00A). Plan it as:
  Session 1 (you, now): write PHASE-00B.md — §1–5 + one implementation handoff
    prompt in §6. Commit it. The contract comes before implementation.
  Session 2: implementation — items 1–6 above. Append work log to §7,
    recommendations to §10. `pnpm verify` must pass. Do not disable a check or
    modify an invariant test.
  Session 3 (you, fresh context): D5 — export 3–4 gallery components to Paper
    over MCP, screenshot the same components from the running gallery, compare.
    If they match, MCP is trusted for D6. If they drift, note it and use the
    Snapshot path. Reconcile any component that disagrees with artboard 4U2-0 —
    resolve once, here. Then review the whole phase against §4 invariants and
    §8 acceptance criteria, set Status: Complete, write the D5 record into §7.

ACCEPTANCE (§8)
- globals.css tokens confirmed against the Paper theme
- Every Tier 1 primitive restyled in every state; no shadcn-default state left
- 3 blocks restyled, demoted to Tier 2, in the gallery
- Every Tier 2 composite from ui-conventions §1 built, semantic tokens only,
  matching its band on 4U2-0
- /dev/gallery renders every component in every state as forced-state instances,
  excluded from production
- App shell navigable at 390 and 1440
- `pnpm verify` passes
- D5 fidelity check done; drift reconciled

CLOSE (your session, now)
- Write docs/delivery/phases/PHASE-00B.md. Status: Planning.
- Commit it (branch first if on master/main).
- Post a ## Recommendations block (max 5, ranked). Check D3-worklog's carried
  recommendations first — do not repeat #3 or #5, they are already parked with
  a plan.
- Hand off session 2 with the §6 prompt.
```

---

## Notes for whoever pastes this

- **Rec #1 is done** — `inventory-availability.md` §7 now carries the worst-day
  encoding. The prompt references it as ratified.
- **Rec #2 and #4** are folded into the build instructions above (PageHeader
  `capturedAt` slot; shared `SearchableList`). The orchestrator writes them into
  the §5 contract so they are not lost.
- **Rec #3 and #5** are parked — the prompt tells the orchestrator not to
  re-raise them.
- The D3 artboard and `D3-worklog.md` are the spec. Nothing in PHASE-00B is a
  fresh design decision; it is translation to code.
```
