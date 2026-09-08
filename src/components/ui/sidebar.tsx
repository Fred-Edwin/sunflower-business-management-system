"use client"

import * as React from "react"
import { cn } from "cn"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// A trimmed sidebar primitive. Kept from the shadcn sidebar block: the
// collapsed/expanded state, the cookie persistence, the ⌘B keyboard shortcut,
// and the mobile Sheet fallback. The demo nav, team switcher and CSS-variable
// theming layer are dropped — the app shell (components/app-sidebar.tsx)
// supplies the real chrome, restyled to tokens (PHASE-00B §5.2 / §6.3).

const SIDEBAR_COOKIE = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const MOBILE_BREAKPOINT = 768

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

type SidebarContextValue = {
  isMobile: boolean
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return ctx
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: {
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [open, setOpenState] = React.useState(defaultOpen)

  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next)
    // INV-none — pure UI preference. Persist so a reload keeps the choice.
    document.cookie = `${SIDEBAR_COOKIE}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [])

  const toggle = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((v) => !v)
    } else {
      setOpen(!open)
    }
  }, [isMobile, open, setOpen])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggle])

  const value = React.useMemo<SidebarContextValue>(
    () => ({ isMobile, open, setOpen, openMobile, setOpenMobile, toggle }),
    [isMobile, open, setOpen, openMobile, toggle],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

// The panel. On desktop it is a fixed-width column that can collapse to zero
// width; on mobile it is rendered inside a Sheet.
function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-[240px] max-w-[240px] border-0 bg-transparent p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <aside className={cn("flex h-full w-[240px] flex-col", className)} {...props}>
            {children}
          </aside>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "hidden shrink-0 overflow-hidden transition-[width] duration-slow ease-in-out md:flex md:flex-col",
        open ? "w-[240px]" : "w-0",
        className,
      )}
      {...props}
    >
      <div className="flex h-full w-[240px] flex-col">{children}</div>
    </aside>
  )
}

export { SidebarProvider, Sidebar, useSidebar }
