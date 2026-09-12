# D6 — The Six Signature Moments

**Companion to `D6-plan.md` §5.** Approved 2026-09-08.

> 90% of the app is quiet Linear/Apple/Mercl-grade restraint. These six places
> get real craft — a piece of motion, a custom graphic, an interaction — that
> Susan will not have seen in Xero, QuickBooks, or a paper book. Each is a small
> artefact drawn in Paper as frames + states + a motion spec the frontend agent
> implements. **Each earns its place by being useful, not decorative.**
>
> Within a group's session the designing agent may propose refinements or
> alternatives to any of these — the user approves, rejects, or iterates. This
> document is the intent, not the final pixels.

---

## The through-line for motion

So the motion reads as one identity, not six unrelated tricks:

- **One easing curve everywhere** — a confident ease-out, approx
  `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Motion always has a direction that means something.** Data responding to
  input moves *toward* the user / *with* the cursor. Things becoming permanent
  *settle* and *lock*. Briefing content *rises* into view.
- **Numbers roll, they don't swap.** Any figure that changes as a result of a
  Susan action animates to its new value. Applied consistently this is a
  signature by itself.
- **Nothing bounces, nothing drags.** 120–300ms. Playful in *shape*, never in
  *duration*.

Each moment ships to the frontend agent as: the frames (storyboard), the timing,
the easing, the trigger — on the Paper artboard as a motion-spec note.

---

## ① The availability "horizon" — your inventory as a living landscape

> **STATUS 2026-09-08 — deferred out of Group A.** The client cut the catalog
> item detail page (the intended first host) and rejected the horizon trial
> outright: *"I do not like that availability horizon, get rid of it… we'll think
> of something else later on."* This moment is **not designed in Group A**. It may
> be reconsidered when the Group B availability lookup is designed, reframed, or
> dropped. `DayAvailabilityStrip` (approved, tabular) stays the availability
> visualisation until then. The description below is kept for reference only.

**Where:** catalog item detail, quote builder line rows, availability lookup.

**What it is.** Instead of a bare number ("300 free on the 14th"), a compact
**horizon graph** — a filled area chart, ~40–60px tall, one bar/column per day
across the queried range. Column height = units free that day. The constrained
day dips visibly, is tinted `--color-warning-subtle`, and pulls a thin
`--color-border-strong` outline. You read the *shape* of a shortage before you
read the number. Everything else stays untinted — this is the only severity
encoding, consistent with `inventory-availability.md` §7 and the existing
`DayAvailabilityStrip` worst-day rule.

**The motion.** When Susan changes the date range or adds/edits a line item, the
horizon **redraws with a left-to-right wipe** (~240ms): columns grow up from the
baseline in a quick stagger, and the worst-day marker slides to its new
position. It feels like the data is responding to her.

**Why it's a wow.** Her entire business is "do I have enough on that day." No
rental software shows this. It turns a database query into something physical she
can glance at while a client is talking.

**Paper deliverable.**
- Component in 4 states: comfortable · tight · one-day shortage · loading.
- A 4-frame motion storyboard for the redraw wipe + marker slide.
- Placement mock in all three host screens.

**Likely new component:** `AvailabilityHorizon` — a sibling to
`DayAvailabilityStrip`, or a new render mode of it. Decide when Group A / B is
designed.

---

## ② The dashboard "briefing" — a calm command center that assembles itself

**Where:** `/` (replaces the PHASE-00 home).

**What it is.** Not a widget grid — we have no analytics in v1. A single
editorial column:

- **Today** — an event timeline (a horizontal spine with a dot per event,
  time-ordered).
- **Waiting on a reply** — issued quotes with age ("sent 3 days ago").
- **Owed to you** — unpaid invoice balances.
- **This month** — one large month-to-date earned figure in mono.

Big confident type, lots of air, no chrome. On desktop it fits without
scrolling. Quick-action affordances (new quote, availability lookup) sit where
they're reachable, not as a toolbar.

**The motion.** On load, a ~1.2s "good morning" sequence that plays **once per
session**:

1. Sections **stagger in from below** — each ~80ms after the last, 200ms rise +
   fade.
2. The month-to-date figure **counts up** from zero to its value (~600ms,
   ease-out).
3. Today's timeline **draws its spine left-to-right**, then the event dots pop
   in along it.

After that it never animates again unprompted.

**Why it's a wow.** The first thing Susan sees every day. It should feel like a
briefing prepared *for her*, not a report she has to read. This is the demo's
opening shot.

**Paper deliverable.**
- Desktop + mobile layout.
- The load-sequence storyboard (~5 frames).
- Empty state: "Nothing needs you today" — the place to trial the restrained
  sunflower graphic.
- Populated, loading, error states.

**Likely new components:** `TodayTimeline` (the spine + dots), `AttentionRow`
(an aged quote / unpaid invoice with age + amount + jump link), `KpiFigure`
(large figure with count-up — possibly a motion variant of `MoneyDisplay`).

---

## ③ The quote totals — a ledger that calculates *with* you

**Where:** quote builder, delivery-note builder (the `TotalsPanel` "ledger"
layout).

**What it is.** The totals panel. Standard until Susan touches a line item.

**The motion.** Change a quantity or a unit price and the affected figures
**roll** to their new values (digit-roll / count, ~180ms), in a **top-to-bottom
cascade**: subtotal first, then a beat later the Total, then the deposit line —
so you see the calculation *flow down* the panel. A hairline **sweeps under the
Total** as it settles.

**Why it's a wow.** Building a quote is the task Susan does most. Making the math
feel alive and precise — like a beautifully made calculator — turns a chore into
something a little satisfying. Cheap to build, disproportionate delight.

**Paper deliverable.**
- The panel in resting + mid-cascade frames.
- The digit-roll spec (duration, easing, direction).
- The cascade timing (stagger between rows).

**Likely new component:** none net-new — a motion spec applied to the existing
`TotalsPanel` and `MoneyDisplay`. Log it as a motion variant if the frontend
agent needs a distinct component.

---

## ④ The public shared quote — the business's face, built like a fine document

**Where:** `/q/[token]` — unauthenticated, opened from WhatsApp. Mostly on a
phone; sometimes by a corporate or government procurement officer.

**What it is.** The one screen a stranger judges Susan by, and the only
unauthenticated surface in the system (INV-T4). Full-bleed letterhead with her
real logo. Line items set like a proper financial instrument — rules, tabular
figures, generous leading. Deposit and validity stated with quiet authority. A
subtle Sunflower watermark on preliminary quotes. It must look like it came from
a company ten times Susan's size.

**The motion.** Minimal and dignified — no play here, the wow is *gravitas*:

- On open, the letterhead settles in.
- The line items **reveal top-to-bottom** in a quick stagger — like a document
  being laid on a desk.
- On mobile, a sticky, understated **"Accept this quote"** bar always in reach.

**Why it's a wow.** This screen can win Susan a contract.

**Paper deliverable.**
- Mobile-first layout + desktop.
- Preliminary vs final variants (watermark).
- The reveal storyboard.
- A shared visual language with the quote PDF (the PDF template track references
  this).
- States: valid · expired · already-accepted · not-found (the token resolves
  one quote, expires, exposes nothing else).

**Likely new component:** `LetterheadBlock` — shared by this screen and the PDF
templates.

---

## ⑤ Voice review — hearing yourself thought back to you

**Where:** the voice review shell (one shell, parameterised by intent).

**What it is.** The transcript is **not** hidden behind a disclosure (INV-V3) —
it is a **first-class quoted passage**: distinct type treatment, a left rule,
generous measure, set apart from the form. The phrases the model was unsure
about are **highlighted inline in the transcript itself**, and the matching form
field carries the same highlight — so the doubt is visible in *both* Susan's
words and the extracted data. Unresolved entities ("'Mwangi' — not in your
clients") show as text with a create/pick affordance, never dropped (INV-V5).

**The motion.** When the review screen opens:

1. The transcript **types itself in** over ~1.5s — fast, like a live caption
   catching up.
2. Then the extracted fields **fly out from their source phrases** into the form
   on the right — a visible line of causality from "what you said" to "what we
   filled in."
3. Uncertain phrases **pulse once, amber**, as they land.

**Why it's a wow.** It makes the AI feel *accountable* — here is exactly what we
heard, here is what we did with it, you are in control (INV-V1: nothing saves
without her press). Trust as a designed experience. Nobody's rental software does
voice at all, let alone like this.

**Paper deliverable.**
- The shell layout (desktop right-rail transcript, mobile stacked).
- The transcript type-in spec.
- The phrase → field "fly" storyboard.
- The uncertainty-highlight treatment (in transcript + on field, matching).
- The extraction-failed state: transcript shown, form empty, she types while
  reading her own words (`voice-pipeline.md` §8 — degrade to manual, never to
  loss).
- Drawn wrapping the quote form (large) and the expense form (small).

**Likely new component:** `TranscriptReveal` — extends `TranscriptPanel` with
inline phrase highlights + the type-in / fly-out motion.

---

## ⑥ Document issued — a small, satisfying "it's official now" moment

**Where:** the `ConfirmDialog` confirm for issuing a quote, delivery note, or
invoice — the instant a reference number is allocated (INV-N4: gapless, never
reused, allocated inside the issuing transaction).

**What it is.** Right now that moment is just a status flag flipping. It is
actually a real business milestone — the document is now a permanent, immutable
record (INV-I2). We mark it.

**The motion.** On confirm:

1. The reference number **stamps in** — a quick scale-down-and-settle with the
   mono digits locking into place (like a rubber stamp hitting paper, but
   refined — ~300ms, a slight overshoot).
2. A hairline **ring pulses out once**.
3. The status badge **cross-fades** Draft → Sent.
4. Optionally the faintest paper-grain texture flashes behind it (prototype;
   kill if it doesn't feel expensive).

**Why it's a wow.** Issuing a document is Susan's "this is now on the record"
moment — the paper-book feeling, digitised. A beat of ceremony makes the software
feel like it respects the weight of what she just did.

**Paper deliverable.**
- The 4-frame stamp storyboard.
- Before/after of the dialog and the detail screen (badge + number in place).
- Applies to all three issue variants of `ConfirmDialog`.

**Likely new component:** none net-new — a motion spec on `ConfirmDialog` +
`PageHeader` (which already renders reference numbers in Geist Mono) +
`StatusBadge`. Log as a motion variant if a distinct component is cleaner.

---

## Optional — the sunflower motif

A very restrained brand motif in **one place only** — not a logo splashed
around. Candidates: the empty-state icon family, or the skeleton shimmer.
**Prototype in Group A empty states.** If it doesn't feel expensive on the third
look, it's cut. Risk: tips twee if overdone — one place, or none.
