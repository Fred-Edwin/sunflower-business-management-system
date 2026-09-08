import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"

// Single account, email + password (PHASE-00A scope). No sign-up route is
// exposed — the seeded user, or one created via `pnpm user:add`, is the only
// way in. See PHASE-00A.md §6 for why: a self-registered user would have no
// Membership and would sign in to an empty system.
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
})
