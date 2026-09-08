import Link from "next/link"
import { Tier1Gallery } from "./tier1"
import { BlocksGallery } from "./blocks"
import { Tier2Gallery } from "./tier2"

// /dev/gallery — every component in every state as a separate static instance
// (PHASE-00B §5.5 / §6.5). Excluded from production by the (dev) layout.
//
// Vertical-slice coverage: Tier 1 primitives + the three demoted blocks. The
// 28 Tier 2 composites (§5.3) and their bands are the deferred follow-up
// (§7, §10 item 1) — their sections will be added here alongside the build.
export default function GalleryPage() {
  return (
    <div className="mx-auto flex max-w-[var(--container-app)] flex-col px-4 py-8 md:px-8">
      <header className="flex flex-col gap-2 pb-4">
        <h1 className="text-2xl font-semibold text-text-primary">
          Component gallery
        </h1>
        <p className="max-w-2xl text-sm text-text-muted">
          Every state is a static instance. The <code>data-force-state</code>
          attribute drives the same rule the real pseudo-class triggers — see
          the forced-state convention in <code>globals.css</code>. Dev-only; a
          production build 404s this route.
        </p>
        <Link href="/" className="text-sm text-accent underline-offset-4 hover:underline">
          ← Back to the app shell
        </Link>
      </header>

      <Tier1Gallery />
      <BlocksGallery />
      <Tier2Gallery />
    </div>
  )
}
