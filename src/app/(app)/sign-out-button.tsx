"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  // Sits in the sidebar footer, on the ink-gradient chrome — so it is styled
  // against the chrome tokens rather than the Button primitive's surface
  // variants, which assume a light ground.
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-md px-[10px] py-1.5 text-left text-[13px] font-medium text-chrome-text-muted transition-colors hover:text-chrome-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chrome-active-underline"
    >
      Sign out
    </button>
  )
}
