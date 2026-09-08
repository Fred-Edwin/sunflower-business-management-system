import type { Prisma, PrismaClient } from "@prisma/client"
import { prisma } from "@/lib/db"

// testing.md §3. One long-lived local Postgres, per-test transaction
// rollback — not Testcontainers, which adds 10-30s per run. Every test gets
// a clean database in milliseconds; nothing is ever committed.
class Rollback extends Error {}

export function withRollback(
  fn: (tx: Prisma.TransactionClient) => Promise<void>,
): () => Promise<void> {
  return async () => {
    await prisma
      .$transaction(async (tx) => {
        await fn(tx)
        throw new Rollback()
      })
      .catch((error: unknown) => {
        if (!(error instanceof Rollback)) {
          throw error
        }
      })
  }
}

export function getTestClient(): PrismaClient {
  return prisma
}
