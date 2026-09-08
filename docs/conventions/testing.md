# Testing

Short and prescriptive by design. Long testing documents get ignored.

**The governing constraint is speed.** A slow suite under agentic development is
worse than a small one, because agents run tests far more often than a human
does and every second of latency is multiplied.

Targets: unit suite under 10 seconds. Full `pnpm verify` under 30 seconds.
End-to-end suite runs in CI only.

---

## 1. What must be tested

Non-negotiable. Every rule in `../architecture/domain-invariants.md` has a test,
and the test names reference the invariant ID.

| Area | Why |
|---|---|
| Money arithmetic | Rounding, percentages, sums (INV-M1–M5) |
| Price snapshotting | Catalog change must not touch issued documents (INV-P1–P4) |
| Reference numbering under concurrency | Gapless, unique, never reused (INV-N1–N5) |
| Immutability enforcement | Both the repository guard and the DB trigger (INV-I2) |
| Availability computation | Especially max-not-sum (INV-A1–A7) |
| Invoice balance and derived status | (INV-C5, INV-C6) |
| Tenant scoping on every repository function | (INV-T2) |
| Document state transitions | Every arrow in `document-lifecycle.md` |
| Voice extraction against golden files | (INV-V2, V4) |

## 2. What must not be tested

- Third-party libraries. Prisma works.
- Framework behaviour. Next.js routes.
- Pure presentation. Whether a button is 36px tall.
- Getters, mappers, and trivial pass-throughs.
- Anything whose test would just restate the implementation.

Coverage percentage is not a target and is not measured. Coverage of the
invariants is the target, and it is binary.

---

## 3. Layers

### Unit tests — Vitest, no database

For everything in `modules/*/domain/`. These are pure functions, so the tests are
fast and there is no setup.

```ts
// modules/quotes/domain/totals.test.ts
it('INV-M4: applies a percentage deposit with a single half-up rounding', () => {
  expect(applyPercent(1250075, 33)).toBe(412525)
})
```

This is where most tests live and where most bugs are caught.

### Repository tests — Vitest, real Postgres

Never mock the database. Mocked query layers test the mock.

**Setup: one long-lived local Postgres, a template database, and per-test
transaction rollback.** Not Testcontainers — container startup adds 10 to 30
seconds per run, which is unacceptable here.

```ts
// tests/db.ts
export function withRollback(fn: (tx: Prisma.TransactionClient) => Promise<void>) {
  return async () => {
    await prisma.$transaction(async (tx) => {
      await fn(tx)
      throw new Rollback()   // always rolls back; never leaks state
    }).catch((e) => { if (!(e instanceof Rollback)) throw e })
  }
}
```

Every test gets a clean database in milliseconds. No truncation between tests, no
ordering dependencies, no cleanup code.

The exception is concurrency tests (numbering, booking races), which need real
committed transactions. Those get their own suite and clean up explicitly. There
should be very few of them.

### End-to-end — Playwright, CI only

**One spec.** The full chain: create a client, build a quote, issue it, accept it,
generate the delivery note, invoice it, record a payment, verify the receipt.

That is the path where breakage would be most expensive and least visible in unit
tests. Everything else is covered at a lower level.

Three rules keep this from eating time:

1. A dev-only auth bypass via env var. No test spends eight seconds on a login
   form.
2. Deterministic seed data. Nothing waits on setup.
3. The suite is never run in the inner loop. `pnpm test:e2e` is a CI command.

### Voice — golden files, no live calls

**No live API calls in the test suite. Ever.**

```
tests/fixtures/voice/
├── quote-wedding-200-chairs.json     { transcript, context, expected }
├── expense-fuel-karatina.json
├── damage-50-chairs.json
└── ...
```

Each fixture is a stored transcript plus the context (date, catalog, client list)
plus the expected structured output. The extraction step is tested against these
with the model call mocked at the AI SDK boundary.

Live-model evaluation is a **separate script**, `pnpm eval:voice`, run
deliberately against the benchmark corpus. It is not part of `pnpm test`, never
runs in CI, and its purpose is provider and prompt comparison, not regression
detection.

---

## 4. How agents verify UI work

This is deliberately not Playwright.

**Visual verification** (agent checking its own work): use the Playwright MCP or
Chrome DevTools MCP to navigate to the route and screenshot it, then compare
against the Paper artboard. Fast loop, no assertions, no test files.

**Regression testing** (protecting against future breakage): the single spec
above, written once, in PHASE-07.

The frontend agent does not write Playwright tests as part of a phase.
The failure mode being avoided is an agent writing a broad suite and then running
it in a loop while iterating, which is where Playwright actually wastes time.

If a specific spec must be run, run one by name:

```bash
pnpm test:e2e -g "quote to receipt"
```

Never the whole suite from inside an agent loop.

---

## 5. Seed data

`prisma/seed.ts` is deterministic. Tests depend on it, so it does not use random
values or the current date without a fixed anchor.

Contains: one organisation, one user, a realistic catalog (tents, 500 chairs,
tables, PA, decor), five clients with recognisable Kenyan surnames, and three
events in different states — one quoted, one accepted with bookings, one invoiced
and part-paid.

`pnpm db:reset` drops, migrates, and reseeds. It should take under 5 seconds.

---

## 6. Commands

```bash
pnpm test              # unit + repository, watch mode off
pnpm test:watch        # inner loop
pnpm test:e2e          # Playwright, CI
pnpm typecheck         # tsc --noEmit
pnpm lint
pnpm verify            # typecheck + lint + test — THE GATE
pnpm eval:voice        # live model evaluation, manual only
pnpm db:reset          # drop, migrate, seed
```

`pnpm verify` must pass before any work is reported complete. Do not disable a
check to make it pass.

---

## 7. Writing tests

- Name the behaviour, not the function. `'rejects an update to an issued
  invoice'`, not `'updateInvoice'`.
- Reference the invariant where one applies: `'INV-A1: availability is a number,
  not a boolean'`.
- One assertion per concept. Several `expect` calls testing one behaviour is
  fine; one test covering three behaviours is not.
- Arrange-act-assert, with blank lines between them.
- No shared mutable state between tests.
- Fix the clock when time matters: `vi.setSystemTime(new Date('2026-10-01T09:00:00+03:00'))`.

## 8. What "done" means for a phase

- Every acceptance criterion in the phase file has a passing test or a
  documented reason it is verified another way.
- `pnpm verify` passes.
- No invariant test has been modified. If a change appears to require modifying
  one, that is a design conversation, not a test edit.
