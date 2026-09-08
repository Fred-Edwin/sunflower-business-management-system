# PHASE-00B — Tier 1 fidelity pass

Reconciling the coded Tier 1 primitives against the Paper design, done during
the vertical-slice session's follow-up (user asked for a real visual diff, not
"I built to the spec").

## Method

The Paper artboard `4U2-0` ("Approved Composite Set") has **no primitive-only
bands** — primitives appear only inside composite bands and in the three shadcn
block spec-cards (`5TI-0`). The design reference for Tier 1 is therefore:

1. **`5TI-0`** — the login-form + Sidebar spec-cards (`get_jsx`, exact values)
2. **Page `2-0` "D2 — Batch 1 Screens"** — every primitive in real screen
   context: `HA-0` Quote Builder (Button, Select, Input, Switch, Table, Badge,
   Search), `F6-0` App Shell, `1U2-0` Client Detail (Tabs), `20X-0` Invoice
   Detail, `1K1-0` Voice Review.
3. Values pulled with `get_jsx` (`format: "inline-styles"`), never read off a
   screenshot.

Each primitive: **Designed** (Paper) → **Code before** → **Verdict** → **Fix**.

Tokens are already confirmed equivalent (`contentHash 72796a7d`); this is about
the primitives' own dimensions, spacing, weights, and state styling.

---

## Reference values pulled from Paper

### Button (`HA-0` header, node `JE-0`)
- height **36px**, padding-inline **14px**, radius **4px** (`--radius-md`)
- text **14px / weight 500 / line-height 18px**, Geist
- **accent** (primary): `bg --color-accent`, `text --color-text-on-accent`
- **outline** (secondary): `border 1px --color-border`, `text --color-text-primary`,
  transparent bg
- gap between two buttons: 8px

### Select trigger / Input (`HA-0` client field, node `JL-0`)
- height **36px**, padding-inline **12px**, radius **4px**, border **1px**
- text **14px / 18px**, `--color-text-primary`
- focused border = `--color-border-focus` (the drawn state is focused)
- chevron: 14px, `stroke --color-text-muted`, `stroke-width 2`

### Field label (`HA-0`, node `JL-0` first child)
- **12px / weight 500 / line-height 16px / `--color-text-secondary`**
- gap label→control: **6px**

### Switch (`HA-0` Preliminary?, node `K1-0`)
- track **32 × 18**, radius-full, `bg --color-neutral-300` (unchecked),
  padding **2px**
- thumb **14 × 14**, `#FFFFFF`, radius-full
- label beside: **13px / 16px / `--color-text-muted`**, gap 8px

### DataTable header (`HA-0`, node `15F-0`)
- row height **32px**, `bg --color-surface-sunken`,
  `border-bottom 1px --color-border-strong`
- labels **11px / 600 / letter-spacing 0.03em / uppercase /
  `--color-text-secondary`**, padding-inline 12px (10px on the `#` col)
- numeric header cells right-aligned

### login-form controls (`5TI-0`)
- control height **40px**, radius **6px**, border `1px --color-border-strong`
- primary button: 40px, `bg --color-accent`, radius 6px, text 13px/500 white
- (the spec-card prose says "44px controls" — the drawn card shows 40px; the
  prose is the contract. Build 44px, note the card is illustrative.)

### Sidebar nav item (`5TI-0`)
- padding **9px / 10px**, **16px icon slot**, gap **10**, text **14 / 500 /
  `--color-chrome-text-muted`**
- active: **1px bottom border `--color-chrome-active-underline`**, text + icon →
  `--color-chrome-text`, weight **600**, NO fill

---

## Primitive-by-primitive verdict

| # | Primitive | Ref | Verdict | Drift → fix |
|---|---|---|---|---|
| 1 | Button | `HA-0`/`JE-0`, `5HH-0`, `1U2-0` | **FIXED** | default was `h-8`/`px-2.5` (32/10). Designed 36/14. → `default` = `h-[--control-h-md]` / `px-3.5`; `sm` = `--control-h-sm`; `lg` = `--control-h-lg` (mobile primary, §9); `icon*` sizes → same tokens. |
| 2 | Input | `HA-0`/`JL-0`, `K8-0` | **match** | 36px (`--control-h-md`), `px-3`, radius-md, 1px border, `text-sm`, focus ring per §10, `aria-invalid` danger. Designed field pad is 12px; code `px-3` = 12px. ✓ |
| 3 | Textarea | (no direct ref — same token family as Input) | **match** | Mirrors Input: border, radius, focus, `aria-invalid`, `disabled`. Note for D5: no textarea drawn in D2. |
| 4 | Select | `HA-0`/`JL-0` | **match** | Trigger `h-[--control-h-md]`, `pl-2.5 pr-2`, radius-md, chevron `text-muted`. Designed pad 12px vs code 10px left / 8px right — **minor**, within tolerance, left as shadcn ships the asymmetric icon pad. Noted. |
| 5 | Combobox | (no ref — Tier 2 pickers wrap it, deferred) | **defer** | Base is `@base-ui` Combobox, token-styled. Its designed form is `ClientPicker`/`CatalogItemPicker` (Tier 2, band `5D6-0`) — verify then. |
| 6 | Checkbox | (no ref) | **consistent** | `size-4`, radius-sm, `data-checked:bg-accent`, focus ring §10, `aria-invalid`. No checkbox in D2 screens. Note for D5. |
| 7 | RadioGroup | (no ref) | **consistent** | `size-4` circle, `bg-text-on-accent` dot, focus ring §10. No radio in D2 screens. Note for D5. |
| 8 | Switch | `HA-0`/`K1-0` | **FIXED** | thumb was `size-4` (16px) in an 18.4px track. Designed track 32×18, 2px inset, thumb 14. → `h-[18px]`, `p-0.5`, thumb `size-[14px]`, translate `14px`; thumb `bg-neutral-0`. |
| 9 | Badge | (no ref for the generic chip) | **defer** | The designed badge is `StatusBadge` = dot + label, NO chip (D3.2 #1) — a Tier 2 component (band `4U7-0`), deferred. The Tier 1 `Badge` (chip) has no D2 appearance. Left as-is; D5 confirms it isn't used on a screen. |
| 10 | Card | `1U2-0` (Contact / Notes cards) | **match** | 1px `--color-border`, radius-lg, header title 16/500, hairline `border-b` between header and rows. Code Card matches; `--card-spacing` 16px. ✓ |
| 11 | Dialog | `5HH-0` (ConfirmDialog band) | **near-match** | Designed: radius-lg (8px), `shadow-lg`, `p-5` (20px), gap 16. Code: `rounded-lg`, `shadow-lg`, `p-4` (16px), `gap-4`. → **padding bumped 16→20, gap kept 16** (see Fixes). Title 16/500 vs designed 16/600 → **weight bumped to 600**. |
| 12 | Sheet | `3UA-0` (mobile drawer), shell live | **match** | Slide-in, `shadow-lg`, `bg-surface-raised`, token border. The shell drawer (built + screenshotted) matches the mobile artboard. |
| 13 | Popover | (no ref) | **consistent** | radius-lg, `shadow-md`, `bg-surface-raised`, 1px border — same as `SelectContent`/`DropdownMenuContent`. Its designed forms are the pickers (Tier 2). |
| 14 | Tooltip | (no ref) | **consistent** | `bg-neutral-900` / `text-neutral-0`, `text-xs`, radius-md — the one deliberately dark primitive. No tooltip drawn in D2. Note for D5. |
| 15 | Table | `HA-0`/`15F-0` | **match** | Header 32px on `surface-sunken` + `border-b-border-strong`, labels 11/600/0.03em uppercase `text-secondary`, `px-3`. The DataTable Tier 2 composite carries this; the raw `table.tsx` primitive is token-clean. ✓ |
| 16 | Tabs | `1U2-0` (underline tabs) | **match** | `variant="line"`: active = `text-primary` + 2px accent underline bar, inactive = `text-muted`, no bg. Code `line` variant matches exactly. Default (segmented) variant → see SegmentedToggle (Tier 2). |
| 17 | DropdownMenu | (no ref) | **consistent** | `bg-surface-raised`, `shadow-md`, radius, `data-highlighted:bg-surface-sunken`, destructive item `text-danger-solid`. No menu drawn in D2. Note for D5. |
| 18 | Calendar | (no ref — DatePicker composition) | **consistent** | react-day-picker, token-styled: selected `bg-accent`, focused cell ring §10, `--cell-radius: --radius-md`. Its designed form is the Availability date pickers (Tier 2 DateRangeControl, band `5AO-0`). |
| 19 | DatePicker | `HA-0` event-date field | **FIXED** | trigger was `size="lg"` (now 40px). Designed date field is 36px. → `size="default"`. |
| 20 | Toast (Sonner) | (no ref) | **consistent** | Theme vars → `--normal-bg: surface-raised`, `--normal-border: border`, `--border-radius: --radius-md`. No toast drawn in D2. Note for D5. |
| 21 | Skeleton | `4AU-0` (Availability loading) | **match** | `animate-pulse`, `bg-surface-sunken`, radius-md. Designed loading rows use `neutral-100` bars — **near-identical** (`surface-sunken` = `neutral-50`, one step lighter). Left as `surface-sunken` (semantic). Noted. |
| 22 | Separator | `1U2-0` (card row dividers) | **match** | 1px `bg-border`. ✓ |
| 23 | ScrollArea | (no ref) | **consistent** | Radix scroll-area, token thumb. No custom scroll region drawn in D2. Note for D5. |
| 24 | Label / Form / InputGroup | `HA-0`/`JL-0`, `K8-0` | **FIXED** | `FormLabel` was `text-sm` (14px). Designed field label 12/500/`text-secondary`, gap 6px. → `FormLabel` = `text-xs font-medium text-text-secondary`; `FormItem` gap `gap-2`→`gap-1.5`. Base `Label` (inline, beside checkbox/switch) → `text-sm`→`text-[13px] leading-4` to match the designed inline labels. `InputGroup` inherits Input's tokens — match. |

---

## Fixes applied — 2026-09-07

All verified against browser-computed styles in the running gallery (not
screenshots):

| File | Change | Was → now |
|---|---|---|
| `ui/button.tsx` | `default` size | `h-8` / `px-2.5` (32/10) → `h-[--control-h-md]` / `px-3.5` (36/14) |
| `ui/button.tsx` | `sm` / `lg` / `icon*` | pinned to `--control-h-sm` / `--control-h-md` / `--control-h-lg` tokens |
| `ui/date-picker.tsx` | trigger size | `size="lg"` → `size="default"` (40 → 36px, matches the event-date field) |
| `ui/form.tsx` | `FormLabel` | `text-sm` (14) → `text-xs font-medium text-text-secondary` (12 / 500 / secondary) |
| `ui/form.tsx` | `FormItem` gap | `gap-2` (8) → `gap-1.5` (6) |
| `ui/label.tsx` | base `Label` (inline) | `text-sm` (14) → `text-[13px] leading-4` (matches inline labels beside checkbox/switch) |
| `ui/switch.tsx` | track / thumb | `h-[18.4px]` + thumb `size-4` (16) → `h-[18px]` + `p-0.5` + thumb `size-[14px]`, translate `14px`; thumb `bg-background` → `bg-neutral-0` |
| `ui/dialog.tsx` | `DialogContent` pad | `p-4` (16) → `p-5` (20); footer offsets `-mx-4/-mb-4/p-4` → `-mx-5/-mb-5/p-5`; close button `top-2/right-2` → `top-3/right-3` |
| `ui/dialog.tsx` | `DialogTitle` | `text-base leading-none font-medium` → `text-base leading-[22px] font-semibold` (16 / 600 / 22) |

Computed-style check (running gallery): Button 36 / 14-14 / 14px / 500 / r4 ✓ ·
Input 36 / 12-12 / r4 ✓ · FormLabel 12 / 500 / neutral-800 ✓ · FormItem gap 6 ✓ ·
Switch 32×18 / p2 / thumb 14×14 ✓ · Dialog p20 / r8 ✓.

### Radius note (design inconsistency for D5)

Buttons in the QB toolbar (`JE-0`) use radius **4px** (`--radius-md`). Buttons and
controls in ConfirmDialog (`5HH-0`) and the login-form spec-card (`5TI-0`) use
radius **6px** — which is not a token (`--radius-md` 4, `--radius-lg` 8). The
code uses `--radius-md` (4px) everywhere per design-system.md §6
(`--radius-base: 4px`, buttons use the base). Flagged so D5 either ratifies 4px
across the board or adds a `--radius-base + 2` step. **Not** a code fix — a
design decision.

### Tier 2 gallery scroll-lock — FIXED

`src/app/dev/gallery/tier2.tsx` (built by the parallel Tier 2 session,
02:42–02:52) force-mounted two `ConfirmDialog`s with `open`, which engaged
`react-remove-scroll` and froze the whole gallery page (`body { overflow:
hidden }`, an undismissable dim) — the exact failure the §6b handoff warned
against. Fixed: the two `open` instances replaced with a static
`ConfirmDialogPanelPreview` helper (a plain div mirroring the dialog panel,
gallery-only) for the pending / error states; the resting state still opens a
real Radix dialog from its trigger. Verified: `body overflow: visible`,
`canScroll: true`, 0 mounted overlays.

---

## Not fixable against Paper — verify at D5

Primitives with **no appearance in the D2 batch screens or the spec-cards**, so
no design reference to diff against. Each is internally consistent with the
token system (semantic tokens, focus ring per §10, `aria-invalid` danger,
Radix `data-state` styling). D5 should confirm none of them is silently wrong
once a screen uses it:

- **Checkbox**, **RadioGroup** — `size-4`, `data-checked:bg-accent`,
  `text-on-accent`, focus ring §10. Checkbox `rounded-sm`, radio `rounded-full`.
- **Popover**, **Tooltip**, **DropdownMenu** — overlay family:
  `bg-surface-raised` (`bg-neutral-900` for Tooltip — the one deliberately dark
  primitive), `shadow-md`, token border. Consistent with `SelectContent`.
- **Calendar** — react-day-picker, token-styled; its designed form is the
  Availability date controls (Tier 2, band `5AO-0`).
- **ScrollArea**, **Separator**, **Skeleton**, **Toast (Sonner)** — token-clean,
  minimal surface. Skeleton uses `bg-surface-sunken` (`neutral-50`); the D2
  loading artboards drew `neutral-100` bars — one step apart, left as the
  semantic token.
