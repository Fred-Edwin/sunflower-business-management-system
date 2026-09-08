# System Overview

**Project:** Sunflower Events — Business Management System
**Client:** Susan, Sunflower Events (Nyeri, Kenya)
**Vendor:** Lobster Technologies
**Status:** Architecture locked, pre-implementation

> Read this first. It explains what the system is, what it is made of, and how a
> request travels through it. For the rules the code must never break, read
> `domain-invariants.md`. For entities and fields, read `data-model.md`.

---

## 1. What this system is

A single-operator business management system that replaces a paper-based workflow
for an events rental business (tents, chairs, decor, PA systems).

The core job is a document chain:

```
Inquiry → Quote → [accepted] → Event → Delivery Note → Invoice → Payment → Receipt
                       │
                       └→ Bookings (equipment committed for dates)
```

Around that chain sit four supporting concerns: an equipment catalog with
quantity-based availability, staff assignment, per-event expense tracking, and a
voice capture pipeline that can create most record types by speech instead of
typing.

### The two properties that define the design

This system replaces physical books. A paper invoice does not change when prices
go up, and it does not vanish when a server dies. The digital system must match
both properties:

1. **Issued documents are historical records.** They are never silently altered.
2. **Data loss is not acceptable.** Backups are automated and restore is tested.

Almost every unusual decision in this architecture traces back to one of these
two. See `domain-invariants.md`.

---

## 2. Technology stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router), TypeScript strict | Single deployable, RSC by default |
| Bundler | Turbopack | Dev and build |
| UI | React, Tailwind v4, shadcn/ui, Radix | Components vendored into repo |
| Typeface | Geist | UI + Geist Mono for reference numbers |
| Forms | react-hook-form + Zod resolver | Shares schemas with server |
| Database | PostgreSQL (Neon in cloud, Docker locally) | |
| ORM | Prisma | `schema.prisma` is the schema source of truth |
| Auth | Better Auth | Self-hosted, owns tables in our Postgres |
| Mutations | Server Actions via `next-safe-action` | Auth + validation cannot be skipped |
| Object storage | Cloudflare R2 (S3-compatible) | Audio + generated PDFs, behind an adapter |
| PDF | `@react-pdf/renderer` | No headless browser |
| AI SDK | Vercel AI SDK | One interface for STT and extraction |
| AI gateway | Vercel AI Gateway | LLM calls only; STT calls go direct |
| Extraction model | Google Gemini Flash | Structured output via Zod schema |
| STT | Adapter interface; provider decided by benchmark | Candidates: Deepgram Nova-3, Gemini |
| Scheduling | Vercel Cron (cloud) / system cron (VPS) | Plain HTTP routes either way |
| Errors | Sentry | |
| Tests | Vitest, Playwright | See `../conventions/testing.md` |

### Explicitly rejected

- **Runtime CSS-in-JS** (MUI, Chakra, Mantine, styled-components). Slower, fights
  React Server Components, and its abstraction depth makes agent edits
  unpredictable.
- **A server-side job queue in v1.** Voice capture is synchronous from the user's
  point of view; retry lives on the device. See §5.
- **Barrel files.** They defeat tree-shaking and are the most common cause of a
  slow Next.js dev server. Import from the specific file.
- **A monorepo.** One app, one package.

---

## 3. Deployment

Three phases, planned from the start so none of them is a rewrite.

**Phase 1 — Local development.** Postgres in Docker, app on `localhost:3000`,
R2 for storage (or a local S3-compatible container).

**Phase 2 — UAT on Vercel + Neon.** Deployed so Susan can use it and give
feedback. Neon branch per preview deployment, so migrations can be exercised
against a throwaway database.

**Phase 3 — Production on a DigitalOcean droplet.** Docker Compose: the Next.js
app in standalone output mode, Postgres, and Caddy for TLS. Moved once a domain
is purchased alongside the marketing website.

### Portability rules (these keep Phase 3 cheap)

1. No Vercel-proprietary APIs beyond cron, and cron endpoints are ordinary HTTP
   route handlers any scheduler can call with a bearer secret.
2. All object storage access goes through `lib/storage`. Never import an S3 SDK
   from application code.
3. `output: 'standalone'` in `next.config.ts` from the first commit.
4. Everything host-related comes from environment variables, validated once in
   `lib/env.ts`. No hardcoded URLs anywhere.
5. Neon is ordinary Postgres. Migration to the droplet is a dump and a restore.

Region: deploy to a European region (Frankfurt) initially. Round-trip to Nairobi
is roughly 130–160ms, and perceived voice latency is dominated by the model
providers' own regions. Measure before optimising.

---

## 4. Application structure

```
src/
├── app/                    Routing only. No business logic. Ever.
│   ├── (auth)/             sign-in
│   ├── (app)/              Authenticated shell + feature routes
│   ├── (public)/q/[token]  Client-facing shared quote (no auth)
│   └── api/                Uploads, cron, webhooks
├── modules/                Feature modules. The centre of gravity.
├── components/
│   ├── ui/                 shadcn primitives (Tier 1)
│   └── ...                 App composites (Tier 2)
├── lib/                    db, auth, storage, money, dates, env, errors, ai
└── styles/                 globals.css — design tokens live here
```

### Module shape

Every module in `src/modules/` has the same five parts:

```
modules/quotes/
├── schema.ts        Zod schemas. THE source of truth for this domain's shapes.
├── domain/          Pure functions. No I/O, no Prisma, no React.
├── repository.ts    The ONLY file in the module permitted to import Prisma.
├── actions.ts       Server Actions. Authorise → validate → domain → persist.
└── ui/              Components specific to this module.
```

Modules: `clients`, `catalog`, `inventory`, `quotes`, `events`, `staff`,
`finance`, `documents`, `voice`.

`voice` is the one module with a larger internal structure, because it has more
moving parts. See `voice-pipeline.md`.

### The three structural rules

These exist so that an agent working on one module cannot silently break another.

1. **`app/` renders, it does not decide.** A route file authenticates, calls into
   a module, and renders. If a calculation is happening in `app/`, it is in the
   wrong place.
2. **Modules communicate through `domain/` and `schema.ts` only.** Never import
   another module's `repository.ts`. If quotes needs inventory data, it calls an
   inventory domain function or an inventory repository function re-exported for
   that purpose — explicitly, and documented.
3. **A shape is defined once.** The same Zod schema drives the form, the Server
   Action input validation, and the AI extraction output schema. When it changes,
   everything downstream fails at compile time. That is the point.

---

## 5. Request lifecycles

### Standard mutation

```
Client component (react-hook-form + Zod)
  → Server Action (next-safe-action)
      → session + organisation resolved
      → input parsed against the module's Zod schema
      → domain function computes the result (pure)
      → repository persists inside a transaction
  → revalidatePath / revalidateTag
  → UI updates
```

Authorisation and tenant scoping happen in the action wrapper, not in each
action body. This is deliberate: it makes forgetting them structurally difficult
rather than a matter of discipline.

### Voice capture

```
Device: record audio (MediaRecorder)
  → write blob to IndexedDB BEFORE any network attempt
  → request presigned R2 upload URL
  → upload audio directly to R2 (never through a serverless function)
  → POST { storageKey, intent? } to the transcription route
      → STT adapter produces a transcript, with keyterms supplied
      → transcript persisted immediately
      → extraction call (Gemini, Zod schema, temperature 0) returns fields
      → VoiceCapture row completed
  → review screen renders pre-filled form with uncertain fields flagged
  → user corrects and confirms
  → normal Server Action path from here; nothing is special about the save
  → IndexedDB entry cleared
```

If any network step fails, the capture stays in IndexedDB and is retried. The
queue is visible in the app shell. Nothing is ever saved without confirmation.

### Why there is no server-side job queue

Susan is waiting on the review screen while transcription and extraction run, so
the work is synchronous by nature. The retry requirement in the PRD is about a
dropped connection on the road, which is a device-side concern and is handled in
IndexedDB. Adding a server queue would add infrastructure that solves neither
problem.

Two scheduled jobs exist, and they are ordinary HTTP routes protected by a
shared secret:

- `POST /api/cron/keyterms` — rebuild the STT keyterm list from client surnames,
  delivery locations, and catalog item names. Daily.
- `POST /api/cron/backup` — trigger a database dump to R2. Daily.

---

## 6. Multi-tenancy

v1 has one user and no user-management interface. The data model is nonetheless
multi-tenant from the first migration.

**Every business record carries `organizationId`, not `userId`.**

This is a deliberate departure from the PRD's wording ("every record is owned by
a user account"). Under user ownership, adding a second office user would show
them an empty system, because none of Susan's records would belong to them. The
PRD's actual goal — that a second user is a configuration change, not a
migration — is only satisfied by tenant ownership.

- `Organization` — the business.
- `User` — a login (Better Auth).
- `Membership` — joins a user to an organisation with a role. Roles exist in the
  schema and are not exposed in the UI in v1.

Every repository query filters on `organizationId`. This is enforced by
convention plus the review pass described in `../conventions/testing.md`.

---

## 7. Cross-cutting decisions

**Money.** Integer minor units (KES cents) everywhere. Never a float, never a
`Decimal` in application code. Column type `Int` in Prisma, field names ending
in `Cents`. Formatting happens only at the render boundary.

**Time.** All timestamps stored as UTC `DateTime`. All *event* dates stored as
`Date` (no time component) because an event happens on a day, not at an instant.
The display timezone is fixed to `Africa/Nairobi`. Relative date resolution in
voice extraction is anchored to the current date in that zone.

**Currency.** KES only. A currency field exists on documents for future-proofing
but is not user-configurable in v1.

**Reference numbers.** Human-readable, sequential, gapless, never reused.
Allocated from a counter row inside the same transaction that issues the
document. See `domain-invariants.md` §3.

**Instrumentation.** The PRD's success metrics are only measurable if events are
timestamped from launch, so instrumentation is a v1 requirement rather than a
later addition. Every record carries `createdVia` (`TYPED` | `VOICE`) and an
optional `voiceCaptureId`. Every double-booking warning is recorded along with
whether the user proceeded.

---

## 8. Out of scope for v1

Restated from the PRD so no agent invents them: field staff mobile access,
business analytics and reporting, win/loss tracking on quotes, contract
generation, a conversational voice agent, follow-up reminders, website lead
intake, a user management UI, offline operation for anything other than voice
capture, and any tax or eTIMS/KRA integration.

Buffer days on equipment (leaving the day before, returning the day after) are
deferred. The quantity model must be built now; the buffer window layers on top
of it later without a schema change.
