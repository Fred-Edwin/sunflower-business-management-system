# Build Plan

**Current phase:** PHASE-01 · Clients, catalog and availability (PHASE-00B
complete — design system in code, D4/D5, 2026-09-08)
**Last updated:** 2026-09-08

> Update the line above when a phase completes. Every agent session reads it to
> know where the project stands.

---

## How this works

The system is built in **phases**. A phase is a vertical slice: schema, backend,
and screens together, ending in something Susan can do in a browser. There are no
infrastructure-only phases. Infrastructure is built inside the phase where it
first becomes visible.

This is deliberate. Progress is judged by what the user can do, not by what
exists in the repository.

### Three roles, four sessions per phase

| Session | Role | Produces |
|---|---|---|
| 1 | Orchestrator | `PHASE-NN.md` — contract, plan, both handoff prompts |
| 2 | Backend | Domain, repository, actions, invariant tests |
| 3 | Frontend | Screens composed from existing components |
| 4 | Orchestrator (fresh context) | Review pass against the invariants |

Session 4 is the same role in a **new session**. It reads
`architecture/domain-invariants.md` and the phase diff without carrying the
planning context, so it does not review against its own assumptions.

### What the orchestrator does

You open a session and say: *"You are the orchestrator. We are in PHASE-02. Read
`docs/delivery/build-plan.md` and `CLAUDE.md`, then proceed."*

It then:

1. Reads this file to find the phase definition, its screens, and its acceptance
   criteria.
2. Reads the architecture docs listed for that phase.
3. **Reads the Paper artboards for that phase's screens**, so it knows what the
   frontend needs from the backend before deciding the contract.
4. **Gap analysis — before writing the contract.** Walk the phase's screen
   inventory and its "Susan can" statement and ask: can she actually complete
   this end to end? Is there a screen, a state, or a flow that is obviously
   needed and not listed? Is anything in the phase definition wrong now that you
   have read the artboards?

   Report findings before writing the contract, following the rules in
   `CLAUDE.md` § *Judgment and recommendations*. **A missing screen caught here
   costs nothing; caught in the frontend session it costs a re-plan.**

   Wait for a decision on anything material before proceeding.

5. Writes the contract: Zod schemas, Server Action signatures, repository and
   domain function signatures.
6. Writes `docs/delivery/phases/PHASE-NN.md` from the template, including both
   handoff prompts, with the gap analysis and its outcomes recorded in §10.

Contract-first, not backend-first. Both implementation sessions build against a
fixed, typed interface, so a mismatch is a compile error rather than a discovery
made late.

### Splitting a phase

PHASE-00 is already split into **00A (scaffold)** and **00B (design system in
code)**, because the design stages D0–D3 sit between them.

Phases are sized to fit comfortably in a session's context. **Phases 2 and 3 are
the heaviest** — Phase 2 carries the document infrastructure alongside the quote
lifecycle, Phase 3 carries the whole operational and financial chain.

The orchestrator has **explicit permission to split either into 2a/2b or 3a/3b**
once it has sized the work against the actual artboards. It will know better at
that point than this document does now. If it splits, it records the split here
and the phase numbering gains a letter suffix.

Do not split any other phase without discussion.

### Prompts point at files

Each pasted prompt is three lines: role, phase file path, go. Long pasted prompts
rot and cannot be updated by an agent that learned something mid-phase. The phase
file is the durable context and the handoff mechanism.

---

## Design runs one phase ahead

Design stages D0–D7 are defined in `../conventions/design-system.md` §1.

- **PHASE-00A (scaffold) runs first, before any design work.** D1 writes tokens
  into a real `globals.css`, which requires the repo to exist.
- **D0–D3 then run between 00A and 00B.** Direction exploration, token lock,
  batch-1 screens, composite extraction and reconciliation.
- **D4–D5 are PHASE-00B.** The coded component library and the Paper
  reconciliation.
- **Batch-1 screens deliberately cut across phases**, chosen for composite
  coverage rather than build order: quote builder, availability view, voice
  review, client detail, invoice detail, event calendar, app shell.
- **D6 designs the remaining screens in phase order**, staying at least one phase
  ahead of implementation.
- **The dashboard is designed early in D6**, ahead of its build phase, because it
  is a signature screen and should not be rushed at the end.

From Phase 1 onward, design and implementation run in parallel with design
leading. A phase does not start until its screens are approved.

---

# Phases

## PHASE-00A · Scaffold

**Susan can:** sign in. (Styled with shadcn defaults — that is expected here.)

This phase has **no frontend/backend split and no contract**. It is pure
infrastructure, so one orchestrator session plans it and executes it.

It runs **before** the design work, not after. D1 codifies tokens into
`src/styles/globals.css`, which requires the repo to exist, and D0 benefits from
having a running app to check density and type scale against.

### Build
Next.js App Router, TypeScript strict, Turbopack, `output: 'standalone'`.
Tailwind v4 and shadcn/ui installed with **default styling**. Prisma with local
Postgres via docker-compose — schema limited to `Organization`, `User`,
`Membership` and the Better Auth tables. Better Auth with email and password.
`src/` structure per `system-overview.md` §4. `lib/` (env, db, auth,
safe-action, money, dates, errors, storage adapter interface). Deterministic
seed. Vitest with the transaction-rollback harness. `pnpm verify`. GitHub
Actions. Sentry. `.env.example`.

**No business tables. No modules. No design tokens. No component restyling.**

### Screens
| Screen | Route | Notes |
|---|---|---|
| Sign in | `/sign-in` | Default shadcn styling |
| Home (plain) | `/` | Behind auth. Replaced in Phase 4. |

### Verify
From a clean clone: `pnpm install && docker compose up -d db && pnpm db:reset &&
pnpm dev`. Sign-in works. `pnpm verify` passes. `pnpm db:reset` completes in
under 5 seconds.

### Docs
system-overview · coding-standards · testing

**`lib/money.ts` is fully tested here.** INV-M1 to INV-M5 outlive every other
decision in this phase.

---

> **Between 00A and 00B: design stages D0–D3.**
> Direction exploration on the three stress screens, token lock, batch-1 screen
> design, composite extraction and reconciliation. See
> `../conventions/design-system.md` §1. PHASE-00B cannot start until D3 exits.

---

## PHASE-00B · Design system in code

**Susan can:** sign in and see the real application.

### Build
Tokens from D1 into `globals.css` as a Tailwind v4 `@theme` block. Tier 1
primitives restyled against them, starting from the shadcn sidebar block for the
shell. The approved Tier 2 composites from D3. `/dev/gallery` with every
component in every state as a forced-state instance. App shell and navigation,
responsive.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Sign in | `/sign-in` | Restyled |
| App shell | — | Layout: nav, header, mobile drawer |
| Home (minimal) | `/` | Plain landing page. Replaced in Phase 4. |
| Component gallery | `/dev/gallery` | Dev only, excluded from production |

### Verify
Navigate the shell at 390px and 1440px. Gallery renders every component in every
state.

### Docs
design-system · ui-conventions · coding-standards

**Exit also covers D4 and D5:** components exported to Paper over MCP, fidelity
verified against gallery screenshots, any drift against the D3 artboard
reconciled. **D6 cannot start until this phase exits.**

---

## PHASE-01 · Clients, catalog and availability

**Susan can:** manage her clients and equipment, and see what is free on any date.

### Build
`Client` and `CatalogItem` CRUD. `Booking`, `InventoryAdjustment`,
`AvailabilityWarning`. **The availability engine with its full test suite.**
Search and filtering via URL state. Organisation settings.

Bookings exist but nothing creates them yet except the seed. That is expected —
Phase 2 wires acceptance to booking creation.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Clients list | `/clients` | Search, filter by source |
| Client detail | `/clients/[id]` | Profile, notes, history section (empty for now) |
| Client form | `/clients/new`, `/clients/[id]/edit` | |
| Catalog list | `/catalog` | |
| Catalog item detail | `/catalog/[id]` | Per-day availability strip |
| Catalog item form | `/catalog/new`, `/catalog/[id]/edit` | Quantity held |
| Availability lookup | `/availability` | "What is free on 14 Oct?" — the on-the-phone screen |
| Damage / maintenance form | dialog | Quantity, reason, dates |
| Adjustments list | `/catalog/adjustments` | Resolve, extend |
| Settings | `/settings` | Business name, phone, email, address, logo, quote validity, default deposit |

Settings ships here, not later, because Phase 2's PDF letterhead needs the
business details.

### Verify
Create a client and five catalog items; search both. Mark 50 of 500 chairs
damaged and watch availability drop to 450. Query a date inside a seeded booking
and see the reduced number. Upload a logo in settings.

### Docs
data-model · inventory-availability

**Highest correctness risk in the project. The max-not-sum test (INV-A1) is
mandatory before this phase closes.**

---

## PHASE-02 · Quotes end-to-end

**Susan can:** quote a client, send it on WhatsApp, revise it, and win the job.

### Build

**Document infrastructure** — first becomes visible here, so it is built here:
`DocumentCounter` and gapless allocation, the immutability trigger migration,
`@react-pdf/renderer` with a shared document template, R2 storage,
`DocumentFile` with share tokens, the regeneration route.

**Inquiries** — capture, list, conversion to quote.

**Quotes** — builder with catalog picker and live availability, price
snapshotting, deposit (fixed and percent), issue transition, PDF, public share
link, native share. Versioning with `rootQuoteId`. Preliminary flag with `HOLD`
bookings and expiry. Site-visit confirmation preserving the original estimate.
Acceptance creating the `Event` and converting holds to `COMMITTED` bookings,
with the in-transaction availability re-check and the warning path. Quote expiry
job.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Inquiry capture | `/inquiries/new` | |
| Inquiries list | `/inquiries` | Filter: unconverted |
| Inquiry detail | `/inquiries/[id]` | Convert to quote |
| Quotes list | `/quotes` | Filter by status |
| Quote builder | `/quotes/new`, `/quotes/[id]/edit` | Line items, availability per row, totals, deposit |
| Quote detail | `/quotes/[id]` | Version selector, status, actions |
| Site-visit confirmation | flow | Creates a non-preliminary version |
| Issue confirmation | dialog | States what will happen |
| Accept / decline | dialogs | Accept creates the event and bookings |
| Availability warning | dialog | "Only 180 of 200 free on 14 Oct. Book anyway?" |
| Public shared quote | `/q/[token]` | **Unauthenticated.** The WhatsApp destination. |
| Quote PDF | template | Letterhead from settings; preliminary watermark |

### Verify
Build a quote, issue it, open the share link on a phone, send it to WhatsApp.
Change a catalog price and confirm the issued quote is unchanged. Edit a sent
quote and see both versions with their own numbers. Accept a quote and watch
availability drop. Request more than is available and see the warning with the
real number.

### Docs
document-lifecycle · data-model · inventory-availability

**Heaviest phase. The orchestrator may split into 2a (infrastructure, inquiries,
build and issue) and 2b (versioning, preliminary, acceptance).**

---

## PHASE-03 · Operations and getting paid

**Susan can:** run the event, deliver, invoice, and take payment.

### Build
Master calendar with staff and equipment conflict detection. `StaffMember` and
`StaffAssignment` with day rates. Delivery note generation from the accepted
quote, with numbering and PDF. Questionnaire generation. Logistics checklist.
Return tracking on delivery note lines. Invoice generation from the delivery
note. Derived balance and status. Payment recording. Automatic receipt
generation. Void and replace.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Calendar | `/calendar` | Month and week; conflict flags |
| Event detail | `/events/[id]` | Tabs: overview, equipment, staff, documents, expenses |
| Staff list | `/staff` | |
| Staff detail | `/staff/[id]` | Assignment history |
| Staff form | `/staff/new`, `/staff/[id]/edit` | |
| Staff assignment | dialog | Role, day rate, days |
| Delivery note detail | `/delivery-notes/[id]` | Return recording |
| Delivery note PDF | template | Printed, carried to site |
| Questionnaire PDF | template | On-site client sign-off |
| Packing checklist | print view | From quote line items |
| Invoices list | `/invoices` | Filter by status |
| Invoice detail | `/invoices/[id]` | Balance, payments, actions |
| Generate invoice | flow | From delivery note |
| Record payment | dialog | Method, reference, date |
| Receipt detail | `/receipts/[id]` | |
| Receipt PDF | template | |
| Void and replace | flow | Reason, links both directions |

### Verify
View the calendar; assign a staff member to two overlapping events and see the
conflict flag. Print a delivery note. Invoice an event, record a partial payment
and see `PARTIALLY_PAID`, record the rest and see `PAID` with two receipts.

### Docs
document-lifecycle · data-model

**Second heaviest. The orchestrator may split into 3a (calendar, staff, delivery
notes) and 3b (invoices, payments, receipts).**

---

## PHASE-04 · Money, records and the dashboard

**Susan can:** see what she earned, find any document, and own her data.

### Build
Expense entry with categories. Wage-derived expenses linked to staff assignments.
Per-event profit and loss. Business-wide monthly summary. Central searchable
document store. Automated daily backup. User-triggered full export. **Restore
drill executed and logged.** Instrumentation reporting. **The real dashboard.**

### Screens
| Screen | Route | Notes |
|---|---|---|
| Dashboard | `/` | **Replaces the Phase 0 home.** Today's and this week's events, quotes awaiting response, unpaid invoices, month-to-date figures, quick actions. |
| Expenses list | `/expenses` | Filter by event, category, month |
| Expense form | `/expenses/new`, `/expenses/[id]/edit` | |
| Event P&L | tab on `/events/[id]` | Revenue minus logged expenses |
| Monthly summary | `/finance` | Income, expenses, profit |
| Document store | `/documents` | Search and filter by client, date, event, type |
| Data export | `/settings/export` | ZIP of CSVs plus PDFs |
| Metrics | `/dev/metrics` | Internal. Inquiry-to-quote, voice share, warning overrides |

The dashboard is built here because every widget needs data that does not exist
until Phase 3 closes. Building it earlier means building it twice. It is
**designed early in D6** so it is not rushed.

### Verify
Log fuel against an event and see it in that event's P&L. Add a staff wage and
confirm it appears once, not twice. Open the monthly summary. Search for a
document three ways. Download the export and open it. The restore drill table in
the runbook has a completed row.

### Docs
ops/runbook · data-model

**The restore drill is a deliverable, not a checkbox (INV-D2).**
**Instrumentation ships before voice on purpose** — voice-vs-typed share is
meaningless without a pre-voice baseline.

---

## PHASE-05 · Voice foundation and quote capture

**Susan can:** speak a quote request and review it before saving.

### Build
`MediaRecorder` capture. IndexedDB queue with Background Sync. Presigned upload.
STT adapter with two provider implementations. `Keyterm` table and daily refresh.
`VoiceCapture` model. **The benchmark harness and provider selection.** The
extraction stage with context injection (date, catalog, clients). The review
screen with transcript, uncertainty flags, and entity resolution.
`correctedFields` diffing. Per-form mic on the quote form only.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Mic control | component | Idle, recording, processing. Per-form for now. |
| Recording overlay | sheet | Waveform, duration, cancel |
| Voice review: quote | `/voice/[captureId]/review` | Transcript visible, uncertain fields flagged, entity resolution |
| Queue indicator | component | Count badge in the shell |
| Queue list | sheet | Pending captures, retry, discard |

### Verify
Speak a quote in a moving vehicle; review it; correct one field; save it. Kill
the connection mid-capture and watch it upload on reconnect. The benchmark
produces a provider comparison table.

### Docs
voice-pipeline

**Blocked on:** ~20 real recordings from Susan (in-vehicle, on-site, at desk).
*Request these during Phase 01 — they have a lead time.*
**Validated with Susan against real recordings before Phase 06 starts.** This
gate is from the PRD and is not negotiable.

---

## PHASE-06 · Voice everywhere

**Susan can:** speak anything, from anywhere.

### Build
The same pipeline extended to expenses, damage reports, payments, staff
assignments, and clients, with a per-form mic on each. Then the shell mic with
intent routing via discriminated union, and the disambiguation screen.

### Screens
| Screen | Route | Notes |
|---|---|---|
| Global mic | component | Shell, thumb zone on mobile |
| Voice review: expense | `/voice/[captureId]/review` | |
| Voice review: client | " | |
| Voice review: damage | " | |
| Voice review: payment | " | |
| Voice review: staff assignment | " | |
| Intent disambiguation | `/voice/[captureId]/disambiguate` | For `UNKNOWN`. Shows the transcript, offers record types. |

Global capture is the primary entry point in the finished product but the last
thing built, because intent routing is only tunable once the individual
extraction schemas are known to work.

### Verify
Each of the five record types created by voice and reviewed. From the calendar
screen, speak an expense and land on the expense review screen pre-filled.

---

## PHASE-07 · Release

**Susan can:** use the system for her real business.

Deploy to Vercel + Neon. The single end-to-end Playwright spec. Performance pass.
Error handling review. Susan's UAT and corrections. Then domain purchase,
DigitalOcean droplet, Docker Compose, Caddy, data migration, cutover.

No new screens.

### Docs
ops/runbook §6, §7

**The reference number check matters most.** `DocumentCounter` rows must migrate
with `lastNumber` intact, or the first invoice after cutover collides with an
existing number.

---

# Definition of done

A phase is done when:

- [ ] The "Susan can" statement is demonstrably true in a browser
- [ ] Every screen in the phase's inventory exists and matches its artboard at
      390px and 1440px
- [ ] Every acceptance criterion in `PHASE-NN.md` passes
- [ ] Every applicable invariant has a passing test
- [ ] `pnpm verify` passes
- [ ] No invariant test was modified
- [ ] Loading, empty, error, and populated states all exist
- [ ] The review pass found no violations
- [ ] `PHASE-NN.md` §10 recommendations all have a recorded decision, and
      anything carried forward is listed
- [ ] `PHASE-NN.md` status log is complete
- [ ] **Current phase** at the top of this file is updated

---

# Screen count by phase

| Phase | Screens | Dialogs / flows | PDF templates |
|---|---|---|---|
| 0A | 2 | — | — |
| 0B | 4 | — | — |
| 1 | 9 | 1 | — |
| 2 | 8 | 4 | 1 |
| 3 | 10 | 3 | 4 |
| 4 | 8 | — | — |
| 5 | 3 | 2 | — |
| 6 | 6 | 1 | — |
| **Total** | **49** | **11** | **5** |

Phases 2 and 3 are visibly the largest. See "Splitting a phase" above.

---

# External dependencies

Two things have lead times independent of build order:

1. **Susan's voice recordings** (~20, three environments). Blocks Phase 5. Ask
   during Phase 1.
2. **Domain purchase**, coordinated with the marketing website. Blocks Phase 7.

Two things to confirm with Susan during Phase 1:

- Whether damage is naturally open-ended or has a known return date
  (`InventoryAdjustment.endDate`).
- Her actual quote validity period (`Organization.quoteValidityDays`).

One thing to confirm before D6 designs it:

- What Susan wants on the dashboard. The proposal above is a reasonable default,
  but it is the one screen in the system with no requirement behind it.