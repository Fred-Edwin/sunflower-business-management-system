# Inventory & Availability

The single most important calculation in the system, and the one most likely to
be implemented wrongly by pattern-matching to a simpler model.

**Availability is a number, not a boolean** (INV-A1). Susan owns 500 chairs.
Committing 200 to a wedding leaves 300 for other events on the same day. Any
model that treats an item as "booked" or "free" is wrong for this business.

---

## 1. The formula

For a catalog item over a date range `[from, to]`:

```
available(item, from, to) =
      item.totalQuantity
    − maxOverlapping(InventoryAdjustment, item, from, to)
    − maxOverlapping(Booking where status ∈ {HOLD (unexpired), COMMITTED}, item, from, to)
```

Two things to be precise about, because both are easy to get wrong:

**"Overlapping" means date-range intersection**, inclusive on both ends:

```
booking.startDate <= to AND booking.endDate >= from
```

**It is the maximum concurrent usage across the range, not the sum.** Two
bookings of 100 chairs on different days inside the queried range do not consume
200. They consume 100 on each of those days. If you sum overlapping bookings you
will under-report availability and block valid business.

For a single-day query these are identical, which is why the bug survives casual
testing. Test the multi-day case explicitly.

---

## 2. The reference implementation

Availability is computed per day across the range, then reduced to the minimum.

```sql
-- Availability for one catalog item across a date range.
-- Returns the worst-case (minimum) availability over the range,
-- plus a per-day breakdown for the UI.
WITH days AS (
  SELECT generate_series($2::date, $3::date, '1 day')::date AS day
),
committed AS (
  SELECT d.day, COALESCE(SUM(b.quantity), 0) AS qty
  FROM days d
  LEFT JOIN "Booking" b
    ON b."catalogItemId" = $1
   AND b."startDate" <= d.day
   AND b."endDate"   >= d.day
   AND (
        b.status = 'COMMITTED'
     OR (b.status = 'HOLD' AND b."expiresAt" > now())
   )
  GROUP BY d.day
),
adjusted AS (
  SELECT d.day, COALESCE(SUM(a.quantity), 0) AS qty
  FROM days d
  LEFT JOIN "InventoryAdjustment" a
    ON a."catalogItemId" = $1
   AND a."startDate" <= d.day
   AND (a."endDate" IS NULL OR a."endDate" >= d.day)
   AND a."resolvedAt" IS NULL
  GROUP BY d.day
)
SELECT
  d.day,
  $4::int - c.qty - j.qty AS available
FROM days d
JOIN committed c ON c.day = d.day
JOIN adjusted  j ON j.day = d.day
ORDER BY d.day;
```

`$4` is `totalQuantity`, passed in rather than joined so the query works
unchanged for the batch variant.

The domain layer takes the per-day rows and returns:

```ts
type Availability = {
  catalogItemId: string
  totalQuantity: number
  minAvailable: number          // worst day in the range — this is the number to check against
  byDay: { day: string; available: number }[]
}
```

`minAvailable` is what a booking request is validated against. `byDay` drives the
calendar UI and lets Susan see that the shortage is on one day only.

---

## 3. What consumes availability

| Source | Consumes | Notes |
|---|---|---|
| `Booking` status `COMMITTED` | Yes | Created on quote acceptance |
| `Booking` status `HOLD`, unexpired | Yes | Preliminary quote |
| `Booking` status `HOLD`, expired | **No** | `expiresAt <= now()` |
| `Booking` status `RELEASED` | No | Cancelled event or superseded quote |
| `InventoryAdjustment`, unresolved | Yes | Damage, maintenance, lost |
| `InventoryAdjustment`, resolved | No | `resolvedAt` set |
| A `DRAFT` or `SENT` non-preliminary quote | **No** | Nothing is committed until acceptance |

That last row is the one to be careful about. A quote sitting in `SENT` does not
reserve equipment. This is deliberate (INV-A3): Susan sends many quotes and wins
some of them, and reserving on every send would show phantom shortages and cost
her business. A preliminary quote is the exception, because it represents work
already done at a site visit.

---

## 4. Booking creation

Availability is re-checked **inside** the transaction that creates the booking
(INV-A4):

```ts
await prisma.$transaction(async (tx) => {
  // Lock the item row so concurrent bookings serialise on it
  await tx.$executeRaw`SELECT id FROM "CatalogItem" WHERE id = ${itemId} FOR UPDATE`

  const availability = await getAvailability(tx, itemId, from, to)

  if (availability.minAvailable < requestedQuantity) {
    await tx.availabilityWarning.create({ /* requested, available, dates */ })
    // Warning is recorded. The caller decides whether to proceed.
  }

  await tx.booking.create({ /* ... */ })
})
```

Checking availability before opening the transaction and trusting the answer is a
defect even with one user, because two browser tabs are two users.

The row lock on `CatalogItem` is the serialisation point. It is cheap here
because contention is effectively zero, and it means the check-then-write is
atomic without needing a higher isolation level.

---

## 5. Warn, do not block

**INV-A6.** When a requested quantity exceeds availability, the system warns and
shows the number actually free. It does not prevent the booking.

Susan may have a reason: equipment returning early, a sub-rental arranged, a
client who accepts fewer chairs. A system that blocks her here would be replaced
by a paper notebook within a month.

Every warning writes an `AvailabilityWarning` row recording the requested
quantity, the actual availability, the dates, and `proceededAnyway`. The PRD asks
for warnings raised and overrides as a success metric, and that is not
recoverable after the fact.

The warning UI states the shortage plainly: *"Only 180 of 200 chairs are free on
14 Oct. Book anyway?"* Not a generic conflict message.

---

## 6. Damage and maintenance

Marking units unavailable removes **exactly those units** (INV-A7), not the whole
item.

```
"50 chairs damaged" → InventoryAdjustment { quantity: 50, reason: DAMAGED,
                                            startDate: today, endDate: null }
```

`endDate: null` means open-ended, running until `resolvedAt` is set. This matches
how repairs actually work: you know when something broke, not when it will be
fixed.

A known-duration adjustment (equipment away for scheduled servicing) sets
`endDate`.

This is voice-enabled. *"Fifty chairs got damaged at the Karatina event"* parses
to a quantity, an item, and a reason.

---

## 7. Availability UI

Three surfaces, all reading the same computation:

**Item detail.** A date-range picker with a per-day availability strip. Drives
directly off `byDay`.

The strip **emphasises the worst day** — the `byDay` entry whose `available`
equals `minAvailable`. That cell is tinted `--color-warning-subtle` when its
availability is below the quantity being checked (line-item quantity in the quote
builder, `1` elsewhere) and `--color-success-subtle` otherwise, plus a
`--color-border-strong` outline. Every other cell is untinted. This is the only
severity encoding on the strip; ties resolve to the earliest day. Ratified for
D3 (`DayAvailabilityStrip` composite), 2026-09-07.

**Quote builder.** As line items are added, each row shows availability for the
quote's event dates alongside the quantity input. Debounced, batched into one
query for all items on the quote.

**Date lookup.** "What is free on 14 October?" — availability for every active
item on a single date. This is the screen Susan uses on the phone while a client
is talking.

The batch query is the same SQL with `catalogItemId = ANY($1)` and a
`GROUP BY` over items. Do not loop the single-item query.

---

## 8. Deferred: buffer days

Equipment realistically leaves the day before an event and returns the day after.
The PRD defers this and it is **not** in v1.

It is designed for, though. When it arrives it becomes two fields on `Booking`
(`loadOutDate`, `loadInDate`) defaulting to `startDate` and `endDate`, and the
overlap predicate widens to use them. No change to the quantity model, no
migration of existing data. Do not implement it early, and do not restructure to
"prepare" for it.

---

## 9. Tests that must exist

These map directly to the PRD's acceptance criteria.

1. 500 chairs, nothing booked → 500 available.
2. 500 chairs, 200 committed for the range → 300 available (partial commitment,
   INV-A5).
3. 500 chairs, 50 damaged open-ended, 200 committed → 250 available.
4. Same as 3, queried for a date outside the booking range → 450 available.
5. Two bookings of 100 on **different days** inside a 5-day query range →
   400 available, not 300. This is the max-not-sum test.
6. A `HOLD` booking past `expiresAt` → does not reduce availability.
7. A `RELEASED` booking → does not reduce availability.
8. Requesting 200 when 180 are free → warning raised, `AvailabilityWarning`
   written, booking still created when the caller proceeds.
9. Two concurrent booking transactions for the same item cannot both pass the
   check when only one can be satisfied.
10. Resolving an adjustment restores the units from that point forward.
