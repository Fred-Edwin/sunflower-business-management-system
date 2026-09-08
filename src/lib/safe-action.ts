import { createSafeActionClient } from "next-safe-action"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ForbiddenError } from "@/lib/errors"

/**
 * Authorisation and tenant scoping live here, in the wrapper, not in each
 * action body (coding-standards.md §5). This is what makes forgetting them
 * structurally difficult rather than a matter of discipline: every action
 * built on `authedAction` gets a resolved session and organisationId in
 * `ctx`, and INV-T3 — the organisation is never taken from client input — has
 * nowhere else to be violated from.
 */
export const authedAction = createSafeActionClient().use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new ForbiddenError("Not signed in")
  }

  // v1 has one organisation per user, but this resolves it from the
  // Membership table rather than assuming — the schema already supports a
  // second membership without a migration (system-overview.md §6).
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  })

  if (!membership) {
    throw new ForbiddenError("No organisation membership")
  }

  return next({
    ctx: {
      session,
      organizationId: membership.organizationId,
    },
  })
})
