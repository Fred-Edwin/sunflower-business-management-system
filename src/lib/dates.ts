import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"

// The display timezone is fixed, never read from the browser
// (coding-standards.md §8). Event dates are calendar days, not instants —
// an event happens on a day, not at a moment in some particular zone.
export const DISPLAY_TIMEZONE = "Africa/Nairobi"

/** The current instant, viewed in the display timezone. */
export function nowInNairobi(): TZDate {
  return TZDate.tz(DISPLAY_TIMEZONE)
}

/**
 * Strips the time component from a date, keeping only the calendar day. Used
 * for event dates, which are stored as `@db.Date` with no time component.
 */
export function toDateOnly(date: Date): Date {
  const zoned = new TZDate(date, DISPLAY_TIMEZONE)
  return new Date(Date.UTC(zoned.getFullYear(), zoned.getMonth(), zoned.getDate()))
}

/** Formats an event date for display, e.g. "12 Oct 2026". */
export function formatEventDate(date: Date): string {
  return format(new TZDate(date, DISPLAY_TIMEZONE), "d MMM yyyy")
}
