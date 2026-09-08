import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { formatEventDate, nowInNairobi, toDateOnly } from "@/lib/dates"

describe("nowInNairobi", () => {
  beforeEach(() => {
    // Fixed clock: 2026-10-01T09:00:00+03:00 is 2026-10-01T06:00:00Z.
    vi.setSystemTime(new Date("2026-10-01T06:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("anchors the current instant to Africa/Nairobi, never the host or browser zone", () => {
    const now = nowInNairobi()

    expect(now.getHours()).toBe(9)
  })
})

describe("toDateOnly", () => {
  it("keeps the calendar day as seen in Nairobi, dropping the time component", () => {
    // 23:30 Nairobi time on 1 Oct is still 1 Oct in Nairobi, even though it is
    // already 2 Oct in UTC.
    const instant = new Date("2026-10-01T20:30:00Z")

    const dateOnly = toDateOnly(instant)

    expect(dateOnly.getUTCFullYear()).toBe(2026)
    expect(dateOnly.getUTCMonth()).toBe(9) // October, zero-indexed
    expect(dateOnly.getUTCDate()).toBe(1)
    expect(dateOnly.getUTCHours()).toBe(0)
  })
})

describe("formatEventDate", () => {
  it("formats an event date for display in Nairobi time", () => {
    const date = new Date("2026-10-12T06:00:00Z")

    expect(formatEventDate(date)).toBe("12 Oct 2026")
  })
})
