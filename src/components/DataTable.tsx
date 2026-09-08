"use client"

import * as React from "react"
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "cn"
import { Skeleton } from "@/components/ui/skeleton"

// The shadcn DataTable block, demoted to Tier 2 (PHASE-00B §5.2, band 58H-0).
//
// What is "ours" and built here: the premium table styling and the mobile
// card projection — the one contract (D3.2 #3). What the block contributes
// (sort / column-visibility / row-selection via @tanstack/react-table) is
// NOT wired in this vertical slice: no screen renders a real DataTable yet,
// so the plumbing has no consumer to exercise. Sort is modelled here as a
// controlled `sort` prop so the visual affordance (the caret on the active
// column) exists and is exercised in the gallery; the follow-up session adds
// react-table when a real table screen needs it (§7).
//
// Semantic tokens only (design-system.md §13.1/§13.2).

export type Column<Row> = {
  id: string
  header: string
  /** Cell renderer. Return a string/number for the default cell, or a node. */
  cell: (row: Row) => React.ReactNode
  /** Right-align + Geist Mono. For money and quantities. */
  numeric?: boolean
  /** Render as a horizontally-scrolling strip inside the mobile card — the
   *  ONLY permitted horizontal scroll (where DayAvailabilityStrip sits). */
  wide?: boolean
  /** Sortable — shows the caret affordance when this column is the sort key. */
  sortable?: boolean
  /** Fixed width in px for this column (desktop). */
  width?: number
}

export type SortState = { columnId: string; direction: "asc" | "desc" } | null

type DataTableProps<Row> = {
  columns: Column<Row>[]
  rows: Row[]
  getRowKey: (row: Row) => string
  /** Primary line for the mobile card. Defaults to the first column's cell. */
  cardPrimary?: (row: Row) => React.ReactNode
  /** Secondary muted line for the mobile card. */
  cardSecondary?: (row: Row) => React.ReactNode
  /** The right-aligned figure block on the mobile card (e.g. a line total). */
  cardFigure?: (row: Row) => React.ReactNode
  loading?: boolean
  /** Rendered when `rows` is empty and not loading. Delegates to EmptyState
   *  at the call site (that composite is in the deferred Tier 2 set). */
  emptyState?: React.ReactNode
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  className?: string
}

// D9-0 revision (user, 2026-09-08): the desktop header label is 12 / 500 /
// normal case / text-primary — no longer 11 / 600 / uppercase. The header band
// now carries the weight (blue wash + heavy bottom rule), so the label is
// quieter. The mobile card's 2-up field labels stay the small uppercase caption.
const HEADER_LABEL_DESKTOP = "text-xs font-medium leading-4 text-text-primary"
const HEADER_LABEL_MOBILE =
  "text-[11px] font-semibold uppercase leading-none tracking-[0.03em] text-text-muted"

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  cardPrimary,
  cardSecondary,
  cardFigure,
  loading = false,
  emptyState,
  sort,
  onSortChange,
  className,
}: DataTableProps<Row>) {
  const gridColumns = columns.filter((c) => !c.wide)
  const wideColumns = columns.filter((c) => c.wide)
  const primary = cardPrimary ?? ((row: Row) => columns[0]?.cell(row))

  function toggleSort(columnId: string) {
    if (!onSortChange) return
    if (sort?.columnId !== columnId) {
      onSortChange({ columnId, direction: "asc" })
    } else if (sort.direction === "asc") {
      onSortChange({ columnId, direction: "desc" })
    } else {
      onSortChange(null)
    }
  }

  if (!loading && rows.length === 0 && emptyState) {
    return (
      <div className={cn("border border-border bg-surface", className)}>
        {emptyState}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Desktop table — md and up. D9-0: sharp corners, blue header wash,
          heavy header rule, no zebra striping. */}
      <div className="hidden overflow-hidden border border-border md:block">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-table-header-border bg-table-header">
              {columns.map((col) => {
                const isSorted = sort?.columnId === col.id
                return (
                  <th
                    key={col.id}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    className={cn(
                      "h-8 px-3 text-left align-middle",
                      col.numeric && "text-right",
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.id)}
                        className={cn(
                          "inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
                          HEADER_LABEL_DESKTOP,
                          col.numeric && "flex-row-reverse",
                        )}
                      >
                        {col.header}
                        {isSorted ? (
                          sort.direction === "asc" ? (
                            <ChevronUpIcon className="size-3 shrink-0" />
                          ) : (
                            <ChevronDownIcon className="size-3 shrink-0" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      <span className={HEADER_LABEL_DESKTOP}>{col.header}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    {columns.map((col) => (
                      <td key={col.id} className="h-9 px-3">
                        <Skeleton
                          className={cn(
                            "h-2.5",
                            col.numeric ? "ml-auto w-10" : "w-3/4",
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={getRowKey(row)}
                    className="border-b border-border last:border-b-0"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "h-9 px-3 align-middle text-sm text-text-primary",
                          col.numeric &&
                            "text-right font-mono tabular-nums",
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card projection — below md */}
      <div className="flex flex-col gap-2 md:hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2.5 rounded-md border border-border p-3"
              >
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : rows.length === 0 && emptyState
            ? emptyState
            : rows.map((row) => (
                <div
                  key={getRowKey(row)}
                  className="flex flex-col gap-2.5 rounded-md border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <div className="text-sm font-semibold leading-tight text-text-primary">
                        {primary(row)}
                      </div>
                      {cardSecondary ? (
                        <div className="text-[13px] leading-tight text-text-muted">
                          {cardSecondary(row)}
                        </div>
                      ) : null}
                    </div>
                    {cardFigure ? (
                      <div className="shrink-0 text-right font-mono text-sm tabular-nums text-text-primary">
                        {cardFigure(row)}
                      </div>
                    ) : null}
                  </div>

                  {gridColumns.length > 0 ? (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {gridColumns.map((col) => (
                        <div key={col.id} className="flex flex-col gap-0.5">
                          <dt className={HEADER_LABEL_MOBILE}>{col.header}</dt>
                          <dd
                            className={cn(
                              "text-[13px] text-text-primary",
                              col.numeric && "font-mono tabular-nums",
                            )}
                          >
                            {col.cell(row)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {wideColumns.map((col) => (
                    <div
                      key={col.id}
                      className="-mx-3 overflow-x-auto px-3"
                    >
                      {col.cell(row)}
                    </div>
                  ))}
                </div>
              ))}
      </div>
    </div>
  )
}
