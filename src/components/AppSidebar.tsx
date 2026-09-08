"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, MicIcon } from "lucide-react"
import { cn } from "cn"
import { Sidebar } from "@/components/ui/sidebar"
import { VoiceQueueIndicator } from "@/components/VoiceQueueIndicator"

// The Sunflower app shell navigation, restyled to the Sidebar spec card
// (Paper 5TI-0, PHASE-00B §5.2 / §6.3):
//  - 240px panel, ink gradient `linear-gradient(in oklab 160deg, …)`
//  - nav item pad 9px/10px, 16px icon slot, gap 10, text 14 / 500 / chrome-text-muted
//  - active = ghost underline: 1px bottom border chrome-active-underline,
//    text + icon → chrome-text, weight 600, NO fill
//  - footer: 1px chrome-border top rule + Voice-capture pill + user row (24px avatar)
//
// Nav links are only the destinations that exist today. PHASE-00B §6.6:
// "Do not add nav links to screens that do not exist yet."

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [{ href: "/", label: "Home", icon: HomeIcon }]

export function AppSidebar({
  userName,
  voiceQueueCount = 0,
  signOutSlot,
}: {
  userName: string
  voiceQueueCount?: number
  signOutSlot?: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="bg-[linear-gradient(in_oklab_160deg,var(--color-chrome-gradient-start)_0%,var(--color-chrome-gradient-end)_60%)] px-3 py-4"
    >
      <div className="flex items-center gap-2 px-2 pt-2 pb-5">
        <span className="size-5 shrink-0 rounded-full bg-[linear-gradient(in_oklab_135deg,var(--color-accent-300)_0%,var(--color-accent-600)_100%)]" />
        <span className="text-[13px] font-semibold leading-4 text-chrome-text">
          Sunflower Events
        </span>
      </div>

      <nav className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-[10px] px-[10px] py-[9px] text-sm transition-colors",
                active
                  ? "border-b border-chrome-active-underline font-semibold text-chrome-text"
                  : "font-medium text-chrome-text-muted hover:text-chrome-text",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-2 border-t border-chrome-border pt-4">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#00000033] px-[10px] py-[9px] text-left shadow-[0_0_0_1px_var(--color-chrome-border)] transition-colors hover:bg-[#00000055] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chrome-active-underline"
          aria-label="Voice capture"
        >
          <MicIcon className="size-4 shrink-0 text-accent-300" />
          <span className="grow text-[13px] font-medium leading-4 text-chrome-text">
            Voice capture
          </span>
          <VoiceQueueIndicator count={voiceQueueCount} />
        </button>

        <div className="flex items-center gap-2 px-2 py-1.5">
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chrome-border text-[11px] font-medium text-chrome-text"
          >
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <span className="grow truncate text-[13px] font-medium leading-4 text-chrome-text">
            {userName}
          </span>
        </div>
        {signOutSlot}
      </div>
    </Sidebar>
  )
}
