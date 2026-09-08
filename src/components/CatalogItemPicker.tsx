"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "cn"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchableList } from "@/components/internal/searchable-list"

// Searchable picker over active catalog items (band 5D6-0). Each option shows
// availability for the quote's event dates (a batched query, implied — warn,
// not block, INV-A6). States: open-with-availability, loading, empty
// ("No item matches … · Add to catalog").
//
// The availability numbers are passed in per option; the batched query lands
// in D6.

type CatalogOption = {
  id: string
  name: string
  /** Free of owned for the quote's dates — omit while not yet checked. */
  available?: number
  total?: number
}

export function CatalogItemPicker({
  value,
  options,
  onSelect,
  onAddToCatalog,
  loading = false,
  placeholder = "Add an item",
  className,
}: {
  value?: { id: string; name: string } | null
  options: CatalogOption[]
  onSelect?: (id: string) => void
  onAddToCatalog?: (query: string) => void
  loading?: boolean
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  )

  const listOptions = filtered.map((o) => ({
    value: o.id,
    label: o.name,
    trailing:
      o.available !== undefined && o.total !== undefined ? (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full",
              o.available === 0
                ? "bg-inventory-damaged"
                : o.available < o.total
                  ? "bg-inventory-low"
                  : "bg-inventory-available",
            )}
          />
          <span
            className={cn(
              "text-xs leading-4",
              o.available === 0
                ? "text-inventory-damaged"
                : o.available < o.total
                  ? "text-inventory-low"
                  : "text-inventory-available",
            )}
          >
            {o.available} of {o.total}
          </span>
        </span>
      ) : undefined,
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="catalog-item-picker"
          data-empty={!value}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-colors",
            "focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)] aria-expanded:border-border-focus",
            "data-[empty=true]:text-text-muted",
            className,
          )}
        >
          {value ? value.name : placeholder}
          <ChevronDownIcon className="size-3.5 shrink-0 text-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
        <SearchableList
          query={query}
          onQueryChange={setQuery}
          options={listOptions}
          loading={loading}
          onSelect={(id) => {
            onSelect?.(id)
            setOpen(false)
          }}
          placeholder="Search catalog…"
          emptyLabel={
            <button
              type="button"
              onClick={() => {
                onAddToCatalog?.(query)
                setOpen(false)
              }}
              className="text-text-muted"
            >
              No item matches &ldquo;{query}&rdquo; ·{" "}
              <span className="text-accent underline-offset-4 hover:underline">
                Add to catalog
              </span>
            </button>
          }
        />
      </PopoverContent>
    </Popover>
  )
}
