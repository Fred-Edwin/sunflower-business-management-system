import { describe, expect, it } from "vitest"
import {
  applyPercent,
  formatMoney,
  multiplyMoney,
  parseMoney,
  subtractMoney,
  sumMoney,
} from "@/lib/money"

describe("multiplyMoney", () => {
  it("INV-M1: a line total of quantity 7 at 1,499 cents produces exactly 10,493", () => {
    expect(multiplyMoney(1499, 7)).toBe(10493)
  })

  it("returns zero for a zero quantity", () => {
    expect(multiplyMoney(500000, 0)).toBe(0)
  })

  it("throws on a non-integer unit price", () => {
    expect(() => multiplyMoney(100.5, 2)).toThrow()
  })

  it("throws on a non-integer quantity", () => {
    expect(() => multiplyMoney(1000, 1.5)).toThrow()
  })
})

describe("applyPercent", () => {
  it("INV-M4: a percentage deposit of 33% on 100,000 cents produces exactly 33,000", () => {
    expect(applyPercent(100000, 33)).toBe(33000)
  })

  it("INV-M4: rounds half-up, applied once, at the fractional boundary", () => {
    // 100,000 * 33.5% = 33,500 exactly, no rounding needed
    expect(applyPercent(100000, 33.5)).toBe(33500)
    // 1 cent * 50% = 0.5, rounds up to 1
    expect(applyPercent(1, 50)).toBe(1)
    // 3 cents * 50% = 1.5, rounds up to 2 (half-up, not banker's rounding)
    expect(applyPercent(3, 50)).toBe(2)
  })

  it("rounds a negative percentage away from zero, matching half-up on the discount's sign", () => {
    expect(applyPercent(3, -50)).toBe(-2)
  })

  it("returns zero for a zero percent", () => {
    expect(applyPercent(500000, 0)).toBe(0)
  })

  it("throws on a non-integer cents amount", () => {
    expect(() => applyPercent(100.5, 10)).toThrow()
  })
})

describe("sumMoney", () => {
  it("INV-M1: sums a list of integer cents values", () => {
    expect(sumMoney([10000, 25000, 500])).toBe(35500)
  })

  it("sums to zero for an empty list", () => {
    expect(sumMoney([])).toBe(0)
  })

  it("throws if any value is not an integer", () => {
    expect(() => sumMoney([1000, 200.25])).toThrow()
  })
})

describe("subtractMoney", () => {
  it("INV-C5: computes a balance as minuend minus subtrahend", () => {
    expect(subtractMoney(500000, 200000)).toBe(300000)
  })

  it("can go negative, representing an overpayment", () => {
    expect(subtractMoney(100000, 150000)).toBe(-50000)
  })
})

describe("formatMoney", () => {
  it("INV-M1: formats with exactly two decimal places", () => {
    expect(formatMoney(1250075)).toBe("KES 12,500.75")
  })

  it("INV-M1: one cent is the smallest representable amount", () => {
    expect(formatMoney(1)).toBe("KES 0.01")
  })

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("KES 0.00")
  })

  it("formats a negative amount with a leading minus sign before the currency", () => {
    expect(formatMoney(-50000)).toBe("-KES 500.00")
  })

  it("INV-M5: returns a string, never used to feed further arithmetic", () => {
    const result = formatMoney(100000)
    expect(typeof result).toBe("string")
  })

  it("throws on a non-integer amount, never silently truncating", () => {
    expect(() => formatMoney(100.5)).toThrow()
  })
})

describe("parseMoney", () => {
  it("INV-M1: parses a typed amount into integer cents", () => {
    expect(parseMoney("1250.75")).toBe(125075)
  })

  it("parses an amount with thousands separators", () => {
    expect(parseMoney("12,500.75")).toBe(1250075)
  })

  it("parses a whole-number amount with no decimal part", () => {
    expect(parseMoney("500")).toBe(50000)
  })

  it("pads a single decimal digit to the nearest cent", () => {
    expect(parseMoney("10.5")).toBe(1050)
  })

  it("parses a negative amount", () => {
    expect(parseMoney("-500")).toBe(-50000)
  })

  it("throws on more than two decimal places, since a cent is the smallest unit", () => {
    expect(() => parseMoney("10.505")).toThrow()
  })

  it("throws on non-numeric input", () => {
    expect(() => parseMoney("twelve")).toThrow()
  })
})
