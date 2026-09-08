# Design System

The token vocabulary for the application, and the process by which it is chosen.

`src/styles/globals.css` is the source of truth once tokens are locked. Paper's
theme is kept in sync with it, not the reverse.

---

## 1. Process

Design runs ahead of implementation in seven stages. The governing principle is
that **things are designed in context and extracted afterwards**, never designed
in isolation and assembled later. A component drawn alone on a canvas is a guess
about a context nobody has looked at yet.

```
D0  Explore directions on 3 stress screens          Paper
D1  Lock tokens → codify in globals.css             code becomes source of truth
D2  Design screen batch 1 (~7 screens)              Paper
D3  Extract + reconcile composites, normalize back  Paper
D4  Build Tier 1 + Tier 2 in code, build gallery    code
D5  Export gallery to Paper, reconcile drift        both
D6  Design remaining screens by composition         Paper
D7  Implement — arranging components that exist     code
```

### What is locked without exploration

Judged once, by the person acting as design lead, against the reasoning below —
not explored as live alternatives. A category lands here only because a better
answer wasn't found, not by default.

| Category | Locked value | Why no alternative is needed |
|---|---|---|
| Spacing scale | 4px base, §5 | Standard, derivable, no taste dimension |
| Radius steps/ratio | base−2 / base / base+4, §6 | Sound derivation; only the base *value* has a taste dimension (explored, below) |
| Motion durations/easing | 120/180/240ms, §8 | Right instinct for daily-use software; nothing gained from alternatives |
| Breakpoints | 640/768/1024/1280, §11 | Standard scale, no reason to deviate |
| Control heights + touch targets | 32/36/40px, 44px min touch, §9 | Correct density-vs-accessibility tradeoff, already well reasoned |
| Font weights | 400/500/600, no light, §4 | Right call for small sizes and low-quality screens |
| Elevation step count | 3 steps (none/sm/md/lg), §7 | The count is right; the actual shadow *values* depend on border-vs-shadow emphasis (explored, below) |
| Tabular numerals | non-negotiable, §4 | Domain rule, not a taste call |
| Focus ring mechanism | 2px bg + 4px ring, `:focus-visible` only, §10 | Structure is right; the ring *colour* depends on the accent decision (explored, below) |

### What is explored in D0

Every category with a real taste dimension, judged together rather than one at a
time, because a neutral ramp looks sophisticated on a swatch grid and muddy
behind real text, and a type scale that looks fine alone can fall apart against a
dense table.

1. **Neutral ramp character** — pure, warm, or cool.
2. **Accent hue and restraint** — which hue, and how sparingly it appears. Also
   fixes the focus ring colour (locked mechanism above).
3. **Status colour semantics** — ten document states, five inventory states.
4. **Surface / elevation emphasis** — how far towards hairline borders with
   minimal shadow versus soft elevation. Also fixes the actual shadow-sm/md/lg
   values (locked step count above).
5. **Type scale and density** — is `--text-sm` the workhorse with tight rows, or
   is it roomier.
6. **Radius base value** — 4px reads technical, 8px friendly, 12px consumer.
7. **Iconography** — icon set, weight, and the one or two fixed sizes used
   throughout.
8. **Dark mode token structure** — not a dark theme for v1, but whether semantic
   tokens are structured now so dark mode is a later value swap rather than a
   rework.

---

### D0 — Direction exploration (Paper, via MCP)

**Breadth first, on a token sheet — not a single screen.** The previous version
of this process explored six things on real screens across three rounds. That
process is more rigorous per-category but slower, and this project's priority is
covering all eight categories above quickly with a working set to react to. The
trade-off is deliberate: composition risk is caught later, in the validation
round below, rather than avoided up front.

Two stages.

**Stage 1 — Swatch sheet.** One Paper artboard, not a screen: the neutral ramp as
labelled swatches, 2–3 accent candidates, the status/semantic colours (document
and inventory), surface treatment on sample cards (border-only vs. soft
elevation), the type scale as live stacked text at each step, radius on sample
rectangles at 4/6/8/12px, and the icon set at its fixed sizes. Build **2–3 full
token sets** as variants of this same sheet — coherent combinations across all
eight categories, not one axis at a time — so the comparison is between systems,
not isolated swatches. Pick one.

**Stage 2 — Validate in composition.** Apply the chosen set to the **quote
builder at 1440px** — the densest screen, exercising type scale, table density,
numeric alignment, and status colour together. Judge on: how the numbers read,
whether hierarchy survives with forty line items rather than four, whether it
looks like it came from a serious company. Then stress it on **availability view
at 1440px** and **voice review at 390px**. This is where a swatch-sheet choice
can still fail — a neutral ramp that looked sophisticated in isolation can turn
muddy behind real text, and mobile density is where a roomy type scale becomes
unusable. Adjust the set in place against these three screens rather than
returning to the swatch sheet; if a category needs rework, change it here, where
real content exposes what the swatch sheet couldn't.

### D1 — Codify immediately

The moment a direction is locked, tokens go into `globals.css` as a Tailwind v4
`@theme` block. Before any more screens are designed. Paper's token system maps
directly onto Tailwind, and the agent syncs the two over MCP.

**From this point, code is the source of truth for tokens.** Paper's theme is
kept in sync with it, not the reverse.

### D2 — Screen batch 1

Design roughly **seven screens**, chosen for maximum composite coverage rather
than for build order:

1. Quote builder
2. Availability view
3. Voice review
4. Client detail
5. Invoice detail
6. Event calendar
7. App shell

Between them these contain almost every composite in the system.

Design at both breakpoints. **Do not force consistency between screens yet.**
Solve each screen as well as it can be solved. Divergence at this stage is
information about which treatment is actually better.

The batch is bounded deliberately. Design twenty screens before extracting and
extraction stops being "pull out the good one" and becomes adjudicating five
versions of the same thing across screens drawn weeks apart.

### D3 — Extraction and reconciliation

The step that turns good screens into a component set.

1. **Extract.** Pull every recurring element out of the batch-1 screens onto a
   dedicated component artboard.
2. **Reconcile.** Where a concept appears more than once, pick the best
   treatment. One `LineItemRow`, not three.
3. **Complete.** Fill in every state and variant for each: resting, hover, focus,
   disabled, loading, error, empty, long-content overflow. The screens showed one
   state each; the component artboard must show all of them.
4. **Normalize backwards.** Update the batch-1 screens to use the reconciled
   versions.

**Step 4 is not optional.** Skip it and both versions survive into the codebase,
because the frontend agent will faithfully implement whatever the artboard shows.

The output is the **approved composite set**. Adding to it later is a deliberate
act — see §12.

### D4 — Build in code

shadcn primitives restyled against the tokens, plus the approved composites, plus
`/dev/gallery` with every component in every state. See `ui-conventions.md`.

### D5 — Export to Paper and reconcile

Export the gallery to Paper over MCP. This does two jobs:

- **Verifies fidelity.** Compare three or four exported components against
  screenshots of the running gallery. If they match, MCP for everything; if they
  drift, Paper's Snapshot extension captures browser-computed CSS instead.
- **Reconciles against D3.** Where the coded component and the designed component
  disagree, resolve it once, here, before screens are built on top.

### D6 — Remaining screens

All remaining screens, both breakpoints, organised by flow, with artboards
mapping onto phases, in phase order, staying one phase ahead of implementation.
**Composition only** — these screens use the
approved composite set and introduce new ones only under §12.

**Two designs, one implementation.** The mobile artboard specifies how the
component tree behaves below `md`. It is not a separate screen to build.

---

## 2. Token layers

Two layers. Components reference the semantic layer only. A component that
references a primitive directly is a defect.

```
primitive (raw value)  →  semantic (meaning)  →  component
--gray-9                  --color-text-muted      text-muted
```

---

## 3. Colour

### Primitives

- **Neutral ramp**, 12 steps, OKLCH. This single choice does more to determine
  whether the app reads as premium than anything else. Vercel and Linear live
  almost entirely in neutrals.
- **Accent hue**, 12 steps.
- **Status hues**: success, warning, danger, info — 12 steps each, or a reduced
  set of 4 if a full ramp is not needed.

OKLCH because perceptually uniform ramps stay legible when a step is swapped, and
Paper supports it natively.

### Semantic

```
Surfaces      --color-background, --color-surface,
              --color-surface-raised, --color-surface-sunken
Borders       --color-border, --color-border-strong, --color-border-focus
Text          --color-text-primary, --color-text-secondary,
              --color-text-muted, --color-text-on-accent
Accent        --color-accent, --color-accent-hover,
              --color-accent-active, --color-accent-subtle
Status        --color-{success,warning,danger,info}-subtle   (backgrounds)
              --color-{success,warning,danger,info}-solid    (text / icons)
```

### Business semantic layer

This is where most design systems stop too early and where this app needs one.
Define these once and every badge in the application is consistent. Leave it to
chance and you get six different oranges for "pending".

```
Document status   --color-status-draft        neutral
                  --color-status-sent         info
                  --color-status-accepted     success
                  --color-status-declined     neutral, muted
                  --color-status-expired      warning
                  --color-status-superseded   neutral, muted
                  --color-status-paid         success
                  --color-status-partial      warning
                  --color-status-overdue      danger
                  --color-status-voided       danger, muted

Inventory         --color-inventory-available   success
                  --color-inventory-low         warning
                  --color-inventory-committed   info
                  --color-inventory-damaged     danger
                  --color-inventory-maintenance neutral
```

**Colour never carries meaning alone.** Every status uses colour plus a label.
This is an accessibility requirement and it also survives printing.

### Dark mode

**Light only in v1.** Paper does not yet support multiple theme modes, and this
is a business tool used in daylight. Halving the design surface is worth more
than the option.

Tokens are structured so dark mode is a later value swap, not a restructure.

---

## 4. Typography

**Geist** for UI. **Geist Mono** for reference numbers, M-Pesa codes, and any
fixed-width identifier.

### Scale

Seven steps, each pairing size, line height, and letter spacing. Tighter tracking
at larger sizes is a large part of the premium feel.

```
--text-xs    12px / 16px / +0.01em     labels, table meta
--text-sm    14px / 20px /  0          body default, table cells, inputs
--text-base  16px / 24px /  0          long-form text
--text-lg    18px / 26px / −0.005em    section headings
--text-xl    20px / 28px / −0.01em     page headings
--text-2xl   24px / 32px / −0.015em    screen titles
--text-3xl   30px / 38px / −0.02em     totals, key figures
```

`--text-sm` is the workhorse. This is a data-dense business application, not a
marketing site.

### Weights

400 regular, 500 medium, 600 semibold. Three only. No light weights — they read
as cheap at small sizes and disappear on low-quality screens.

### Tabular numerals

```css
--font-numeric-tabular: tabular-nums;
```

**Non-negotiable in this application.** Every money value, quantity, date, and
reference number uses `font-variant-numeric: tabular-nums` so columns of figures
align. This one detail does more for perceived professionalism in a financial
tool than almost anything else on this page.

Applied automatically by the `MoneyDisplay` and `QuantityInput` components, and
available as a utility for anything else.

---

## 5. Spacing

4px base.

```
--space-0   0      --space-6   24px
--space-1   4px    --space-8   32px
--space-2   8px    --space-12  48px
--space-3   12px   --space-16  64px
--space-4   16px   --space-24  96px
```

Spacing comes from the scale. A one-off `padding: 13px` in a screen file means
either the scale is wrong or the value belongs in a component.

---

## 6. Radius

Three steps derived from one base, so a single change reshapes the whole app.

```
--radius-base  6px     (the one to change)
--radius-sm    calc(var(--radius-base) - 2px)
--radius-md    var(--radius-base)
--radius-lg    calc(var(--radius-base) + 4px)
--radius-full  9999px
```

---

## 7. Elevation

Restrained. The premium look is borders plus very subtle shadows, not large soft
drop shadows.

```
--shadow-none
--shadow-sm     hairline + 1px, for raised surfaces
--shadow-md     for popovers and dropdowns
--shadow-lg     for modals only
```

Three levels. If a fourth seems necessary, the layout is wrong.

---

## 8. Motion

Almost always omitted from design systems, and a large part of why an interface
feels expensive.

```
--duration-fast   120ms    hover, focus, colour changes
--duration-base   180ms    dropdowns, tooltips, small transitions
--duration-slow   240ms    sheets, modals, page-level transitions

--ease-out        cubic-bezier(0.16, 1, 0.3, 1)     entering
--ease-in-out     cubic-bezier(0.65, 0, 0.35, 1)    moving
```

All motion respects `prefers-reduced-motion`.

---

## 9. Density

The app is data-heavy on desktop and touch-driven on mobile, so both are needed.

```
--control-h-sm   32px    compact tables, dense toolbars
--control-h-md   36px    desktop default
--control-h-lg   40px    mobile default, primary actions
```

**Touch targets are at least 44px on mobile**, achieved by padding around the
control rather than by growing the control itself. Susan uses this while
standing on a worksite.

---

## 10. Focus

One token, applied consistently to every interactive element.

```
--color-border-focus
--focus-ring: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-border-focus);
```

Applied via `:focus-visible` only, never `:focus`. Accessibility and polish in
the same move.

---

## 11. Layout

```
--breakpoint-sm    640px
--breakpoint-md    768px     ← the mobile/desktop boundary for this app
--breakpoint-lg    1024px
--breakpoint-xl    1280px

--container-form   680px     single-column forms
--container-app    1440px    max app shell width
```

Mobile artboards are designed at **390px**. Desktop artboards at **1440px**.

---

## 12. Adding to the approved composite set

The composite set produced in D3 is a registry, not a snapshot. It grows, but
growth is deliberate.

A screen may introduce a new composite. Doing so is an explicit act with four
consequences, all of which happen before the screen is considered designed:

1. It is added to the **component artboard** in Paper, with every state and
   variant.
2. It is checked against the existing set — if it is a variant of something that
   already exists, it becomes a variant of that component rather than a new one.
3. It is built in code as **Tier 2** and added to `/dev/gallery` with every state.
4. It is listed in the approved set in `ui-conventions.md` §1.

What must not happen is a screen quietly containing a bespoke element that never
becomes a component. That is how a design system erodes: not through bad
decisions, but through undocumented ones.

---

## 13. Rules

1. Components reference **semantic** tokens, never primitives.
2. No raw hex values outside `globals.css`. None.
3. No arbitrary Tailwind values (`p-[13px]`, `text-[#1a1a1a]`) in screen files.
   If a value is needed that the scale lacks, either the scale is wrong or it
   belongs inside a Tier 2 component.
4. Status colour always accompanies a text label.
5. Money, quantities, and reference numbers always use tabular numerals.
6. Every interactive element has a visible `:focus-visible` state.
7. Adding a token is a deliberate act. Adding one to solve a single screen means
   the screen is wrong.
