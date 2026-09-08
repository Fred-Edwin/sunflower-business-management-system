# PHASE-NN · <Phase name>

**Status:** Planning | Backend in progress | Frontend in progress | In review | Complete
**Written by:** Orchestrator, <date>

> **The orchestrator writes this file.** It is not hand-written and not written
> in advance. It is created at the start of the phase from the definition in
> `../build-plan.md`, and every session appends to §7.

---

## 1. Susan can

Copy the "Susan can" statement from `../build-plan.md`. This is the phase's
reason for existing and the thing that gets demonstrated at the end.

> Susan can …

## 2. Scope

**In scope**
-

**Explicitly out of scope**
-

> Anything not listed as in scope is out of scope. If something seems necessary,
> record it in §8 rather than building it.

## 3. Reading list

Read these. Do not read the whole `docs/` tree.

- `docs/architecture/domain-invariants.md` — always
- `docs/conventions/coding-standards.md` — always
- `docs/architecture/<relevant>.md`
- `docs/conventions/ui-conventions.md` — frontend only
- Paper artboards: `<flow>` desktop + mobile

## 4. Invariants in play

Specific IDs only, so the review pass has a checklist rather than a whole
document.

- INV-
- INV-

---

## 5. Contract

**Written by the orchestrator before any implementation begins.** Derived from
reading the phase definition *and the Paper artboards*, so it reflects what the
frontend actually needs from the backend.

### Schema changes
`prisma/schema.prisma`

```prisma
```

### Zod schemas
`src/modules/<domain>/schema.ts`

```ts
```

### Server Actions
```ts
```

### Repository functions
```ts
```

### Domain functions
```ts
```

> Fixed once committed. If an implementation session must change it, the change
> is made here first and recorded in §7.

---

## 6. Handoff prompts

The orchestrator writes both. Paste them into fresh sessions.

### Backend

```
You are the backend implementation agent for the Sunflower Events system.
Read CLAUDE.md, then docs/delivery/phases/PHASE-NN.md.
Implement §6a. Append your entry to §7, and any recommendations to §10.
```

#### 6a. Backend tasks
- [ ]

#### Tests required
- [ ] INV-… :
- [ ]

#### Done when
- [ ] All tasks complete
- [ ] All invariant tests pass
- [ ] `pnpm verify` passes
- [ ] §7 updated, including any contract change
- [ ] §10 updated, or explicitly marked "no recommendations"

---

### Frontend

```
You are the frontend implementation agent for the Sunflower Events system.
Read CLAUDE.md, then docs/delivery/phases/PHASE-NN.md — including §7,
which may contain contract changes from the backend session.
Implement §6b. Append your entry to §7, and any recommendations to §10.
```

#### 6b. Screens
| Screen | Route | Artboard (desktop) | Artboard (mobile) |
|---|---|---|---|
| | | | |

#### Components
Existing — compose, do not restyle:
-

New Tier 2 — follow the promotion rule in `design-system.md` §12:
-

#### Done when
- [ ] Screens match artboards at 390px and 1440px
- [ ] One route per screen — no mobile twin
- [ ] Loading, empty, error, populated states all present
- [ ] New components in `/dev/gallery` with every state
- [ ] Verified visually against artboards via screenshots
- [ ] `pnpm verify` passes

> Do not write Playwright tests. See `docs/conventions/testing.md` §4.

---

## 7. Status log

Append-only. This is the handoff mechanism and it survives context loss.

```
### YYYY-MM-DD · Orchestrator — planning
Contract defined. Notes:

### YYYY-MM-DD · Backend
Completed:
Contract changes (frontend must read these):
Deviations from plan, and why:

### YYYY-MM-DD · Frontend
Completed:
Deviations:

### YYYY-MM-DD · Orchestrator — review (fresh session)
Invariants checked:
Violations found:
Resolved:
```

> The review runs as a **new session in the orchestrator role**, reading the
> invariants and the diff without the planning context. Reviewing in the same
> session that planned the work means reviewing against its own assumptions.

---

## 8. Acceptance criteria

Copied verbatim from the PRD so the trace is verifiable. Do not paraphrase.

- [ ] *(PRD § …)*

## 9. Demo script

The steps to perform in a browser to show the "Susan can" statement is true.
Run this before marking the phase complete.

1.
2.

## 10. Recommendations and decisions

Every session appends here, following `CLAUDE.md` § *Judgment and
recommendations*. Maximum five items per session, ranked. Silence is valid.

**Check this section before proposing.** If something was rejected already, do
not raise it again without a new reason.

### Orchestrator — gap analysis

Run before the contract is written.

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| 1 | GAP | | S/M/L | do now / next phase / v2 / no | approved / rejected / deferred |

**Details**

> **[GAP] Title**
> What is missing and why it matters for this product.
> Cost: S · Recommendation: do now
> **Decision:** —

### Backend session

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| | | | | | |

### Frontend session

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| | | | | | |

### Review session

| # | Type | Title | Cost | Recommendation | Decision |
|---|---|---|---|---|---|
| | | | | | |

---

### Carried forward

Anything marked **do next phase** or **v2**, so it is not lost when this file
stops being read.

| Item | From | Target |
|---|---|---|
| | | |

### Blocking questions

For Edwin or Susan. An agent that hits one of these stops and records it here
rather than guessing.

-