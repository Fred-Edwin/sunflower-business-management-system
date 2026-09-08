"use client"

import * as React from "react"
import { ChevronDownIcon, PlusIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  SearchableList,
  type SearchableOption,
} from "@/components/internal/searchable-list"

// Searchable picker over clients (band 5D6-0). Trigger 36px; popover on
// surface-raised + shadow-md; options 32px. "Create client <query>" inline.
// Unresolved-entity affordance for voice: "<name> — not in your clients"
// with create / pick actions.
//
// Data-layer wiring (the batched client query) lands in D6 — this composite is
// the visual + interaction contract. `options` are passed in.

type Client = { id: string; name: string }

export function ClientPicker({
  value,
  options,
  onSelect,
  onCreate,
  loading = false,
  /** Voice unresolved-entity name — renders the "no match" affordance. */
  unresolvedName,
  onPickExisting,
  placeholder = "Select a client",
  className,
}: {
  value?: Client | null
  options: Client[]
  onSelect?: (id: string) => void
  onCreate?: (name: string) => void
  loading?: boolean
  unresolvedName?: string
  onPickExisting?: () => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filtered = options.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  )
  const listOptions: SearchableOption[] = filtered.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  if (unresolvedName) {
    return (
      <div
        data-slot="client-picker"
        className={cn(
          "flex flex-col gap-1.5 rounded-md border border-warning-solid bg-warning-subtle px-3 py-2.5",
          className,
        )}
      >
        <div className="flex items-center gap-1">
          <TriangleAlertIcon className="size-[11px] shrink-0 text-warning-solid" />
          <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-warning-solid">
            No match
          </span>
        </div>
        <p className="text-[13px] leading-4 text-text-primary">
          &ldquo;{unresolvedName}&rdquo; — not in your clients
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-4 text-accent">
          <button
            type="button"
            onClick={() => onCreate?.(unresolvedName)}
            className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <PlusIcon className="size-3" />
            Create client &ldquo;{unresolvedName}&rdquo;
          </button>
          <span className="text-text-muted">·</span>
          <button
            type="button"
            onClick={onPickExisting}
            className="underline-offset-4 hover:underline"
          >
            or pick an existing client
          </button>
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="client-picker"
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
          placeholder="Search clients…"
          emptyLabel={query ? `No client matches “${query}”` : "No clients yet"}
          footer={
            query ? (
              <button
                type="button"
                onClick={() => {
                  onCreate?.(query)
                  setOpen(false)
                }}
                className="inline-flex items-center gap-1.5 text-accent underline-offset-4 hover:underline"
              >
                <PlusIcon className="size-3" />
                Create client &ldquo;{query}&rdquo;
              </button>
            ) : null
          }
        />
      </PopoverContent>
    </Popover>
  )
}
