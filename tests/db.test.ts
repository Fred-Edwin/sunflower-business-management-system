import { describe, expect, it } from "vitest"
import { prisma } from "@/lib/db"
import { withRollback } from "./db"

// This suite is a prerequisite for trusting every other repository test: if
// the harness itself doesn't roll back, "clean database per test" is a lie
// and later tests could pass or fail on leaked state.
describe("withRollback", () => {
  it(
    "commits nothing: a row created inside the callback is gone afterward",
    withRollback(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          id: "org_rollback_probe",
          name: "Rollback Probe Co",
          phone: "+254700000001",
          email: "probe@example.com",
          addressLine: "Nowhere",
        },
      })

      expect(organization.id).toBe("org_rollback_probe")

      const withinTransaction = await tx.organization.findUnique({
        where: { id: "org_rollback_probe" },
      })
      expect(withinTransaction).not.toBeNull()
    }),
  )

  it("leaves no trace on the real connection after the callback throws and rolls back", async () => {
    const found = await prisma.organization.findUnique({
      where: { id: "org_rollback_probe" },
    })

    expect(found).toBeNull()
  })
})
