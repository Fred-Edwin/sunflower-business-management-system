"use client"

import { MenuIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// The mobile top-bar. Below `md` the Sidebar collapses to a Sheet and this
// hamburger opens it (PHASE-00B §6.6). On desktop the bar is hidden — the
// Sidebar is always present. This is the only piece of the shell that must be
// a Client Component; it is kept as low in the tree as possible
// (coding-standards.md §10).
//
// PHASE-00B's PageHeader composite (which owns the real mobile top-bar with
// breadcrumb + title) is in the deferred Tier 2 set — this is the minimal
// stand-in the shell needs to be navigable at 390px now.
export function AppShellTopBar() {
  const { toggle } = useSidebar()

  return (
    <div className="flex h-14 items-center gap-2 border-b border-border bg-surface px-3 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </Button>
      <span className="text-sm font-semibold text-text-primary">
        Sunflower Events
      </span>
    </div>
  )
}
