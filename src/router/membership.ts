import { z } from "zod"
import { t } from "~/lib/trpc.server"
import { updateMembership } from "~/models/membership"

export const membershipRouter = t.router({
  updateMembership: t.procedure
    .input(
      z.object({
        id: z.string(),
        lastSwitchedTo: z
          .string()
          .transform((v) => new Date())
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...payload } = input
      if (
        !ctx.gate.allows({ type: "can-update-membership", membership: { id } })
      ) {
        throw ctx.gate.permissionError()
      }

      await updateMembership(id, payload)
    }),
})
