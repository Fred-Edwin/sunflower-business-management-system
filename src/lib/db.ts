import { PrismaClient } from "@prisma/client"

// Dev singleton so the client survives Next.js HMR without exhausting
// Postgres connections on every reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Repository functions accept either the singleton or a transaction client
// (coding-standards.md §4), so they can be composed inside
// `prisma.$transaction`.
export type PrismaClientOrTx = PrismaClient | Omit<PrismaClient, "$transaction" | "$connect" | "$disconnect" | "$on" | "$use" | "$extends">
