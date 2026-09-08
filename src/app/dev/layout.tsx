import { notFound } from "next/navigation"

// The (dev) route group is excluded from production (PHASE-00B §6.5, §10 GAP
// "production-exclusion mechanism unspecified" — resolved). `notFound()` here
// makes every route under (dev) a 404 in a production build; the segment still
// sits behind the auth middleware in every environment. Mechanism recorded in
// §7.
export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <div className="min-h-svh bg-surface">{children}</div>
}
