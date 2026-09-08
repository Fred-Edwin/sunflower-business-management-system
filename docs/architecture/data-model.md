# Data Model

`prisma/schema.prisma` is the executable source of truth. This document explains
the reasoning behind it: why entities are shaped as they are, and which fields
carry rules that are not obvious from their names.

Read `domain-invariants.md` alongside this. Several columns here exist only to
support an invariant.

---

## Conventions

- Primary keys are `cuid()` strings, named `id`.
- Every business table has `organizationId String` (non-nullable, indexed) and a
  relation to `Organization`.
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`.
- Money: `Int`, field name ends in `Cents`.
- Event dates: `@db.Date` (no time component). Timestamps: `DateTime` in UTC.
- Provenance: records a user can create carry `createdVia CreatedVia` and
  `voiceCaptureId String?`.
- Nothing is hard-deleted. Deactivation uses `active Boolean` or a status enum.

---

## 1. Tenancy and identity

### Organization
The business. One row in v1.
`id`, `name`, `phone`, `email`, `addressLine`, `logoStorageKey?`,
`defaultCurrency` (`"KES"`), `quoteValidityDays` (default 14),
`depositDefaultPercent?`.

### User
Managed by Better Auth. Login identity only. Carries no business data.

### Membership
`userId`, `organizationId`, `role MemberRole`. Unique on
`(userId, organizationId)`.

> This is the change from the PRD described in `system-overview.md` §6.
> Business records belong to the organisation, not to a user. `Membership` is
> what makes adding a second office user a configuration change.

---

## 2. Clients and inquiries

### Client
`name`, `phone`, `email?`, `contactPersonName?`, `source ClientSource`,
`notes?`, `active`.
Indexed on `(organizationId, name)` for search.

### Inquiry
The first touch. Exists so that inquiry-to-quote elapsed time is measurable
without reconstruction (PRD instrumentation requirement).

`clientId?` (may precede client creation), `rawDescription`, `eventDateGuess?`,
`receivedAt`, `channel InquiryChannel`, `convertedQuoteId?`, `createdVia`,
`voiceCaptureId?`.

> `receivedAt` is the start of the clock for the "under 10 minutes to quote"
> metric. `Quote.issuedAt` is the end.

---

## 3. Catalog and inventory

### CatalogItem
`name`, `description?`, `category ItemCategory`, `unitPriceCents`,
`totalQuantity`, `unitLabel` (e.g. "chair", "tent"), `active`, `sortOrder`.

`totalQuantity` is how many units the business owns. It is **not** an
availability figure. Availability is always computed (INV-A2).

Items are never deleted (INV-P4).

### InventoryAdjustment
Units removed from availability for a reason other than a booking.

`catalogItemId`, `quantity`, `reason AdjustmentReason`, `startDate @db.Date`,
`endDate @db.Date?` (null = open-ended), `note?`, `resolvedAt?`,
`createdVia`, `voiceCaptureId?`.

An open-ended adjustment reduces availability from `startDate` forward until
resolved. This is how "50 chairs damaged" works (INV-A7).

### Booking
Units committed to an event for a date range. **This table is the sole source of
committed quantity.**

`eventId`, `catalogItemId`, `quantity`, `startDate @db.Date`,
`endDate @db.Date`, `status BookingStatus`, `expiresAt DateTime?`.

- `HOLD` — created by a preliminary quote. Has `expiresAt`. **Does not reduce
  availability once expired.**
- `COMMITTED` — created when a quote is accepted (INV-A3).
- `RELEASED` — event cancelled or quote superseded. Does not reduce availability.

Indexed on `(catalogItemId, startDate, endDate, status)` — this index carries the
availability query.

### AvailabilityWarning
Instrumentation, required by the PRD.

`catalogItemId`, `eventId?`, `quoteId?`, `requestedQuantity`,
`availableQuantity`, `startDate`, `endDate`, `proceededAnyway Boolean`,
`raisedAt`.

---

## 4. Quotes

### Quote
`referenceNumber String?` — null while `DRAFT`, allocated at issue (INV-N5).
`clientId`, `inquiryId?`, `eventId?`,
`status QuoteStatus`, `version Int`, `rootQuoteId String?`,
`supersededByQuoteId String?`,
`isPreliminary Boolean`, `siteVisitRequired Boolean`, `siteVisitCompletedAt?`,
`eventDate @db.Date`, `eventEndDate @db.Date?`, `venueName?`,
`deliveryLocation?`, `deliveryFeeCents`,
`subtotalCents`, `discountCents`, `totalCents`,
`depositType DepositType`, `depositValue Int`, `depositAmountCents`,
`validUntil @db.Date?`, `issuedAt?`, `acceptedAt?`, `declinedAt?`,
`notes?`, `createdVia`, `voiceCaptureId?`.

**Versioning (INV-I4).** An edit to a `SENT` quote creates a new `Quote` row.
The new row shares `rootQuoteId` with the original, increments `version`, and
receives its own reference number. The original is set to `SUPERSEDED` with
`supersededByQuoteId` pointing forward. `rootQuoteId` on the first version
points to itself, so "all versions of this quote" is a single indexed query.

**Deposit.** `depositType` is `FIXED` or `PERCENT`. `depositValue` holds either
cents or a whole percent. `depositAmountCents` is the resolved figure, computed
once at issue and stored, because it is a client-visible value on an issued
document.

### QuoteLineItem
`quoteId`, `catalogItemId?`, `sortOrder`,
`nameSnapshot`, `descriptionSnapshot?`, `unitPriceCentsSnapshot`,
`quantity`, `lineTotalCents`.

`catalogItemId` is nullable so that ad-hoc lines are possible, and is **never
joined for display** (INV-P2). The `Snapshot` suffix is deliberate: it makes the
rule visible at every call site.

---

## 5. Events and staff

### Event
Created when a quote is accepted. The operational record.

`quoteId`, `clientId`, `name`, `eventType EventType`,
`eventDate @db.Date`, `eventEndDate @db.Date?`,
`setupAt DateTime?`, `venueName?`, `location?`,
`status EventStatus`, `notes?`.

### StaffMember
`name`, `phone?`, `role StaffRole`, `defaultDayRateCents?`, `active`,
`createdVia`, `voiceCaptureId?`.

### StaffAssignment
`eventId`, `staffMemberId`, `role StaffRole`, `dayRateCents`, `days Int`,
`createdVia`, `voiceCaptureId?`.
Unique on `(eventId, staffMemberId)`.

A wage entry produces a linked `Expense` row automatically (INV-E2), so event
profitability has a single source of truth for costs.

---

## 6. Documents

### DeliveryNote
`referenceNumber`, `eventId`, `issuedAt?`, `status DocumentStatus`,
`deliveredAt?`, `receivedByName?`, `notes?`.

### DeliveryNoteLineItem
`deliveryNoteId`, `nameSnapshot`, `quantity`, `sortOrder`, `catalogItemId?`,
`returnedQuantity Int?`, `returnedAt?`.

Line items are copied from the accepted quote (INV-C2). Return tracking lives
here because equipment comes back against the delivery note, not the invoice.

### Invoice
`referenceNumber`, `eventId`, `clientId`, `deliveryNoteId?`,
`status InvoiceStatus`, `issuedAt?`, `dueDate @db.Date?`,
`subtotalCents`, `discountCents`, `totalCents`,
`voidedAt?`, `voidReason?`, `replacesInvoiceId?`, `replacedByInvoiceId?`,
`notes?`.

`balanceCents` and `amountPaidCents` are **not columns**. They are computed from
`Payment` rows (INV-C5), and `status` is derived from the balance (INV-C6).

Corrections use `replacesInvoiceId` / `replacedByInvoiceId` (INV-I3).

### InvoiceLineItem
Same snapshot shape as `QuoteLineItem`.

### Payment
`invoiceId`, `amountCents`, `method PaymentMethod`, `paidAt DateTime`,
`reference?` (M-Pesa code, bank reference), `notes?`,
`createdVia`, `voiceCaptureId?`.

### Receipt
`referenceNumber`, `paymentId` (unique), `invoiceId`, `issuedAt`.

One receipt per payment, always (INV-C4).

### DocumentFile
Generated PDFs.

`documentType DocumentType`, `documentId String`, `storageKey`,
`contentHash`, `generatedAt`,
`shareToken String? @unique`, `shareTokenExpiresAt?`.

`shareToken` backs the public `/q/[token]` route used for WhatsApp delivery
(INV-T4). Opaque, expiring, scoped to one document.

### DocumentCounter
`organizationId`, `documentType DocumentType`, `year Int`, `lastNumber Int`.
Unique on `(organizationId, documentType, year)`.

The row is selected `FOR UPDATE` inside the issuing transaction (INV-N4). This
table is the reason reference numbers are gapless.

---

## 7. Finance

### Expense
`eventId?` (null = general business expense), `category ExpenseCategory`,
`amountCents`, `description`, `incurredAt @db.Date`,
`staffAssignmentId? @unique`, `receiptStorageKey?`,
`createdVia`, `voiceCaptureId?`.

`staffAssignmentId` is unique and nullable: it links a wage-derived expense back
to its assignment so it can never be double-counted (INV-E2).

---

## 8. Voice

### VoiceCapture
The diagnostic record and the tuning dataset (INV-V8).

`audioStorageKey`, `durationMs?`, `mimeType`,
`sttProvider`, `sttModel`, `transcript String?`, `sttLatencyMs?`,
`intent VoiceIntent?`, `intentConfidence Float?`,
`extractionModel?`, `parsedPayload Json?`, `uncertainFields String[]`,
`status CaptureStatus`, `errorMessage?`,
`capturedAt`, `uploadedAt?`, `transcribedAt?`, `extractedAt?`, `savedAt?`,
`targetRecordType?`, `targetRecordId?`,
`correctedFields Json?`, `wasCorrected Boolean @default(false)`.

`transcript` is written as soon as STT returns, before extraction is attempted
(INV-V3). A capture that fails extraction still has a usable record.

`correctedFields` stores the diff between what the model produced and what was
saved. This is what makes prompt tuning possible.

### Keyterm
`term`, `source KeytermSource`, `refreshedAt`.
Rebuilt daily from client surnames, delivery locations, and catalog item names,
and supplied to the STT adapter on every call.

---

## 9. Enums

```prisma
enum MemberRole      { OWNER  ADMIN  STAFF }
enum CreatedVia      { TYPED  VOICE }
enum ClientSource    { REFERRAL  TENDER  WALK_IN  REPEAT  WEBSITE  OTHER }
enum InquiryChannel  { PHONE  WHATSAPP  SMS  EMAIL  IN_PERSON  OTHER }
enum ItemCategory    { TENT  SEATING  TABLE  DECOR  AUDIO  LIGHTING  UTILITY  OTHER }
enum AdjustmentReason{ DAMAGED  MAINTENANCE  LOST  RETIRED }
enum BookingStatus   { HOLD  COMMITTED  RELEASED }
enum QuoteStatus     { DRAFT  SENT  ACCEPTED  DECLINED  EXPIRED  SUPERSEDED }
enum DepositType     { FIXED  PERCENT }
enum EventType       { WEDDING  FUNERAL  CORPORATE  INSTITUTIONAL  PRIVATE  OTHER }
enum EventStatus     { SCHEDULED  IN_PROGRESS  COMPLETED  CANCELLED }
enum StaffRole       { DRIVER  SETUP  SUPERVISOR  AUDIO  GENERAL }
enum DocumentStatus  { DRAFT  ISSUED  VOIDED }
enum InvoiceStatus   { DRAFT  ISSUED  PARTIALLY_PAID  PAID  VOIDED }
enum PaymentMethod   { CASH  MOBILE_MONEY  BANK_TRANSFER  CHEQUE }
enum DocumentType    { QUOTE  DELIVERY_NOTE  INVOICE  RECEIPT }
enum ExpenseCategory { FUEL  REPAIRS  MATERIALS  WAGES  TRANSPORT  PERMITS  OTHER }
enum VoiceIntent     { QUOTE  EXPENSE  CLIENT  DAMAGE_REPORT  PAYMENT  STAFF_ASSIGNMENT  UNKNOWN }
enum CaptureStatus   { PENDING_UPLOAD  UPLOADED  TRANSCRIBING  EXTRACTING  READY  SAVED  DISCARDED  FAILED }
enum KeytermSource   { CLIENT_NAME  LOCATION  CATALOG_ITEM  MANUAL }
```

---

## 10. Relationship summary

```
Organization ─┬─ Membership ── User
              ├─ Client ──┬─ Inquiry
              │           ├─ Quote
              │           └─ Invoice
              ├─ CatalogItem ─┬─ InventoryAdjustment
              │               ├─ Booking
              │               └─ (referenced, never joined, by line items)
              ├─ Quote ─┬─ QuoteLineItem
              │         ├─ Quote (rootQuoteId / supersededByQuoteId)
              │         └─ Event
              ├─ Event ─┬─ Booking
              │         ├─ StaffAssignment ── Expense
              │         ├─ DeliveryNote ── DeliveryNoteLineItem
              │         ├─ Invoice ─┬─ InvoiceLineItem
              │         │           └─ Payment ── Receipt
              │         └─ Expense
              ├─ StaffMember ── StaffAssignment
              ├─ DocumentCounter
              ├─ DocumentFile
              ├─ VoiceCapture
              ├─ Keyterm
              └─ AvailabilityWarning
```

---

## 11. Notes for implementers

**Indexes that matter.** `Booking(catalogItemId, startDate, endDate, status)`
carries the availability query and will be the hottest path in the app.
`Quote(organizationId, status, eventDate)` carries the quote list.
`DocumentCounter(organizationId, documentType, year)` must be unique or
numbering breaks.

**The trigger.** A Postgres trigger blocking updates to financial columns on
issued documents is applied in a hand-written migration, not generated by Prisma.
It lives in `prisma/migrations/` and is described in the migration's comment.

**Seed data.** `prisma/seed.ts` creates one organisation, one user, a realistic
catalog (tents, 500 chairs, tables, PA, decor), five clients, and three events in
different states. Deterministic — tests depend on it.

**What is deliberately absent.** No `Notification`, no `AuditLog` beyond the
provenance fields, no `Tag`, no `Attachment` beyond `receiptStorageKey`, no tax
tables. Do not add speculative tables.
