import { cn } from "cn"
import { formatMoney } from "@/lib/money"

// Renders an integer count of KES cents as a formatted money string
// (band 4X8-0). The catalog / document layers pass `cents` — never a
// pre-formatted string — and `formatMoney()` (lib/money.ts) is called HERE,
// at the render boundary only (INV-M1/M5). Geist Mono + tabular-nums always,
// so columns of figures align (design-system.md §4).

type MoneySize = "sm" | "base" | "lg" | "xl" | "3xl"

const SIZE_CLASS: Record<MoneySize, string> = {
  // Paper band 4X8-0: 13px / 16px / 20px semibold / 30px semibold. The stat /
  // KPI sizes carry semibold; the dense-column size stays regular.
  sm: "text-[13px] leading-4",
  base: "text-base leading-5",
  lg: "text-lg leading-[22px] font-semibold",
  xl: "text-xl leading-6 font-semibold",
  "3xl": "text-3xl leading-9 font-semibold tracking-[-0.02em]",
}

export function MoneyDisplay({
  cents,
  prefix = false,
  size = "sm",
  loading = false,
  className,
}: {
  /** Integer KES cents, or null when the amount is not set (renders an em dash). */
  cents: number | null
  /** Show the "KES " prefix — on for KPI cards and mobile, off in dense columns. */
  prefix?: boolean
  size?: MoneySize
  loading?: boolean
  className?: string
}) {
  if (loading) {
    return (
      <span
        data-slot="money-display"
        aria-hidden
        className={cn(
          "inline-block h-[13px] w-20 animate-pulse rounded-sm bg-surface-sunken align-middle",
          className,
        )}
      />
    )
  }

  const base = cn(
    "font-mono tabular-nums",
    SIZE_CLASS[size],
    className,
  )

  if (cents === null) {
    return (
      <span data-slot="money-display" className={cn(base, "text-text-muted")}>
        —
      </span>
    )
  }

  // formatMoney returns e.g. "-KES 12,000.00" — the minus sign leads the whole
  // string. Negative amounts are credits / overpayments and read danger.
  const formatted = formatMoney(cents)
  const negative = cents < 0
  const zero = cents === 0
  const withoutPrefix = prefix
    ? formatted
    : formatted.replace(/^(-?)KES\s/, "$1")

  return (
    <span
      data-slot="money-display"
      className={cn(
        base,
        negative && "text-danger-solid",
        zero && "text-text-muted",
        !negative && !zero && "text-text-primary",
      )}
    >
      {withoutPrefix}
    </span>
  )
}
