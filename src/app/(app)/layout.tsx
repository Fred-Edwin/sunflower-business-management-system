import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AppShellTopBar } from "@/components/AppShellTopBar"
import { SignOutButton } from "./sign-out-button"

// The application shell (PHASE-00B §6.6). Server Component: it authenticates,
// reads the persisted sidebar state, and renders the frame. `'use client'` is
// pushed down to the two islands that need it — the Sidebar collapse/Sheet
// (SidebarProvider / AppSidebar) and the mobile hamburger (AppShellTopBar).
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  const sidebarState = (await cookies()).get("sidebar_state")?.value
  const defaultOpen = sidebarState !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-svh w-full">
        <AppSidebar
          userName={session.user.name || session.user.email}
          voiceQueueCount={0}
          signOutSlot={<SignOutButton />}
        />
        <div className="flex min-w-0 grow flex-col">
          <AppShellTopBar />
          <main className="grow">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
