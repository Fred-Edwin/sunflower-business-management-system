// Operator-only lever standing in for a user-management UI, which is
// deferred (PHASE-00A.md §10). No public route, no email dependency: creates
// a user through Better Auth's own hasher plus an OWNER membership on the
// seeded organisation.
//
// Usage:
//   pnpm user:add -- --email you@example.com --password "..." --name "Name"
import { hashPassword } from "better-auth/crypto"
import { prisma } from "@/lib/db"

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--") {
      // pnpm's own separator between the script name and forwarded args.
      continue
    }
    if (arg?.startsWith("--")) {
      const key = arg.slice(2)
      const value = argv[i + 1]
      if (value === undefined) {
        throw new Error(`Missing value for --${key}`)
      }
      args[key] = value
      i += 1
    }
  }

  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { email, password, name } = args

  if (!email || !password || !name) {
    console.error(
      "Usage: pnpm user:add -- --email <email> --password <password> --name <name>",
    )
    process.exitCode = 1
    return
  }

  const organization = await prisma.organization.findFirst()

  if (!organization) {
    console.error(
      "No organisation exists. Run `pnpm db:seed` first — this script adds a " +
        "user to the existing organisation, it does not create one.",
    )
    process.exitCode = 1
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.error(`A user with email ${email} already exists.`)
    process.exitCode = 1
    return
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: { name, email, emailVerified: true },
  })

  await prisma.account.create({
    data: {
      accountId: user.id,
      providerId: "credential",
      issuer: "local:credential",
      userId: user.id,
      password: hashedPassword,
    },
  })

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: "OWNER",
    },
  })

  console.log(`Created user ${email} with an OWNER membership on ${organization.name}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
