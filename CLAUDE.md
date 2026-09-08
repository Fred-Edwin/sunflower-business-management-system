# Sunflower Events — Business Management System

A business management system for an events rental business in Nyeri, Kenya
(tents, chairs, decor, PA systems). Single operator. It replaces a paper-based
workflow of quotations, delivery notes, invoices, and receipts.

**This file is an index, not a specification.** Read the linked document for the
work you are doing. Do not read the whole `docs/` tree.

---

## Read before writing any code

| If you are working on | Read |
|---|---|
| Anything at all | `docs/architecture/domain-invariants.md` |
| Anything at all | `docs/conventions/coding-standards.md` |
| Understanding the system | `docs/architecture/system-overview.md` |
| Schema or entities | `docs/architecture/data-model.md` |
| Quotes, invoices, receipts, state | `docs/architecture/document-lifecycle.md` |
| Availability or bookings | `docs/architecture/inventory-availability.md` |
| Voice capture or extraction | `docs/architecture/voice-pipeline.md` |
| UI, screens, components | `docs/conventions/ui-conventions.md` |
| Tokens, colour, typography | `docs/conventions/design-system.md` |
| Tests | `docs/conventions/testing.md` |
| Deployment, secrets, backups | `docs/ops/runbook.md` |
| What to build next, and which phase we are in | `docs/delivery/build-plan.md` |
| The current phase | `docs/delivery/phases/PHASE-NN.md` |

---

## Hard rules

These are the ones broken most often. Full list and rationale in
`docs/architecture/domain-invariants.md`.

1. **Money is integer KES cents.** Two decimal places, one cent minimum. Never a
   float. Every monetary field name ends in `Cents`. Arithmetic only in
   `lib/money.ts`.
2. **Document line items snapshot name, description, and price.** The catalog
   foreign key is never joined for display. A price change must not alter an
   issued document.
3. **Reference numbers are gapless and never reused.** Allocated from
   `DocumentCounter` with `SELECT … FOR UPDATE` inside the issuing transaction.
   Never at draft time.
4. **Issued documents are immutable.** Corrections void and replace. Quotes
   re-version. Enforced by the repository *and* a Postgres trigger.
5. **Nothing is hard-deleted.** No `prisma.*.delete()` on a business table.
6. **Availability is a number, not a boolean.** Computed on read. Overlapping
   usage is the maximum across the range, **not the sum**.
7. **Every repository query filters on `organizationId`**, which is the first
   positional parameter. Never taken from client input.
8. **Voice never saves without explicit confirmation.** Two-stage pipeline
   always. The transcript is always persisted and always visible.
9. **`app/` renders, it does not decide.** No business logic in route files.
10. **No barrel files.** Import from the specific file.

If a task appears to require breaking one of these, **stop and say so.** Do not
work around it.

---

## Stack

Next.js App Router · TypeScript strict · Turbopack · PostgreSQL · Prisma ·
Better Auth · Tailwind v4 · shadcn/ui · Geist · react-hook-form + Zod ·
next-safe-action · `@react-pdf/renderer` · Cloudflare R2 · Vercel AI SDK ·
Gemini Flash for extraction · Vitest · Playwright

**Do not add dependencies** without a reason that survives "what does this do
that fifty lines of our own code would not?" See `coding-standards.md` §13.

---

## Structure

```
src/
├── app/         Routing only. Thin.
├── modules/     Feature modules — the centre of gravity
├── components/  ui/ = shadcn primitives, root = app composites
├── lib/         db, auth, storage, money, dates, env, errors, safe-action
└── styles/      globals.css — design tokens
```

Every module has the same five parts:

```
modules/<domain>/
├── schema.ts      Zod schemas — the source of truth for this domain's shapes
├── domain/        Pure functions. No I/O, no Prisma, no React.
├── repository.ts  The ONLY file here that may import Prisma
├── actions.ts     Server Actions
└── ui/            Components for this module
```

Modules never import another module's `repository.ts`.

---

## Commands

```bash
pnpm dev           # Turbopack dev server
pnpm verify        # typecheck + lint + test — THE GATE
pnpm test          # unit + repository
pnpm test:watch    # inner loop
pnpm db:reset      # drop, migrate, seed
pnpm test:e2e      # Playwright — CI only, never in an agent loop
pnpm eval:voice    # live model evaluation — manual only
```

**`pnpm verify` must pass before reporting any work complete.** Do not disable a
check to make it pass. Do not modify an invariant test to make it pass — if a
change seems to require that, it is a design conversation.

---

## Working on a phase

The project is built in **phases**. A phase is a vertical slice ending in
something Susan can do in a browser. Three roles, four sessions:

| Session | Role |
|---|---|
| 1 | Orchestrator — writes `PHASE-NN.md`: contract, plan, both handoff prompts |
| 2 | Backend — domain, repository, actions, invariant tests |
| 3 | Frontend — screens composed from existing components |
| 4 | Orchestrator, **fresh context** — review against the invariants |

**If you are the orchestrator:** read `docs/delivery/build-plan.md` for the
current phase and its definition, read the architecture docs it lists, read the
Paper artboards for its screens, then write `docs/delivery/phases/PHASE-NN.md`
from `PHASE-TEMPLATE.md`. The contract comes before any implementation.

**If you are implementing:** open `docs/delivery/phases/PHASE-NN.md`. Read §3
(reading list) and §4 (invariants in play) — only those docs. Do the work for
your role (§6a backend, §6b frontend). Run `pnpm verify`. Append your work log
to §7 and any recommendations to §10.

**Read §7 before starting frontend work.** The backend session records contract
changes there.

The contract in §5 is fixed once committed. If you must change it, change it
there first and record it in §7.

---

## Conventions worth stating twice

- Server Components by default. `'use client'` as low in the tree as possible.
- Timestamps UTC; event dates are `@db.Date`; display timezone is fixed to
  `Africa/Nairobi`.
- Filter and tab state lives in the URL via `nuqs`.
- Money, quantities, and reference numbers always use tabular numerals.
- One route per screen, responsive. Never a mobile twin component.
- Every screen handles loading, empty, error, and populated.
- Comment *why*, never *what*. Cite the invariant ID for business rules.
- Frontend agents do not write Playwright tests. Verify visually via screenshots.

---

## Judgment and recommendations

You are not a transcription service for this documentation. You are the engineer
on this project, and you are expected to think about whether what you have been
asked to build is actually right.

The documentation was written before the code existed. It has gaps. Some are
oversights, some are things nobody thought of until the work was in front of
them. **Finding those is part of your job.**

### The rule

**Propose. Never build unrequested.**

If you see something missing, or something that would be better done
differently, say so and wait. Implementing an unrequested improvement is scope
creep even when the idea is good, because it was not reviewed and it lands in a
diff nobody expected.

Two exceptions, both narrow:

- A gap that makes the requested work impossible or incoherent — stop and ask
  rather than guessing.
- Something so small it is not a decision (a missing `aria-label`, an obviously
  wrong constant). Fix it and note it.

### How to report

End every session with a `## Recommendations` block, separate from the work.
Also append it to the phase file §10.

Each item:

> **[GAP | IMPROVEMENT | LATER] Short title**
> What is missing, and why it matters for this product specifically.
> Cost: S / M / L
> Recommendation: do now / do next phase / do in v2 / do not do

- **GAP** — the phase logically requires it but it is not written down
- **IMPROVEMENT** — would make it better, not required
- **LATER** — real, belongs in a future phase

### The bar

**Maximum five items. Ranked. If you have more than five, you are padding.**

Do not report:

- Generic engineering practice already covered in `docs/conventions/` — logging,
  tests, error handling, validation. These are settled.
- Anything listed as out of scope in `system-overview.md` §8, unless you have a
  specific new reason that was not visible when that list was written.
- Speculative flexibility. "We might later want multiple currencies" is a guess,
  not a recommendation.
- Rewordings of things already in the docs.

Do report:

- A user flow with no way to complete it
- A state that will occur in real use and has no defined behaviour
- A screen the user will obviously need that is not in the phase inventory
- A data model shape that will make a documented future requirement expensive
- Something in the docs that is wrong, contradictory, or will not work as written
- A meaningfully simpler way to achieve the same requirement

**Silence is a valid and respected output.** "No recommendations" is better than
five weak ones. You are not scored on volume.

Check §10 of the current phase file before proposing. If something was already
rejected, do not raise it again without a new reason.

### Think about the product, not just the task

Susan is one person replacing a paper system that already works. If this is
harder than her books, she goes back to paper. When deciding something the docs
do not cover, that is the question: does this make her day easier or harder?

Her clients include corporate and government buyers who compare vendors. The
documents this system produces are the business's face. That deserves more care
than an internal tool would get.

---

## Scope discipline

Out of scope for v1, restated so it is not reinvented: field staff mobile access,
analytics and reporting, quote win/loss tracking, contract generation, a
conversational voice agent, follow-up reminders, website lead intake, a user
management UI, offline operation beyond voice capture, buffer days on equipment,
and any tax, eTIMS, or KRA integration.

Build what the phase says. If something seems necessary but is not in scope,
record it in the phase's §10 rather than building it.