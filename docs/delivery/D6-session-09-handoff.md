# D6 · Session 9 — PDF template track (the last D6 deliverable)

**Paste the block below into a fresh session.** The durable context is the linked
files, not this prompt.

---

```
D6 SESSION — PDF TEMPLATE TRACK — HANDOFF PROMPT

You are the product designer for the Sunflower Events BMS, running the final
piece of design stage D6: the PRINT LAYOUT for the documents the business hands
to clients. Every application SCREEN group (A–G) is done and client-approved.
This is the last thing before D6 is complete.

This is NOT interaction design. There are no screens here, no loading / empty /
error states, no responsive breakpoints. These are PRINT FACES — fixed-size
pages rendered by `@react-pdf/renderer`, sent by WhatsApp / email or printed and
carried to a venue. One rendering path per document; the file the client
receives is the one you design.

THE CLIENT'S BRIEF, IN HER WORDS (2026-09-10): "I want these documents to look
very high-end… very well branded, very clean, very structured, very well
designed. Easy to print. Proper standard sizes. Include all the standard details
that need to be in an invoice, a delivery note — let them be there." Her clients
include corporate and government buyers who compare vendors and photocopy
documents. These pages ARE the business's face. This deserves more craft than an
internal tool would get.

TWO-STEP SESSION, APPROVAL GATE BETWEEN THEM:
  1. OUTLINE every document's structure as a written spec — page setup, the
     shared letterhead, every section top to bottom, and the COMPLETE set of
     standard fields each document type must carry (issuer identity, client
     identity, all dates, line-item table columns, the totals breakdown, payment
     terms, signature blocks, legal/standard lines). Research what belongs on a
     proper quotation / delivery note / invoice / receipt and lay it ALL out so
     the client can see nothing is missing. Post it as a chat message. WAIT FOR
     APPROVAL. Do not create the Paper page or any artboard before this.
  2. On approval, design the print faces in Paper at A4 proportions.

---

## 1. READ FIRST, IN THIS ORDER, AND ONLY THESE

- `CLAUDE.md`
- `docs/delivery/D6-plan.md` — §2 the eight governing constraints (they still
  apply: compose from tokens, no raw hex, money is integer KES cents tabular,
  screens/faces don't invent styling); §3 the session mechanic (outline →
  approve → build → status log → recommendations); §5.1 the baseline aesthetic
  ("restraint is the aesthetic", "typography does the work", Geist + Geist Mono);
  §5.3 (signature moments DEFERRED — the C3 "dignified reveal" motion and any
  `LetterheadBlock` craft-polish were pushed to the later moments pass; the PDF
  track is print layout, not motion, so this mostly doesn't bite — but do NOT
  storyboard anything); §6 "PDF template track (after Group D)" — the planning
  list, which you finalise this session; §8 status log — read the Group C entry
  (C3 Public shared quote + the `LetterheadBlock` component) and the Group D
  entries (D3 Delivery note detail, D4 Invoice detail, Record payment dialog —
  the screens these PDFs are downloaded from) and §9d (the "Download PDF only,
  no separate Print button" decision, and the note that D4's Download-PDF
  affordance is only actually on some states). §9a–§9g recommendations — several
  bear on this:
    - §9d: client confirmed "Download PDF only" (a downloaded PDF opens in the
      browser's PDF viewer, which has print built in — a second Print button is
      redundant). D3 and D5 should carry the same affordance consistently — a
      D7 wiring note, not your problem, but know it.
    - §9e: `ExpenseCategory` promoted to a per-org table — irrelevant here.
    - §9g (Group G): the client lifted the "no chart" rule for the Dashboard
      only. Does NOT extend to documents — a quote/invoice has no chart.
  Check §9a–§9g before proposing anything new.
- `docs/architecture/document-lifecycle.md` — **read §1, §3, §5, §6, §7 in
  full.** §1 the document chain (Quote → Event → Delivery Note → Invoice →
  Payment → Receipt); §3 Quote (states, issuing allocates `QUO-YYYY-NNNN` at
  `DRAFT`→`SENT`, preliminary quotes + watermark, validity/expiry, sharing via
  `/q/[token]`); §5 Delivery Note (issuing allocates `DN-YYYY-NNNN`, line items
  copied from the accepted quote INV-C2, returns tracked on the line items, "a
  questionnaire for on-site client sign-off is generated alongside… a printable
  artefact with no state of its own"); §6 Invoice (states DRAFT / ISSUED /
  PARTIALLY_PAID / PAID / VOIDED, `balanceCents` + status are COMPUTED INV-C5/C6,
  corrections void-and-replace INV-I3 with both documents staying visible);
  §7 Payment and Receipt ("one receipt per payment, always" INV-C4, receipt
  allocates `RCP-YYYY-NNNN`). §9 "what each stage may and may not do" and §10
  implementation notes.
- `docs/architecture/data-model.md` — **read §4, §6, §7, §11 in full.** §4
  `Quote` + `QuoteLineItem` (`nameSnapshot`, `descriptionSnapshot?`,
  `unitPriceCentsSnapshot`, `quantity`, `lineTotalCents` — the PDF renders the
  SNAPSHOT, never joins the catalog, INV-P2; `deliveryFeeCents`, `subtotalCents`,
  `discountCents`, `totalCents`, `depositType` FIXED|PERCENT, `depositValue`,
  `depositAmountCents`, `validUntil`, `issuedAt`, `isPreliminary`,
  `siteVisitRequired`); §6 `DeliveryNote` / `DeliveryNoteLineItem` (name + qty
  only — NO prices on a delivery note; `returnedQuantity`, `returnedAt`,
  `receivedByName`, `deliveredAt`), `Invoice` / `InvoiceLineItem` (same snapshot
  shape as quote lines; `dueDate`, `voidReason`, `replacesInvoiceId` /
  `replacedByInvoiceId`), `Payment` (`amountCents`, `method PaymentMethod` =
  CASH|MOBILE_MONEY|BANK_TRANSFER|CHEQUE, `paidAt`, `reference?` = M-Pesa code /
  bank ref), `Receipt` (`referenceNumber`, `paymentId` unique, `invoiceId`,
  `issuedAt`), `DocumentFile` (the stored PDF: `documentType`, `contentHash`,
  `shareToken`), `DocumentCounter` (why reference numbers are gapless — one
  counter per `(org, documentType, year)`, `FOR UPDATE` in the issuing txn);
  §7 `Expense` (not printed); §9 the enums — note `DocumentType` is
  `{ QUOTE  DELIVERY_NOTE  INVOICE  RECEIPT }` — **there is no QUESTIONNAIRE
  value**, see §5 GAP below; §11 "Notes for implementers" — the seed data (one
  org, realistic catalog, 5 clients, 3 events) and "what is deliberately absent"
  (no tax tables — this matters for the invoice, see §5).
- `docs/architecture/domain-invariants.md` — the invariants the faces must
  respect: INV-M1 (integer KES cents, two decimal places, tabular mono);
  INV-M5 (format at the render boundary only); INV-P2 (line items snapshot name
  / description / price — the catalog FK is NEVER joined for display);
  INV-N5 (no reference number while DRAFT); INV-I2/I3/I4 (issued documents
  immutable; corrections void-and-replace, both stay visible; quotes
  re-version); INV-C2 (delivery-note / invoice line items copied from the
  accepted quote); INV-C4 (one receipt per payment); INV-C5/C6 (invoice balance
  + status computed); INV-T4 (the opaque expiring share token).
- `docs/architecture/system-overview.md` — §8 (out of scope for v1 — **no tax,
  no eTIMS, no KRA integration**; this is the single most important constraint
  for the invoice: it is a plain commercial invoice with NO VAT/tax line, NO
  PIN, NO tax invoice number. Say so explicitly on the invoice spec so nobody
  "adds tax back"). The `@react-pdf/renderer` choice ("No headless browser").
- `docs/conventions/design-system.md` — §2 token layers, §3–11 the token
  vocabulary (you use the SAME tokens as the screens — colour, the type scale,
  spacing, radius — a print face is not allowed its own palette), §13 rules.
  Print notes: `--font-sans` = Geist, `--font-mono` = Geist Mono,
  `--font-numeric-tabular: tabular-nums`. There is no serif display font in the
  token set — if you want one for the letterhead wordmark, that is a PROPOSAL
  (§13, a token addition), not a thing you just do.
- `docs/conventions/ui-conventions.md` — §8 "Print" (printed output comes from
  the generated PDF, not a print stylesheet; ONE rendering path per document;
  delivery notes + questionnaires are printed and carried to site, invoices +
  receipts are sometimes printed). §5 screen patterns do NOT apply — there is no
  "PDF pattern" yet, you are establishing it.
- `docs/conventions/coding-standards.md` — §13 (do not add dependencies) and the
  allowed-libraries line (`@react-pdf/renderer` is already in). The faces you
  draw ship to D7 as `@react-pdf/renderer` component trees — <Document> <Page>
  <View> <Text> <Image>, flexbox layout, `StyleSheet.create`, points not px,
  no CSS grid, no external fonts unless registered. Keep the layouts
  expressible in that vocabulary (the same discipline as "screens compose from
  the token set").

Do not read the wider `docs/` tree. Do not read `D6-signature-moments.md`
(nothing in the PDF track is a signature moment — the C3 reveal motion that WAS
one is deferred and is not your deliverable).

---

## 2. PAPER — file, tools, page

File: `01M1X43Q66HDD6TF72TYYWH3KE` ("Sunflower BMS").

First calls, in order:
1. `get_guide({topic:"paper-mcp-instructions"})` — once. Again if a long thread
   compresses.
2. `open_file({fileId:"01M1X43Q66HDD6TF72TYYWH3KE"})`
3. `get_basic_info` — note the pages and the token set.
4. `create_page` — a new page named **"D6 — PDF templates"**. AFTER the outline
   is approved, not before.
5. `get_font_family_info(["Geist","Geist Mono"])` once before any typographic
   styling. If you propose a serif display face for the wordmark, look it up
   here too and present it as a token proposal.

**PRIOR ART TO PULL (screenshot / `get_jsx`, do not eyeball):**
- **C3 Public shared quote** — page "D6 — Group C · Quoting" (pageId `A-0`),
  artboards `GMJ-0` (390 valid), `GO7-0` (390 valid + preliminary), `GQR-0`
  (1440 valid, the centred 720px print-like sheet), `GPW-0` (expired / accepted
  / not-found states). This screen was drawn "clean and well-set… must look
  like it came from a serious company" and contains the in-context
  `LetterheadBlock`. The PDF quote is the SAME document as a print face — the
  public shared quote and the quote PDF must not diverge. Start the letterhead
  from what's on C3 and elevate it to the client's "very high-end" bar.
- **`LetterheadBlock`** — logged in `D6-new-components.md` as Proposed
  (drawn in-context on C3; the dedicated `4U2-0`-style band is TODO). Its
  manifest entry: logo (or typographic-wordmark fallback, reusing A4's
  `FileDropField` broken-image behaviour), business name, address line,
  phone/email, then document title (`QUOTATION`), reference number (Geist Mono),
  parties/dates block. This session BUILDS that band properly and it is shared
  by all four numbered documents.
- **D3 Delivery note detail** / **D4 Invoice detail** — page "D6 — Group D"
  (pageId `B-0`), artboards `JXB-0` (D3 issued), `K4K-0` (D3 voided),
  `KLP-0` (D4 issued), `KPV-0` (D4 partially-paid), `KY7-0` (D4 voided). These
  are the SCREENS the PDFs are downloaded from — the on-screen line-item table
  and totals are the same data the PDF renders; keep them consistent.
- **A4 Settings** — page "D6 — Group A" (pageId `7-0` or `8-0`), the Settings
  screen — business name / logo / address / phone / email / quote validity /
  default deposit all feed the letterhead. `FileDropField` there defines the
  broken-image → typographic-wordmark fallback the letterhead reuses.
- **The approved component set** — page "D3 — Components" (pageId `6-0`),
  artboard `4U2-0`. You compose from the SAME tokens; `MoneyDisplay`,
  `TotalsPanel` "ledger" layout, and `StatusBadge` anatomy are the on-screen
  reference for how money and status read — translate their VALUES into the
  print face, don't import the components (a PDF is not React DOM).

**DO NOT TOUCH** any existing page. Pages "D6 — Group A" (`7-0`, `8-0`),
"D6 — Group B" (`9-0`), "D6 — Group C" (`A-0`), "D6 — Group D" (`B-0`),
"D6 — Group E" (`C-0`), "D6 — Group F" (`D-0`), "D6 — Group G · Dashboard"
(`E-0`), "D3 — Components" (`6-0`), artboard `4U2-0`, "D2 — Batch 1 Screens"
(`2-0`), "Page 1" (`1-0`), any sign-in artboard.

**YOUR PAGE** — the new "D6 — PDF templates" page. Convention (adapt from prior
D6 group pages): one document per horizontal ROW, a "Lane guide" strip at the
top, a left-hand row-title card per row. Each document's row shows its A4 page(s)
at true proportion and its variants side by side (see §4). A "Row 0 · Letterhead"
comes first — the shared band + its fallback states. A "Page legend" artboard
tops the page like every other D6 group.

**A4 sizing on the canvas.** A4 is 210 × 297 mm. Draw each page as an artboard
at a clean scale — **595 × 842** (points, the PDF unit, 1pt ≈ 0.353mm — this is
literally the `@react-pdf/renderer` default page size) is ideal because the D7
agent can lift point values directly. Use a **48pt margin** all round as the
starting content box (≈ 17mm — generous, photocopier-safe; propose a different
margin in the outline if you have a reason). Multi-page documents (a long
invoice) get a second artboard showing the continuation page with its repeating
header + "Page 2 of 2".

`get_screenshot` to review after each document against the client's bar
(spacing / typographic hierarchy / alignment of the money column / the
letterhead / print-safety — would this photocopy cleanly in mono? is every
standard field present?). One-line verdict, fix before moving on.
`finish_working_on_nodes` when done. No raw node IDs in anything you tell the
user.

---

## 3. THE DOCUMENT SET — FINAL (client-decided 2026-09-10)

**FIVE documents. The planning list in `D6-plan.md` §6 had four + a packing
checklist; the checklist is CUT and the invoice is ADDED, both client decisions.**

| # | Document | Ref prefix | Shared letterhead | Notes |
|---|---|---|---|---|
| 1 | **Quote** | `QUO-YYYY-NNNN` | yes | The priced offer. Same document as the C3 public shared quote — must not diverge. |
| 2 | **Delivery note** | `DN-YYYY-NNNN` | yes | What's dropped at the venue. NAME + QTY only, no prices. Signed on delivery. |
| 3 | **Questionnaire** | — (see §5 GAP) | yes (lighter) | On-site client sign-off form, generated alongside the delivery note. No state, no number in the current model. |
| 4 | **Invoice** | `INV-YYYY-NNNN` | yes | The demand for payment. The most standards-heavy. **NO tax line** (v1 out of scope — `system-overview.md` §8). |
| 5 | **Receipt** | `RCP-YYYY-NNNN` | yes | Auto-created per payment (INV-C4). Proof of payment received. |

**CUT:** packing checklist (client: "why do we have a packing checklist? Let's
just use the delivery note. Let's not complicate things"). Remove it from
`D6-plan.md` §6 in the status-log edit.

---

## 4. DRAFT-PDF POLICY & PER-DOCUMENT STATES (client-approved 2026-09-10)

**Policy: never block Susan from generating a PDF at any stage — but the PDF's
face always tells the truth about its status.** She may want to proof numbers,
print a working copy, keep a record of a voided document. What she must NEVER be
able to do is hand a client a document that looks final but isn't.

- **Issued** → the full, clean document: reference number, issue date, complete.
  This is the one she sends. NO status stamp — a clean issued document.
- **Draft** (not yet issued) → the SAME layout, but:
  - a **"DRAFT — NOT ISSUED"** treatment (a diagonal watermark OR a top band —
    you choose; it must be unmistakable at a glance and survive a mono
    photocopy),
  - NO reference number (there isn't one — INV-N5) — the ref slot reads
    "Draft — not yet issued" or similar,
  - a muted footer line: "This is a working copy. Figures are not final."
- **Preliminary quote** (quote only, `isPreliminary`) → a **"PRELIMINARY —
  pricing subject to site visit"** band + a light watermark (this is the C3
  preliminary treatment; keep them identical). Can be a preliminary DRAFT or a
  preliminary ISSUED quote — the two treatments stack.
- **Voided** (invoice, delivery note) → the PDF still generates (nothing is
  hard-deleted). A **"VOIDED"** stamp + a line naming the replacement document's
  number if there is one ("Replaced by INV-2026-0043"). The void reason is shown.

**States to draw per document** (each at 595×842, side by side in that
document's row):

| Document | States to draw |
|---|---|
| Quote | draft · issued (final) · issued + preliminary · (a "long" continuation page if line items overflow) |
| Delivery note | issued (pre-delivery, blank signature block) · issued + returns recorded (returned-qty column populated) · voided |
| Questionnaire | the one face (it has no states) — blank, ready for on-site completion |
| Invoice | draft · issued (unpaid) · issued + partially paid (payments-received block + balance due) · paid (PAID stamp) · voided (+ replacement) · continuation page |
| Receipt | issued (the one face) · voided-payment variant if a payment is reversed (`document-lifecycle.md` §7 — confirm whether a reversed payment voids its receipt) |

Motion: **none.** These are print faces. The C3 "dignified reveal" that was a
signature moment is deferred and is not part of this track.

---

## 5. GAPS TO FLAG IN THE OUTLINE (do not solve silently)

1. **`DocumentType` has no `QUESTIONNAIRE` value** (`data-model.md` §9). The
   questionnaire is "a printable artefact with no state of its own"
   (`document-lifecycle.md` §5) — it is not a numbered document and does not
   come off the `DocumentCounter`. That is probably fine (it's a form, not a
   commercial document) — but the outline must state explicitly: the
   questionnaire has NO reference number, is regenerated on demand from event
   data, and is stored (if at all) as a `DocumentFile` with a type that either
   needs adding to the enum or a decision that it's generated transiently and
   not persisted. Recommend one.
2. **No tax on the invoice** (`system-overview.md` §8 — no tax / eTIMS / KRA).
   The invoice is a plain commercial invoice: subtotal, delivery fee, discount,
   total, amount paid, balance due. NO VAT row, NO KRA PIN, NO "tax invoice"
   title. State this on the invoice spec in bold so a later reader doesn't
   "add tax back". If the client ever needs a tax invoice that is a v2 schema +
   template change, not a tweak.
3. **Bank / payment details for the invoice.** A proper invoice tells the
   client HOW to pay (M-Pesa paybill / till, bank account, cheque payee). The
   `Organization` model has `name`, `phone`, `email`, `addressLine`,
   `logoStorageKey`, `defaultCurrency`, `quoteValidityDays`,
   `depositDefaultPercent` — **no payment-details fields.** The invoice needs a
   "How to pay" block; that is new `Organization` columns (e.g.
   `paymentInstructions Text?` free-form, or structured M-Pesa / bank fields).
   Flag it as a GAP with a recommended shape, and draw the block on the invoice
   using placeholder content.
4. **`LetterheadBlock` is still "Proposed"** in `D6-new-components.md` and has no
   `4U2-0` band. This session finalises it — the band + the four §12 promotion
   consequences. Also decide: is it ONE component with an `app` vs `print`
   projection (like `PageHeader` has two), or is the print letterhead a separate
   `DocumentLetterhead`? Recommend.
5. **Wordmark / logo treatment.** The client wants "very well branded." The only
   brand asset is `logoStorageKey` (an uploaded image) with a typographic
   fallback. If the fallback wordmark deserves a serif display face to feel
   high-end, that's a `--font-*` token proposal (design-system.md §13). Present
   it; don't just add a font.
6. **Currency.** `Organization.defaultCurrency` is `"KES"` and v1 is
   single-currency. Every figure on every document is `KES` — state it; do not
   build a currency-switcher affordance.

Check `D6-plan.md` §9a–§9g before adding any recommendation of your own.

---

## 6. THE TASK — ORDER OF WORK

1. Reconnect context: read the docs in §1, run the Paper context calls in §2,
   screenshot C3 (all four artboards), D3 issued/voided, D4 issued/partially-
   paid/voided, and A4 Settings so the letterhead and the line-item/totals
   treatment match what already exists.

2. **Post the OUTLINE as a chat message and WAIT FOR APPROVAL.** It must contain,
   for each of the five documents:
   - **Page setup** — size (595×842 pt), margins, grid, how many pages typical
     vs. long.
   - **The shared letterhead** — every element, top to bottom, with the fallback
     behaviour; the `LetterheadBlock` finalisation decision (§5.4).
   - **Every section of the document, top to bottom** — with the COMPLETE field
     list. Do the research: what does a proper quotation carry? a delivery note?
     a commercial invoice? a receipt? Issuer identity (name, address, phone,
     email, and — flag — no PIN); client identity (name, contact person,
     address, phone); document identity (title, reference number, issue date,
     and per-document: valid-until / due-date / delivery-date / payment-date);
     the line-item table and its exact columns per document (quote: description,
     qty, unit price, line total; delivery note: description, qty ordered, qty
     delivered, qty returned; invoice: description, qty, unit price, line total;
     receipt: what it itemises — the payment, or the invoice it's against);
     the totals breakdown per document; deposit terms (quote); payment
     instructions (invoice — flag the GAP); the signature / acknowledgement
     blocks (delivery note "Received by ___ / Date ___", questionnaire sign-off,
     quote acceptance line); standard footer lines (validity, terms, "thank you
     for your business", generated-on timestamp, page x of y).
   - **The state treatments** (§4) for that document — where the DRAFT /
     PRELIMINARY / VOIDED / PAID marks sit and what they look like.
   - **The gaps** from §5 that touch that document.
   Then a short "shared decisions" section: the accent-colour usage on print
   (one accent max, must degrade to mono), the type hierarchy, the margin, the
   `LetterheadBlock` decision, the serif-wordmark proposal if you're making one.

3. On approval: create the page, build the legend + lane guide + "Row 0 ·
   Letterhead" (the shared band + fallback states) + Row 1 title card.

4. Build the five documents, one row each, in this order: **Quote → Delivery
   note → Questionnaire → Invoice → Receipt** (chain order; each reuses the
   letterhead and the line-item treatment from the one before). `get_screenshot`
   review after each. Draw the state variants side by side in the row. For the
   invoice and quote, draw a continuation page showing the repeating header +
   "Page 2 of 2".

5. Full-page screenshot review against the client's bar — "very high-end, very
   well branded, very clean, very structured, easy to print, all the standard
   details present." Present to the client. Iterate until approved.

6. Wrap up:
   - Append a status-log entry to `D6-plan.md` §8.
   - Edit `D6-plan.md` §6 "PDF template track": remove "Packing checklist print
     view", add "Invoice PDF", note the draft-PDF policy.
   - Update `D6-new-components.md`: `LetterheadBlock` moves from Proposed to
     built/finalised with its `4U2-0` band and the §12 consequences; log any
     print-only sub-components (e.g. a `DocumentTotals` print block) or state
     explicitly that the faces are composed from tokens with no new components.
   - Append recommendations (max 5, ranked) to a new `D6-plan.md` §9h — the §5
     gaps become the recommendations (`QUESTIONNAIRE` enum decision,
     `Organization` payment-details columns, `LetterheadBlock` finalisation,
     serif-wordmark token, and one more if warranted).
   - `finish_working_on_nodes`.

7. **D6 is then complete.** Update `D6-plan.md` §10 "Definition of done" —
   check the boxes that are now true. The remaining unchecked box will be the
   post-D6 signature-moments pass, which is a separate stage.

---

## 7. CONSTRAINTS THAT DO NOT BEND

Print faces, not screens — no interaction states, no responsive, no motion.
Compose from the existing token set — no raw hex, no new palette, money is
integer KES cents in Geist Mono tabular (INV-M1), formatted at the render
boundary. Line items render the SNAPSHOT (name / description / price) — the
catalog is NEVER joined (INV-P2). No reference number on a DRAFT (INV-N5). NO
TAX on the invoice (v1, `system-overview.md` §8) — a plain commercial invoice.
The quote PDF and the C3 public shared quote are the SAME document — keep them
consistent. Draft / preliminary / voided marks must be unmistakable AND survive
a mono photocopy. One accent colour maximum on any face, and it must degrade
cleanly to black-and-white. A4 at 595×842 pt with point values the D7 agent can
lift directly. Propose, never build unrequested — the outline is approved before
anything is drawn; a token addition (serif wordmark) is a proposal; a schema gap
(`QUESTIONNAIRE` enum, `Organization` payment fields) is flagged, not solved.
Files you may write this session: `D6-plan.md` (§6, §8, new §9h, §10),
`D6-new-components.md`. Nothing else. No raw node IDs to the user.
`finish_working_on_nodes` when done.

After this session, D6 is done except the signature-moments pass (a separate
stage, walked with the client across all the approved screens + these documents).
```
