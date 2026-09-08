import { cn } from "cn"
import { MoneyDisplay } from "@/components/MoneyDisplay"

// One component, two layouts (band 5ES-0) — the same document money summary
// shown two ways. All figures via MoneyDisplay (INV-M1/M5).
//
//  ledger    — quote / delivery-note builder: stacked label/value rows →
//              hairline rule → Total (label 15 semibold, value 20 mono
//              semibold) → deposit line.
//  statcards — invoice detail: three KPI cards (Invoice total / Paid to date /
//              Balance). Balance is computed by the caller (INV-C5), never
//              stored. Mobile: three stacked rows.

type LedgerRow = { label: string; cents: number | null }

type LedgerProps = {
  layout: "ledger"
  rows: LedgerRow[]
  totalCents: number | null
  deposit?: { label: string; cents: number | null }
  loading?: boolean
}

type StatcardsProps = {
  layout: "statcards"
  invoiceTotalCents: number | null
  paidToDateCents: number | null
  /** Computed by the caller: totalCents − sum(payments) (INV-C5). */
  balanceCents: number | null
  loading?: boolean
}

export function TotalsPanel(
  props: (LedgerProps | StatcardsProps) & { className?: string },
) {
  if (props.layout === "statcards") {
    const cards: { label: string; cents: number | null }[] = [
      { label: "Invoice total", cents: props.invoiceTotalCents },
      { label: "Paid to date", cents: props.paidToDateCents },
      { label: "Balance", cents: props.balanceCents },
    ]
    return (
      <div
        data-slot="totals-panel"
        data-layout="statcards"
        className={cn(
          "flex flex-col gap-3 md:flex-row md:gap-3",
          props.className,
        )}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-2 rounded-md border border-border p-4 md:min-w-[180px]"
          >
            <span className="text-xs leading-4 text-text-muted">
              {card.label}
            </span>
            {props.loading ? (
              <MoneyDisplay cents={null} loading />
            ) : (
              <MoneyDisplay cents={card.cents} prefix size="lg" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      data-slot="totals-panel"
      data-layout="ledger"
      className={cn("flex w-full max-w-[320px] flex-col gap-2", props.className)}
    >
      {props.rows.map((row) => (
        <div key={row.label} className="flex justify-between">
          <span className="text-[13px] leading-4 text-text-muted">
            {row.label}
          </span>
          <MoneyDisplay cents={row.cents} loading={props.loading} />
        </div>
      ))}

      <div className="my-1 h-px bg-border" />

      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-semibold leading-[18px] text-text-primary">
          Total
        </span>
        <MoneyDisplay
          cents={props.totalCents}
          size="xl"
          loading={props.loading}
        />
      </div>

      {props.deposit ? (
        <div className="flex justify-between pt-1">
          <span className="text-[13px] leading-4 text-text-muted">
            {props.deposit.label}
          </span>
          <MoneyDisplay
            cents={props.deposit.cents}
            className="font-medium"
            loading={props.loading}
          />
        </div>
      ) : null}
    </div>
  )
}
