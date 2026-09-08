# Domain Invariants

**These rules are not negotiable and not subject to convenience.**

This is the most important document in the repository. Every rule below is
stated as a testable assertion, and every one of them has a corresponding test.
If a change makes one of these tests fail, the change is wrong — not the test.

If you are an agent and a task appears to require breaking one of these rules,
stop and say so rather than working around it.

---

## 1. Money

**INV-M1.** All monetary values are stored as integers in KES cents.
Never a float. Never a JavaScript `number` used for a fractional currency amount.

Precision is **exactly two decimal places**. One cent is the smallest
representable amount and the smallest unit of rounding. `KES 12,500.75` is stored
as `1250075`. There is no sub-cent precision anywhere in the system, including in
intermediate calculations.

**INV-M2.** Every monetary database column is `Int` and every field name ends in
`Cents` (`unitPriceCents`, `totalCents`, `amountPaidCents`). A monetary field
that does not end in `Cents` is a defect.

**INV-M3.** Arithmetic on money happens only in `lib/money.ts`. Application code
does not multiply, divide, or apply percentages to currency inline.

**INV-M4.** Rounding is half-up, applied once, at the point a fractional result
is produced (percentage deposits, tax if ever added). Never round twice.

**INV-M5.** Formatting for display happens only at the render boundary, via
`formatMoney()`. A domain function never returns a formatted string.

*Test:* percentage deposit of 33% on 100,000 cents produces exactly 33,000; a
line total of quantity 7 at 1,499 cents produces exactly 10,493.

---

## 2. Price snapshotting

**INV-P1.** When a document line item is created, the catalog item's
**name, description, and unit price are copied onto the line item**. The line
item stores its own values.

**INV-P2.** The foreign key to the catalog item exists for traceability only.
**It is never joined for display.** Rendering a document reads only the
snapshotted fields. A catalog item may be renamed, repriced, or deactivated
without any effect on documents already created.

**INV-P3.** This applies to quotes, delivery notes, invoices, and receipts.

**INV-P4.** Deleting a catalog item is forbidden. Items are deactivated
(`active = false`). Historical documents must never dangle.

*Test:* create a quote, change the catalog price, re-read the quote. Every line
item still shows the original price and the original name.

---

## 3. Reference numbers

**INV-N1.** Quotes, delivery notes, invoices, and receipts each carry a
human-readable reference number in the form `PREFIX-YYYY-NNNN`
(`QUO-2026-0001`, `DN-2026-0001`, `INV-2026-0001`, `RCP-2026-0001`).

**INV-N2.** Numbers are **sequential and gapless** within an organisation,
document type, and year.

**INV-N3.** A number is **never reused**, including after a void.

**INV-N4.** Numbers are allocated from a `DocumentCounter` row, selected
`FOR UPDATE`, **inside the same transaction that creates the document**. If the
transaction rolls back, the counter rolls back with it. This is why a Postgres
sequence is not used — sequences leak gaps on rollback.

**INV-N5.** A number is allocated at **issue** time, not at draft time. Drafts
have no reference number.

*Test:* issuing 50 invoices concurrently produces exactly `INV-YYYY-0001` through
`INV-YYYY-0050` with no duplicates and no gaps. A transaction that fails after
allocation leaves the counter unchanged.

---

## 4. Immutability of issued documents

**INV-I1.** Every document has a status. Documents in a draft state are freely
editable. Documents in an issued state are not.

**INV-I2.** Once issued, a document's **financial fields, line items, reference
number, and client identity are immutable**. This is enforced in two places:
the repository layer refuses the write, and a Postgres trigger rejects the
`UPDATE` at the database level.

The database trigger is not redundancy for its own sake. Application-layer
guards are easy to route around accidentally during a refactor; the trigger is
not.

**INV-I3.** Corrections are made by issuing a linked replacement document, never
by editing. The original is marked `VOIDED` with a reason and a link to its
replacement. Both remain visible and both keep their reference numbers.

**INV-I4.** Quotes are the exception in mechanism but not in principle: an edit
to a sent quote creates a **new version** with a new reference number. The prior
version is marked `SUPERSEDED` and remains viewable. Nothing is overwritten.

**INV-I5.** Nothing is ever hard-deleted. There is no `DELETE` in application
code against a business table.

*Test:* attempting to update `totalCents` on an issued invoice throws, both
through the repository and through a raw SQL update.

---

## 5. Inventory and availability

**INV-A1.** Availability is a **number, not a boolean**. For a catalog item over
a date range:

```
available = totalQuantity
          − units unavailable (damaged / maintenance / lost) overlapping the range
          − units committed to bookings overlapping the range
```

**INV-A2.** Availability is **computed on read** from bookings and adjustments.
There is no denormalised "units available" counter to drift out of sync.

**INV-A3.** Inventory is committed when a **quote is accepted**, creating
`COMMITTED` bookings. A preliminary quote may create a `HOLD` booking with an
expiry; expired holds do not reduce availability. A draft or sent quote commits
nothing.

**INV-A4.** Availability is **re-checked inside the transaction** that creates a
booking. Checking before the transaction and trusting the result is a defect,
even with one user.

**INV-A5.** Partial commitment is normal and must work. Committing 200 of 500
chairs leaves 300 available, not zero.

**INV-A6.** The system **warns but does not block** when a requested quantity
exceeds availability. Susan may have a reason to proceed. Every warning is
recorded with the requested quantity, the actual availability, and whether she
proceeded (PRD instrumentation requirement).

**INV-A7.** Marking units damaged or under maintenance removes **exactly those
units** from availability for the stated period, not the whole item.

*Test:* 500 chairs, 50 marked damaged, 200 committed to an overlapping event →
250 available. The same query one day outside the range → 450.

---

## 6. Document chain integrity

**INV-C1.** The chain is `Quote → Event → Delivery Note → Invoice → Payment →
Receipt`. Each step derives its data from the previous one. Data is never
re-entered by hand at a later stage.

**INV-C2.** A delivery note's line items are copied from the accepted quote's
line items, with their snapshotted values.

**INV-C3.** An invoice's line items are copied from the delivery note's line
items. They must match. If a delivery note is amended before invoicing, the
invoice reflects the amendment; an invoice is never edited to diverge from its
delivery note after issue.

**INV-C4.** A receipt is generated automatically when a payment is recorded.
A payment without a receipt is an invalid state.

**INV-C5.** An invoice's `balanceCents` always equals
`totalCents − sum(payments.amountCents)`. This is computed, never stored as an
independently-writable field.

**INV-C6.** An invoice's status is derived from its balance: `ISSUED` when no
payment exists, `PARTIALLY_PAID` when `0 < paid < total`, `PAID` when
`paid >= total`. It is never set directly.

*Test:* recording two partial payments totalling the invoice amount moves it to
`PAID` and produces two receipts with sequential numbers.

---

## 7. Event profitability

**INV-E1.** An event's profit is `invoiced revenue − sum of logged expenses`.

**INV-E2.** Staff wage entries for an event are expenses. They appear in the
event's expense total automatically and are not double-counted if also entered
manually.

**INV-E3.** Profit is computed, never stored.

---

## 8. Tenancy

**INV-T1.** Every business table has a non-nullable `organizationId`.

**INV-T2.** Every repository query filters on `organizationId`. There are no
exceptions. A query without it is a security defect, not a style issue.

**INV-T3.** The organisation is resolved from the session in the Server Action
wrapper and passed down. It is never taken from client input.

**INV-T4.** The only unauthenticated route is the public shared quote at
`/q/[token]`, which resolves an opaque, expiring, single-purpose token. It
exposes one quote and nothing else.

*Test:* every repository function, given a record belonging to another
organisation, returns nothing rather than throwing.

---

## 9. Voice

**INV-V1.** **Nothing is ever saved directly from voice input.** Every capture
produces a pre-filled form for review, and the user confirms explicitly.

**INV-V2.** The pipeline is **two-stage**: speech-to-text produces a transcript,
then a separate extraction step parses that transcript into fields. A combined
audio-to-fields call is forbidden, because it makes mishearing and misparsing
indistinguishable when diagnosing a bad record.

**INV-V3.** The **transcript is always persisted**, even when extraction fails,
and is always visible on the review screen.

**INV-V4.** The extraction step may return empty fields. A blank field flagged
for the user is always better than a confident guess. Extraction prompts must
say so explicitly.

**INV-V5.** Fields the model was uncertain about are visually flagged in the UI.

**INV-V6.** Audio is written to device storage **before** any upload is
attempted. A capture is only cleared from the device once it has been saved.

**INV-V7.** The STT provider is accessed only through the adapter in
`modules/voice/stt`. No application code references a provider by name.

**INV-V8.** Every capture is logged with: audio reference, transcript, resolved
intent, parsed payload, whether the user corrected any field, and which fields
they corrected. This is both the diagnostic record and the tuning dataset.

---

## 10. Data safety

**INV-D1.** Database backups run daily without manual intervention.

**INV-D2.** A restore is tested at least once before launch, and the procedure is
written down in `../ops/runbook.md`.

**INV-D3.** The owner can trigger a complete export of her business records at
any time and download it.

**INV-D4.** Generated PDFs are stored in object storage and are immutable once
their document is issued.

---

## Quick reference

| ID | Rule |
|---|---|
| INV-M1 | Money is integer KES cents |
| INV-P1 | Line items snapshot name, description, price |
| INV-P2 | Never join catalog for display on a document |
| INV-N2 | Reference numbers are gapless |
| INV-N4 | Numbers allocated in the issuing transaction, `FOR UPDATE` |
| INV-I2 | Issued documents immutable; app guard + DB trigger |
| INV-I5 | Nothing is hard-deleted |
| INV-A1 | Availability is a number |
| INV-A3 | Commit inventory on quote acceptance |
| INV-A6 | Warn, do not block; record the warning |
| INV-C5 | Invoice balance is computed |
| INV-T2 | Every query filters on `organizationId` |
| INV-V1 | Voice never saves without confirmation |
| INV-V2 | Two-stage pipeline, always |
