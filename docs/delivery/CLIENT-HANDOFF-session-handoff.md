# CLIENT DELIVERABLES SESSION — HANDOFF PROMPT

You are producing the **client-facing package** Edwin (Lobster Technologies) will
take into his next meeting with Susan (Sunflower Events). Design of the whole
product is done — every screen group A–G is client-approved or pending approval,
and the five client-facing PDF documents are designed (`D6-plan.md` §8, PDF
template track entry, 2026-09-10). This session does **not** touch the product,
the schema, or the Paper design file. It produces three written/spoken artefacts:

1. **A Proposal & Agreement document** — the thing Susan signs.
2. **A Loom walkthrough script** — what Edwin says, screen by screen, when he
   records the video for Susan.
3. **An artboard spec** — exactly which Paper artboards to pull into a clean
   client-facing walkthrough page, in what order.

Then a short "how to run the meeting" note.

**Context Edwin gave when commissioning this (2026-09-10):**
- He has designed the whole app and the client-facing documents. This is the
  point where he shows Susan what he'll build and how he'll charge for it.
- He has never done a client proposal before and wants it done the way a
  professional software agency does it.
- Before the meeting he wants to send Susan a **video or prototype** so she
  understands how the app works. Decision reached this session: **a clean Paper
  walkthrough page + a Loom recording of Edwin narrating it** is the right
  pre-meeting artefact (not a Figma prototype, not a Remotion video — both are
  post-signature investments; Remotion in particular is an iterative
  watch-every-render project, not a one-shot, and only pays off as a reusable
  agency asset). The Loom script (deliverable 2) and the artboard spec
  (deliverable 3) support that recording.
- **Open question for Edwin — you must ask before finalising pricing:** has he
  already agreed a rough budget or price range with Susan, or is this proposal
  the first number she sees? This changes how the commercials section is framed.
  Do not invent a price. Leave the figures as clearly-marked placeholders with a
  worked structure, OR — if Edwin gives you numbers when you ask — fill them in.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `docs/business-management-system-prd.md` — the whole PRD. This is the source
  for the "Understanding" and "Goals" sections of the proposal, in Susan's
  language. Note: **Owner is Lobster Technologies (Edwin Kamau); Client is
  Susan, Sunflower Events.** The problem statement (deals lost to slow response,
  paper records at risk, no availability truth, no profitability visibility) is
  the spine of the proposal's opening.
- `docs/delivery/build-plan.md` — **the entire file.** This is the source for:
  - the **scope**, organised as phases (PHASE-00A through PHASE-07), each with a
    "Susan can…" statement, a screen inventory, and a build list;
  - the **"Screen count by phase"** table (49 screens, 11 dialogs/flows, 5 PDF
    templates total) — the raw material for a scope table Susan can read;
  - the **"External dependencies"** section — Susan owes ~20 voice recordings
    (blocks Phase 5) and a domain purchase (blocks Phase 7); two things to
    confirm during Phase 1. These become the "What we need from you" section.
  - the **phase weighting** — Phases 2 and 3 are the heaviest; the orchestrator
    may split them. Relevant to any timeline you sketch.
- `docs/architecture/system-overview.md` — **§8 "Out of scope for v1"** is the
  single most important paragraph for the proposal. It becomes the **"Explicitly
  out of scope"** section verbatim in intent (field staff mobile, analytics,
  win/loss tracking, contract generation, conversational voice agent, follow-up
  reminders, website lead intake, user management UI, offline beyond voice,
  buffer days, **any tax / eTIMS / KRA integration**). Also §1 (the two
  properties that define the design — issued documents are historical records,
  data loss is not acceptable) — good "why this is built carefully" language.
  Also §2 the stack table and §3 deployment (local → Vercel/Neon UAT →
  DigitalOcean droplet) — the "How it's hosted" section, and the pass-through
  costs (Neon, R2, the AI API, a domain).
- `docs/delivery/D6-plan.md` — §8 status log (every group's design state and
  what's approved vs pending — the proposal should be honest that Group G +
  the PDF track are "designed, pending your sign-off"), and §9h (the five
  schema/token gaps that D7 ratifies — **not** client-facing, but Edwin should
  know they exist before quoting Phase 1, because two are Phase-1 schema
  additions: `Organization.paymentInstructions`, `Client.addressLine`).
- `docs/delivery/D6-new-components.md` — the `LetterheadBlock` entry (now
  Built/finalised) and the note that the PDF faces are otherwise
  token-composed. Only relevant so you can state design is genuinely complete.
- `docs/conventions/design-system.md` §1 — the D0–D7 stage list. Use it to
  explain, in the proposal, that **design (D0–D6) is done and de-risked** —
  the client is paying for implementation (D7 onward), not a blank-page design
  exercise. This is a real selling point: the visual product already exists and
  she's about to see it.
- Paper file `01M1X43Q66HDD6TF72TYYWH3KE` — **read-only.** You need the page and
  artboard inventory (`get_basic_info`, then `get_children` on the relevant
  pages) to write deliverable 3. Do **not** edit anything. Pages:
  - `7-0` / `8-0` "D6 — Group A · Getting set up"
  - `9-0` "D6 — Group B · Daily inbound"
  - `A-0` "D6 — Group C · Quoting"
  - `B-0` "D6 — Group D · Running events & getting paid"
  - `C-0` "D6 — Group E · Money & records"
  - `D-0` "D6 — Group F · Voice"
  - `E-0` "D6 — Group G · Dashboard"
  - `F-0` "D6 — PDF templates" (built this session — Rows 0–5)
  - `6-0` "D3 — Components" (the approved component set — context only)

Do not read the wider `docs/` tree. Do not read the architecture docs beyond
`system-overview.md`. Do not read the other D6 session handoffs.

---

## 2. FIRST ACTIONS

1. Ask Edwin the **open question** (§ top of this file): has a budget/price range
   already been discussed with Susan? Wait for the answer before writing the
   commercials section. Everything else you can draft while waiting.
2. Confirm two facts with Edwin you cannot get from the repo:
   - **Legal entity & location** — is "Lobster Technologies" a registered
     company, a business name, or a sole proprietorship? Kenya-registered? This
     sets the tone of the agreement (a registered Ltd signs differently from a
     freelancer).
   - **His rate basis** — does he think in a day rate, a per-phase fixed price,
     or a total project price? And does he want a **post-launch support
     retainer** offered as a line item?
   - **Timeline he can commit to** — rough weeks per phase, and whether he's
     working on this full-time or alongside other work.
3. `open_file` the Paper file and `get_basic_info` + `get_children` on pages
   `7-0`/`8-0`, `9-0`, `A-0`, `B-0`, `C-0`, `D-0`, `E-0`, `F-0` to build the
   artboard inventory for deliverable 3. Screenshot 2–3 hero artboards per group
   so you can name them accurately (the Quote screen, the Dashboard, the public
   shared quote, the Invoice PDF, the Availability lookup, the Voice review
   shell).

---

## 3. DELIVERABLE 1 — Proposal & Agreement

**File:** `docs/delivery/client/PROPOSAL-AND-AGREEMENT.md` (create the
`docs/delivery/client/` directory). Write it as a document Edwin can export to
PDF and send. Professional, plain, not salesy. 6–10 pages. Susan is a
non-technical business owner replacing a paper system — every sentence must be
readable by her.

**Structure (follow this order — it is the agency-standard shape):**

### Cover / header
Lobster Technologies · prepared for Susan, Sunflower Events · date · "Proposal &
Agreement — Sunflower Events Business Management System" · a version/reference
line. Leave a signature block at the very end (both parties, name / signature /
date).

### 1. Understanding
2–3 short paragraphs proving Lobster understands the business and the problem.
Pull directly from the PRD problem statement: the business (tents, chairs, decor,
PA — weddings, funerals, corporate/government), the pain (can't quote in the
moment → lost deals, especially with buyers who compare vendors; paper records
at risk; no availability truth; no profit visibility), and the cost of not
solving it. One sentence on what the system does at a high level.

### 2. What we're building
The scope **in Susan's language, organised by what she'll be able to do** — not
by technical module. Draw the "Susan can…" statements from `build-plan.md` and
group them into ~6 capability headings, e.g.:
- **Quote clients in minutes, from anywhere** (quote builder, catalog picker,
  live availability, deposit, WhatsApp share, the client-facing quote document)
- **Never double-book equipment** (availability engine, "what's free on 14 Oct")
- **Run the event and get paid** (calendar, delivery notes, invoices, payments,
  receipts — all generated from the quote, nothing retyped)
- **Speak instead of type, from anywhere** (global + per-form voice capture,
  always reviewed before saving)
- **See what she earned** (per-event profit, monthly summary, searchable
  document store)
- **A digital system that's a safe replacement for paper** (issued documents
  never silently change, automated backups, a tested restore, a full data export
  she owns)

Under this section, embed **4–6 screenshots** of hero screens (deliverable 3
tells you which). Caption each in one line.

Include a subsection: **"The design is already done."** Explain that Lobster has
completed the full visual design of every screen and every client-facing
document (quotation, delivery note, invoice, receipt, on-site sign-off form) —
Susan will see these in the walkthrough — so the project is implementation of a
known design, not design from scratch. This de-risks timeline and cost. Mention
the documents were designed to a high standard specifically because they are the
business's face to corporate and government buyers.

### 3. Explicitly out of scope for v1
A clean bulleted list, from `system-overview.md` §8 and the PRD Non-Goals. State
plainly that these are deliberate v1 exclusions, each can be added later as a
separate piece of work, and **the system is built so they can be added without
starting over** (multi-user data model from day one; the tax-free invoice is a
plain commercial invoice and a compliant tax invoice would be a later change).
This section protects both parties — write it clearly, not apologetically.

### 4. How it's delivered — phases
A table of the phases from `build-plan.md`, but **client-facing**: phase name,
the "Susan can…" outcome, and a rough duration placeholder (`[X weeks]` — Edwin
fills in). Collapse 00A + 00B into one "Foundations" line. Note that Phases 2
and 3 are the largest and may each run in two parts. State the delivery model:
**each phase ends in something Susan can use in her browser and review** — she
sees working software at every milestone, not a big-bang delivery at the end.

### 5. What we need from you (Susan's responsibilities)
From `build-plan.md` "External dependencies" + the PRD:
- Her real content early: business details, logo, bank/M-Pesa payment details
  for the invoice, her actual equipment catalog, a handful of real clients.
- **~20 voice recordings** in three settings (in the car, on-site, at her desk)
  — needed well before the voice phase, ask early, they have lead time.
- **Feedback turnaround** — a stated number of working days to review each phase,
  or the timeline slips.
- A **UAT period** near the end where she uses the system against her real
  work before cutover.
- **A domain name** purchase, coordinated with the marketing website, before
  the final release phase.
- Two decisions during Phase 1 (how she handles damaged stock — open-ended or
  with a return date; her real quote validity period).

### 6. Commercials
**Do not invent numbers.** Build the *structure* and mark every figure as a
placeholder (`KES [____]`) unless Edwin gave you figures. Include:
- A **pricing model statement** — recommend **fixed price per phase** (Susan
  knows the cost of each stage; Lobster isn't open-ended). Explain it in one
  paragraph.
- A **pricing table**: phase / deliverable / price / payment trigger.
- A **payment schedule**: a deposit (recommend 40–50%) before each phase starts,
  balance on phase completion and acceptance. Net-7 or net-14 on milestone
  invoices. Work pauses if an invoice is more than `[X]` days overdue.
- **Design work** shown as a line — either already delivered (and folded into
  Phase 1 / the total) or itemised — Edwin decides; present it as a value
  already created.
- A **change-request rate** — one clear sentence: work outside this scope is
  quoted separately at `KES [____] per day` before any work begins. This single
  clause prevents most scope disputes.
- **Pass-through costs** — Neon (database), Cloudflare R2 (file storage), the AI
  service for voice, and the domain — listed as third-party running costs that
  are either billed to Susan monthly at cost with no markup, or paid by her
  directly. Give a rough monthly range placeholder.
- **Optional: post-launch support retainer** — a monthly fee for bug fixes and
  small changes after release, with what's included and what counts as a new
  change request. Present as optional, Susan can decline.

### 7. Assumptions
Short list: reliable connectivity (per the PRD — offline is out of scope except
voice), Susan is the only user in v1, content provided on time, one round of
revisions per phase included, hosting decisions as described, KES throughout.

### 8. The agreement (terms)
Keep it proportionate — this is a small engagement, not enterprise. Cover:
- **Intellectual property** — Susan owns the delivered software and its data
  once final payment for a phase is made; Lobster retains the right to reuse
  generic components and know-how.
- **Confidentiality** — mutual, business data kept private.
- **Warranty** — a defined period (e.g. 30 days) after each phase where bugs
  against the agreed spec are fixed free; changes to the spec are new work.
- **Liability** — capped at fees paid; no liability for indirect/consequential
  loss. (Note this is a template clause — recommend Edwin has a lawyer glance at
  it if the contract value is significant.)
- **Termination** — either party may end the engagement with `[X]` days notice;
  Susan pays for work completed and accepted to that point; Lobster hands over
  all code and data.
- **Governing law** — Kenya (confirm with Edwin).
- **Signature block** — both parties.

Add a visible note at the top of section 8: *"This section is a plain-language
agreement suitable for a project of this size. For a contract value above
[Edwin's threshold], both parties may wish to have it reviewed by a lawyer."*

**Tone check for the whole document:** a competent professional writing to a
respected client, not a salesperson and not a lawyer. Short sentences. No jargon
without a plain gloss. Susan should finish it understanding exactly what she's
getting, what it costs, when, and what's expected of her.

---

## 4. DELIVERABLE 2 — Loom walkthrough script

**File:** `docs/delivery/client/WALKTHROUGH-SCRIPT.md`.

A word-for-word (or close) narration script for a **10–15 minute screen
recording** where Edwin clicks through the clean Paper walkthrough page
(deliverable 3) and explains the app as Susan's working day. Structure:

- **Open (30s):** who, what this is, what she's about to see, and that it's a
  design walkthrough — "this is exactly what the finished screens look like;
  I'll show you how a normal week runs through the system."
- **The spine — follow the document chain**, because it's how her business
  actually flows:
  1. **A call comes in** → open the app, start a quote (or speak it while
     driving — show the voice capture and the review screen, stress "nothing
     saves until you check it").
  2. **Building the quote** → catalog picker, quantities, the availability
     number ("200 of your 500 chairs are free that day"), the deposit, the
     total.
  3. **Sending it** → issue, the WhatsApp share, and **show the client-facing
     quotation PDF** — "this is what your client opens. This is your business's
     face." Linger here; the documents are the emotional high point.
  4. **She wins the job** → accept, the event is created, equipment is now
     committed, it shows on the calendar.
  5. **Running the event** → the event hub, assign staff, the delivery note
     (show the PDF, the on-site sign-off form), returns.
  6. **Getting paid** → generate the invoice from the delivery note (nothing
     retyped), show the **invoice PDF**, record a payment, the **receipt PDF**
     appears automatically.
  7. **Seeing the business** → the dashboard (today's events, quotes waiting,
     unpaid invoices, money this month), per-event profit, the searchable
     document store — "you never carry a book again."
- **A short aside on the safe-replacement-for-paper points:** issued documents
  never change; automated backups; you can export everything you own, any time.
- **Close (30s):** "That's the whole system. The proposal that came with this
  video breaks it into stages, each one something you can use and check before
  we move on. Let's talk on [date]."

For each screen, the script gives: **[SCREEN: <artboard name>]** then 2–4
sentences of narration in Susan's-day language, not feature language. Mark where
to pause, where to click, where to slow down (the documents).

Add a **2-paragraph "recording tips" preamble**: keep it to one take if
possible, talk like you're sitting next to her, don't apologise for it being a
design and not a live app, export at 1080p, name the file clearly.

---

## 5. DELIVERABLE 3 — Clean walkthrough artboard spec

**File:** `docs/delivery/client/WALKTHROUGH-ARTBOARDS.md`.

A precise list Edwin uses to build a **new, clean Paper page** ("Client
walkthrough") containing only the happy-path screens in click order — no
annotations, no state matrices, no lane guides. For each entry:

| # | What Susan sees | Source page | Source artboard(s) | Notes |
|---|---|---|---|---|

Walk the D6 group pages in the Paper file and pick the **single populated /
canonical desktop (1440) artboard** for each step in the deliverable-2 spine —
plus the 2–3 places a 390 mobile artboard tells the story better (the voice
capture on the phone, the public shared quote on the phone). Include:
- Dashboard (populated)
- Availability lookup (populated)
- Quote screen (editable/populated)
- Voice review shell · quote (populated) + the recording overlay
- Public shared quote (mobile, valid) — the C3 screen
- The **Quote PDF** (issued/final) from page `F-0`
- Calendar (populated)
- Event detail (overview)
- Delivery note detail (issued) + the **Delivery note PDF** + **Questionnaire
  PDF** from `F-0`
- Invoice detail (issued) + the **Invoice PDF** (issued) from `F-0`
- Record payment dialog
- The **Receipt PDF** from `F-0`
- Monthly summary / finance
- Document store (populated)

End the file with a short **"how to assemble it"** note: duplicate each named
artboard onto the new page, lay them left-to-right in this order at a readable
zoom, add a one-line caption strip above each (from the script's screen
headings), export the page or present it live in the Loom. ~15–20 artboards
total — enough to tell the story, not the whole design.

---

## 6. DELIVERABLE 4 — "How to run the meeting" note

**File:** `docs/delivery/client/MEETING-RUNBOOK.md`. One page. The agency
sequence:

1. **Before:** send the Loom + the proposal PDF in one email (draft that email
   too — 5 sentences, warm, sets up the meeting). Give her a week.
2. **The meeting:** walk the proposal section by section, answer questions,
   capture any scope changes — **do not negotiate price live**, take it away.
3. **After:** one revision of scope/price if needed, resend.
4. **Close:** she signs, pays the first deposit, Phase 1 starts.
Include 4–5 likely questions Susan will ask and how to answer them (timeline,
what if I want changes, what happens if it doesn't work, who owns it, ongoing
cost).

---

## 7. CONSTRAINTS

- **No product code, no schema, no Paper edits.** This session writes Markdown
  in `docs/delivery/client/` only. The Paper file is read-only reference.
- **Invent no prices, no dates, no legal-entity facts.** Ask Edwin; where he
  hasn't answered, use clearly-marked placeholders (`KES [____]`, `[X weeks]`,
  `[registered company / sole proprietor]`).
- **Everything client-facing is in Susan's language.** If a sentence needs a
  glossary, rewrite the sentence.
- **Be honest about design status** — Group G and the PDF track are "designed,
  pending your sign-off," not "done and approved." The proposal can still lead
  with "design is complete" because it is — approval is a formality that the
  walkthrough itself triggers.
- **Scope comes from `build-plan.md` and `system-overview.md` §8 only.** Do not
  add capabilities that aren't in the build plan. Do not soften the out-of-scope
  list.
- End the session by listing the four files created and the open questions still
  outstanding with Edwin (price basis, legal entity, timeline, retainer y/n).

After this session Edwin has a complete package to take to Susan: a signable
proposal, a video script, the screens to put in the video, and a plan for the
meeting.
