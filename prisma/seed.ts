// Deterministic: fixed ids, fixed credentials, no Math.random, no bare
// `new Date()` (testing.md §5). Runs in under 5 seconds as part of
// `pnpm db:reset`.
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "better-auth/crypto"

const prisma = new PrismaClient()

const ORGANIZATION_ID = "org_sunflower_seed"
const USER_ID = "user_susan_seed"
const ACCOUNT_ID = "account_susan_seed"
const SEED_EMAIL = "susan@sunflowerevents.example"
const SEED_PASSWORD = "sunflower-dev-password"

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: ORGANIZATION_ID },
    create: {
      id: ORGANIZATION_ID,
      name: "Sunflower Events",
      phone: "+254700000000",
      email: SEED_EMAIL,
      addressLine: "Nyeri, Kenya",
    },
    update: {},
  })

  // Hashed with Better Auth's own hasher (not a hand-rolled hash) so the
  // seeded credentials actually authenticate through the Better Auth
  // Prisma adapter — see PHASE-00A.md §6.
  const hashedPassword = await hashPassword(SEED_PASSWORD)

  const user = await prisma.user.upsert({
    where: { id: USER_ID },
    create: {
      id: USER_ID,
      name: "Susan",
      email: SEED_EMAIL,
      emailVerified: true,
    },
    update: {},
  })

  await prisma.account.upsert({
    where: { id: ACCOUNT_ID },
    create: {
      id: ACCOUNT_ID,
      accountId: user.id,
      providerId: "credential",
      // Better Auth 1.7's synthetic issuer for the local credential
      // provider — sign-in matches on providerId + issuer + accountId.
      issuer: "local:credential",
      userId: user.id,
      password: hashedPassword,
    },
    update: { password: hashedPassword },
  })

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: "OWNER",
    },
    update: {},
  })

  console.log(`Seeded organisation "${organization.name}" and user ${SEED_EMAIL}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
