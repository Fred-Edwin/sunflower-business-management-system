# Document Lifecycle

How a piece of business travels from a phone call to a receipt, and what is
allowed to happen at each step.

Every rule here is an application of `domain-invariants.md`. Where a transition
has a rule attached, the invariant ID is given. Read that document first.

---

## 1. The chain

```
Inquiry
   │  (convert)
   ▼
Quote ──────────────┐
   │  (accept)      │ (edit after send → new version)
   ▼                │
Event ◄─────────────┘
   │  (generate)
   ▼
Delivery Note
   │  (generate)
   ▼
Invoice
   │  (record payment)
   ▼
Payment ──► Receipt
```

**INV-C1.** Each step derives its data from the previous one. Nothing is
re-keyed by hand at a later stage. If an implementation asks the user to retype
a client name or a line item that already exists upstream, it is wrong.

---

## 2. Inquiry

The lightest record in the system. It exists for one reason: `Inquiry.receivedAt`
is the start of the clock for the PRD's headline metric, median time from inquiry
to quote sent. Without it that number has to be reconstructed by hand, which
means it never gets reported.

**States:** none. An inquiry is either unconverted or has
`convertedQuoteId` set.

**Creation:** manual entry or voice capture. May exist before a `Client` record
does, so `clientId` is nullable.

**Conversion:** creating a quote from an inquiry copies across the client (or
prompts to create one), the guessed event date, and the description into quote
notes. It sets `convertedQuoteId`.

An inquiry is never required. Susan can create a quote directly, and often will.
When she does, `Quote.inquiryId` is null and that quote is excluded from the
inquiry-to-quote metric rather than counted as zero.

---

## 3. Quote

The most complex object in the system, because it is both a working document and
a client-facing record.

### States

```
        ┌──────────────────────────────────────────┐
        │                                          │
     DRAFT ──issue──► SENT ──accept──► ACCEPTED    │
        │              │  │                        │
        │              │  └──decline──► DECLINED   │
        │              │                           │
        │              └──expire───► EXPIRED       │
        │                                          │
        └──abandon──► (stays DRAFT, no number)     │
                                                   │
   edit a SENT quote ──► new Quote row (v+1) ──────┘
   original becomes SUPERSEDED
```

| State | Editable | Has reference number | Reduces availability |
|---|---|---|---|
| `DRAFT` | Yes, freely | No (INV-N5) | No |
| `SENT` | No (creates a version) | Yes | Only if preliminary hold |
| `ACCEPTED` | No | Yes | Yes, `COMMITTED` |
| `DECLINED` | No | Yes | No |
| `EXPIRED` | No | Yes | No |
| `SUPERSEDED` | No | Yes | No |

### Issuing (`DRAFT` → `SENT`)

This is a single transaction:

1. Validate the quote has a client, an event date, and at least one line item.
2. Allocate a reference number from `DocumentCounter` with `SELECT … FOR UPDATE`
   (INV-N4).
3. Resolve `depositAmountCents` from `depositType` and `depositValue`, and store
   it. Once issued this is a client-visible number and must not drift (INV-M4).
4. Set `validUntil` from `Organization.quoteValidityDays` if not set explicitly.
5. Set `issuedAt`, set status `SENT`.
6. If `isPreliminary`, create `HOLD` bookings with `expiresAt = validUntil`.
7. Render the PDF, store it in R2, create a `DocumentFile` with a `shareToken`.

Steps 2 through 6 are one database transaction. Step 7 happens after commit; a
failed PDF render must not roll back an issued quote, and the file can be
regenerated from the immutable record.

### Versioning (INV-I4)

A `SENT` quote is never edited in place. Editing produces a **new `Quote` row**:

- `version` = previous + 1
- `rootQuoteId` = the original's `rootQuoteId` (which points at itself for v1)
- Line items are copied, then modified
- A **new reference number** is allocated
- The previous row → `SUPERSEDED`, with `supersededByQuoteId` set forward

Both versions remain viewable with their own numbers and their own PDFs. The
quote detail screen shows a version selector when more than one exists.

Only the latest version can be accepted.

### Preliminary quotes and site visits

`isPreliminary = true` means the pricing is an estimate pending a site visit.
The PDF is watermarked accordingly.

Confirming after a site visit sets `siteVisitCompletedAt` and creates a new
version with `isPreliminary = false`. **The original estimate is preserved as a
superseded version**, which the PRD requires explicitly.

### Acceptance (`SENT` → `ACCEPTED`)

One transaction:

1. Set `acceptedAt`, status `ACCEPTED`.
2. Create the `Event` from the quote.
3. Convert `HOLD` bookings to `COMMITTED`, or create `COMMITTED` bookings if none
   existed (INV-A3).
4. **Re-check availability inside the transaction** (INV-A4). If short, raise an
   `AvailabilityWarning` and surface it, but do not block (INV-A6).

### Expiry

A daily job moves `SENT` quotes past `validUntil` to `EXPIRED` and releases any
`HOLD` bookings. Expired quotes can be re-versioned into a fresh quote; they are
not resurrected in place.

### Sharing

The PDF is delivered by a public link at `/q/[shareToken]` (INV-T4). The share
sheet is invoked with that URL, which puts it into WhatsApp in one tap on
Android. The link resolves one quote, expires, and exposes nothing else.

---

## 4. Event

Created automatically on quote acceptance. Never created directly in v1.

### States

```
SCHEDULED ──► IN_PROGRESS ──► COMPLETED
     │                            
     └──────────► CANCELLED
```

Cancellation sets all the event's bookings to `RELEASED`, freeing the equipment
immediately.

The event is the hub: bookings, staff assignments, the delivery note, the
invoice, and expenses all hang off it. Per-event profitability
(INV-E1) is computed here.

---

## 5. Delivery Note

Generated from the event, populated from the accepted quote's line items
(INV-C2). Printed and carried to site by the delivery team. v1 is print-based;
field staff have no app access.

### States

```
DRAFT ──issue──► ISSUED ──► (delivered, returns recorded)
                    │
                    └──void──► VOIDED (+ replacement)
```

Issuing allocates `DN-YYYY-NNNN` and renders the PDF. After issue the line items
are immutable (INV-I2).

**Returns.** `returnedQuantity` and `returnedAt` on the line items track what
came back. Partial returns are normal. Equipment returns against the delivery
note, not the invoice, which is why the fields live here.

A questionnaire for on-site client sign-off is generated alongside, from the same
event data. It is a printable artefact with no state of its own.

---

## 6. Invoice

### States

```
DRAFT ──issue──► ISSUED ──payment──► PARTIALLY_PAID ──payment──► PAID
                    │                      │                       │
                    └──────────────────────┴───────────────────────┘
                                    void
                                     │
                                     ▼
                                  VOIDED ──► replacement invoice
```

`status` is **derived, never set directly** (INV-C6):

- no payments → `ISSUED`
- `0 < paid < total` → `PARTIALLY_PAID`
- `paid >= total` → `PAID`

`balanceCents` is likewise computed as `totalCents − sum(payments)` (INV-C5).
Neither is a writable column.

### Generation

Line items are copied from the delivery note (INV-C3), which in turn came from
the quote. The client never sees a figure that was retyped.

If the delivery note was amended before invoicing (short delivery, substitution),
the invoice reflects the amendment. After issue, the invoice is never edited to
diverge from its delivery note.

### Corrections (INV-I3)

An issued invoice is never edited. To correct one:

1. Set the original to `VOIDED` with a `voidReason`.
2. Create a replacement invoice with a **new reference number**.
3. Link them: `replacesInvoiceId` and `replacedByInvoiceId`.

Both remain visible. Both keep their numbers. Neither number is reused (INV-N3).
The UI shows a clear banner on a voided invoice pointing to its replacement.

---

## 7. Payment and Receipt

Recording a payment is one transaction:

1. Create the `Payment` (amount, method, date, optional reference such as an
   M-Pesa code).
2. Allocate `RCP-YYYY-NNNN` and create the `Receipt` (INV-C4).
3. Render the receipt PDF after commit.

The invoice balance and status update as a consequence, because both are
computed. There is no separate "update invoice" step, and therefore no way for
payments and invoice state to disagree.

Overpayment is permitted and leaves a negative balance rather than being
rejected. Susan will occasionally receive a round number against an odd total,
and blocking her would be worse than showing a credit.

A receipt is never voided independently. Reversing a payment voids the payment
and its receipt together, and both remain visible.

---

## 8. Expenses

Not part of the document chain, but attached to the event and therefore to
profitability.

- Created manually, by voice, or automatically from a `StaffAssignment` wage.
- Wage-derived expenses carry `staffAssignmentId`, which is unique. That
  uniqueness is what makes double-counting impossible (INV-E2).
- `eventId` is nullable. A null event means a general business expense that
  appears in monthly totals but not in any event's profit.

---

## 9. What each stage may and may not do

| Action | Allowed | Rule |
|---|---|---|
| Edit a draft quote | Yes | |
| Edit a sent quote | No — creates a version | INV-I4 |
| Delete any document | No | INV-I5 |
| Change a catalog price | Yes, affects nothing already issued | INV-P1 |
| Edit an issued invoice | No — void and replace | INV-I3 |
| Reuse a reference number | Never | INV-N3 |
| Invoice without a delivery note | Discouraged, not blocked | |
| Accept a superseded quote | No | |
| Record payment on a voided invoice | No | |
| Exceed available inventory | Yes, with a recorded warning | INV-A6 |

---

## 10. Implementation notes

**Transactions.** Any operation that allocates a reference number, creates
bookings, or generates a linked document runs in a single Prisma transaction.
The number allocation and the document insert must never be separable.

**PDF rendering is post-commit.** Always. A storage outage must not be able to
prevent a document being issued. `DocumentFile` rows can be regenerated from the
immutable source record, and a regeneration route exists for exactly that.

**Status is derived where it can be.** Invoice status and invoice balance are
computed in the domain layer from payments. Resist adding a cached column; the
volume here is trivial and the correctness benefit is large.

**Every transition is a domain function.** `issueQuote`, `acceptQuote`,
`versionQuote`, `voidInvoice`, `recordPayment`. Pure where possible, taking
current state and returning the next state, with the repository applying it.
This is what makes the state machine testable without a database.
