// All monetary arithmetic in the application lives here (INV-M3). Nothing
// outside this file multiplies, divides, or applies a percentage to a
// monetary value. Every amount is an integer count of KES cents (INV-M1):
// two decimal places, one cent the smallest unit of rounding, never a float
// carried as a fractional currency amount.

function assertCents(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, got ${value}`)
  }
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer number of cents, got ${value}`)
  }
}

/** Line total: unit price times quantity. Quantity is a plain integer count. */
export function multiplyMoney(unitPriceCents: number, quantity: number): number {
  assertCents(unitPriceCents, "unitPriceCents")
  if (!Number.isInteger(quantity)) {
    throw new Error(`quantity must be an integer, got ${quantity}`)
  }

  return unitPriceCents * quantity
}

/**
 * Applies a percentage to a cents amount with half-up rounding, applied once,
 * at the point the fractional result is produced (INV-M4). Never round twice:
 * callers must not pre-round or post-round this result.
 */
export function applyPercent(cents: number, percent: number): number {
  assertCents(cents, "cents")
  if (!Number.isFinite(percent)) {
    throw new Error(`percent must be a finite number, got ${percent}`)
  }

  // Half-up: add 0.5 before truncating toward zero. Percent can be negative
  // (a discount expressed as a negative adjustment), so round away from zero
  // in the direction of the sign rather than always flooring.
  const raw = (cents * percent) / 100
  const rounded =
    raw >= 0 ? Math.floor(raw + 0.5) : -Math.floor(-raw + 0.5)

  return rounded
}

/** Sums a list of cents values. Empty list sums to zero. */
export function sumMoney(values: number[]): number {
  return values.reduce((total, value) => {
    assertCents(value, "value")
    return total + value
  }, 0)
}

/** Subtracts one cents amount from another. Used for balances (INV-C5). */
export function subtractMoney(minuendCents: number, subtrahendCents: number): number {
  assertCents(minuendCents, "minuendCents")
  assertCents(subtrahendCents, "subtrahendCents")

  return minuendCents - subtrahendCents
}

/**
 * Formats cents for display only (INV-M5). A domain function never calls
 * this and never returns its result — formatting happens at the render
 * boundary alone.
 */
export function formatMoney(cents: number): string {
  assertCents(cents, "cents")

  const negative = cents < 0
  const absoluteCents = Math.abs(cents)
  const whole = Math.floor(absoluteCents / 100)
  const fraction = absoluteCents % 100

  const wholeFormatted = whole.toLocaleString("en-KE")
  const fractionFormatted = fraction.toString().padStart(2, "0")

  return `${negative ? "-" : ""}KES ${wholeFormatted}.${fractionFormatted}`
}

/**
 * Parses a user-typed amount (e.g. a form field showing "1,250.75") into
 * integer cents. This is the only place `parseFloat`-adjacent string-to-money
 * conversion happens, so a form never does `Math.round(parseFloat(x) * 100)`
 * inline and risks the float contact INV-M1 forbids.
 */
export function parseMoney(input: string): number {
  const cleaned = input.replace(/,/g, "").trim()

  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error(`Cannot parse "${input}" as a monetary amount`)
  }

  const [wholePart = "0", fractionPart = ""] = cleaned.split(".")
  const negative = wholePart.startsWith("-")
  const whole = Math.abs(Number(wholePart))
  const fraction = Number(fractionPart.padEnd(2, "0"))

  const cents = whole * 100 + fraction

  return negative ? -cents : cents
}
