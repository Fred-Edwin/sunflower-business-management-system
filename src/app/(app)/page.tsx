import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

// Plain landing page inside the app shell. No dashboard content — that is a
// later phase (PHASE-00B §6.6, build-plan Phase 4). It greets the signed-in
// user; sign-out lives in the shell sidebar now.
export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="mx-auto flex max-w-[var(--container-app)] flex-col gap-2 px-4 py-8 md:px-8">
      <h1 className="text-2xl font-semibold text-text-primary">
        Welcome back{session.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="text-sm text-text-muted">
        Signed in as {session.user.email}
      </p>
    </div>
  )
}
