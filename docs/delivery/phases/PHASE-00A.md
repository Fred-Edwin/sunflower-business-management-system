# PHASE-00A · Scaffold

**Susan can:** sign in, and land on a plain home page behind auth.

**Status:** Complete

> This phase has **no frontend/backend split and no contract**. It is pure
> infrastructure, so one orchestrator session plans it and executes it. Sections
> 5, 6 and 7 of the template collapse into the single task list in §5 below.

---

## 1. Scope

Stand up the repository: Next.js App Router on TypeScript strict with Turbopack
and `output: 'standalone'`, Tailwind v4 and shadcn/ui at **default styling**,
Prisma against local Postgres in Docker, Better Auth with email and password, the
`src/` structure from `system-overview.md` §4, the `lib/` primitives, a
deterministic seed, Vitest with the transaction-rollback harness, `pnpm verify`,
GitHub Actions, Sentry, and `.env.example`.

`lib/money.ts` is written and **fully tested** here. INV-M1 to INV-M5 outlive
every other decision in this phase.

The schema is limited to `Organization`, `User`, `Membership` and the Better Auth
tables.

## 2. Out of scope

- **All design work.** No tokens, no restyling of shadcn primitives, no Tier 2
  composites, no `/dev/gallery`. That is PHASE-00B, and it depends on design
  stages D0–D3, which have not happened. Default shadcn styling is the correct
  and expected output of this phase.
- **All business tables** — no `Client`, `CatalogItem`, `Quote`, `Event`,
  `Invoice`, `Booking`, `VoiceCapture`. None.
- **All business modules.** `src/modules/` is created empty. No `clients`, no
  `quotes`, no `voice`.
- **Any screen beyond `/sign-in` and `/`.**
- Storage *implementation*. The adapter interface is defined; no R2 client is
  written and no S3 SDK is installed.
- AI SDK, PDF rendering, cron routes, Playwright specs.
- A user-management UI, sign-up, or password reset. The single user comes from
  the seed.

## 3. Reading list

| Document | Why |
|---|---|
| `architecture/system-overview.md` | §2 stack, §3 portability rules, §4 structure, §6 multi-tenancy, §7 cross-cutting |
| `conventions/coding-standards.md` | §1 TypeScript, §2 layout and no barrels, §7 money, §8 dates, §9 errors, §13 dependencies |
| `conventions/testing.md` | §3 the rollback harness, §5 seed data, §6 commands |
| `architecture/domain-invariants.md` | §1 money (INV-M1–M5), §8 tenancy (INV-T1–T4) only |
| `architecture/data-model.md` | §1 tenancy and identity only — `Organization`, `User`, `Membership` |

## 4. Invariants in play

| ID | Rule | Where it is enforced in this phase |
|---|---|---|
| INV-M1 | Money is integer KES cents, exactly two decimals, one cent minimum | `lib/money.ts` + `lib/money.test.ts` |
| INV-M2 | Every monetary field name ends in `Cents` | Naming discipline; no monetary columns exist yet |
| INV-M3 | Money arithmetic only in `lib/money.ts` | `lib/money.ts` is the only place with the operations |
| INV-M4 | Rounding is half-up, applied **once** | `applyPercent` — single rounding, tested |
| INV-M5 | Formatting only at the render boundary | `formatMoney` is the sole formatter; returns `string` |
| INV-T1 | Every business table has non-nullable `organizationId` | No business tables yet; `Organization`/`Membership` make it possible |
| INV-T3 | Organisation resolved from the session, never from client input | `lib/safe-action.ts` wrapper puts `organizationId` in `ctx` |
| INV-T4 | The only unauthenticated route is `/q/[token]` | Middleware protects everything but `/sign-in`; `/q` does not exist yet |

Not in play yet, deliberately: INV-P\*, INV-N\*, INV-I\*, INV-A\*, INV-C\*, INV-V\*.
No document, catalog, booking, or voice code exists to enforce them against.

---

## 5. Task list

Single list — this phase has no handoff.

### 5.1 Repository and toolchain
- [x] `git init`; `.gitignore` (node, next, env, coverage, `.turbo`)
- [x] `package.json` on pnpm; Node 24; `packageManager` pinned
- [x] Next.js App Router, TypeScript strict, Turbopack for dev and build
- [x] `next.config.ts` with `output: 'standalone'` (portability rule 3, from the first commit)
- [x] `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `@/*` → `src/*`
- [x] ESLint flat config; a rule banning barrel `index.ts` re-exports is not
      available off the shelf — enforce by convention and review, and add
      `no-restricted-imports` for `@/modules/*/repository` from client code
- [x] Prettier
- [x] Scripts: `dev`, `build`, `start`, `typecheck`, `lint`, `test`,
      `test:watch`, `verify`, `db:reset`, `db:migrate`, `db:seed`, `user:add`

### 5.2 Structure
- [x] `src/app/(auth)/sign-in`, `src/app/(app)/`, `src/app/api/`
- [x] `src/modules/` — created, empty, with a `.gitkeep`
- [x] `src/components/ui/` (shadcn) and `src/components/`
- [x] `src/lib/`, `src/styles/globals.css`
- [x] `tests/`, `prisma/`

### 5.3 `lib/` primitives
- [x] `lib/env.ts` — Zod-validated, parsed at module load. **The app refuses to
      start on a missing or malformed variable**, with a message naming the
      variable. Server-only; no `NEXT_PUBLIC_` leakage into server schema.
- [x] `lib/db.ts` — Prisma client, dev singleton to survive HMR
- [x] `lib/money.ts` — `multiplyMoney`, `applyPercent`, `sumMoney`,
      `subtractMoney`, `formatMoney`, `parseMoney`. Integer cents throughout,
      half-up once, throws on non-integer or non-finite input
- [x] `lib/dates.ts` — `nowInNairobi`, `toDateOnly`, `formatEventDate`;
      `date-fns` + `@date-fns/tz`; timezone constant `Africa/Nairobi`
- [x] `lib/errors.ts` — `AppError` base, `NotFoundError`, `ForbiddenError`,
      `ValidationError`, `DomainError`; `Result<T>` type per coding-standards §9
- [x] `lib/storage.ts` — the `StorageAdapter` **interface only** (`put`, `get`,
      `getSignedUploadUrl`, `delete`) plus a `notConfigured` stub that throws.
      No S3 SDK dependency in this phase.
- [x] `lib/auth.ts` — Better Auth server instance, Prisma adapter, email +
      password, sessions
- [x] `lib/auth-client.ts` — Better Auth React client for the sign-in form
- [x] `lib/safe-action.ts` — `next-safe-action`; `authedAction` resolves session
      then `organizationId` via `Membership` and puts both in `ctx` (INV-T3)

### 5.4 Database
- [x] `docker-compose.yml` — Postgres 17, named volume, healthcheck, port 5432
- [x] `prisma/schema.prisma` — `Organization`, `Membership`, `MemberRole` enum,
      and the Better Auth tables (`User`, `Session`, `Account`, `Verification`).
      `Organization` fields per `data-model.md` §1: `name`, `phone`, `email`,
      `addressLine`, `logoStorageKey?`, `defaultCurrency`, `quoteValidityDays`
      (default 14), `depositDefaultPercent?`. `Membership` unique on
      `(userId, organizationId)`.
- [x] Initial migration
- [x] `prisma/seed.ts` — one organisation, one user (password hashed through
      Better Auth's own hasher so sign-in actually works), one `OWNER`
      membership. Deterministic: fixed ids, fixed credentials, no `Math.random`,
      no bare `new Date()`.
- [x] `db:reset` = drop + migrate + seed, **under 5 seconds**
- [x] `scripts/user-add.ts` (`pnpm user:add -- --email --password --name`) —
      creates a `User` through Better Auth's own hasher plus an `OWNER`
      `Membership` on the seeded organisation. No route, no email send; an
      operator-only lever standing in for the user-management UI deferred to a
      later phase (see §10)

### 5.5 Auth and screens
- [x] Better Auth route handler at `app/api/auth/[...all]`
- [x] `middleware.ts` — everything except `/sign-in` and the auth API requires a
      session; redirect to `/sign-in`
- [x] `/sign-in` — shadcn `Card`, `Input`, `Button`, `Label`; react-hook-form +
      zodResolver; server error mapped back onto the form. **Default styling.**
- [x] `/` — Server Component, greets the signed-in user, sign-out button.
      Plain. Replaced in Phase 4.
- [x] `app/layout.tsx` with Geist, `error.tsx`, `not-found.tsx`

### 5.6 Tests
- [x] Vitest config; `pnpm test` runs unit + repository, no watch
- [x] `lib/money.test.ts` — **INV-M1 to INV-M5, the priority deliverable.**
      Includes the two cases named in the invariants doc: 33% of 100,000 cents is
      exactly 33,000, and quantity 7 at 1,499 cents is exactly 10,493
- [x] `tests/db.ts` — the `withRollback` harness from testing.md §3
- [x] One repository-layer test proving the harness rolls back, so the
      harness itself is known-good before any module depends on it
- [x] `lib/dates.test.ts` — Nairobi anchoring, clock fixed with `vi.setSystemTime`

### 5.7 Ops
- [x] `.env.example` — **names and comments only, no values**
- [x] `.github/workflows/verify.yml` — pnpm, Node 24, Postgres service,
      `pnpm verify`
- [x] Sentry — server and client init, DSN optional so a clean clone runs
      without one
- [x] `README.md` — the clean-clone sequence from §7

---

## 6. Decisions taken during planning

Recorded because they are judgement calls, not transcriptions of a doc.

1. **Better Auth owns `User`; we own `Membership`.** `Organization` and
   `Membership` are ours and are written by hand. This keeps
   `system-overview.md` §6 true: business records will hang off
   `organizationId`, never `userId`.
2. **No public sign-up route.** v1 has no user-management UI (out of scope, §8 of
   system-overview) — a self-registered user would have no `Membership` and
   would sign in to an empty system, which is the exact failure tenancy is
   designed to prevent. Better Auth's sign-up endpoint is disabled. Instead,
   `pnpm user:add` (a local CLI script, no route, no email dependency) creates a
   user plus an `OWNER` membership directly, so there is an operator lever
   without a public attack surface.
3. **`lib/storage.ts` is an interface with a throwing stub.** The phase list says
   "storage adapter interface". Installing an S3 SDK now would violate
   coding-standards §13 for a capability nothing calls yet.
4. **`parseMoney` and `subtractMoney` added** beyond the four functions named in
   coding-standards §7. Both are money arithmetic, and INV-M3 says arithmetic
   happens *only* here — so the alternative is inline subtraction in application
   code, which the invariant forbids.
5. **Seed uses Better Auth's hasher.** Inserting an `Account` row with a
   hand-rolled hash produces a user who exists but cannot sign in, which would
   fail the phase's own exit criterion.
6. **No barrel-file lint rule.** No stock ESLint rule expresses it. Enforced by
   convention plus review, as the docs already assume.
7. **Prisma pinned to 6.19.3, not the `latest` tag (8.0.0-rc.13).** Prisma 7
   removed `datasource { url }` in favour of `prisma.config.ts` plus a driver
   adapter passed to the client constructor — a real architectural break from
   the pattern coding-standards.md and Better Auth's Prisma adapter both
   assume. 6.19.3 is the newest stable release on the classic pattern.
8. **shadcn initialised with `-b radix`, not the CLI's own default.** The
   current shadcn CLI defaults to a `base-nova` preset built on `@base-ui/react`
   — a different primitives library from Radix. `system-overview.md` §2 names
   Radix explicitly, so the default was overridden rather than followed.
9. **The `shadcn` npm package is a runtime dependency, not just a CLI tool.**
   `globals.css` imports `shadcn/tailwind.css` for base theme layers — this is
   a real import resolved at build time, not dead weight from `pnpm dlx`.
   Removing it (which looked like tidying up an accidental install) broke the
   build; it belongs in `dependencies`.
10. **`Account.issuer` added, beyond `data-model.md`'s Better Auth table
    sketch.** Better Auth 1.7's credential sign-in matches on
    `providerId + issuer + accountId`, where `issuer` is a required column
    (`"local:<providerId>"` for password auth) that the classic Better Auth
    Prisma schema documentation predates. Without it every sign-in fails with
    a misleading "User not found" despite the user and account rows both
    existing — discovered by reproducing the failure in-process with the
    adapter's debug logs. See §8.

## 7. Acceptance criteria

- [x] From a clean clone: `pnpm install && docker compose up -d db && pnpm db:reset && pnpm dev`
- [x] Sign-in works with the seeded credentials; `/` is unreachable signed out
- [x] `pnpm verify` passes — typecheck, lint, tests
- [x] `pnpm db:reset` completes in under 5 seconds
- [x] `lib/money.ts` fully tested: INV-M1 to INV-M5
- [x] The app refuses to start with a missing environment variable, naming it
- [x] No business table, module, or component exists beyond this list
- [x] §8 status log complete

## 8. Status log

| Date | Session | Entry |
|---|---|---|
| 2026-09-06 | Orchestrator | Phase file written. `docs/` reorganised into `architecture/`, `conventions/`, `delivery/`, `ops/` to match the CLAUDE.md index; cross-doc links already assumed this layout and now resolve. `PHASE-TEMPLATE.md` written — it did not exist. |
| 2026-09-06 | Orchestrator | Scaffolded Next.js 15.5.25 (not the `latest` tag, which resolved to a Next 16 canary-adjacent major — too new for the wider ecosystem this phase depends on). Full toolchain, `lib/` primitives, Prisma schema/migration/seed, Better Auth wiring, `/sign-in` and `/` screens, Vitest + rollback harness, CI, Sentry, `.env.example` all written. See §6 items 7–10 for the deviations from the plan as written, discovered during implementation. |
| 2026-09-06 | Orchestrator | **Sign-in initially failed with a 401** ("User not found") despite the seeded user and Account row both existing and being queryable directly. Root-caused by reproducing the failure in-process with the Prisma adapter's `debugLogs` and Better Auth's own debug logger: `sign-in.mjs` matches the credential account on `providerId === "credential" && account.issuer === createLocalAccountIssuer("credential")`, and the schema had no `issuer` column at all. Added `Account.issuer String`, migrated (required a `pnpm db:reset` — a destructive local action, run only after explicit user consent per the Prisma AI-safety gate), reseeded, and verified sign-in end-to-end via Playwright (submit → session → redirect to `/` → sign-out → redirect back to `/sign-in` → direct navigation to `/` while signed out redirects to `/sign-in`). |
| 2026-09-06 | Orchestrator | Squashed the two migrations into one clean `init` migration (user's call — see conversation) once the schema was final; `pnpm db:reset` measured at 2.87s, comfortably under the 5s target. `pnpm verify` passes: typecheck, lint, 32/32 tests in ~3s. Fixed a `parseArgs` bug in `scripts/user-add.ts` that choked on pnpm's own `--` argument separator; verified `pnpm user:add` creates a working second account. |

## 9. Handoff prompts

None. Single session plans and executes.

## 10. Deferred

Recorded, not built.

- `docs/ops/runbook.md` is referenced by CLAUDE.md and by
  `domain-invariants.md` §254 but does not exist. It belongs to the phase that
  first deploys — backups and restore are its subject.
- **A user-management UI** — invitations, tokens, an email sender, a members
  list, role assignment. `pnpm user:add` (§5.4) is the interim operator lever.
  The schema (`Organization`, `Membership`, `MemberRole`) is already shaped so
  this is additive, not a migration, when it is built.
- Barrel-file prevention as an enforced lint rule rather than a convention.
- A local S3-compatible container as an alternative to R2 in development
  (`system-overview.md` §3 mentions it as an option).
