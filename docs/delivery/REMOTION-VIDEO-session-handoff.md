# REMOTION WALKTHROUGH VIDEO SESSION — HANDOFF PROMPT

You are producing a **rendered MP4 walkthrough video** of the Sunflower Events
Business Management System, for Edwin (Lobster Technologies) to send to his
client Susan before their proposal meeting. The whole product is designed —
every screen group A–G is in Paper, client-approved or pending approval, and the
five client-facing PDF documents are drawn (`D6-plan.md` §8, PDF template track,
2026-09-10). This session builds a **Remotion project** that animates the real
screen designs into a narrated product tour and renders it to a video file.

**This is an experiment Edwin explicitly asked to try.** Read the "MANAGE
EXPECTATIONS" section below and surface it to Edwin early — a polished motion
piece is an iterative, watch-every-render effort, not a one-shot. If after the
first render pass the quality/effort trade-off looks wrong, say so plainly and
recommend falling back to the Loom-walkthrough approach (already speced in
`docs/delivery/CLIENT-HANDOFF-session-handoff.md`, deliverables 2 + 3).

---

## 0. MANAGE EXPECTATIONS — read this to Edwin before writing code

Remotion renders video by running React in a headless browser, one frame at a
time, and stitching the frames into an MP4. It is real "video as code." But:

- **"It renders" is not "it looks good."** A still frame an agent can screenshot
  and judge instantly. **Motion cannot be judged from a screenshot** — mistimed
  entrances, janky easing, a cursor arriving before the screen changes, text
  that flashes for four frames. Catching those means rendering the video,
  sampling frames across time, adjusting, and re-rendering. The loop is slow and
  motion quality genuinely needs a human watching the finished MP4. The industry
  consensus (2026) is that there is **no tool that verifies animation intent** and
  human sign-off stays mandatory.
- **Realistic scope for one session:** a **60–90 second** tour — wordmark title
  card, 8–12 key screens with simple, consistent transitions (fade/slide on one
  easing curve), caption text per screen, optional a single moving cursor on 2–3
  screens, over an optional voiceover or music bed. **Not** a 10-minute
  feature-by-feature demo, not bespoke per-screen choreography, not simulated
  live typing into forms.
- **Licensing is fine:** Remotion's Free License covers individuals and
  companies of up to 3 people for commercial client work at no cost. Confirm
  with Edwin that Lobster Technologies is ≤3 people; if so, nothing to pay. If
  4+, there is a paid company license and you should stop and tell him before
  proceeding.
- **The honest recommendation** remains: for *this one meeting*, a clean Paper
  walkthrough page + a Loom of Edwin narrating it is lower-effort and equally
  persuasive. Remotion earns its keep as a **reusable asset** — a 60-second
  sizzle for the Lobster website, in-app onboarding clips later, or a proposal-
  video template reused for every future client. Frame the output that way: this
  session is also building Edwin's first reusable video template.

If Edwin still wants to proceed after hearing this — and he said he does, "I just
want to try" — build it well and keep it tight.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `docs/delivery/CLIENT-HANDOFF-session-handoff.md` — the companion session's
  handoff. **Deliverable 2 (the Loom walkthrough script)** is the narrative
  spine you are turning into video: the document chain as Susan's working day
  (call comes in → quote → win → run event → get paid → see the business).
  **Deliverable 3 (the artboard spec)** names the exact screens. If those two
  files already exist in `docs/delivery/client/` (`WALKTHROUGH-SCRIPT.md`,
  `WALKTHROUGH-ARTBOARDS.md`), **use them as the source of truth for screen
  order and narration** — do not re-derive. If they do not exist yet, derive the
  spine yourself from the sources below and note that the companion session
  should reconcile.
- `docs/business-management-system-prd.md` — Problem Statement, Goals, User
  Stories. The source for caption copy in Susan's language ("respond to a client
  while you're still on the call", "never commit equipment to two events at
  once", "see whether that event was actually profitable"). Owner: Lobster
  Technologies (Edwin Kamau). Client: Susan, Sunflower Events.
- `docs/delivery/build-plan.md` — the "Susan can…" statements per phase and the
  document chain. Context for what the app does; not for scope of the video.
- `docs/architecture/document-lifecycle.md` §1 (the chain diagram) — the video
  follows this exact order: Quote → Event → Delivery Note → Invoice → Payment →
  Receipt.
- `docs/conventions/design-system.md` §3 (colour), §4 (type — Geist / Geist
  Mono, the scale), §8 (motion — **one easing curve `cubic-bezier(0.16, 1, 0.3,
  1)`**, durations 120/180/240ms, nothing bounces, nothing exceeds ~300ms). The
  video's motion must feel like the same system: one curve, quick, no bounce.
  The tokens (`src/styles/globals.css`) are the palette — pull the actual hex/
  oklch values from there for backgrounds, accent, text.
- `docs/delivery/D6-plan.md` §8 (design status — be aware Group G + the PDF track
  are "designed, pending sign-off"; the video can still show them) and §5.1
  ("restraint is the aesthetic, typography does the work") — the video's visual
  register.
- Paper file `01M1X43Q66HDD6TF72TYYWH3KE` — **read + export only, never edit.**
  This is where the screen images come from. Pages:
  - `A-0` "D6 — Group C · Quoting" — Quote screen, public shared quote (C3)
  - `B-0` "D6 — Group D · Running events & getting paid" — Calendar, Event
    detail, Delivery note detail, Invoice detail, Record payment dialog
  - `C-0` "D6 — Group E · Money & records" — Monthly summary, Document store
  - `D-0` "D6 — Group F · Voice" — Voice review shell, recording overlay
  - `E-0` "D6 — Group G · Dashboard" — Dashboard (populated)
  - `F-0` "D6 — PDF templates" — the Quote / Delivery note / Questionnaire /
    Invoice / Receipt PDF faces (Rows 1–5, the "issued/final" canonical of each)
  - `9-0` "D6 — Group B · Daily inbound" — Availability lookup

Do not read the wider `docs/` tree. Do not read the other D6 session handoffs.

---

## 2. FIRST ACTIONS

1. **Tell Edwin the "MANAGE EXPECTATIONS" summary** (2–3 sentences) and confirm
   two things:
   - Lobster Technologies is **≤3 people** (Remotion Free License applies).
   - He wants to proceed knowing the first render will need his eyes on the
     actual MP4 and probably 1–2 rounds of "the timing on screen 4 is off."
2. Confirm scope with Edwin:
   - **Length target** — recommend 75 seconds.
   - **Voiceover?** Three options: (a) no VO, captions + a music bed only;
     (b) Edwin records a voiceover from the Loom script and drops the audio file
     in `public/`; (c) a placeholder silent cut now, VO added later. Recommend
     (a) or (c) for this session — VO recording is Edwin's job, not yours.
   - **Aspect ratio** — 1920×1080 (landscape, for email/desktop). Confirm.
   - **Music** — if he wants a bed, he provides a royalty-free track in
     `public/`; otherwise silent.
3. Check whether `docs/delivery/client/WALKTHROUGH-SCRIPT.md` and
   `WALKTHROUGH-ARTBOARDS.md` exist. If yes, they drive screen order + captions.
   If no, derive a 10-screen spine from `document-lifecycle.md` §1 + the PRD and
   flag for reconciliation.
4. **Export the screens from Paper.** For each screen in the spine, use the
   Paper `export` tool on the single canonical **1440-wide desktop artboard**
   (and the **390 mobile** artboard for the 2–3 phone moments — voice capture,
   the public shared quote). Export as **PNG at 2x scale**. Save them to
   `remotion/public/screens/` with clear names (`01-dashboard.png`,
   `02-availability.png`, `03-quote-builder.png`, `04-voice-review.png`,
   `05-shared-quote-mobile.png`, `06-quote-pdf.png`, `07-calendar.png`,
   `08-event-detail.png`, `09-delivery-note-pdf.png`, `10-invoice-pdf.png`,
   `11-record-payment.png`, `12-receipt-pdf.png`, `13-finance.png`,
   `14-document-store.png`). ~14 images.
   - The PDF faces on page `F-0` are already page-shaped (595×842 proportion) —
     export those as-is; they'll sit on a neutral ground in the video like a
     document held up to camera.

---

## 3. BUILD THE REMOTION PROJECT

**Location:** a new `remotion/` directory at the repo root. It is a **separate,
self-contained project** — its own `package.json`, not wired into the Next.js
app, not part of `pnpm verify`. Add `remotion/` to the root `.gitignore`'s
`node_modules` handling but **commit the source** (`remotion/src/`,
`remotion/public/`, `remotion/package.json`, `remotion/remotion.config.ts`).

**Use pnpm** (per the repo convention — never npm/yarn). Scaffold with:

```bash
cd remotion && pnpm dlx create-video@latest --yes --blank --no-tailwind .
```

If the scaffolder insists on a subdirectory, scaffold then move files up. Pin
the Remotion version in `package.json` (no `^`).

### Composition config

- `id: "SunflowerWalkthrough"`
- `width: 1920`, `height: 1080`, `fps: 30`
- `durationInFrames`: computed from the scene list (target ~2250 = 75s)

### Structure — force component reuse (this is the #1 agent mistake)

```
remotion/src/
├── Root.tsx                     registers the composition
├── SunflowerWalkthrough.tsx     the top-level timeline (a <Series>)
├── theme.ts                     colours + type pulled from globals.css tokens
├── components/
│   ├── TitleCard.tsx            wordmark + tagline, used for open + close
│   ├── ScreenScene.tsx          ONE component: screen image + caption + entrance
│   ├── DeviceFrame.tsx          optional thin bezel for mobile screenshots
│   ├── Caption.tsx              the lower-third caption text
│   └── Cursor.tsx               a moving pointer, used on 2–3 scenes only
└── scenes.ts                    the data array: [{ img, caption, durationInFrames, mobile? }]
```

**`ScreenScene` is parameterised and used for every screen.** Do not copy scene
markup 12 times. The timeline maps over `scenes.ts`.

### Motion rules (from `design-system.md` §8 — non-negotiable for coherence)

- **One easing curve everywhere:** `cubic-bezier(0.16, 1, 0.3, 1)`. Define it
  once in `theme.ts` as an `Easing.bezier(...)` and pass it to every
  `interpolate`.
- Entrances: a screen **rises 24px and fades in** over ~12 frames (~400ms), then
  holds. Exits: fade out over ~8 frames. Nothing slides the full width, nothing
  bounces, nothing scales past 1.0.
- Captions rise into place ~4 frames after their screen settles.
- If a cursor is used: it moves on the same curve, "clicks" (a quick 0.9 scale
  dip + a subtle ring pulse) just before the screen it's on cross-fades to the
  next. The cursor is a nice-to-have — **cut it entirely if it's eating the
  session** and the screens carry the story alone.
- **Coding correctness (from the Remotion LLM rules):**
  - Work in **frames, not seconds**. `useCurrentFrame()`; convert with
    `frame / fps` only where a real-time value is needed.
  - Every `interpolate()` call includes `extrapolateLeft: 'clamp'` and
    `extrapolateRight: 'clamp'`.
  - `spring()` only if needed, always `{ fps, frame, config }` with a damping
    that does not overshoot (`config: { damping: 200 }` ≈ no bounce). Prefer
    `interpolate` + the shared bezier over spring for this piece.
  - Layer with `<AbsoluteFill>`. Sequence scenes with `<Series>` /
    `<Series.Sequence durationInFrames={...}>` — child `useCurrentFrame()` is
    relative to the scene start.
  - Static images: `<Img src={staticFile('screens/01-dashboard.png')} />` — the
    `<Img>` component, not a bare `<img>`; `staticFile()` for anything in
    `public/`.
  - Audio (if a track is added): `<Audio src={staticFile('music.mp3')} volume={0.3} />`,
    trimmed to the composition length.
  - Any randomness: `random('seed')`, never `Math.random()`.

### Visual register

- Neutral off-white / `--color-background` ground behind every screen. The
  screen image sits centred with a soft shadow and the app's `--radius-lg`
  corner. Generous margin — the screen should not touch the frame edges.
- The PDF faces sit slightly smaller, portrait, on the same ground — they read
  as "a document," distinct from the app screens.
- Type: Geist for captions (load via `@remotion/google-fonts/Geist` or bundle
  the font). Caption = one short line, `--text-xl`ish, `--color-text-primary`,
  bottom-left third, with a hair of letter-spacing tightening per the type
  scale. A tiny `--color-text-muted` kicker above it (e.g. "QUOTING",
  "GETTING PAID") to mark the chapter.
- Title card: the **Fraunces** wordmark "Sunflower Events" (the same serif used
  on the document letterheads — see page `F-0`), the Lobster Technologies credit
  small at the bottom, on the neutral ground. Reuse for the closing card with
  "Let's talk" + the meeting date as a caption.

### The scene list (adjust to the walkthrough script if it exists)

| # | Screen (from `public/screens/`) | Chapter kicker | Caption (Susan's language) |
|---|---|---|---|
| 0 | Title card | — | "Sunflower Events — your business, in one place" |
| 1 | Dashboard | YOUR MORNING | "Everything that needs you today, on one screen." |
| 2 | Voice review (mobile) | A CALL COMES IN | "Speak the request while you're still driving. Nothing saves until you check it." |
| 3 | Quote builder | QUOTING | "Build the quote in a minute — with live stock numbers as you add items." |
| 4 | Availability lookup | QUOTING | "See exactly how many chairs are free on the 14th — not just 'booked' or 'not'." |
| 5 | Public shared quote (mobile) | QUOTING | "Send it to WhatsApp in one tap." |
| 6 | Quote PDF | THE DOCUMENT | "This is what your client opens. This is your business's face." |
| 7 | Calendar | THE JOB IS ON | "Accept the quote — the event, the equipment, the calendar all update themselves." |
| 8 | Event detail | RUNNING THE EVENT | "One place for the equipment, the staff, the documents, the costs." |
| 9 | Delivery note PDF | ON SITE | "The delivery note and the sign-off form print straight from the quote." |
| 10 | Invoice PDF | GETTING PAID | "The invoice builds itself from the delivery note. Nothing retyped." |
| 11 | Record payment | GETTING PAID | "Record the payment —" |
| 12 | Receipt PDF | GETTING PAID | "— the receipt is made automatically." |
| 13 | Finance / monthly summary | THE WHOLE PICTURE | "What you invoiced, what you spent, what you kept — per event and per month." |
| 14 | Document store | NO MORE BOOKS | "Every quote, invoice and receipt — searchable. You never carry a book again." |
| 15 | Closing card | — | "The full system, built in stages you can use and check. Let's talk on [DATE]." |

~14–15 scenes × ~140 frames ≈ 2100–2250 frames ≈ 70–75s at 30fps. Tune per-scene
duration so the caption is comfortably readable (min ~90 frames per scene, more
for the document scenes).

---

## 4. RENDER AND VERIFY

1. **Stills first.** Before any full render, render **single still frames** at
   the midpoint of each scene:
   `pnpm dlx remotion still SunflowerWalkthrough --frame=<n> out/still-<n>.png`
   Screenshot-check each: is the screen centred, caption readable, colours right,
   nothing clipped? Fix layout on stills — they're as checkable as a web
   screenshot. **Do the whole layout pass on stills.**
2. **Then the full render:**
   `pnpm dlx remotion render SunflowerWalkthrough out/sunflower-walkthrough.mp4`
   (H.264, the default. Add `--codec=h264` explicitly. 1080p.)
3. **Sample the motion.** You cannot watch the MP4. Instead render stills at
   **scene boundaries** — the last frame of each scene and the first frame of
   the next — and check the transition reads (screen A fading as screen B rises,
   caption gone before the cut, cursor click landed before the change). Also
   sample 3–4 frames *inside* one entrance to confirm the rise/fade isn't
   janky or too fast.
4. **Hand the MP4 to Edwin.** He watches it. This is the mandatory human gate —
   say so explicitly. Expect notes like "screen 6 holds too long", "the caption
   on 3 is hard to read", "the cursor on 11 feels late". Apply, re-render,
   repeat — budget for **2 rounds**.
5. Use `SendUserFile` to put `out/sunflower-walkthrough.mp4` in front of Edwin
   (and any still frames you want him to check).

---

## 5. CONSTRAINTS

- **Do not touch the product** (`src/`, `prisma/`, the Next.js app) or the Paper
  design file (read + export only). Everything you create lives in `remotion/`.
- **`remotion/` is not part of `pnpm verify`** and must not break it. It has its
  own `package.json` and its own `node_modules`.
- **pnpm only** — `pnpm dlx`, never `npx`/`npm`/`yarn`, even for one-offs.
- **Pin the Remotion version.** No `^`.
- **One `ScreenScene` component**, data-driven from `scenes.ts`. No copy-pasted
  scene markup.
- **One easing curve**, from `design-system.md` §8. Nothing bounces. Nothing
  exceeds ~400ms. The video must feel like the same system as the app.
- **Colours and type come from `globals.css` tokens** — no invented palette.
- **Captions in Susan's language** — outcomes, not features. If a caption needs
  a technical term, rewrite it.
- **No voiceover recording** — that's Edwin's job. Silent cut or a music bed he
  provides.
- **Verify on stills; the MP4 is Edwin's call.** Never tell Edwin the video is
  "done" — tell him it's ready for his review, and what you were and weren't
  able to check.
- End the session with: the MP4 path, the still frames you checked, what you
  could not verify (motion feel, timing, pacing), the outstanding decisions
  (VO? music? length?), and a one-line honest verdict on whether Remotion was
  worth it here vs. the Loom fallback.

After this session Edwin has a rendered walkthrough MP4 to review, a reusable
`remotion/` project he can re-render with new screens or captions, and a clear
picture of what it took — so he can decide whether to use it for Susan's
meeting or fall back to the Loom, and whether to invest in it as an agency
asset.
