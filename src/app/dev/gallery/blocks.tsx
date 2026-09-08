"use client"

import * as React from "react"
import { GallerySection, StateRow } from "./gallery-shell"
import { LoginForm } from "@/components/LoginForm"
import { DataTable, type Column, type SortState } from "@/components/DataTable"
import { VoiceQueueIndicator } from "@/components/VoiceQueueIndicator"

type CatalogRow = {
  id: string
  item: string
  category: string
  owned: number
}

const CATALOG_ROWS: CatalogRow[] = [
  { id: "1", item: "Chiavari chairs, gold", category: "Seating", owned: 500 },
  {
    id: "2",
    item: "Tent 12x18m, white",
    category: "Tents & structures",
    owned: 4,
  },
  { id: "3", item: "Round tables, 1.8m", category: "Seating", owned: 40 },
]

const COLUMNS: Column<CatalogRow>[] = [
  { id: "item", header: "Item", cell: (r) => r.item, sortable: true },
  { id: "category", header: "Category", cell: (r) => r.category },
  {
    id: "owned",
    header: "Owned",
    cell: (r) => r.owned,
    numeric: true,
    sortable: true,
    width: 90,
  },
]

export function BlocksGallery() {
  const [sort, setSort] = React.useState<SortState>({
    columnId: "item",
    direction: "asc",
  })

  return (
    <>
      <GallerySection
        title="Block · Sidebar"
        note="The app shell. Built and exercised live at /  — the gallery links there rather than re-mounting a second shell."
      >
        <StateRow label="Voice-capture pill badge (VoiceQueueIndicator)">
          <div className="flex items-center gap-2 rounded-lg bg-[linear-gradient(in_oklab_160deg,var(--color-chrome-gradient-start)_0%,var(--color-chrome-gradient-end)_60%)] px-3 py-2">
            <span className="text-[13px] font-medium text-chrome-text">
              Voice capture
            </span>
            <VoiceQueueIndicator count={0} />
            <VoiceQueueIndicator count={2} />
            <VoiceQueueIndicator count={12} />
          </div>
        </StateRow>
      </GallerySection>

      <GallerySection
        title="Block · login-form"
        note="Demoted to Tier 2, tokenised, 44px controls, accent primary. Live at /sign-in."
      >
        <StateRow label="resting" className="block">
          <div className="max-w-sm rounded-lg border border-border bg-surface p-4">
            <LoginForm />
          </div>
        </StateRow>
      </GallerySection>

      <GallerySection
        title="Block · DataTable"
        note="Premium table + mobile card projection are ours. Sort is a controlled affordance here; @tanstack/react-table plumbing lands with a real table screen (§7)."
      >
        <StateRow label="populated + sorted column" className="block">
          <DataTable
            columns={COLUMNS}
            rows={CATALOG_ROWS}
            getRowKey={(r) => r.id}
            sort={sort}
            onSortChange={setSort}
            cardSecondary={(r) => `${r.category} · owns ${r.owned}`}
          />
        </StateRow>
        <StateRow label="loading (skeleton rows, not a spinner)" className="block">
          <DataTable
            columns={COLUMNS}
            rows={[]}
            getRowKey={(r) => r.id}
            loading
          />
        </StateRow>
        <StateRow label="empty (delegates to an EmptyState node)" className="block">
          <DataTable
            columns={COLUMNS}
            rows={[]}
            getRowKey={(r) => r.id}
            emptyState={
              <div className="flex flex-col items-center gap-1 p-8 text-center">
                <p className="text-sm font-semibold text-text-primary">
                  No active catalog items
                </p>
                <p className="text-sm text-text-muted">
                  Add an item to start quoting.
                </p>
              </div>
            }
          />
        </StateRow>
      </GallerySection>
    </>
  )
}
